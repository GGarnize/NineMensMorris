import { createSnapshot } from "./rules";
import type { GameState } from "./types";

export function undoLastCompleteMove(state: GameState): GameState {
  const snapshot = state.history[state.history.length - 1];
  if (!snapshot) {
    return state;
  }

  return createSnapshot(snapshot);
}
