import React, { useState, useEffect } from 'react';
import { useGameStore, GameState, GameActions } from '@/store/gameStore'; 

// Define the type for the data we need to hold in local state
type ModalData = {
    isGameOver: boolean;
    isGameWon: boolean;
    resetGame: GameActions['resetGame'];
};

// Empty initial state
const initialData: ModalData = {
    isGameOver: false,
    isGameWon: false,
    // Prevent errors if the button is clicked early
    resetGame: () => console.log("Game reset not yet loaded."), 
};

type CombinedState = GameState & GameActions;

export const GameOverModal: React.FC = () => {
    
    const [data, setData] = useState<ModalData>(initialData);

    useEffect(() => {
        // Get snapshot of current state and actions
        const currentState = useGameStore.getState();

        // Define the subscription listener
        const unsubscribe = useGameStore.subscribe((state) => { 
            const s = state as CombinedState; 
            
            const selectedState = {
                isGameOver: s.isGameOver,
                isGameWon: s.isGameWon,
                resetGame: s.resetGame,
            };
            
            // Update local state
            setData(selectedState); 
        });

        // Set the initial state after subscribing
        setData({
            isGameOver: currentState.isGameOver,
            isGameWon: currentState.isGameWon,
            resetGame: currentState.resetGame,
        });

        // Unsubscribe when the component unmounts
        return () => unsubscribe();
    }, []);

    const { isGameOver, isGameWon, resetGame } = data;
    
    // Check conditions to display the modal
    if (!isGameOver && !isGameWon) {
        return null;
    }

    const title = isGameWon ? "🏆 VICTORY! 🏆" : "❌ GAME OVER! ❌";
    const message = isGameWon 
        ? "You correctly identified all players in the starting eleven. Great job!" 
        : "You ran out of guesses for one of your players. Better luck next time!";
    
    const bgColor = isGameWon ? "bg-green-700" : "bg-red-700";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className={`rounded-xl shadow-2xl w-full max-w-md p-8 text-white ${bgColor}`}>
                <h2 className="text-3xl font-extrabold text-center mb-4">{title}</h2>
                <p className="text-center text-lg mb-6">{message}</p>
                
                <div className="text-center">
                    <button
                        onClick={resetGame}
                        className="bg-white text-gray-800 hover:bg-gray-200 font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-lg shadow-md"
                    >
                        Play Again
                    </button>
                </div>
            </div>
        </div>
    );
};