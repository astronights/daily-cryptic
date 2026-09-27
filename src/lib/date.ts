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

export const previousDate = (iso: string) => utcISODate(Date.parse(iso) - DAY);

export const formatLong = (iso: string) =>
    new Date(iso + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
