'use client';

import { Pitch } from "@/components/Pitch";
import { GuessingPanel } from "@/components/GuessingPanel";
import { useState } from "react";
import { SolutionPlayer, Player, PositionId } from "@/types"; 
import { FormationKey, FORMATION_MAP } from "@/components/PitchData"; 
import { useGameStore } from "@/store/gameStore";
import { MatchSelector } from "@/components/MatchSelector";
import dynamic from "next/dynamic";

// Relies on dynamic client-side state
const GameOverModal = dynamic(
  () => import('@/components/GameOverModal').then((mod) => mod.GameOverModal),
  {
    ssr: false, // Disable server-side rendering
  }
);

export default function Home() {
    // State to track which position the user has clicked on (e.g., 'GK', 'ST')
  const [selectedSlotId, setSelectedSlotId] = useState<PositionId | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentMatch = useGameStore(state => state.currentMatch);

  // Get the current formation string from the mock solution
  const activeFormation = currentMatch.formation as FormationKey;

  // Get the full lineup data to pass to the Pitch component
  const solutionLineup: SolutionPlayer[] = currentMatch.lineup;

  const guessesByPosition = useGameStore(state => state.guessesByPosition);

  const handleSlotClick = (positionId: string) => {
    const id = positionId as PositionId;
    setSelectedSlotId(id);
    setIsModalOpen(true);
    useGameStore.getState().setActivePosition(id);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSlotId(null);
  };
  
  const getPositionName = (id: PositionId | null) => {
    if (!id) return "";
    const slot = FORMATION_MAP[activeFormation].find(s => s.id === id);
    return slot?.name || id;
  };
  
  // This function is the final step after a player is successfully guessed
  const handlePlayerSuccess = (player: Player) => {
      console.log(`Player ${player.name} solved for position ${selectedSlotId}`);
      handleModalClose();
  };

  return (
    <main className="flex h-screen flex-col bg-[#050a0f] bg-[radial-gradient(circle_at_top_right,_#101a25_0%,_#050a0f_100%)] overflow-hidden">
      
      {/* Header */}
      <header className="w-full py-4 px-8 border-b border-white/10 flex justify-between items-center backdrop-blur-md z-20">
        <div>
          <h1 className="text-2xl font-black text-emerald-500 tracking-tighter uppercase italic">
            Lineup <span className="text-white">Guessr</span>
          </h1>
        </div>
        
        <div className="text-right">
          <p className="text-sm font-bold text-white uppercase tracking-widest">
            {currentMatch.team} <span className="text-emerald-500 mx-1">vs</span> {currentMatch.opponent}
          </p>
          <p className="text-[10px] text-white/40 uppercase font-medium">
            Champions League Final • {currentMatch.date}
          </p>
        </div>
      </header>

      {/* Main dashboard */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[320px_1fr_350px] overflow-hidden">
        
        {/* Fixture list */}
        <aside className="hidden lg:block border-r border-white/10 overflow-y-auto">
          <MatchSelector />
        </aside>

        {/* Pitch */}
        <section className="relative flex flex-col items-center justify-center p-4 overflow-y-auto custom-scrollbar">
          <Pitch
            onSlotClick={handleSlotClick}
            currentFormation={activeFormation}
            solutionLineup={solutionLineup}
            gameState={guessesByPosition}
          />
        </section>

        {/* Guessing panel */}
        <aside className="hidden lg:block border-l border-white/10 bg-white/[0.02] backdrop-blur-3xl overflow-y-auto">
          <GuessingPanel />
        </aside>

      </div>

      <GameOverModal />
    </main>
  );
}