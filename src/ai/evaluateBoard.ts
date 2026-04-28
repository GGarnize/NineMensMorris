import { MILLS } from "../domain/board";
import { countMills } from "../domain/mill";
import { getLegalMoves, playerPositions } from "../domain/moveGenerator";
import type { GameState, Player } from "../domain/types";
import { getOpponent } from "../domain/types";

function twoPieceLineScore(state: GameState, player: Player): number {
  return MILLS.reduce((score, mill) => {
    const mine = mill.filter((position) => state.board[position] === player).length;
    const empty = mill.filter((position) => state.board[position] === null).length;
    const theirs = mill.length - mine - empty;
    if (mine === 2 && empty === 1) return score + 18;
    if (theirs === 2 && empty === 1) return score - 16;
    return score;
  }, 0);
}

export function evaluateBoard(state: GameState, player: Player): number {
  const opponent = getOpponent(player);
  if (state.winner === player) return 100_000;
  if (state.winner === opponent) return -100_000;

  const material = (state.piecesOnBoard[player] - state.piecesOnBoard[opponent]) * 100;
  const reserves = (state.piecesToPlace[player] - state.piecesToPlace[opponent]) * 12;
  const mills = (countMills(state.board, player) - countMills(state.board, opponent)) * 70;
  const mobility =
    (getLegalMoves({ ...state, currentPlayer: player, phase: state.piecesToPlace[player] > 0 ? "placing" : "moving" }, player).length -
      getLegalMoves(
        { ...state, currentPlayer: opponent, phase: state.piecesToPlace[opponent] > 0 ? "placing" : "moving" },
        opponent,
      ).length) *
    3;
  const flexibility = (playerPositions(state.board, player).length - playerPositions(state.board, opponent).length) * 5;

  return material + reserves + mills + mobility + flexibility + twoPieceLineScore(state, player);
}
