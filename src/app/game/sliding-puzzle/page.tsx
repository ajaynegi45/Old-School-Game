"use client";
import { useState, useEffect, useCallback } from "react";
import styles from "./SlidingPuzzle.module.css";

const SIZES = [3, 4, 5];

function generateSolvablePuzzle(size: number): number[] {
  const total = size * size;
  let tiles: number[];
  do {
    tiles = [...Array(total - 1)].map((_, i) => i + 1);
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    tiles.push(0);
  } while (!isSolvable(tiles, size) || isSolved(tiles));
  return tiles;
}

function isSolvable(tiles: number[], size: number): boolean {
  let inversions = 0;
  const filtered = tiles.filter((t) => t !== 0);
  for (let i = 0; i < filtered.length; i++) {
    for (let j = i + 1; j < filtered.length; j++) {
      if (filtered[i] > filtered[j]) inversions++;
    }
  }

  if (size % 2 === 1) {
    // Odd grid: solvable if inversions is even
    return inversions % 2 === 0;
  } else {
    // Even grid: find row of blank from bottom (1-based)
    const emptyIndex = tiles.indexOf(0);
    const rowFromBottom = size - Math.floor(emptyIndex / size);
    return (rowFromBottom % 2 === 1) === (inversions % 2 === 0);
  }
}

function isSolved(tiles: number[]): boolean {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return tiles[tiles.length - 1] === 0;
}

export default function SlidingPuzzle() {
  const [size, setSize] = useState(4);
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const startGame = useCallback(() => {
    setTiles(generateSolvablePuzzle(size));
    setMoves(0);
    setWon(false);
  }, [size]);

  useEffect(() => {
    startGame();
  }, [startGame]);

  const handleTileClick = (index: number) => {
    if (won) return;
    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / size);
    const col = index % size;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;

    const isAdjacent =
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(moves + 1);

      if (isSolved(newTiles)) {
        setWon(true);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1>Sliding Puzzle</h1>

      <div className={styles.sizeSelector}>
        {SIZES.map((s) => (
          <button
            key={s}
            className={`${styles.sizeButton} ${s === size ? styles.activeSize : ""}`}
            onClick={() => setSize(s)}
          >
            {s}x{s}
          </button>
        ))}
      </div>

      <p className={styles.moves}>Moves: {moves}</p>

      {won && (
        <p className={styles.winMessage}>🎉 Congratulations! Solved in {moves} moves!</p>
      )}

      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {tiles.map((tile, index) => (
          <button
            key={index}
            className={`${styles.tile} ${tile === 0 ? styles.empty : ""}`}
            onClick={() => handleTileClick(index)}
            aria-label={tile !== 0 ? `Tile ${tile}` : "Empty space"}
            disabled={tile === 0}
          >
            {tile !== 0 ? tile : ""}
          </button>
        ))}
      </div>

      <button className={styles.resetButton} onClick={startGame}>
        New Game
      </button>
    </div>
  );
}
