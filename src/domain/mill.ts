import { MILLS } from "./board";
import type { Board, Player, PositionIndex } from "./types";

export function getMillsForPosition(position: PositionIndex) {
  return MILLS.filter((mill) => mill.includes(position));
}

export function isMillAt(board: Board, position: PositionIndex, player: Player): boolean {
  return getMillsForPosition(position).some((mill) =>
    mill.every((millPosition) => board[millPosition] === player),
  );
}

export function formsMill(
  board: Board,
  position: PositionIndex,
  player: Player,
): boolean {
  return isMillAt(board, position, player);
}

export function countMills(board: Board, player: Player): number {
  return MILLS.filter((mill) => mill.every((position) => board[position] === player)).length;
}

export function isPositionInMill(board: Board, position: PositionIndex): boolean {
  const player = board[position];
  if (!player) {
    return false;
  }

  return isMillAt(board, position, player);
}

export const isMillPosition = isMillAt;

export function isMillFormedByMove(
  board: Board,
  player: Player,
  to: PositionIndex,
  from?: PositionIndex,
): boolean {
  const nextBoard = [...board] as Board;
  if (from !== undefined) {
    nextBoard[from] = null;
  }
  nextBoard[to] = player;
  return formsMill(nextBoard, to, player);
}

export function getRemovablePositions(board: Board, player: Player): PositionIndex[] {
  const opponentPositions = board
    .map((occupant, position) => ({ occupant, position: position as PositionIndex }))
    .filter(({ occupant }) => occupant === player)
    .map(({ position }) => position);

  const outsideMills = opponentPositions.filter((position) => !isPositionInMill(board, position));
  return outsideMills.length > 0 ? outsideMills : opponentPositions;
}
