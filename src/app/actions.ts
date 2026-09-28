'use server';

import { store } from '@/lib/clues';
import { clampDate } from '@/lib/date';
import { encode } from '@/lib/obfuscate';
import { answerWords } from '@/lib/score';
import type { Puzzle } from '@/lib/types';

// Trailing letter count such as "(5)" or "(3,5)" or "(4-4)".
const ENUMERATION = /\s*\([\d,\s\-–]+\)\s*$/;

// Imported rows can hold NaN or null where the dataset had gaps.
const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const isoDate = (v: unknown) => {
    const d = v ? new Date(v as string) : null;
    return d && !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : null;
};

export async function loadPuzzle(localDate: string): Promise<Puzzle> {
    const date = clampDate(localDate);
    const { clue, edition } = await store.clueFor(date);
    const words = answerWords(clue.answer);
    return {
        date,
        edition,
        clue: text(clue.clue).replace(ENUMERATION, ''),
        lengths: words.map((w) => w.length),
        key: encode(words.join(' ')),
        source: {
            name: text(clue.puzzle_name),
            date: isoDate(clue.puzzle_date),
            url: text(clue.source_url) || null,
        },
    };
}

export async function loadHint(date: string): Promise<string | null> {
    const { clue } = await store.clueFor(clampDate(date));
    return text(clue.definition) || null;
}

export async function rateClue(date: string, liked: boolean): Promise<void> {
    await store.rate(clampDate(date), liked ? 1 : -1);
}
