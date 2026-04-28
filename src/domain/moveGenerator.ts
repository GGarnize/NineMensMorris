import { ADJACENCY } from "./board";
import { formsMill, getRemovablePositions } from "./mill";
import type { Board, GameState, Move, Player, PositionIndex } from "./types";

export const emptyPositions = (board: Board): PositionIndex[] =>
  board.reduce<PositionIndex[]>((positions, cell, index) => {
    if (cell === null) positions.push(index as PositionIndex);
    return positions;
  }, []);

export const playerPositions = (board: Board, player: Player): PositionIndex[] =>
  board.reduce<PositionIndex[]>((positions, cell, index) => {
    if (cell === player) positions.push(index as PositionIndex);
    return positions;
  }, []);

export const canFly = (state: GameState, player: Player): boolean =>
  state.piecesToPlace[player] === 0 && state.piecesOnBoard[player] === 3;

export const getLegalDestinations = (
  state: GameState,
  from: PositionIndex,
): PositionIndex[] => {
  const piece = state.board[from];
  if (!piece || state.phase !== "moving") return [];
  if (canFly(state, piece)) return emptyPositions(state.board);
  return ADJACENCY[from].filter((position) => state.board[position] === null);
};

export const getLegalMoves = (
  state: GameState,
  player = state.currentPlayer,
): Move[] => {
  if (state.phase === "game-over") return [];
  if (state.phase === "removing") {
    if (state.pendingRemovalBy !== player) return [];
    return getRemovablePositions(state.board, player === "white" ? "black" : "white").map((remove) => ({
      kind: "remove",
      remove,
    }));
  }

  if (state.phase === "placing") {
    return emptyPositions(state.board).map((to) => ({ kind: "place", to }));
  }

  return playerPositions(state.board, player).flatMap((from) =>
    getLegalDestinations(state, from).map((to) => ({ kind: "move", from, to })),
  );
};

export function getCompleteMoves(state: GameState, player = state.currentPlayer): Move[][] {
  const baseMoves = getLegalMoves(state, player);
  if (state.phase === "removing") {
    return baseMoves.map((move) => [move]);
  }

  return baseMoves.flatMap((move) => {
    const board = [...state.board] as Board;
    const to = move.kind === "place" || move.kind === "move" ? move.to : null;
    if (move.kind === "move") {
      board[move.from] = null;
    }
    if (to === null) {
      return [[move]];
    }
    board[to] = player;
    if (!formsMill(board, to, player)) {
      return [[move]];
    }
    const opponent = player === "white" ? "black" : "white";
    return getRemovablePositions(board, opponent).map((remove) => [
      move,
      { kind: "remove", remove } satisfies Move,
    ]);
  });
}
