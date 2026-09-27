import { previousDate } from './date';

export const MAX_GUESSES = 5;

export type SavedGame = {
    date: string;
    guesses: string[];
    hint: string | null;   // the definition, once revealed
    hintUsed: boolean;
    rated?: boolean;       // true = liked, false = disliked
};

export type Stats = {
    wins: number[];        // wins[i] = solved in i+1 guesses
    losses: number;
    streak: number;
    maxStreak: number;
    lastDate: string | null;  // last date that was recorded
    lastWin: string | null;
};

const GAME_KEY = 'cryptle_game';
const STATS_KEY = 'cryptle_stats_v2';
const LEGACY_STATS_KEY = 'cryptle_stats';   // [w1..w5, losses]

const read = <T>(key: string): T | null => {
    try {
        return JSON.parse(localStorage.getItem(key) ?? 'null');
    } catch {
        return null;
    }
};
const write = (key: string, value: unknown) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch { /* storage full or blocked: play on without saving */ }
};

export const loadGame = (date: string): SavedGame => {
    const saved = read<SavedGame>(GAME_KEY);
    return saved?.date === date ? saved : { date, guesses: [], hint: null, hintUsed: false };
};
export const saveGame = (game: SavedGame) => write(GAME_KEY, game);

export const loadStats = (): Stats => {
    const stats = read<Stats>(STATS_KEY);
    if (stats) return stats;
    const legacy = read<number[]>(LEGACY_STATS_KEY);
    return {
        wins: Array.isArray(legacy) ? legacy.slice(0, 5).map(Number) : [0, 0, 0, 0, 0],
        losses: Array.isArray(legacy) ? Number(legacy[5]) || 0 : 0,
        streak: 0,
        maxStreak: 0,
        lastDate: null,
        lastWin: null,
    };
};

// Record a finished game once per date.
export const recordResult = (date: string, guesses: number | null): Stats => {
    const stats = loadStats();
    if (stats.lastDate === date) return stats;
    const next: Stats = { ...stats, wins: [...stats.wins], lastDate: date };
    if (guesses) {
        next.wins[guesses - 1] += 1;
        next.streak = stats.lastWin === previousDate(date) ? stats.streak + 1 : 1;
        next.maxStreak = Math.max(next.maxStreak, next.streak);
        next.lastWin = date;
    } else {
        next.losses += 1;
        next.streak = 0;
    }
    write(STATS_KEY, next);
    return next;
};

export const seenHelp = () => read<boolean>('cryptle_seen_help') === true;
export const markHelpSeen = () => write('cryptle_seen_help', true);
