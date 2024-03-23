import { Clue } from '../types';
import { ClueModel } from './DBAPI';

export const getDailyClue = async (): Promise<Clue> => {
    const randomClue = await ClueModel.aggregate([
        { 
            $match: { 
                date_used: { 
                    $lte: new Date('2000-01-01'), } } },
        { $sample: { size: 1 } },
    ]);
    return randomClue[0];

};

