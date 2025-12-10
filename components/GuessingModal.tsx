'use client';

import React, { useState } from 'react';
import { NameGuess, GuessLetter, LetterStatus, Player, PositionId } from '@/types';
import { MOCK_SOLUTION } from '@/data/mockMatch'; 
import { useGameStore } from '@/store/gameStore';

interface GuessingModalProps {
    isOpen: boolean;
    onClose: () => void;
    positionId: PositionId | null; 
    positionName: string;
    onPlayerSuccess: (player: Player) => void;
}

// Letter comparison logic
const compareNames = (guess: string, answer: string): GuessLetter[] => {
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

// Player guess row component
const GuessRow: React.FC<{ guess: NameGuess }> = ({ guess }) => (
    <div className="flex justify-center my-1 space-x-0.5">
        {guess.feedback.map((f, i) => (
            <div
                key={i}
                className={`w-8 h-8 text-sm flex items-center justify-center font-extrabold text-white rounded 
                    ${f.status === 'correct' ? 'bg-green-600' : 
                      f.status === 'present' ? 'bg-yellow-500' : 'bg-gray-400'}`}
            >
                {f.letter}
            </div>
        ))}
    </div>
);

export const GuessingModal: React.FC<GuessingModalProps> = ({ 
    isOpen, 
    onClose, 
    positionId, 
    positionName,
    onPlayerSuccess
}) => {
    const [currentGuess, setCurrentGuess] = useState('');
    
    // Get state and actions from the store
    const positionState = useGameStore(state => positionId ? state.guessesByPosition[positionId] : undefined);
    const addGuess = useGameStore(state => state.addGuess);

    // Get history and lives from the store state
    const guessHistory = positionState?.guesses || [];
    const maxGuesses = 5; 
    const livesRemaining = positionState?.livesRemaining || maxGuesses;

    if (!isOpen || !positionId || !positionState) return null;

    const solutionPlayer = MOCK_SOLUTION.lineup.find(p => p.positionId === positionId);
    const correctName = solutionPlayer?.name || "";
    const correctNameLength = correctName.length;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Must match the length of the correct name
        if (currentGuess.trim().length !== correctNameLength) {
             alert(`Guess must be exactly ${correctNameLength} letters long.`);
             return;
        }

        if (currentGuess.trim() === '' || positionState.isSolved || livesRemaining <= 0) return;

        const feedback = compareNames(currentGuess, correctName);
        const newGuess: NameGuess = { guessName: currentGuess, feedback };
        
        const isSuccess = feedback.every(f => f.status === 'correct');

        addGuess(positionId, newGuess, isSuccess);

        if (isSuccess && solutionPlayer) {
            onPlayerSuccess(solutionPlayer); 
        } else if (livesRemaining - 1 <= 0) {
             alert(`Out of guesses for ${positionName}! The player was ${correctName}.`);
             onClose();
        }

        setCurrentGuess('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-start justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mt-16 p-6 transform transition-all duration-300">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-2xl font-extrabold text-gray-900">
                        Guess: <span className="text-green-700">{positionName}</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl font-light leading-none">
                        &times;
                    </button>
                </div>
                
                {/* Guess History Grid */}
                <div className="min-h-[160px] flex flex-col justify-end p-2 mb-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                    {guessHistory.length === 0 ? (
                        <p className="text-gray-500 italic text-sm text-center py-8">
                            Make your first guess!
                        </p>
                    ) : (
                        guessHistory.map((guess, index) => (
                            <GuessRow key={index} guess={guess} />
                        ))
                    )}
                </div>

                <form onSubmit={handleSubmit} className="flex gap-3 mb-3">
                    <input
                        type="text"
                        placeholder={`${correctNameLength}-Letter Name for ${positionId}`}
                        value={currentGuess}
                        onChange={(e) => setCurrentGuess(e.target.value)}
                        className="
                            w-full p-4 border-2 border-green-400 rounded-xl 
                            focus:ring-2 focus:ring-green-600 focus:border-green-600 
                            uppercase font-mono tracking-widest text-lg font-bold
                            transition duration-200
                        "
                        disabled={positionState.isSolved || livesRemaining <= 0}
                        maxLength={correctNameLength}
                    />
                    <button 
                        type="submit" 
                        className="
                            p-4 bg-green-600 text-white font-bold rounded-xl 
                            hover:bg-green-700 transition duration-200
                            disabled:bg-gray-400 disabled:cursor-not-allowed
                        "
                        disabled={positionState.isSolved || livesRemaining <= 0}
                    >
                        SUBMIT
                    </button>
                </form>

                <p className="text-base text-gray-700 font-semibold mt-2">
                    Guesses Remaining: <span className={`font-extrabold ${livesRemaining <= 1 ? 'text-red-500' : 'text-green-600'}`}>{livesRemaining}</span>
                </p>
            </div>
        </div>
    );
};