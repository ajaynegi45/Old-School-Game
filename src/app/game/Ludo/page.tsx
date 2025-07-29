
"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

type Player = 'red' | 'blue' | 'green' | 'yellow';
type PawnPosition = {
  position: number; // 0-51 for board positions, -1 for home, 52+ for finish area
  isHome: boolean;
  isFinished: boolean;
};

type GameState = {
  players: {
    red: PawnPosition[];
    blue: PawnPosition[];
    green: PawnPosition[];
    yellow: PawnPosition[];
  };
  currentPlayer: Player;
  diceValue: number;
  isRolling: boolean;
  winner: Player | null;
  selectedPawn: number | null;
  movablePawns: number[];
};

const PLAYER_COLORS: Player[] = ['red', 'blue', 'green', 'yellow'];
const SAFE_POSITIONS = [1, 9, 14, 22, 27, 35, 40, 48];
const START_POSITIONS = { red: 1, blue: 14, green: 27, yellow: 40 };
const HOME_STRETCH_START = { red: 51, blue: 12, green: 25, yellow: 38 };

export default function LudoPage() {
  const [gameState, setGameState] = useState<GameState>({
    players: {
      red: Array(4).fill(0).map(() => ({ position: -1, isHome: true, isFinished: false })),
      blue: Array(4).fill(0).map(() => ({ position: -1, isHome: true, isFinished: false })),
      green: Array(4).fill(0).map(() => ({ position: -1, isHome: true, isFinished: false })),
      yellow: Array(4).fill(0).map(() => ({ position: -1, isHome: true, isFinished: false }))
    },
    currentPlayer: 'red',
    diceValue: 1,
    isRolling: false,
    winner: null,
    selectedPawn: null,
    movablePawns: []
  });

  const rollDice = () => {
    if (gameState.isRolling || gameState.winner) return;
    
    setGameState(prev => ({ ...prev, isRolling: true }));
    
    // Animate dice roll
    let rollCount = 0;
    const rollAnimation = setInterval(() => {
      setGameState(prev => ({ ...prev, diceValue: Math.floor(Math.random() * 6) + 1 }));
      rollCount++;
      
      if (rollCount >= 10) {
        clearInterval(rollAnimation);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setGameState(prev => {
          const newState = { ...prev, diceValue: finalValue, isRolling: false };
          const movablePawns = getMovablePawns(prev.currentPlayer, finalValue, prev.players);
          return { ...newState, movablePawns };
        });
      }
    }, 100);
  };

  const getMovablePawns = (player: Player, diceValue: number, players: GameState['players']): number[] => {
    const playerPawns = players[player];
    const movable: number[] = [];

    playerPawns.forEach((pawn, index) => {
      if (pawn.isFinished) return;
      
      if (pawn.isHome) {
        if (diceValue === 6) movable.push(index);
      } else {
        const newPosition = calculateNewPosition(player, pawn.position, diceValue);
        if (newPosition !== -1) movable.push(index);
      }
    });

    return movable;
  };

  const calculateNewPosition = (player: Player, currentPos: number, diceValue: number): number => {
    if (currentPos >= 52) return -1; // Already in finish area
    
    const newPos = currentPos + diceValue;
    const homeStretchStart = HOME_STRETCH_START[player];
    
    // Check if entering home stretch
    if (currentPos < homeStretchStart && newPos >= homeStretchStart) {
      const overShoot = newPos - homeStretchStart;
      return 52 + overShoot; // Enter finish area
    }
    
    // Already in finish area
    if (currentPos >= 52) {
      if (newPos > 57) return -1; // Can't move beyond finish
      return newPos;
    }
    
    // Normal board movement
    return newPos > 51 ? newPos - 52 : newPos;
  };

  const movePawn = (pawnIndex: number) => {
    if (!gameState.movablePawns.includes(pawnIndex) || gameState.winner) return;

    setGameState(prev => {
      const newState = { ...prev };
      const player = prev.currentPlayer;
      const pawn = newState.players[player][pawnIndex];
      
      if (pawn.isHome && prev.diceValue === 6) {
        // Move out of home
        pawn.position = START_POSITIONS[player];
        pawn.isHome = false;
      } else if (!pawn.isHome) {
        // Move on board
        const newPosition = calculateNewPosition(player, pawn.position, prev.diceValue);
        if (newPosition !== -1) {
          pawn.position = newPosition;
          
          // Check if finished
          if (newPosition === 57) {
            pawn.isFinished = true;
          }
          
          // Check for captures
          checkCapture(newState, player, newPosition, pawnIndex);
        }
      }
      
      // Check for winner
      const finishedPawns = newState.players[player].filter(p => p.isFinished).length;
      if (finishedPawns === 4) {
        newState.winner = player;
      }
      
      // Next player turn (unless rolled 6 or captured)
      const shouldContinueTurn = prev.diceValue === 6 && !newState.winner;
      if (!shouldContinueTurn) {
        const currentIndex = PLAYER_COLORS.indexOf(prev.currentPlayer);
        newState.currentPlayer = PLAYER_COLORS[(currentIndex + 1) % 4];
      }
      
      return {
        ...newState,
        selectedPawn: null,
        movablePawns: []
      };
    });
  };

  const checkCapture = (state: GameState, currentPlayer: Player, position: number, currentPawnIndex: number) => {
    if (SAFE_POSITIONS.includes(position) || position >= 52) return;
    
    PLAYER_COLORS.forEach(player => {
      if (player === currentPlayer) return;
      
      state.players[player].forEach((pawn, index) => {
        if (!pawn.isHome && !pawn.isFinished && pawn.position === position) {
          // Capture the pawn
          pawn.position = -1;
          pawn.isHome = true;
        }
      });
    });
  };

  const resetGame = () => {
    setGameState({
      players: {
        red: Array(4).fill(0).map(() => ({ position: -1, isHome: true, isFinished: false })),
        blue: Array(4).fill(0).map(() => ({ position: -1, isHome: true, isFinished: false })),
        green: Array(4).fill(0).map(() => ({ position: -1, isHome: true, isFinished: false })),
        yellow: Array(4).fill(0).map(() => ({ position: -1, isHome: true, isFinished: false }))
      },
      currentPlayer: 'red',
      diceValue: 1,
      isRolling: false,
      winner: null,
      selectedPawn: null,
      movablePawns: []
    });
  };

  const renderBoard = () => {
    const boardPositions = Array(52).fill(null).map((_, index) => {
      const pawnsAtPosition = PLAYER_COLORS.reduce((acc, player) => {
        gameState.players[player].forEach((pawn, pawnIndex) => {
          if (pawn.position === index && !pawn.isHome && !pawn.isFinished) {
            acc.push({ player, pawnIndex });
          }
        });
        return acc;
      }, [] as { player: Player; pawnIndex: number }[]);

      return (
        <div
          key={index}
          className={`${styles.boardPosition} ${SAFE_POSITIONS.includes(index) ? styles.safePosition : ''}`}
          data-position={index}
        >
          {pawnsAtPosition.map(({ player, pawnIndex }, i) => (
            <div
              key={`${player}-${pawnIndex}`}
              className={`${styles.pawn} ${styles[player]} ${
                gameState.movablePawns.includes(pawnIndex) && gameState.currentPlayer === player
                  ? styles.movablePawn
                  : ''
              }`}
              onClick={() => gameState.currentPlayer === player && movePawn(pawnIndex)}
              style={{
                transform: `translate(${(i % 2) * 8}px, ${Math.floor(i / 2) * 8}px)`,
                zIndex: 10 + i
              }}
            />
          ))}
        </div>
      );
    });

    return <div className={styles.gameBoard}>{boardPositions}</div>;
  };

  const renderHomeArea = (player: Player) => {
    const pawns = gameState.players[player];
    
    return (
      <div className={`${styles.homeArea} ${styles[player]}`}>
        <h3>{player.charAt(0).toUpperCase() + player.slice(1)}</h3>
        <div className={styles.homeGrid}>
          {pawns.map((pawn, index) => (
            <div
              key={index}
              className={`${styles.homeSlot} ${pawn.isHome ? styles.occupied : ''}`}
            >
              {pawn.isHome && (
                <div
                  className={`${styles.pawn} ${styles[player]} ${
                    gameState.movablePawns.includes(index) && gameState.currentPlayer === player
                      ? styles.movablePawn
                      : ''
                  }`}
                  onClick={() => gameState.currentPlayer === player && movePawn(index)}
                />
              )}
            </div>
          ))}
        </div>
        <div className={styles.finishArea}>
          <div className={styles.finishCount}>
            Finished: {pawns.filter(p => p.isFinished).length}/4
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.ludoContainer}>
      <div id={styles.bgGrid}>
        <div id={styles.blurGrid}></div>
      </div>
      
      <div className={styles.gameHeader}>
        <h1>Ludo Game</h1>
        {gameState.winner ? (
          <div className={styles.winnerMessage}>
            🎉 {gameState.winner.charAt(0).toUpperCase() + gameState.winner.slice(1)} Wins! 🎉
          </div>
        ) : (
          <div className={styles.currentTurn}>
            Current Turn: <span className={styles[gameState.currentPlayer]}>
              {gameState.currentPlayer.charAt(0).toUpperCase() + gameState.currentPlayer.slice(1)}
            </span>
          </div>
        )}
      </div>

      <div className={styles.gameContainer}>
        <div className={styles.leftPanel}>
          {renderHomeArea('red')}
          {renderHomeArea('blue')}
        </div>

        <div className={styles.centerPanel}>
          {renderBoard()}
          
          <div className={styles.diceContainer}>
            <div 
              className={`${styles.dice} ${gameState.isRolling ? styles.rolling : ''}`}
              onClick={rollDice}
            >
              {gameState.diceValue}
            </div>
            <p>Click to Roll!</p>
          </div>
        </div>

        <div className={styles.rightPanel}>
          {renderHomeArea('green')}
          {renderHomeArea('yellow')}
        </div>
      </div>

      <div className={styles.gameControls}>
        <button className={styles.resetButton} onClick={resetGame}>
          New Game
        </button>
      </div>
    </div>
  );
}
