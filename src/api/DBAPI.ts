import mongoose from 'mongoose';
import { Clue } from '../types';

const mongo_uri = 'mongodb+srv://user:pass@cluster-e0925482.g5ni9qp.mongodb.net/daily-cryptic'

mongoose.connect(mongo_uri.replace('user', process.env.MONGO_USER).replace('pass', process.env.MONGO_PASS));

const clueSchema = new mongoose.Schema<Clue>({
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

export const ClueModel = mongoose.model<Clue>('clues', clueSchema);
