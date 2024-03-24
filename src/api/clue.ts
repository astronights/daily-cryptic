import mongoose from 'mongoose';

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
});

const getModel = () => {
    return mongoose.model('Clue', clueSchema);
}

const ClueModel = mongoose.models.Clue || getModel();

export default ClueModel;
