import { getLegalMoves } from "./moveGenerator";
import type { Board, GameState, Player } from "./types";
import { getOpponent } from "./types";

export function hasTooFewPieces(state: GameState, player: Player): boolean {
  return state.piecesToPlace[player] === 0 && state.piecesOnBoard[player] < 3;
}

export function hasNoLegalMoves(state: GameState, player: Player): boolean {
  if (state.piecesToPlace[player] > 0 || state.piecesOnBoard[player] <= 3) {
    return false;
  }

  return getLegalMoves({ ...state, currentPlayer: player, phase: "moving" }, player).length === 0;
}

export function getWinner(state: GameState): Player | null {
  const players: Player[] = ["white", "black"];

  for (const player of players) {
    if (hasTooFewPieces(state, player) || hasNoLegalMoves(state, player)) {
      return getOpponent(player);
    }
  }

  return null;
}

export function countPieces(board: Board, player: Player): number {
  return board.filter((occupant) => occupant === player).length;
}
