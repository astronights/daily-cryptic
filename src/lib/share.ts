import { scoreGuess, type Mark } from './score';

const EMOJI: Record<Mark, string> = { absent: '⬜', elsewhere: '🟪', present: '🟨', correct: '🟩' };
export const SITE_URL = 'https://daily-cryptic-iief.vercel.app/';

export const shareText = (edition: number, answer: string, guesses: string[], solved: boolean, hintUsed: boolean) => {
    const rows = guesses.map((g) => scoreGuess(answer, g).marks.map((w) => w.map((m) => EMOJI[m]).join('')).join(' '));
    return `Cryptle #${edition} ${solved ? guesses.length : 'X'}/5${hintUsed ? '*' : ''}\n\n${rows.join('\n')}`;
};
