import { getCompleteMoves } from "../domain/moveGenerator";
import { applyCompleteMove, createSnapshot } from "../domain/rules";
import type { GameState, Move, Player } from "../domain/types";
import { getWinner } from "../domain/winner";
import { evaluateBoard } from "./evaluateBoard";
import { orderMoves } from "./moveOrdering";

export interface SearchResult {
  moves: Move[];
  score: number;
}

function scoreTerminal(state: GameState, player: Player): number | null {
  const winner = state.winner ?? getWinner(state);
  if (!winner) {
    return null;
  }
  return winner === player ? 100_000 : -100_000;
}

function search(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: Player,
): SearchResult {
  const terminalScore = scoreTerminal(state, maximizingPlayer);
  if (terminalScore !== null || depth === 0) {
    return { moves: [], score: terminalScore ?? evaluateBoard(state, maximizingPlayer) };
  }

  const player = state.currentPlayer;
  const completeMoves = orderMoves(state, getCompleteMoves(state, player), player);
  if (completeMoves.length === 0) {
    return {
      moves: [],
      score: player === maximizingPlayer ? -100_000 : 100_000,
    };
  }

  const isMaximizingTurn = player === maximizingPlayer;
  let best: SearchResult = {
    moves: completeMoves[0],
    score: isMaximizingTurn ? -Infinity : Infinity,
  };

  for (const moves of completeMoves) {
    const child = createSnapshot(applyCompleteMove(createSnapshot(state), moves));
    const result = search(child, depth - 1, alpha, beta, maximizingPlayer);

    if (isMaximizingTurn) {
      if (result.score > best.score) {
        best = { moves, score: result.score };
      }
      alpha = Math.max(alpha, best.score);
    } else {
      if (result.score < best.score) {
        best = { moves, score: result.score };
      }
      beta = Math.min(beta, best.score);
    }

    if (beta <= alpha) {
      break;
    }
  }

  return best;
}

export function minimax(state: GameState, player = state.currentPlayer, depth = 3): SearchResult {
  return search(
    { ...createSnapshot(state), currentPlayer: player },
    depth,
    -Infinity,
    Infinity,
    player,
  );
}

export function searchBestMove(state: GameState, player = state.currentPlayer, depth = 3): Move[] {
  return minimax(state, player, depth).moves;
}
