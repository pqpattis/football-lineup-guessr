import React from 'react';
import { FORMATION_MAP, FormationKey, getBestFeedback } from './PitchData'; 
import { PositionSlot, SolutionPlayer, PositionId } from '@/types';
import { PositionState } from '@/store/gameStore';
import { GuessLetter } from '@/utils/nameComparison';

// Name progress display
const NameProgressDisplay: React.FC<{ bestFeedback: GuessLetter[] }> = ({ bestFeedback }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const marqueeRef = React.useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = React.useState(false);

  React.useLayoutEffect(() => {
    const el = marqueeRef.current;
    const container = containerRef.current;
    if (!el || !container) return;
    setShouldScroll(el.scrollWidth > container.offsetWidth);
  }, [bestFeedback]);

  // Calculate scroll distance (overflow amount)
  const [scrollDist, setScrollDist] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = marqueeRef.current;
    const container = containerRef.current;
    if (!el || !container || !shouldScroll) return;
    setScrollDist(el.scrollWidth - container.offsetWidth);
  }, [shouldScroll, bestFeedback]);

  return (
    <div
      ref={containerRef}
      className="relative mt-2 overflow-x-hidden"
      style={{
        width: '110px',
        maxWidth: '100%',
        minWidth: 0,
      }}
    >
      <div
        ref={marqueeRef}
        className={
          `flex items-center justify-center transition-all duration-200 ${shouldScroll ? 'animate-pingpong' : ''}`
        }
        style={{
          whiteSpace: 'nowrap',
          flexShrink: 0,
          minWidth: 'fit-content',
          animation: shouldScroll && scrollDist > 0 ? `pingpong 3s linear infinite alternate` : undefined,
          ...(shouldScroll && scrollDist > 0 ? { ['--pingpong-dist' as any]: `-${scrollDist}px` } : {}),
        }}
      >
        {bestFeedback.map((f, i) => (
          <span
            key={i}
            aria-hidden
            className={`w-4 h-4 rounded-full flex items-center justify-center font-mono text-[15px] font-extrabold text-center leading-none select-none
              ${f.status === 'correct' ? 'bg-green-400' : f.status === 'present' ? 'bg-yellow-400' : 'bg-white/30'}
            `}
          >
            {f.letter === '_' ? '•' : f.letter}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes pingpong {
          0% { transform: translateX(0); }
          100% { transform: translateX(var(--pingpong-dist, -50%)); }
        }
      `}</style>
    </div>
  );
};

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
    // Use a pulsing animation for solved slots
    const solvedClasses = isSolved ? 'animate-pulse scale-105 ring-4 ring-green-300/30' : '';
    
    return (
      <button
        aria-pressed={isSolved}
        aria-label={isSolved ? `${name} solved` : `Guess ${name}`}
        className={`
          flex flex-col items-center justify-center
          w-[clamp(3.5rem,8vmin,5rem)] h-[clamp(3.5rem,8vmin,5rem)] 
          rounded-full transition-all duration-300 transform-gpu relative
          border-2 cursor-pointer group
          
          ${isSolved 
            ? 'bg-gradient-to-br from-emerald-400 via-green-500 to-green-600 border-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.7)] scale-110 z-10' 
            : 'bg-white/10 backdrop-blur-md border-white/30 hover:border-white shadow-lg'}
        `}
        onClick={() => onClick(id)}
        title={isSolved ? `${name} (Solved)` : `Guess the ${name} (Kit #${kitNumber})`}
        disabled={isSolved}
      >
        {/* Inner shadow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        {/* Main icon and kit number */}
        <span className={`
            font-black leading-none drop-shadow-md transition-all duration-300
            ${isSolved ? 'text-slate-900' : 'text-xl text-white/90'}
        `}>
            {isSolved ? (
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-8 h-8 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] animate-in zoom-in duration-500"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            ): kitNumber}
        </span>
        
        {/* Guesses counter */}
        {guessesTaken > 0 && !isSolved && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white animate-in zoom-in duration-300 shadow-md">
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
    <div className="p-4 rounded-lg shadow-inner">
      <div
        className={
          `relative h-[min(70vh,700px)] w-full max-w-3xl mx-auto
          bg-green-700 border-4 border-white/10 rounded-lg
          shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]
          grid gap-2 p-0`
        }
        style={{
          gridTemplateColumns: 'repeat(5, 1fr)', // Always 5 columns wide
          gridTemplateRows: 'repeat(6, 1fr)',    // Always 6 rows high
          gridTemplateAreas: gridTemplateAreas,
          backgroundColor: '#2d5a27',
          backgroundImage: `
            repeating-linear-gradient(
              to bottom,
              transparent,
              transparent 8%,
              rgba(0, 0, 0, 0.08) 8%,
              rgba(0, 0, 0, 0.08) 16%
            ),
            radial-gradient(
              circle at 50% 50%,
              rgba(255, 255, 255, 0.15) 0%,
              rgba(0, 0, 0, 0.2) 100%
            )
          `
        }}
      >
        {/* Dev-only grid overlay to help debug cell boundaries */}
        {/* {process.env.NODE_ENV !== 'production' && (
          <div className="absolute inset-0 pointer-events-none z-50">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.65) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.65) 1px, transparent 1px)',
                backgroundSize: '20% 100%, 100% 16.6667%',
                backgroundRepeat: 'repeat, repeat',
                mixBlendMode: 'overlay',
              }}
            />
          </div>
        )} */}
        {/* Field lines for visual context */}
       <div className="absolute inset-0 pointer-events-none">
          {/* Outside boundaries */}
          <div className="absolute inset-4 border-2 border-white/20 rounded-sm" />

          {/* Opposing 18-yard box */}
          <div className="absolute top-4 left-1/2 w-[40%] h-24 border-b-2 border-x-2 border-white/20 -translate-x-1/2" />
          
          {/* Opposing 6-yard box */}
          <div className="absolute top-4 left-1/2 w-[20%] h-10 border-b-2 border-x-2 border-white/20 -translate-x-1/2" />

          {/* Half */}
          <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-white/20 -translate-y-1/2" />
          
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
          
          {/* Current team's 18-yard box */}
          <div className="absolute bottom-4 left-1/2 w-[40%] h-24 border-t-2 border-x-2 border-white/20 -translate-x-1/2" />
          
          {/* Current team's 6-yard box */}
          <div className="absolute bottom-4 left-1/2 w-[20%] h-10 border-t-2 border-x-2 border-white/20 -translate-x-1/2" />
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

          return (
            <div
              key={slot.id}
              style={{ gridArea: slot.gridArea }}
              className="grid place-items-center h-full w-full"
            >
              <div className="flex flex-col items-center max-w-[110px] w-full">
                {player ? (
                  <>
                    <PlayerSlot
                      id={slot.id}
                      name={slot.name}
                      onClick={onSlotClick}
                      kitNumber={player.kitNumber}
                      guessesTaken={positionState?.guesses.length || 0}
                      isSolved={positionState?.isSolved || false}
                    />
                    {correctNameLength > 0 && (
                      <NameProgressDisplay bestFeedback={bestFeedback} />
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/60 text-xs select-none" style={{minHeight: 48}}>
                    {slot.name}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};