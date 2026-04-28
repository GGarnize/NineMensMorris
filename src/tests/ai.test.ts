import { describe, expect, it } from "vitest";
import { chooseAiMove } from "../ai/aiEngine";
import { applyCompleteMove, createInitialState } from "../domain/rules";
import type { Board, GameState } from "../domain/types";

const board = (entries: Array<[number, "white" | "black"]>): Board => {
  const result = Array.from({ length: 24 }, () => null) as Board;
  for (const [position, player] of entries) {
    result[position] = player;
  }
  return result;
};

function stateWithBoard(entries: Array<[number, "white" | "black"]>): GameState {
  const state = createInitialState();
  const nextBoard = board(entries);
  return {
    ...state,
    board: nextBoard,
    currentPlayer: "white",
    phase: "placing",
    piecesToPlace: { white: 7, black: 7 },
    piecesOnBoard: { white: 2, black: 2 },
  };
}

describe("ai engine", () => {
  it("nível 1 retorna movimento legal", () => {
    const state = createInitialState();
    const move = chooseAiMove(state, 1);

    expect(move.length).toBe(1);
    expect(move[0].kind).toBe("place");
    if (move[0].kind === "place") {
      expect(move[0].to).toBeGreaterThanOrEqual(0);
      expect(move[0].to).toBeLessThan(24);
    }
  });

  it("nível 2 prioriza formar moinho", () => {
    const state = stateWithBoard([
      [0, "white"],
      [1, "white"],
      [9, "black"],
      [10, "black"],
    ]);

    const move = chooseAiMove(state, 2);
    const next = applyCompleteMove(state, move);

    expect(move[0]).toEqual({ kind: "place", to: 2 });
    expect(next.phase).toBe("placing");
    expect(next.board.filter((cell) => cell === "black").length).toBe(1);
  });

  it("níveis minimax retornam movimento aplicável", () => {
    const state = stateWithBoard([
      [0, "white"],
      [1, "white"],
      [9, "black"],
      [10, "black"],
    ]);

    const move = chooseAiMove(state, 4);
    const next = applyCompleteMove(state, move);

    expect(move.length).toBeGreaterThan(0);
    expect(next).not.toBe(state);
  });
});
