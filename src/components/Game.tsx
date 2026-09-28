'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { loadHint, loadPuzzle, rateClue } from '@/app/actions';
import { formatLong, toISODate } from '@/lib/date';
import { decode } from '@/lib/obfuscate';
import { isSolved, lettersOnly, scoreGuess, splitGuess } from '@/lib/score';
import { SITE_URL, shareText } from '@/lib/share';
import {
    MAX_GUESSES, loadGame, loadStats, markHelpSeen, recordResult, saveGame, seenHelp,
    type SavedGame, type Stats,
} from '@/lib/storage';
import type { Puzzle } from '@/lib/types';
import Dialog from './Dialog';
import Help from './Help';
import { HelpIcon, MoonIcon, StatsIcon, SunIcon } from './Icons';
import Row from './Row';
import StatsView from './StatsView';

export default function Game() {
    const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
    const [failed, setFailed] = useState(false);
    const [game, setGame] = useState<SavedGame | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [input, setInput] = useState('');
    const [focused, setFocused] = useState(false);
    const [dialog, setDialog] = useState<'help' | 'stats' | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [shake, setShake] = useState(false);
    const [hintLoading, setHintLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const load = useCallback(() => {
        loadPuzzle(toISODate(new Date()))
            .then((p) => {
                setPuzzle(p);
                setGame(loadGame(p.date));
                setStats(loadStats());
                setFailed(false);
                setInput('');
                if (!seenHelp()) setDialog('help');
            })
            .catch(() => setFailed(true));
    }, []);
    useEffect(load, [load]);
    useEffect(() => { if (game) saveGame(game); }, [game]);

    const answer = useMemo(() => (puzzle ? decode(puzzle.key) : ''), [puzzle]);
    const guesses = game?.guesses ?? [];
    const solved = guesses.some((g) => isSolved(answer, g));
    const over = solved || guesses.length >= MAX_GUESSES;
    const maxLetters = (puzzle?.lengths.reduce((a, b) => a + b, 0) ?? 0) + 4;

    const flash = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 2000);
    };

    const submit = () => {
        if (!game || over) return;
        const guess = lettersOnly(input);
        if (!guess) {
            setShake(true);
            setTimeout(() => setShake(false), 400);
            return;
        }
        const next = [...game.guesses, guess];
        setGame({ ...game, guesses: next });
        setInput('');
        const won = isSolved(answer, guess);
        if (won || next.length >= MAX_GUESSES) {
            setStats(recordResult(game.date, won ? next.length : null));
            inputRef.current?.blur();
        }
    };

    const showHint = async () => {
        if (!game || game.hintUsed) return;
        setHintLoading(true);
        const hint = await loadHint(game.date).catch(() => null);
        setHintLoading(false);
        setGame((g) => g && { ...g, hint, hintUsed: true });
    };

    const share = async () => {
        if (!puzzle || !game) return;
        const text = shareText(puzzle.edition, answer, game.guesses, solved, game.hintUsed);
        if (navigator.share && matchMedia('(pointer: coarse)').matches) {
            navigator.share({ text, url: SITE_URL }).catch(() => { });
            return;
        }
        try {
            await navigator.clipboard.writeText(`${text}\n\n${SITE_URL}`);
            flash('Copied to clipboard');
        } catch {
            flash('Could not copy');
        }
    };

    const rate = (liked: boolean) => {
        if (!game || game.rated !== undefined) return;
        setGame({ ...game, rated: liked });
        rateClue(game.date, liked).catch(() => { });
    };

    const closeDialog = () => {
        if (dialog === 'help') markHelpSeen();
        setDialog(null);
    };

    return (
        <div className="app">
            <header className="topbar">
                <h1 className="wordmark">Crypt<span>le</span></h1>
                <nav>
                    <button className="icon-button" onClick={() => setDialog('help')} aria-label="How to play"><HelpIcon /></button>
                    <button className="icon-button" onClick={() => setDialog('stats')} aria-label="Statistics"><StatsIcon /></button>
                    <ThemeToggle />
                </nav>
            </header>

            <main className="main">
                {failed ? (
                    <div className="card error">
                        <p>Couldn&apos;t load today&apos;s clue.</p>
                        <button className="button" onClick={() => { setFailed(false); load(); }}>Try again</button>
                    </div>
                ) : !puzzle || !game ? (
                    <Skeleton />
                ) : (
                    <>
                        <p className="meta">#{puzzle.edition} · {formatLong(puzzle.date)}</p>

                        <section className="card clue-card">
                            <p className="clue">
                                <ClueText clue={puzzle.clue} hint={game.hint} />{' '}
                                <span className="enum">({puzzle.lengths.join(',')})</span>
                            </p>
                            {game.hintUsed && !clueContains(puzzle.clue, game.hint) && (
                                <p className="hint-line">{game.hint ? <>Definition: <mark>{game.hint}</mark></> : 'No hint available for this clue.'}</p>
                            )}
                            {puzzle.source.name && (
                                <p className="source">
                                    From{' '}
                                    {puzzle.source.url
                                        ? <a href={puzzle.source.url} target="_blank" rel="noreferrer">{puzzle.source.name}</a>
                                        : puzzle.source.name}
                                    {puzzle.source.date && ` · ${formatLong(puzzle.source.date)}`}
                                </p>
                            )}
                        </section>

                        <section
                            className={'board' + (shake ? ' shake' : '')}
                            onClick={() => inputRef.current?.focus()}
                        >
                            {Array.from({ length: MAX_GUESSES }, (_, i) => {
                                if (i < guesses.length) {
                                    const { words, marks } = scoreGuess(answer, guesses[i]);
                                    return <Row key={i} lengths={puzzle.lengths} words={words} marks={marks} />;
                                }
                                if (i === guesses.length && !over) {
                                    return <Row key={i} lengths={puzzle.lengths} words={splitGuess(puzzle.lengths, input)} cursor={focused} />;
                                }
                                return <Row key={i} lengths={puzzle.lengths} muted />;
                            })}
                            {!over && (
                                <input
                                    ref={inputRef}
                                    className="ghost-input"
                                    value={input}
                                    onChange={(e) => setInput(lettersOnly(e.target.value).slice(0, maxLetters))}
                                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                                    onFocus={() => setFocused(true)}
                                    onBlur={() => setFocused(false)}
                                    autoFocus={!matchMedia('(pointer: coarse)').matches}
                                    autoCapitalize="characters"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck={false}
                                    enterKeyHint="go"
                                    aria-label="Your answer"
                                />
                            )}
                        </section>

                        {over ? (
                            <Result
                                solved={solved}
                                answer={answer}
                                tries={guesses.length}
                                rated={game.rated}
                                onShare={share}
                                onRate={rate}
                                onStats={() => setDialog('stats')}
                                onNewDay={load}
                            />
                        ) : (
                            <div className="actions">
                                <button className="button secondary" onClick={showHint} disabled={game.hintUsed || hintLoading}>
                                    {game.hintUsed ? 'Hint shown' : hintLoading ? 'Loading…' : 'Hint'}
                                </button>
                                <span className="tries">{MAX_GUESSES - guesses.length} left</span>
                                <button className="button" onClick={submit} disabled={!input}>Submit</button>
                            </div>
                        )}
                    </>
                )}
            </main>

            <footer className="footer">
                Clues from the <a href="https://cryptics.georgeho.org/" target="_blank" rel="noreferrer">Cryptic Crossword Dataset</a>
                {' · '}made by <a href="https://www.linkedin.com/in/shubhankar-agarwal/" target="_blank" rel="noreferrer">astronights</a>
            </footer>

            <Dialog open={dialog === 'help'} title="How to play" onClose={closeDialog}>
                <Help />
                <button className="button wide" onClick={closeDialog}>Let&apos;s play</button>
            </Dialog>
            <Dialog open={dialog === 'stats'} title="Statistics" onClose={closeDialog}>
                {stats && <StatsView stats={stats} today={over ? (solved ? guesses.length : 'X') : undefined} />}
                {over && <button className="button wide" onClick={share}>Share result</button>}
            </Dialog>

            {toast && <div className="toast" role="status">{toast}</div>}
        </div>
    );
}

const clueContains = (clue: string, hint: string | null) =>
    !!hint && clue.toLowerCase().includes(hint.toLowerCase());

function ClueText({ clue, hint }: { clue: string; hint: string | null }) {
    if (!hint || !clueContains(clue, hint)) return <>{clue}</>;
    const i = clue.toLowerCase().indexOf(hint.toLowerCase());
    return <>{clue.slice(0, i)}<mark>{clue.slice(i, i + hint.length)}</mark>{clue.slice(i + hint.length)}</>;
}

type ResultProps = {
    solved: boolean; answer: string; tries: number; rated?: boolean;
    onShare: () => void; onRate: (liked: boolean) => void; onStats: () => void; onNewDay: () => void;
};

function Result({ solved, answer, tries, rated, onShare, onRate, onStats, onNewDay }: ResultProps) {
    return (
        <section className="card result">
            <h2>{solved ? ['Genius!', 'Brilliant!', 'Nicely done!', 'Got it!', 'Phew!'][tries - 1] : 'So close'}</h2>
            <p>
                {solved
                    ? `Solved in ${tries} ${tries === 1 ? 'guess' : 'guesses'}.`
                    : <>The answer was <b className="answer">{answer}</b>.</>}
            </p>
            <div className="result-actions">
                <button className="button" onClick={onShare}>Share</button>
                <button className="button secondary" onClick={onStats}>Stats</button>
            </div>
            <div className="rating">
                {rated === undefined ? (
                    <>
                        <span>Enjoy this clue?</span>
                        <button className="chip" onClick={() => onRate(true)} aria-label="Yes">👍</button>
                        <button className="chip" onClick={() => onRate(false)} aria-label="No">👎</button>
                    </>
                ) : <span>Thanks for the feedback!</span>}
            </div>
            <Countdown onDone={onNewDay} />
        </section>
    );
}

// Counts down to local midnight, then loads the new day's clue.
function Countdown({ onDone }: { onDone: () => void }) {
    const [midnight] = useState(() => new Date().setHours(24, 0, 0, 0));
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const id = setInterval(() => {
            setNow(Date.now());
            if (Date.now() >= midnight) {
                clearInterval(id);
                onDone();
            }
        }, 1000);
        return () => clearInterval(id);
    }, [midnight, onDone]);
    const s = Math.max(0, Math.floor((midnight - now) / 1000));
    const pad = (n: number) => String(n).padStart(2, '0');
    return <p className="countdown">Next clue in <b>{pad(Math.floor(s / 3600))}:{pad(Math.floor(s / 60) % 60)}:{pad(s % 60)}</b></p>;
}

// The theme lives on <html data-theme>, falling back to the system setting.
const DARK_QUERY = '(prefers-color-scheme: dark)';
const isDark = () => {
    const theme = document.documentElement.dataset.theme;
    return theme ? theme === 'dark' : matchMedia(DARK_QUERY).matches;
};
const subscribeTheme = (onChange: () => void) => {
    const query = matchMedia(DARK_QUERY);
    const observer = new MutationObserver(onChange);
    query.addEventListener('change', onChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
        query.removeEventListener('change', onChange);
        observer.disconnect();
    };
};

function ThemeToggle() {
    const dark = useSyncExternalStore(subscribeTheme, isDark, () => false);
    const toggle = () => {
        const theme = dark ? 'light' : 'dark';
        document.documentElement.dataset.theme = theme;
        try { localStorage.setItem('cryptle_theme', theme); } catch { }
    };
    return (
        <button className="icon-button" onClick={toggle} aria-label={dark ? 'Light mode' : 'Dark mode'}>
            {dark ? <SunIcon /> : <MoonIcon />}
        </button>
    );
}

function Skeleton() {
    return (
        <div aria-busy="true" aria-label="Loading">
            <div className="skeleton" style={{ width: '40%', height: 14, margin: '4px auto 16px' }} />
            <div className="card clue-card">
                <div className="skeleton" style={{ height: 22, marginBottom: 10 }} />
                <div className="skeleton" style={{ width: '60%', height: 22 }} />
            </div>
            <div className="skeleton" style={{ height: 260, marginTop: 20 }} />
        </div>
    );
}
