import { PositionSlot } from "@/types";
import { GuessLetter, LetterStatus } from "@/types";
import { PositionState } from "@/store/gameStore";

// Define array positioning for 4-3-3 formation
const formation433: PositionSlot[] = [
  // Attack
  { id: 'LW', name: 'Left Winger', gridArea: 'A1' },
  { id: 'ST', name: 'Striker', gridArea: 'A3' },
  { id: 'RW', name: 'Right Winger', gridArea: 'A5' },

  // Midfield
  { id: 'LCM', name: 'Left Center Mid', gridArea: 'C2' },
  { id: 'CM', name: 'Center Midfielder', gridArea: 'C3' },
  { id: 'RCM', name: 'Right Center Mid', gridArea: 'C4' },

  // Defense
  { id: 'LB', name: 'Left Back', gridArea: 'E1' },
  { id: 'LCB', name: 'Left Center Back', gridArea: 'E2' },
  { id: 'RCB', name: 'Right Center Back', gridArea: 'E4' },
  { id: 'RB', name: 'Right Back', gridArea: 'E5' },
  
  // GK
  { id: 'GK', name: 'Goalkeeper', gridArea: 'F3' },
];


// Export a map containing all defined formations
export const FORMATION_MAP = {
  '4-3-3': formation433,
  // '4-4-2': formation442,
};

export type FormationKey = keyof typeof FORMATION_MAP;

// Calculates the best letter status across all guesses for visualization
export const getBestFeedback = (
    positionState: PositionState | undefined, 
    correctNameLength: number
): GuessLetter[] => {
    if (!positionState || positionState.guesses.length === 0) {
        // Return blank placeholders if no guesses have been made
        return Array(correctNameLength).fill({ letter: '_', status: 'absent' });
    }

    const guesses = positionState.guesses;
    const bestFeedback: GuessLetter[] = Array(correctNameLength).fill(null);

    // Iterate over all guesses, prioritizing 'correct' status
    for (const guess of guesses) {
        const feedback = guess.feedback;
        
        for (let i = 0; i < correctNameLength; i++) {
            const currentLetter = feedback[i];
            
            // Safety check for guesses that are shorter than the answer name
            if (!currentLetter) continue; 
            
            const existingBest = bestFeedback[i];
            
            // If the current guess is 'correct', it is always the best
            if (currentLetter.status === 'correct') {
                bestFeedback[i] = currentLetter;
            } 
            // If the position is currently empty or has a lower status, update it
            else if (!existingBest || existingBest.status !== 'correct') {
                // If existing is 'present' and current is 'absent', keep 'present' (prioritize)
                if (existingBest?.status === 'present' && currentLetter.status === 'absent') {
                    continue; 
                }
                // If the current status is 'present' and existing is 'absent' or null, update
                if (currentLetter.status === 'present' && existingBest?.status !== 'present') {
                    bestFeedback[i] = currentLetter;
                }
            }
        }
    }
    
    // Replace nulls and mark all letters as absent by default if status wasn't 'correct'/'present'
    return bestFeedback.map((f, i) => {
        if (f) return f;
        // Default to a blank placeholder if no definitive status was achieved
        return { letter: '_', status: 'absent' as LetterStatus };
    });
};