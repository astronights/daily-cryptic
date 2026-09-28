import mongoose from 'mongoose';

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

// Unused clues carry a placeholder date before this cutoff.
const UNUSED = '1970-01-01';
const CUTOFF = '2000-01-01';

const clueSchema = new mongoose.Schema({
    rowid: Number,
    clue: String,
    answer: String,
    definition: String,
    puzzle_date: Date,
    puzzle_name: String,
    source_url: String,
    source: String,
    score: Number,
    date_used: Date,
    date_used_v2: { type: String, index: true },  // YYYY-MM-DD, or UNUSED
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

// If two requests assign a clue to the same day at once, the lowest _id wins
// and the loser is handed back to the unused pool.
const findForDate = (date: string) =>
    ClueModel.findOne({ date_used_v2: date }).sort({ _id: 1 }).lean<StoredClue & { _id: unknown }>();

const mongoStore: ClueStore = {
    async clueFor(date) {
        await connect();
        let clue = await findForDate(date);
        if (!clue) {
            const [candidate] = await ClueModel.aggregate([
                { $match: { date_used_v2: { $lte: CUTOFF } } },
                { $sample: { size: 1 } },
            ]);
            if (!candidate) throw new Error('No unused clues left');
            await ClueModel.updateOne(
                { _id: candidate._id, date_used_v2: { $lte: CUTOFF } },
                { $set: { date_used_v2: date, date_used: new Date(date) } },
            );
            clue = await findForDate(date);
            if (clue && String(clue._id) !== String(candidate._id)) {
                await ClueModel.updateOne(
                    { _id: candidate._id, date_used_v2: date },
                    { $set: { date_used_v2: UNUSED, date_used: new Date(UNUSED) } },
                );
            }
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
