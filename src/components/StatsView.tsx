import type { Stats } from '@/lib/storage';

export default function StatsView({ stats, today }: { stats: Stats; today?: number | 'X' }) {
    const played = stats.wins.reduce((a, b) => a + b, 0) + stats.losses;
    const won = played - stats.losses;
    const bars: [label: number | 'X', count: number][] = [...stats.wins.map((n, i) => [i + 1, n] as [number, number]), ['X', stats.losses]];
    const max = Math.max(1, ...bars.map(([, n]) => n));

    return (
        <div className="stats">
            <div className="stat-grid">
                <div><strong>{played}</strong><span>Played</span></div>
                <div><strong>{played ? Math.round((won / played) * 100) : 0}</strong><span>Win %</span></div>
                <div><strong>{stats.streak}</strong><span>Streak</span></div>
                <div><strong>{stats.maxStreak}</strong><span>Best</span></div>
            </div>
            <h3>Guesses</h3>
            <div className="bars">
                {bars.map(([label, n]) => (
                    <div className="bar-row" key={label}>
                        <span className="bar-label">{label}</span>
                        <div className="bar-track">
                            <div className={'bar' + (label === today ? ' today' : '')} style={{ width: `${Math.max(8, (n / max) * 100)}%` }}>{n}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
