'use server';

import { store } from '@/lib/clues';
import { clampDate } from '@/lib/date';
import { encode } from '@/lib/obfuscate';
import { answerWords } from '@/lib/score';
import type { Puzzle } from '@/lib/types';

// Trailing letter count such as "(5)" or "(3,5)" or "(4-4)".
const ENUMERATION = /\s*\([\d,\s\-–]+\)\s*$/;

export async function loadPuzzle(localDate: string): Promise<Puzzle> {
    const date = clampDate(localDate);
    const { clue, edition } = await store.clueFor(date);
    const words = answerWords(clue.answer);
    return {
        date,
        edition,
        clue: clue.clue.replace(ENUMERATION, ''),
        lengths: words.map((w) => w.length),
        key: encode(words.join(' ')),
        source: {
            name: clue.puzzle_name ?? '',
            date: clue.puzzle_date ? new Date(clue.puzzle_date).toISOString().slice(0, 10) : null,
            url: clue.source_url || null,
        },
    };
}

export async function loadHint(date: string): Promise<string | null> {
    const { clue } = await store.clueFor(clampDate(date));
    return clue.definition?.trim() || null;
}

export async function rateClue(date: string, liked: boolean): Promise<void> {
    await store.rate(clampDate(date), liked ? 1 : -1);
}
