import { countMills } from "../domain/mill";
import { applyCompleteMove } from "../domain/rules";
import type { GameState, Move, Player } from "../domain/types";

export function orderMoves(state: GameState, moves: Move[][], player: Player): Move[][] {
  return [...moves].sort((a, b) => scoreMove(state, b, player) - scoreMove(state, a, player));
}

function scoreMove(state: GameState, move: Move[], player: Player): number {
  const beforeMills = countMills(state.board, player);
  const nextState = applyCompleteMove(state, move);
  const afterMills = countMills(nextState.board, player);
  const removes = move.some((step) => step.kind === "remove") ? 50 : 0;
  return removes + (afterMills - beforeMills) * 25;
}
