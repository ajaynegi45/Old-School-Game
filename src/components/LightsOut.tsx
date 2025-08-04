"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./LightsOut.module.css";

export default function LightsOutGame() {
  const [gridSize, setGridSize] = useState(3); // default Easy
  const [grid, setGrid] = useState<boolean[][]>([]);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by delaying rendering until after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      startNewGame(gridSize);
    }
  }, [gridSize, mounted]);

  useEffect(() => {
    if (!mounted) return;
    timerRef.current = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [mounted]);

  const startNewGame = (size: number) => {
    const newGrid = Array(size)
      .fill(false)
      .map(() =>
        Array(size)
          .fill(false)
          .map(() => Math.random() < 0.5)
      );
    setGrid(newGrid);
    setTimer(0);
  };

  const toggle = (x: number, y: number) => {
    const newGrid = grid.map((row) => [...row]);
    const toggleCell = (i: number, j: number) => {
      if (i >= 0 && i < gridSize && j >= 0 && j < gridSize) {
        newGrid[i][j] = !newGrid[i][j];
      }
    };
    toggleCell(x, y);
    toggleCell(x - 1, y);
    toggleCell(x + 1, y);
    toggleCell(x, y - 1);
    toggleCell(x, y + 1);
    setGrid(newGrid);
  };

  const isWon = grid.flat().every((cell) => !cell);

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      <h1>Lights Out</h1>

      <div className={styles.controls}>
        <span>Difficulty:</span>
        <button className={styles.difficultyButton} onClick={() => setGridSize(3)}>Easy</button>
        <button className={styles.difficultyButton} onClick={() => setGridSize(5)}>Medium</button>
        <button className={styles.difficultyButton} onClick={() => setGridSize(7)}>Hard</button>
        <span className={styles.timer}>Timer: {timer}s</span>
    </div>


      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${gridSize}, 60px)` }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`${styles.cell} ${cell ? styles.on : ""}`}
              onClick={() => toggle(i, j)}
            />
          ))
        )}
      </div>

      {isWon && (
        <div className={styles.winMessage}>
           You won in {timer} seconds!
        </div>
      )}
    </div>
  );
}
