import type { Mark } from '@/lib/score';

type Props = {
    lengths: number[];     // answer word lengths
    words?: string[];      // letters typed per word (may overflow the last word)
    marks?: Mark[][];
    cursor?: boolean;      // highlight the next empty tile
    muted?: boolean;
};

export default function Row({ lengths, words = [], marks, cursor, muted }: Props) {
    const sizes = lengths.map((len, i) => Math.max(len, words[i]?.length ?? 0));
    const total = sizes.reduce((a, b) => a + b, 0);
    // The next empty tile is in the first word that isn't full yet.
    const cursorWord = cursor ? sizes.findIndex((size, i) => (words[i]?.length ?? 0) < size) : -1;

    return (
        <div
            className={'row' + (muted ? ' muted' : '')}
            style={{ '--n': total, '--k': lengths.length } as React.CSSProperties}
        >
            {sizes.map((size, i) => (
                <div className="word" key={i}>
                    {Array.from({ length: size }, (_, j) => {
                        const letter = words[i]?.[j] ?? '';
                        const mark = marks?.[i]?.[j];
                        let cls = 'tile';
                        if (mark) cls += ' ' + mark;
                        else if (letter) cls += ' filled';
                        if (j >= lengths[i]) cls += ' extra';
                        if (i === cursorWord && j === (words[i]?.length ?? 0)) cls += ' cursor';
                        return (
                            <span key={j} className={cls} style={mark ? { animationDelay: `${(i * 10 + j) * 60}ms` } : undefined}>
                                {letter}
                            </span>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
