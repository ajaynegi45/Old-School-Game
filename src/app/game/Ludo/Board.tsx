import React from "react";
import "./Board.css"; // Optional if you use custom styles

const Board = () => {
  return (
    <div className="w-[450px] h-[450px] grid grid-cols-15 grid-rows-15 border-4 border-black">
      {/* Top-left Red Home */}
      <div className="col-span-6 row-span-6 bg-red-500 border border-black" />
      {/* Top-middle path */}
      <div className="col-span-3 row-span-6 flex flex-col">
        {[...Array(6)].map((_, i) => (
          <div
            key={`top-${i}`}
            className="flex-1 border border-black bg-white"
          ></div>
        ))}
      </div>
      {/* Top-right Green Home */}
      <div className="col-span-6 row-span-6 bg-green-500 border border-black" />

      {/* Middle-left path */}
      <div className="col-span-6 row-span-3 flex">
        {[...Array(6)].map((_, i) => (
          <div
            key={`left-${i}`}
            className="flex-1 border border-black bg-white"
          ></div>
        ))}
      </div>

      {/* Center: Finish Area */}
      <div className="col-span-3 row-span-3 bg-gray-300 border-2 border-black flex items-center justify-center text-xl font-bold">
        🏁
      </div>

      {/* Middle-right path */}
      <div className="col-span-6 row-span-3 flex">
        {[...Array(6)].map((_, i) => (
          <div
            key={`right-${i}`}
            className="flex-1 border border-black bg-white"
          ></div>
        ))}
      </div>

      {/* Bottom-left Yellow Home */}
      <div className="col-span-6 row-span-6 bg-yellow-400 border border-black" />
      {/* Bottom-middle path */}
      <div className="col-span-3 row-span-6 flex flex-col">
        {[...Array(6)].map((_, i) => (
          <div
            key={`bottom-${i}`}
            className="flex-1 border border-black bg-white"
          ></div>
        ))}
      </div>
      {/* Bottom-right Blue Home */}
      <div className="col-span-6 row-span-6 bg-blue-500 border border-black" />
    </div>
  );
};

export default Board;
