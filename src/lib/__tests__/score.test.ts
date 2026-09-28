import { describe, expect, it } from 'vitest';
import { isSolved, scoreGuess, splitGuess } from '../score';
import { clampDate, hashDate } from '../date';
import { decode, encode } from '../obfuscate';

describe('splitGuess', () => {
    it('splits by answer word lengths and ignores spaces/case', () => {
        expect(splitGuess([3, 5], 'redcr oss')).toEqual(['RED', 'CROSS']);
    });
    it('spills extra letters into the last word', () => {
        expect(splitGuess([3, 5], 'REDCROSSES')).toEqual(['RED', 'CROSSES']);
    });
    it('leaves later words short when the guess is short', () => {
        expect(splitGuess([3, 5], 'RE')).toEqual(['RE', '']);
    });
});

describe('scoreGuess', () => {
    it('marks all four states', () => {
        expect(scoreGuess('RED CROSS', 'ROD SCARE').marks).toEqual([
            ['correct', 'elsewhere', 'correct'],
            ['present', 'present', 'absent', 'present', 'elsewhere'],
        ]);
    });
    it('does not over-count repeated letters', () => {
        expect(scoreGuess('ABBEY', 'BBBBB').marks[0]).toEqual(['absent', 'correct', 'correct', 'absent', 'absent']);
    });
    it('prefers the same word before other words', () => {
        expect(scoreGuess('AB BA', 'XA XX').marks).toEqual([['absent', 'present'], ['absent', 'absent']]);
    });
    it('treats the whole answer as solved regardless of spacing', () => {
        expect(isSolved('Red Cross', 'redcross')).toBe(true);
        expect(isSolved('RED CROSS', 'REDCROSSES')).toBe(false);
    });
});

describe('clampDate', () => {
    const now = Date.parse('2026-09-27T12:00:00Z');
    it('accepts dates within a day of UTC', () => {
        expect(clampDate('2026-09-26', now)).toBe('2026-09-26');
        expect(clampDate('2026-09-28', now)).toBe('2026-09-28');
    });
    it('rejects far-off or malformed dates', () => {
        expect(clampDate('2030-01-01', now)).toBe('2026-09-27');
        expect(clampDate('garbage', now)).toBe('2026-09-27');
    });
});

describe('hashDate', () => {
    it('is stable and in [0, 1)', () => {
        const h = hashDate('2026-09-28');
        expect(hashDate('2026-09-28')).toBe(h);
        expect(h).toBeGreaterThanOrEqual(0);
        expect(h).toBeLessThan(1);
    });
    it('spreads consecutive days apart', () => {
        const days = ['2026-09-28', '2026-09-29', '2026-09-30'].map(hashDate);
        expect(new Set(days).size).toBe(3);
        expect(Math.abs(days[0] - days[1])).toBeGreaterThan(0.01);
    });
});

it('round-trips the answer obfuscation', () => {
    expect(decode(encode('RED CROSS'))).toBe('RED CROSS');
});
