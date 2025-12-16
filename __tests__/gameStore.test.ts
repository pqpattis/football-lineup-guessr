import { useGameStore, GameState } from '@/store/gameStore'; 
import { MOCK_MATCHES } from '@/data/mockMatches';
import { NameGuess, PositionId } from '@/types';

// Helper to get a clean slice of the store for testing
const getStoreState = (): GameState => useGameStore.getState();

// Utility to reset the store to its initial state before each test
beforeEach(() => {
    useGameStore.getState().resetGame();
});

describe('useGameStore Core Logic', () => {

    test('Store initializes with correct number of positions and lives', () => {
        const state = getStoreState();
        const expectedPositions = MOCK_MATCHES[0].lineup.length; // 11 positions

        expect(Object.keys(state.guessesByPosition).length).toBe(expectedPositions);
        expect(state.guessesByPosition['GK'].livesRemaining).toBe(state.MAX_LIVES);
        expect(state.isGameWon).toBe(false);
        expect(state.isGameOver).toBe(false);
    });

    test('addGuess (Incorrect): Decreases lives and adds to history', () => {
        const { addGuess, MAX_LIVES } = useGameStore.getState();
        const positionId = 'GK';
        const incorrectGuess = { guessName: 'WRONG', feedback: [] };

        addGuess(positionId, incorrectGuess, false);

        const state = getStoreState();
        const gkState = state.guessesByPosition[positionId];

        expect(gkState.guesses).toHaveLength(1);
        expect(gkState.livesRemaining).toBe(MAX_LIVES - 1);
        expect(gkState.isSolved).toBe(false);
    });

    test('addGuess (Correct): Sets isSolved to true', () => {
        const { addGuess } = useGameStore.getState();
        const positionId = 'GK';
        const correctGuess = { guessName: 'CORRECT', feedback: [{ letter: 'C', status: 'correct' }] }; // Mock feedback

        addGuess(positionId, correctGuess as NameGuess, true);

        const state = getStoreState();
        const gkState = state.guessesByPosition[positionId];

        expect(gkState.isSolved).toBe(true);
        expect(state.isGameWon).toBe(false); // Should not be won yet
    });

    test('Game Over Condition: Sets isGameOver when final life is used', () => {
        const { addGuess, MAX_LIVES } = useGameStore.getState();
        const positionId = 'GK';
        const incorrectGuess = { guessName: 'WRONG', feedback: [] };

        // Consume all lives (MAX_LIVES attempts)
        for (let i = 0; i < MAX_LIVES; i++) {
            addGuess(positionId, incorrectGuess, false);
        }

        const state = getStoreState();
        const gkState = state.guessesByPosition[positionId];

        expect(gkState.livesRemaining).toBe(0);
        expect(state.isGameOver).toBe(true); // Should be game over
        expect(state.activePositionId).toBeNull(); // Modal should close
    });

    test('Game Won Condition: Sets isGameWon when all positions are solved', () => {
        const { addGuess } = useGameStore.getState();
        const correctGuess = { guessName: 'CORRECT', feedback: [] };
        
        // Loop through all positions and mark them as solved (simulating a correct guess)
        Object.keys(getStoreState().guessesByPosition).forEach(id => {
            addGuess(id as PositionId, correctGuess, true);
        });

        const state = getStoreState();

        expect(state.isGameWon).toBe(true); // Should be game won
        expect(state.isGameOver).toBe(false);
        expect(state.activePositionId).toBeNull(); // Modal should close
    });
    
    test('resetGame action returns to initial state', () => {
        const { addGuess, resetGame } = useGameStore.getState();
        const positionId = 'GK';
        const incorrectGuess = { guessName: 'WRONG', feedback: [] };

        // Alter the state (play the game a bit)
        addGuess(positionId, incorrectGuess, false);
        
        let state = getStoreState();
        expect(state.guessesByPosition[positionId].livesRemaining).toBeLessThan(state.MAX_LIVES);

        // Reset the game
        resetGame();
        
        // Assert state is back to initial
        state = getStoreState();
        expect(state.guessesByPosition[positionId].guesses).toHaveLength(0);
        expect(state.guessesByPosition[positionId].livesRemaining).toBe(state.MAX_LIVES);
        expect(state.isGameWon).toBe(false);
        expect(state.isGameOver).toBe(false);
    });
});