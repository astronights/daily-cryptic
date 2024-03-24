'use server';

import { Clue } from '../types';
import { connectDB } from './DBAPI';
import ClueModel from './clue';

export const getNthDay = async (): Promise<number> => {
    await connectDB();
    const count = await ClueModel.countDocuments({ date_used: { $gt: new Date('2000-01-01') } });
    return Promise.resolve(count);
}

export const getDailyClue = async (): Promise<Clue> => {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await connectDB();

    let todayClue = null;
    todayClue = await ClueModel.findOne({ date_used: today });

    if (!todayClue) {
        const randomClue = await ClueModel.aggregate(
            [
                {
                    $match: {
                        date_used: {
                            $lte: new Date('2000-01-01'),
                        }
                    }
                },
                { $sample: { size: 1 } }]
        );
        todayClue = randomClue[0];
        todayClue.date_used = today;
        await ClueModel.updateOne({ _id: todayClue._id }, todayClue, { upsert: true });
    }

    return Promise.resolve({
        rowid: todayClue.rowid,
        clue: todayClue.clue,
        answer: todayClue.answer,
        definition: todayClue.definition,
        puzzle_date: todayClue.puzzle_date,
        puzzle_name: todayClue.puzzle_name,
        source_url: todayClue.source_url,
        source: todayClue.source,
        score: todayClue.score,
        date_used: todayClue.date_used,
    });

};