import mongoose from 'mongoose';
import { hashDate } from './date';

// A clue as stored, trimmed to what the app uses.
export type StoredClue = {
    clue: string;
    answer: string;
    definition: string | null;
    puzzle_name: string | null;
    puzzle_date: Date | null;
    source_url: string | null;
};

export interface ClueStore {
    // Returns the clue for `date`, assigning a fresh one if the day has none yet.
    clueFor(date: string): Promise<{ clue: StoredClue; edition: number }>;
    rate(date: string, delta: 1 | -1): Promise<void>;
}

// ---------------------------------------------------------------- MongoDB

// Unused clues carry a placeholder date (1970-01-01) before this cutoff.
const CUTOFF = '2000-01-01';

const clueSchema = new mongoose.Schema({
    rowid: { type: Number, index: true },
    clue: String,
    answer: String,
    definition: String,
    puzzle_date: Date,
    puzzle_name: String,
    source_url: String,
    source: String,
    score: Number,
    date_used: Date,
    date_used_v2: { type: String, index: true },  // YYYY-MM-DD, or the placeholder
});
type ClueDoc = mongoose.InferSchemaType<typeof clueSchema>;
const ClueModel = (mongoose.models.Clue as mongoose.Model<ClueDoc>) ?? mongoose.model<ClueDoc>('Clue', clueSchema);

let connection: Promise<typeof mongoose> | null = null;
const connect = () => {
    connection ??= mongoose.connect(process.env.MONGO_URI!).catch((err) => {
        connection = null;
        throw err;
    });
    return connection;
};

// Sorted by _id so a date that older code stamped on two clues still reads consistently.
const findForDate = (date: string) =>
    ClueModel.findOne({ date_used_v2: date }).sort({ _id: 1 }).lean<StoredClue & { _id: unknown }>();

// The date alone decides which clue it gets: hash it to a starting rowid and take
// the first unused clue from there (wrapping around). Two requests racing to open
// a new day therefore pick, and stamp, the very same clue.
const pickUnused = async (date: string) => {
    const last = await ClueModel.findOne().sort({ rowid: -1 }).select('rowid').lean();
    const start = Math.floor(hashDate(date) * ((last?.rowid ?? 0) + 1));
    const unused = { date_used_v2: { $lte: CUTOFF } };
    return (await ClueModel.findOne({ ...unused, rowid: { $gte: start } }).sort({ rowid: 1 }).lean())
        ?? (await ClueModel.findOne({ ...unused, rowid: { $lt: start } }).sort({ rowid: 1 }).lean());
};

const mongoStore: ClueStore = {
    async clueFor(date) {
        await connect();
        let clue = await findForDate(date);
        if (!clue) {
            const candidate = await pickUnused(date);
            if (!candidate) throw new Error('No unused clues left');
            await ClueModel.updateOne(
                { _id: candidate._id, date_used_v2: { $lte: CUTOFF } },
                { $set: { date_used_v2: date, date_used: new Date(date) } },
            );
            clue = await findForDate(date);
        }
        const edition = await ClueModel.countDocuments({ date_used_v2: { $gt: CUTOFF, $lte: date } });
        return { clue: clue!, edition };
    },
    async rate(date, delta) {
        await connect();
        const clue = await findForDate(date);
        if (clue) await ClueModel.updateOne({ _id: clue._id }, { $inc: { score: delta } });
    },
};

// ---------------------------------------------------------------- Sample data
// Used when MONGO_URI is not set, so the app runs locally with no database.

const SAMPLES: [clue: string, answer: string, definition: string][] = [
    ['Dirty room reorganised as dormitory (9)', 'DORMITORY', 'dormitory'],
    ['Humanitarian body is angry, then angry again (3,5)', 'RED CROSS', 'Humanitarian body'],
    ['Carthorse drawn wildly for musicians (9)', 'ORCHESTRA', 'musicians'],
    ['Listen to silent disturbance (6)', 'LISTEN', 'Listen'],
    ['They see, oddly, what we look with (3,4)', 'THE EYES', 'what we look with'],
    ['Moon starer, confused, is a scientist (10)', 'ASTRONOMER', 'scientist'],
];
const EPOCH = Date.UTC(2024, 3, 1);

const sampleStore: ClueStore = {
    async clueFor(date) {
        const edition = Math.round((Date.parse(date) - EPOCH) / 86_400_000) + 1;
        const [clue, answer, definition] = SAMPLES[edition % SAMPLES.length];
        return {
            clue: { clue, answer, definition, puzzle_name: 'Sample clues', puzzle_date: null, source_url: null },
            edition,
        };
    },
    async rate() { },
};

export const store: ClueStore = process.env.MONGO_URI ? mongoStore : sampleStore;
