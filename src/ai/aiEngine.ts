import { formsMill } from "../domain/mill";
import { getCompleteMoves } from "../domain/moveGenerator";
import { applyCompleteMove } from "../domain/rules";
import type { Difficulty, GameState, Move, Player } from "../domain/types";
import { getOpponent } from "../domain/types";
import { evaluateBoard } from "./evaluateBoard";
import { minimax } from "./minimax";

const randomIndex = (length: number): number => Math.floor(Math.random() * length);

function chooseRandom(moves: Move[][]): Move[] {
  return moves[randomIndex(moves.length)] ?? [];
}

function moveFormsMill(state: GameState, moves: Move[], player: Player): boolean {
  const first = moves[0];
  if (!first || first.kind === "remove") return false;
  const board = [...state.board];
  if (first.kind === "move") board[first.from] = null;
  board[first.to] = player;
  return formsMill(board, first.to, player);
}

function blocksOpponentMill(state: GameState, moves: Move[], player: Player): boolean {
  const first = moves[0];
  if (!first || first.kind === "remove") return false;
  const opponent = getOpponent(player);
  const board = [...state.board];
  board[first.to] = opponent;
  return formsMill(board, first.to, opponent);
}

function chooseTacticalMove(state: GameState, player: Player, moves: Move[][]): Move[] {
  return (
    moves.find((move) => moveFormsMill(state, move, player)) ??
    moves.find((move) => blocksOpponentMill(state, move, player)) ??
    chooseRandom(moves)
  );
}

function chooseHeuristicMove(state: GameState, player: Player, moves: Move[][]): Move[] {
  return moves.reduce((best, candidate) => {
    const bestScore = evaluateBoard(applyCompleteMove(state, best), player);
    const candidateScore = evaluateBoard(applyCompleteMove(state, candidate), player);
    return candidateScore > bestScore ? candidate : best;
  }, moves[0]);
}

export function chooseAiMove(state: GameState, difficulty: Difficulty = 1, player = state.currentPlayer): Move[] {
  const moves = getCompleteMoves(state, player);
  if (moves.length === 0) return [];

  if (difficulty === 1) return chooseRandom(moves);
  if (difficulty === 2) return chooseTacticalMove(state, player, moves);
  if (difficulty === 3) return chooseHeuristicMove(state, player, moves);
  if (difficulty === 4) return minimax(state, player, 3).moves;
  return minimax(state, player, 4).moves;
}
