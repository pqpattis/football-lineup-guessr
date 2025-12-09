'use client';

import { Pitch } from "@/components/Pitch";
import { useState } from "react";
import { MOCK_SOLUTION } from "@/data/mockMatch"; 
import { SolutionPlayer } from "@/types"; 
import { FormationKey } from "@/components/PitchData";

export default function Home() {
  // State to track which position the user has clicked on (e.g., 'GK', 'ST')
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Get the current formation string from the mock solution
  const activeFormation = MOCK_SOLUTION.formation as FormationKey; 
  
  // Get the full lineup data to pass to the Pitch component
  const solutionLineup: SolutionPlayer[] = MOCK_SOLUTION.lineup;

  // Function called when a player slot is clicked
  const handleSlotClick = (positionId: string) => {
    setSelectedSlot(positionId);
    console.log(`Slot clicked: ${positionId}. Ready to open guessing modal.`);
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
      />

      {selectedSlot && (
        <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg">
          Currently Guessing for: {selectedSlot}
        </div>
      )}
    </main>
  );
}