import type { PositionIndex } from "./types";

export const POSITIONS: Array<{ id: PositionIndex; x: number; y: number }> = [
  { id: 0, x: 50, y: 50 },
  { id: 1, x: 300, y: 50 },
  { id: 2, x: 550, y: 50 },
  { id: 3, x: 130, y: 130 },
  { id: 4, x: 300, y: 130 },
  { id: 5, x: 470, y: 130 },
  { id: 6, x: 210, y: 210 },
  { id: 7, x: 300, y: 210 },
  { id: 8, x: 390, y: 210 },
  { id: 9, x: 50, y: 300 },
  { id: 10, x: 130, y: 300 },
  { id: 11, x: 210, y: 300 },
  { id: 12, x: 390, y: 300 },
  { id: 13, x: 470, y: 300 },
  { id: 14, x: 550, y: 300 },
  { id: 15, x: 210, y: 390 },
  { id: 16, x: 300, y: 390 },
  { id: 17, x: 390, y: 390 },
  { id: 18, x: 130, y: 470 },
  { id: 19, x: 300, y: 470 },
  { id: 20, x: 470, y: 470 },
  { id: 21, x: 50, y: 550 },
  { id: 22, x: 300, y: 550 },
  { id: 23, x: 550, y: 550 },
];

export const ADJACENCY: Record<PositionIndex, PositionIndex[]> = {
  0: [1, 9],
  1: [0, 2, 4],
  2: [1, 14],
  3: [4, 10],
  4: [1, 3, 5, 7],
  5: [4, 13],
  6: [7, 11],
  7: [4, 6, 8],
  8: [7, 12],
  9: [0, 10, 21],
  10: [3, 9, 11, 18],
  11: [6, 10, 15],
  12: [8, 13, 17],
  13: [5, 12, 14, 20],
  14: [2, 13, 23],
  15: [11, 16],
  16: [15, 17, 19],
  17: [12, 16],
  18: [10, 19],
  19: [16, 18, 20, 22],
  20: [13, 19],
  21: [9, 22],
  22: [19, 21, 23],
  23: [14, 22],
};

export const MILLS: PositionIndex[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [9, 10, 11],
  [12, 13, 14],
  [15, 16, 17],
  [18, 19, 20],
  [21, 22, 23],
  [0, 9, 21],
  [3, 10, 18],
  [6, 11, 15],
  [1, 4, 7],
  [16, 19, 22],
  [8, 12, 17],
  [5, 13, 20],
  [2, 14, 23],
];

export const BOARD_LINES: Array<[PositionIndex, PositionIndex]> = Object.entries(ADJACENCY).flatMap(
  ([from, targets]) =>
    targets
      .filter((to) => Number(from) < to)
      .map((to) => [Number(from) as PositionIndex, to] as [PositionIndex, PositionIndex]),
);
