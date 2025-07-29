'use client';
import React from "react";

interface DiceProps {
  value: number | null;
  onRoll: () => void;
  isDisabled?: boolean;
}

const Dice: React.FC<DiceProps> = ({ value, onRoll, isDisabled = false }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        className={`px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition ${
          isDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={onRoll}
        disabled={isDisabled}
      >
        Roll Dice 🎲
      </button>

      {value !== null && (
        <div className="w-16 h-16 bg-white border-2 border-gray-500 rounded text-3xl flex items-center justify-center">
          {value}
        </div>
      )}
    </div>
  );
};

export default Dice;
