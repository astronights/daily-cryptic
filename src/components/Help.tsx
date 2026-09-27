import { scoreGuess } from '@/lib/score';
import Row from './Row';

const EXAMPLE = scoreGuess('RED CROSS', 'ROD SCARE');
const tile = (mark: string, letter: string) => <span className={`tile small ${mark}`}>{letter}</span>;

export default function Help() {
    return (
        <div className="help">
            <p>Solve one cryptic crossword clue a day, in <b>5 guesses</b>.</p>
            <ul>
                <li>Every clue has a <b>definition</b> (at the start or end) and some <b>wordplay</b> leading to the same answer.</li>
                <li>The numbers, like <b>(3,5)</b>, give the length of each word. Just type the letters; spaces don&apos;t matter.</li>
            </ul>

            <h3>Reading the colours</h3>
            <p className="muted-text">Answer <b>RED CROSS</b>, guess <b>ROD SCARE</b>:</p>
            <Row lengths={[3, 5]} words={EXAMPLE.words} marks={EXAMPLE.marks} />
            <ul className="legend">
                <li>{tile('correct', 'R')} Right letter, right spot</li>
                <li>{tile('present', 'S')} In this word, wrong spot</li>
                <li>{tile('elsewhere', 'O')} In a different word</li>
                <li>{tile('absent', 'A')} Not in the answer</li>
            </ul>

            <h3>Stuck?</h3>
            <p>Tap <b>Hint</b> to highlight the definition. Your shared score gets a <b>*</b>.</p>
            <p className="muted-text">A new clue arrives every day at midnight.</p>
        </div>
    );
}
