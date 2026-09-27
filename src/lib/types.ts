export type Puzzle = {
    date: string;          // YYYY-MM-DD the puzzle belongs to
    edition: number;       // Cryptle #N
    clue: string;          // clue text without the trailing letter count
    lengths: number[];     // word lengths of the answer, e.g. [3, 5]
    key: string;           // obfuscated answer (see obfuscate.ts)
    source: { name: string; date: string | null; url: string | null };
};
