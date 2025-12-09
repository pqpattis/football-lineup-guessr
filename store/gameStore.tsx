import { create } from 'zustand';
import { NameGuess, PositionId, Player } from '@/types';

// State structure for a single position
export interface PositionState {
    id: PositionId;
    isSolved: boolean;
    guesses: NameGuess[];
    livesRemaining: number;
}

// Overall state structure
export interface GameState {
    guessesByPosition: Record<PositionId, PositionState>;
    
    // Actions
    initializePositions: (positions: PositionId[]) => void;
    addGuess: (positionId: PositionId, guess: NameGuess, isCorrect: boolean) => void;
    markSolved: (positionId: PositionId, solvedPlayer: Player) => void;
}

// Initial state creator helper
const createInitialPositionState = (id: PositionId): PositionState => ({
    id,
    isSolved: false,
    guesses: [],
    livesRemaining: 5,
});

export const useGameStore = create<GameState>((set, get) => ({
    guessesByPosition: {} as Record<PositionId, PositionState>,

    // Action to set up the state when the game starts (in app/page.tsx)
    initializePositions: (positions) => {
        const initialMap = positions.reduce((acc, id) => {
            acc[id] = createInitialPositionState(id);
            return acc;
        }, {} as Record<PositionId, PositionState>);

        set({ guessesByPosition: initialMap });
    },
    
    // Action to add a guess and update the state
    addGuess: (positionId, guess, isCorrect) => {
        set((state) => {
            const currentPositionState = state.guessesByPosition[positionId];
            if (!currentPositionState) return state;

            const newGuesses = [...currentPositionState.guesses, guess];
            const newLives = currentPositionState.livesRemaining - 1;
            const solvedStatus = isCorrect || currentPositionState.isSolved;

            return {
                guessesByPosition: {
                    ...state.guessesByPosition,
                    [positionId]: {
                        ...currentPositionState,
                        guesses: newGuesses,
                        livesRemaining: newLives,
                        isSolved: solvedStatus,
                    },
                },
            };
        });
    },
    
    // Action to mark a position as permanently solved
    markSolved: (positionId, solvedPlayer) => {
        set((state) => ({
            guessesByPosition: {
                ...state.guessesByPosition,
                [positionId]: {
                    ...state.guessesByPosition[positionId],
                    isSolved: true,
                },
            },
        }));
    },
}));