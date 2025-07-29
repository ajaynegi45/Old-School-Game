export type LudoColor = "red" | "green" | "yellow" | "blue";
export type PlayerId = number;

export interface LudoPlayer {
    id: PlayerId;
    color: LudoColor;
    pieces: number[]; // 0 = home, 1-57 = board, 58 = finished
}

export interface LudoGameState {
    players: LudoPlayer[];
    currentPlayer: PlayerId;
    diceValue: number | null;
    winner: PlayerId | null;
}

export class LudoGame {
    state: LudoGameState;

    constructor(playerCount: 2 | 3 | 4) {
        const colors: LudoColor[] = ["red", "green", "yellow", "blue"];
        const selectedColors = colors.slice(0, playerCount);
        this.state = {
            players: selectedColors.map((color, i) => ({
                id: i,
                color,
                pieces: [0, 0, 0, 0], // All pieces at home
            })),
            currentPlayer: 0,
            diceValue: null,
            winner: null,
        };
    }

    rollDice(): number {
        const value = Math.floor(Math.random() * 6) + 1;
        this.state.diceValue = value;
        return value;
    }

    movePiece(playerId: PlayerId, pieceIndex: number): boolean {
        const player = this.state.players.find(p => p.id === playerId);
        if (!player || this.state.diceValue === null) return false;
        const pos = player.pieces[pieceIndex];

        // If piece is at home, need a 6 to move out
        if (pos === 0 && this.state.diceValue === 6) {
            player.pieces[pieceIndex] = 1;
            this.checkWin(player);
            return true;
        }

        // If piece is on the board
        if (pos > 0 && pos < 58) {
            let newPos = pos + this.state.diceValue;
            if (newPos > 57) return false; // Can't move beyond finish
            player.pieces[pieceIndex] = newPos;
            this.checkWin(player);
            return true;
        }

        return false;
    }

    nextTurn() {
        if (this.state.winner !== null) return;
        this.state.currentPlayer = (this.state.currentPlayer + 1) % this.state.players.length;
        this.state.diceValue = null;
    }

    checkWin(player: LudoPlayer) {
        if (player.pieces.every(pos => pos === 58)) {
            this.state.winner = player.id;
        }
    }

    getState(): LudoGameState {
        return this.state;
    }
}