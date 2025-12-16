import { create } from 'zustand';
import { MatchSolution, NameGuess, PositionId, SolutionPlayer } from '@/types';
import { MOCK_MATCHES } from '@/data/mockMatches';

// State structure for a single position
export interface PositionState {
    positionId: PositionId;
    isSolved: boolean;
    guesses: NameGuess[];
    livesRemaining: number;
}

// Overall state structure
export interface GameState {
    currentMatch: MatchSolution;
    guessesByPosition: Record<PositionId, PositionState>;
    activePositionId: PositionId | null;
    isGameOver: boolean;
    isGameWon: boolean;
    MAX_LIVES: number;
}

export interface GameActions {
    selectMatch: (id: number) => void;
    setActivePosition: (id: PositionId | null) => void;
    addGuess: (positionId: PositionId, newGuess: NameGuess, isSolved: boolean) => void;
    resetGame: () => void;
}

// Initial state creator helper
const createInitialPositionStates = (
    lineup: SolutionPlayer[],
    maxLives: number
): Record<PositionId, PositionState> => {
    const states = {} as Record<PositionId, PositionState>;
    lineup.forEach(p => {
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
const FIRST_MATCH_SOLUTION = MOCK_MATCHES[0];
const initialState: GameState = {
    currentMatch: FIRST_MATCH_SOLUTION,
    guessesByPosition: createInitialPositionStates(FIRST_MATCH_SOLUTION.lineup, MAX_LIVES), 
    activePositionId: null,
    isGameOver: false,
    isGameWon: false,
    MAX_LIVES: MAX_LIVES,
};

export const useGameStore = create<GameState & GameActions>((set) => ({
    ...initialState,
    
    selectMatch: (id) => set((state) => {
        const newMatch = MOCK_MATCHES.find(m => m.matchId === id);

        if (!newMatch || newMatch.matchId === state.currentMatch.matchId) {
            return {};
        }
        
        const newLineup = newMatch.lineup;

        return {
            currentMatch: newMatch,
            guessesByPosition: createInitialPositionStates(newLineup, state.MAX_LIVES), 
            livesRemaining: 5,
            isGameOver: false,
            isGameWon: false,
        };
    }),

    currentMatchIndex: MOCK_MATCHES[0].matchId,
    solution: MOCK_MATCHES[0].lineup,

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

    // Reset the entire game state
    resetGame: () => set((state) => {
        const currentLineup = state.currentMatch.lineup; 
    
        // Recalculate the clean guesses
        const newGuessesByPosition = createInitialPositionStates(
            currentLineup, 
            state.MAX_LIVES
        );

        // Return the reset state, preserving the current match solution/ID
        return {
            // Preserve the core state identifying the game:
            currentMatchId: state.currentMatch.matchId, 
            currentSolution: state.currentMatch.lineup,
            MAX_LIVES: state.MAX_LIVES,

            // Reset the game-play specific state:
            guessesByPosition: newGuessesByPosition,
            activePositionId: null,
            isGameOver: false,
            isGameWon: false,
        };
    }),
}));