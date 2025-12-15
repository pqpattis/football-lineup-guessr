// Letter status for wordle feedback
export type LetterStatus = 'correct' | 'present' | 'absent'; 

export interface GuessLetter {
  letter: string;
  status: LetterStatus;
}

// Letter comparison logic
export const compareNames = (guess: string, answer: string): GuessLetter[] => {
    const guessUpper = guess.toUpperCase();
    const answerUpper = answer.toUpperCase();
    const feedback: GuessLetter[] = [];
    
    const answerMap = new Map<string, number>();
    for (const char of answerUpper) {
        answerMap.set(char, (answerMap.get(char) || 0) + 1);
    }

    // Find correct letters
    for (let i = 0; i < guessUpper.length; i++) {
        const letter = guessUpper[i];
        if (answerUpper[i] === letter) {
            feedback[i] = { letter, status: 'correct' };
            answerMap.set(letter, (answerMap.get(letter)! - 1));
        }
    }

    // Find misplaced and absent letters
    for (let i = 0; i < guessUpper.length; i++) {
        if (feedback[i]) continue;

        const letter = guessUpper[i];
        const count = answerMap.get(letter) || 0;

        if (count > 0) {
            feedback[i] = { letter, status: 'present' };
            answerMap.set(letter, count - 1);
        } else {
            feedback[i] = { letter, status: 'absent' };
        }
    }
    
    while (feedback.length < guessUpper.length) {
        feedback.push({ letter: guessUpper[feedback.length], status: 'absent' });
    }

    return feedback;
};