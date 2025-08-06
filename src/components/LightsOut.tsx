"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./LightsOut.module.css";

export default function LightsOutGame() {
  const [gridSize, setGridSize] = useState(3); // default Easy
  const [grid, setGrid] = useState<boolean[][]>([]);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);

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
        style={{ "--cols": gridSize } as React.CSSProperties}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`${styles.cell} ${cell ? styles.on : styles.off}`}
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

      <div className={styles.instructions}>
        <h2>How to Play</h2>
        <p>
          The goal of <strong>Lights Out</strong> is to turn off all the cells in the grid. 
          Clicking a cell will toggle its state and the state of its adjacent neighbors (top, bottom, left, right). 
          Grey cells are ON and green cells are OFF.
        </p>

        <h2>Game Algorithm</h2>
        <p>
          The game uses a 2D boolean array to represent the grid. When a player clicks on a cell, the toggle() function is called, which inverts the clicked cell and its immediate neighbors using boundary-safe checks.
        </p>
        <p>
          A win is detected when all values in the grid are false (OFF state).
        </p>
      </div>
    </div>
  );
}
