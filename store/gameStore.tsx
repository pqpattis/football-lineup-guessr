import { create } from 'zustand';
import { NameGuess, PositionId } from '@/types';
import { MOCK_SOLUTION } from '@/data/mockMatch';

// State structure for a single position
export interface PositionState {
    positionId: PositionId;
    isSolved: boolean;
    guesses: NameGuess[];
    livesRemaining: number;
}

// Overall state structure
export interface GameState {
    guessesByPosition: Record<PositionId, PositionState>;
    activePositionId: PositionId | null;
    
    isGameOver: boolean;
    isGameWon: boolean;
    MAX_LIVES: number;
}

export interface GameActions {
    setActivePosition: (id: PositionId | null) => void;
    addGuess: (positionId: PositionId, newGuess: NameGuess, isSolved: boolean) => void;
    resetGame: () => void;
}

// Initial state creator helper
const createInitialPositionStates = (maxLives: number): Record<PositionId, PositionState> => {
    const states = {} as Record<PositionId, PositionState>;
    MOCK_SOLUTION.lineup.forEach(p => {
        states[p.positionId] = {
            positionId: p.positionId,
            guesses: [],
            isSolved: false,
            livesRemaining: maxLives,
        };
    });
    return states;
};

const MAX_LIVES = 5;
const initialState: GameState = {
    guessesByPosition: createInitialPositionStates(MAX_LIVES), 
    activePositionId: null,
    
    isGameOver: false,
    isGameWon: false,
    MAX_LIVES: MAX_LIVES,
};

export const useGameStore = create<GameState & GameActions>((set) => ({
    ...initialState,

    // Action to control which modal is open
    setActivePosition: (id) => set(() => ({
        activePositionId: id,
    })),

    // Action to record a new guess and check win/loss conditions (Commit 4 & 5 Logic)
    addGuess: (positionId, newGuess, isSolved) => set((state) => {
        const positionState = state.guessesByPosition[positionId];
        const newGuesses = [...positionState.guesses, newGuess];
        const livesRemaining = state.MAX_LIVES - newGuesses.length;
        
        // Update position state
        const updatedPositionState: PositionState = {
            ...positionState,
            guesses: newGuesses,
            isSolved: isSolved || positionState.isSolved,
            livesRemaining: livesRemaining,
        };
        
        // Game over if any player guesses are exceeded
        let isGameOver = state.isGameOver;
        if (!isSolved && livesRemaining === 0) {
            isGameOver = true;
        }
        
        // Game is won when all players are correctly guessed
        const allPositionsSolved = Object.values({
            ...state.guessesByPosition,
            [positionId]: updatedPositionState, 
        }).every(pos => pos.isSolved);
        
        let isGameWon = state.isGameWon;
        if (allPositionsSolved) {
            isGameWon = true;
        }

        return {
            guessesByPosition: {
                ...state.guessesByPosition,
                [positionId]: updatedPositionState,
            },
            isGameOver: isGameOver,
            isGameWon: isGameWon,
            activePositionId: (isGameOver || isGameWon) ? null : state.activePositionId, 
        };
    }),

    // Action to reset the entire game state
    resetGame: () => set(() => {
        // Recalculates and returns the initial state values
        return { 
            ...initialState, 
            guessesByPosition: createInitialPositionStates(MAX_LIVES),
        };
    }),
}));