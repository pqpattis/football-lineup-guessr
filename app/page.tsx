'use client';

import { Pitch } from "@/components/Pitch";
import { FormationKey } from "@/components/PitchData";
import { useState } from "react";

export default function Home() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [activeFormation, setActiveFormation] = useState<FormationKey>('4-3-3');
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
        Click a position to start your guesses.
      </p>
      
      <Pitch
          onSlotClick={handleSlotClick}
          currentFormation={activeFormation} />

      {selectedSlot && (
        <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg">
          Currently Guessing for: {selectedSlot}
        </div>
      )}
    </main>
  );
}