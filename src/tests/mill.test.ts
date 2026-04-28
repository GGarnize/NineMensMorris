import { describe, expect, it } from "vitest";
import { formsMill } from "../domain/mill";
import type { Board } from "../domain/types";

const emptyBoard = (): Board => Array.from({ length: 24 }, () => null);

describe("mill detection", () => {
  it("detecta moinho horizontal", () => {
    const board = emptyBoard();
    board[0] = "white";
    board[1] = "white";
    board[2] = "white";

    expect(formsMill(board, 1, "white")).toBe(true);
  });

  it("detecta moinho vertical", () => {
    const board = emptyBoard();
    board[0] = "black";
    board[9] = "black";
    board[21] = "black";

    expect(formsMill(board, 9, "black")).toBe(true);
  });
});
