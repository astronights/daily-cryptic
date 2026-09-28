const DAY = 86_400_000;

export const toISODate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const utcISODate = (ms: number) => new Date(ms).toISOString().slice(0, 10);

// Players get the puzzle for their own local date, but only within a day of
// UTC (time zones span roughly -12h..+14h). Anything else falls back to UTC today.
export const clampDate = (requested: string, now = Date.now()) => {
    const allowed = [utcISODate(now - DAY), utcISODate(now), utcISODate(now + DAY)];
    return allowed.includes(requested) ? requested : allowed[1];
};

// Stable 32-bit hash of a date string, scaled to [0, 1). FNV-1a, then murmur3's
// final mix so dates differing only in the last digit land far apart.
export const hashDate = (iso: string) => {
    let h = 0x811c9dc5;
    for (let i = 0; i < iso.length; i++) h = Math.imul(h ^ iso.charCodeAt(i), 0x01000193);
    h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
    h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 2 ** 32;
};

export const previousDate =(iso: string) => utcISODate(Date.parse(iso) - DAY);

export const formatLong = (iso: string) =>
    new Date(iso + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
