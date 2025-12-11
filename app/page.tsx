'use client';

import { Pitch } from "@/components/Pitch";
import { GuessingModal } from "@/components/GuessingModal";
import { useState } from "react";
import { MOCK_SOLUTION } from "@/data/mockMatch"; 
import { SolutionPlayer, Player, PositionId } from "@/types"; 
import { FormationKey, FORMATION_MAP } from "@/components/PitchData"; 
import { useGameStore } from "@/store/gameStore";
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
  
  // Get the current formation string from the mock solution
  const activeFormation = MOCK_SOLUTION.formation as FormationKey;

    // Get the full lineup data to pass to the Pitch component
  const solutionLineup: SolutionPlayer[] = MOCK_SOLUTION.lineup;

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
        {MOCK_SOLUTION.lineup[0].team} vs Liverpool ({MOCK_SOLUTION.date.substring(0, 4)} Final)
      </p>
      
      <Pitch 
        onSlotClick={handleSlotClick} 
        currentFormation={activeFormation} 
        solutionLineup={solutionLineup}
        gameState={guessesByPosition}
      />
      
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