export const mapColor = (score: number) => {
    switch (score) {
        case 0:
            return 'purple';
        case 1:
            return 'yellow';
        case 2:
            return 'green';
        case -1:
            return 'none';
    }
}

export const checkColor = (score: number[]) => {
    if (score.every((val) => val === 2)) {
        return 'green';
    } else if (score.every((val) => val > 0)) {
        return 'yellow';
    } else if (score.every((val) => val >= 0)) {
        return 'purple';
    } else {
        return 'blue';
    }
}

export const getShareScores = (edition: number, hint: boolean, scores: number[][][]) => {
    const solved = scores[scores.length - 1].every((word) => word.every((letter) => letter === 2));
    const emojis = ['🔵', '🟠', '🟡', , '🟢'] ;
    const colors = scores.map((word) => word.map((letter) => emojis[Math.min(...letter)+1]));
    console.log(colors);
    return "Cryptle #" + edition + ' ' + (solved ? scores.length : 'X') + '/5' + (hint ? '*' : '') + '\n\n' + colors.map((word) => word.join('')).join('\n') + '\n\n' + 'https://daily-cryptic-iief.vercel.app/';
}

export const compareAnswers = (answer: string, guess: string): [string[], number[][]] => {

    const answerWords = answer.split(' ');
    const cleanGuess = guess.replace(/[^A-Za-z]/g,"");

    let pos = 0;
    const guessWords = answerWords.map((word, ix) => {
        const guessWord = ix === answerWords.length - 1 ? cleanGuess.slice(pos) : cleanGuess.slice(pos, word.length + pos);
        pos += word.length;
        return guessWord;
    });

    let scores: number[][] = guessWords.map((word) => Array(word.length).fill(-1));
    let matchedIndices = new Set();

    for (let i = 0; i < guessWords.length; i++) {
        for (let j = 0; j < guessWords[i].length; j++) {
            if (guessWords[i][j] === answerWords[i][j]) {
                scores[i][j] = 2;
                matchedIndices.add(i * 1000 + j);
            }
        }
    }

    const remainingAnswers = answerWords.map((word, ix) => {
        return word.split('').filter((_, j) => !matchedIndices.has(ix * 1000 + j));
    });

    for (let i = 0; i < guessWords.length; i++) {
        for (let j = 0; j < guessWords[i].length; j++) {
            if (scores[i][j] === -1) {
                const match = remainingAnswers[i].findIndex((letter) => letter === guessWords[i][j]);
                if (match !== -1) {
                    scores[i][j] = 1;
                    remainingAnswers[i].splice(match, 1);
                }
            }
        }
    }

    const allRemainingLetters = remainingAnswers.reduce((acc, val) => acc.concat(val), []);

    for (let i = 0; i < guessWords.length; i++) {
        for (let j = 0; j < guessWords[i].length; j++) {
            if (scores[i][j] === -1) {
                const match = allRemainingLetters.findIndex((letter) => letter === guessWords[i][j]);
                if (match !== -1) {
                    scores[i][j] = 0;
                    allRemainingLetters.splice(match, 1);
                }
            }
        }
    }

    return [guessWords, scores];
}