import React from 'react';
import { FORMATION_MAP, FormationKey, getBestFeedback } from './PitchData'; 
import { PositionSlot, SolutionPlayer, PositionId } from '@/types';
import { GuessLetter } from '@/types';
import { PositionState } from '@/store/gameStore';

// Name progress display
const NameProgressDisplay: React.FC<{ bestFeedback: GuessLetter[] }> = ({ bestFeedback }) => (
    <div className="flex space-x-0.5 mt-1">
            {bestFeedback.map((f, i) => (
                <span
                    key={i}
                    className={`text-[8px] font-extrabold w-2 h-2 rounded-full flex items-center justify-center 
                      ${f.status === 'correct' ? 'bg-green-300' : 
                        f.status === 'present' ? 'bg-yellow-300' : 'bg-white/30'}`}
                >
                    {f.letter === '_' ? '•' : f.letter}
                </span>
            ))}
        </div>
);

// The clickable player slot
const PlayerSlot: React.FC<{ 
  id: string, 
  name: string,
  onClick: (id: string) => void,
  kitNumber: number,
  guessesTaken: number,
  isSolved: boolean;
}> = ({ id, name, onClick, kitNumber, guessesTaken, isSolved }) => {
    
    // Determine the main background color
    const bgColor = isSolved ? 'bg-green-600' : 'bg-gray-700';
    const borderColor = isSolved ? 'border-green-300' : 'border-yellow-300';
    
    return (
      <button
        className={`
          flex flex-col items-center justify-center 
          w-16 h-16 rounded-full shadow-lg transition-all duration-200 
          ${bgColor} text-white font-bold text-xs 
          hover:opacity-90 hover:scale-105 hover:shadow-xl
          border-2 ${borderColor} cursor-pointer relative
        `}
        onClick={() => onClick(id)}
        title={isSolved ? `${name} (Solved)` : `Guess the ${name} (Kit #${kitNumber})`}
        disabled={isSolved}
      >
        {/* Main kit number and icon */}
        <span className="text-2xl font-extrabold mb-1">
            {isSolved ? '✅' : kitNumber}
        </span>
        
        {/* Guesses counter */}
        {guessesTaken > 0 && !isSolved && (
            <div className="absolute top-[-10px] right-[-10px] bg-red-600 text-white w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
                {guessesTaken}
            </div>
        )}
      </button>
    );
  };

// Main pitch interface ---
interface PitchProps {
  onSlotClick: (positionId: string) => void; 
  currentFormation: FormationKey; 
  solutionLineup: SolutionPlayer[];
  gameState: Record<PositionId, PositionState>;
}

// Main pitch
export const Pitch: React.FC<PitchProps> = ({ onSlotClick, currentFormation, solutionLineup, gameState }) => {
  
  // Get the specific slot layout based on the formation key
  const LineupSlots: PositionSlot[] = FORMATION_MAP[currentFormation]; 

  // Define the master grid areas for the pitch. 
  // All formations use this same 6x5 grid, but slots are placed differently.
  const gridTemplateAreas = 
    '"A1 A2 A3 A4 A5"' + // Attacking Third 
    '"B1 B2 B3 B4 B5"' + 
    '"C1 C2 C3 C4 C5"' + // Middle Third 
    '"D1 D2 D3 D4 D5"' + 
    '"E1 E2 E3 E4 E5"' + // Defensive Third 
    '"F1 F2 F3 F4 F5"';  // GK Area 

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-inner">
      <div 
        className="
          relative h-[700px] w-full max-w-xl mx-auto 
          bg-green-700 border-4 border-white rounded-lg 
          shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]
          grid gap-2 p-2
        "
        style={{
          gridTemplateColumns: 'repeat(5, 1fr)', // Always 5 columns wide
          gridTemplateRows: 'repeat(6, 1fr)',    // Always 6 rows high
          gridTemplateAreas: gridTemplateAreas,
        }}
      >
        {/* Field Lines for Visual Context */}
        <div className="absolute inset-0 border-white/50 pointer-events-none">
          {/* Halfway Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/50 transform -translate-y-1/2"></div>
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-white/50 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          {/* Goal Area/Penalty Box visual at the bottom (GK end) */}
          <div className="absolute bottom-0 left-1/2 w-48 h-16 border-t-4 border-l-2 border-r-2 border-white/50 transform -translate-x-1/2"></div>
        </div>

        {/* Render the Player Slots by mapping the formation data */}
        {LineupSlots.map((slot) => {
          // Find the matching player's data from the solution
          const player = solutionLineup.find(p => p.positionId === slot.id);

          // Get the history state for this specific position
          const positionState = gameState[slot.id];
          
          const correctNameLength = player?.name.length || 0;

          // Calculate the best persistent visual feedback
          const bestFeedback = getBestFeedback(positionState, correctNameLength);

          if (!player) return null;
          
          return (
            <div
                key={slot.id}
                style={{ gridArea: slot.gridArea }}
                className="flex flex-col items-center justify-center h-full w-full">

                <PlayerSlot
                  id={slot.id}
                  name={slot.name}
                  onClick={onSlotClick}
                  kitNumber={player.kitNumber}
                  guessesTaken={positionState?.guesses.length || 0}
                  isSolved={positionState?.isSolved || false}
                />
                
                {/* Display the progress only if the name has letters */}
                {correctNameLength > 0 && (
                  <NameProgressDisplay bestFeedback={bestFeedback} />
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};