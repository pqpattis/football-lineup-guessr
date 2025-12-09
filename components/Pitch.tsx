import React from 'react';
import { FORMATION_MAP, FormationKey } from './PitchData';
import { PositionSlot } from '@/types';

// --- Helper Component ---
// Renders a single clickable player slot
const PlayerSlot: React.FC<{ id: string, name: string, gridArea: string, onClick: (id: string) => void }> = ({ id, name, gridArea, onClick }) => (
  <button
    // Apply positioning using the grid area defined in PitchData
    style={{ gridArea }}
    className="
      flex flex-col items-center justify-center 
      w-16 h-16 rounded-full shadow-lg transition-all duration-200 
      bg-gray-700 text-white font-bold text-xs 
      hover:bg-yellow-500 hover:scale-105 hover:shadow-xl
      border-2 border-yellow-300 cursor-pointer
    "
    onClick={() => onClick(id)}
    title={`Guess the ${name}`}
  >
    <span className="text-sm">?</span>
    <span className="text-[10px] uppercase font-light mt-0.5">{id}</span>
  </button>
);

// --- Main Component Interface ---
interface PitchProps {
  onSlotClick: (positionId: string) => void; 
  currentFormation: FormationKey; 
}

// --- Main Pitch Component ---
export const Pitch: React.FC<PitchProps> = ({ onSlotClick, currentFormation }) => {
  
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
        {LineupSlots.map((slot) => (
          <PlayerSlot
            key={slot.id}
            id={slot.id}
            name={slot.name}
            gridArea={slot.gridArea}
            onClick={onSlotClick}
          />
        ))}
      </div>
    </div>
  );
};