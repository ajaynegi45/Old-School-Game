import React from "react";

interface PieceProps {
  index: number;
  position: number;
  onClick: () => void;
}

const Piece: React.FC<PieceProps> = ({ index, position, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-3 border border-gray-400 rounded shadow hover:bg-gray-100"
    >
      Piece {index + 1}: {position === 0 ? "Home" : position === 58 ? "Finished" : `Pos ${position}`}
    </button>
  );
};

export default Piece;
