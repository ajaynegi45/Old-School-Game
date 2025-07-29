'use client';

import React, { useState } from 'react';
import LudoPage from './LudoPage'; // This is your actual Ludo game

export default function LudoEntryPage() {
  // Step 1: Local state to track how many players were selected
  const [players, setPlayers] = useState<number | null>(null);

  // Step 2: If players have been selected, show the game
  if (players !== null) {
    return <LudoPage numberOfPlayers={4} />;
  }

  // Step 3: Otherwise show the selection screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-6">
      <h1 className="text-4xl font-bold mb-6">🎲 Select Number of Players</h1>

      <div className="flex gap-4">
        {/* Step 4: 3 buttons - onClick sets player count */}
        {[2, 3, 4].map((num) => (
          <button
            key={num}
            onClick={() => setPlayers(num)} // when clicked, saves the number
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {num} Players
          </button>
        ))}
      </div>
    </div>
  );
}
