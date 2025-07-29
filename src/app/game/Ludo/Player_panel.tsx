import React from "react";

interface PlayerPanelProps {
  currentPlayerColor: string;
  winner: number | null;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({ currentPlayerColor, winner }) => {
  return (
    <div className="text-center mb-6">
      {winner !== null ? (
        <p className="text-2xl text-green-600 font-bold">
          Player {winner + 1} wins! 🏆
        </p>
      ) : (
        <p className="text-xl">
          Current Turn:{" "}
          <span className={`font-semibold text-${currentPlayerColor}-600`}>
            {currentPlayerColor.toUpperCase()}
          </span>
        </p>
      )}
    </div>
  );
};

export default PlayerPanel;
