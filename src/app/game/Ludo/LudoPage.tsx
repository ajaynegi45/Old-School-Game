'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { LudoGame } from './Ludo';
import Board from './Board';
import Dice from './Dice';
import PlayerPanel from './Player_panel';
import Piece from './Piece';

export default function LudoPage({ numberOfPlayers }: { numberOfPlayers: 2 | 3 | 4 }) {
  const [ludoGame] = useState(new LudoGame(numberOfPlayers));
  const [state, setState] = useState(ludoGame.getState());

  const handleDiceRoll = () => {
    ludoGame.rollDice();
    setState({ ...ludoGame.getState() });
  };

  const handleMove = (pieceIndex: number) => {
    const moved = ludoGame.movePiece(state.currentPlayer, pieceIndex);
    setState({ ...ludoGame.getState() });

    if (moved && state.diceValue !== 6) {
      ludoGame.nextTurn();
      setState({ ...ludoGame.getState() });
    }
  };

  const currentPlayer = state.players[state.currentPlayer];

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🎲 Ludo Game</h1>

      <div className={styles.panel}>
        <PlayerPanel
          currentPlayerColor={currentPlayer.color}
          winner={state.winner}
        />
      </div>

      <div className={styles.dice}>
        <Dice
          value={state.diceValue}
          onRoll={handleDiceRoll}
          isDisabled={state.diceValue !== null || state.winner !== null}
        />
      </div>

      <div className={styles.board}>
        <Board />
      </div>

      <div className={styles.pieceGrid}>
        {currentPlayer.pieces.map((pos, idx) => (
          <Piece
            key={idx}
            index={idx}
            position={pos}
            onClick={() => handleMove(idx)}
          />
        ))}
      </div>
    </div>
  );
}
