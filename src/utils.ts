export const italicizeRegex = (text: string, regex: string): string => {
    const re = new RegExp(regex, 'g');
    return text.replace(re, '**$&**');
}

export const compareAnswers = (answer: string, guess: string): number[] => {

    const answerWords = answer.split(' ');
    const guessWords = guess.split(' ');

    let scores = []
    let matchedIndices = new Set();

    for (let i = 0; i < guessWords.length; i++) {
        for (let j = 0; j < answerWords.length; j++) {
            if (matchedIndices.has(j)) {
                continue;
            }
            if (guessWords[i] === answerWords[j]) {
                scores.push(1);
                matchedIndices.add(j);
                break;
            }
        }
    }
    console.log(answer, guess, scores);
    return scores;
}