'use client';

import { Pitch } from "@/components/Pitch";
import { GuessingModal } from "@/components/GuessingModal";
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
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-200">
      <h1 className="text-4xl font-extrabold text-green-800 mb-6">
        Lineup Wordle
      </h1>
      <p className="mb-8 text-lg text-gray-600">
        {currentMatch.team} vs {currentMatch.opponent} {currentMatch.date}
      </p>

      <div className="flex w-full max-w-7xl items-start gap-8">
          
          <MatchSelector />
          
          <Pitch
            onSlotClick={handleSlotClick}
            currentFormation={activeFormation}
            solutionLineup={solutionLineup}
            gameState={guessesByPosition}
          />
          
      </div>
      
      <GuessingModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        positionId={selectedSlotId}
        positionName={getPositionName(selectedSlotId)}
        onPlayerSuccess={handlePlayerSuccess}
      />

      <GameOverModal />

    </main>
  );
}