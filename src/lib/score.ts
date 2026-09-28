// Letter feedback, from worst to best:
//   absent    – letter is not in the answer at all
//   elsewhere – letter is in the answer, but in a different word
//   present   – letter is in this word, but in a different position
//   correct   – right letter, right position
export type Mark = 'absent' | 'elsewhere' | 'present' | 'correct';

export type ScoredGuess = { words: string[]; marks: Mark[][] };

export const lettersOnly = (s: string) => s.toUpperCase().replace(/[^A-Z]/g, '');

export const answerWords = (answer: string) =>
    answer.toUpperCase().split(/[^A-Z]+/).filter(Boolean);

// Split a guess into words matching the answer's word lengths.
// Any extra letters spill over into the last word.
export const splitGuess = (lengths: number[], guess: string): string[] => {
    const letters = lettersOnly(guess);
    let pos = 0;
    return lengths.map((len, i) => {
        const word = i === lengths.length - 1 ? letters.slice(pos) : letters.slice(pos, pos + len);
        pos += len;
        return word;
    });
};

export const scoreGuess = (answer: string, guess: string): ScoredGuess => {
    const target = answerWords(answer);
    const words = splitGuess(target.map((w) => w.length), guess);
    const marks: Mark[][] = words.map((w) => Array(w.length).fill('absent'));

    // Letters of each answer word not yet claimed by a guess letter.
    const pool = target.map((w) => w.split(''));
    const take = (arr: string[], letter: string) => {
        const i = arr.indexOf(letter);
        if (i === -1) return false;
        arr.splice(i, 1);
        return true;
    };

    // 1. Exact matches.
    words.forEach((w, i) => w.split('').forEach((ch, j) => {
        if (target[i][j] === ch) {
            marks[i][j] = 'correct';
            take(pool[i], ch);
        }
    }));
    // 2. Same word, wrong position.
    words.forEach((w, i) => w.split('').forEach((ch, j) => {
        if (marks[i][j] === 'absent' && take(pool[i], ch)) marks[i][j] = 'present';
    }));
    // 3. Somewhere else in the answer.
    words.forEach((w, i) => w.split('').forEach((ch, j) => {
        if (marks[i][j] === 'absent' && pool.some((p) => take(p, ch))) marks[i][j] = 'elsewhere';
    }));

    return { words, marks };
};

export const isSolved = (answer: string, guess: string) =>
    lettersOnly(answer) === lettersOnly(guess);
