import { describe, expect, it } from "vitest";
import { applyMoveWithHistory, applyMovement, applyRemoval, createInitialState, isLegalMove, isLegalRemoval } from "../domain/rules";
import { undoLastCompleteMove } from "../domain/undo";
import { getWinner } from "../domain/winner";
import type { Board, GameState } from "../domain/types";

const emptyBoard = (): Board => Array.from({ length: 24 }, () => null) as Board;

function movingState(board: Board, overrides: Partial<GameState> = {}): GameState {
  const white = board.filter((cell) => cell === "white").length;
  const black = board.filter((cell) => cell === "black").length;
  return {
    ...createInitialState(),
    board,
    phase: "moving",
    currentPlayer: "white",
    piecesToPlace: { white: 0, black: 0 },
    piecesOnBoard: { white, black },
    message: "",
    ...overrides,
  };
}

describe("regras centrais", () => {
  it("impede movimento não adjacente quando jogador tem mais de 3 peças", () => {
    const board = emptyBoard();
    board[0] = "white";
    board[3] = "white";
    board[6] = "white";
    board[21] = "white";
    const state = movingState(board);

    expect(isLegalMove(state, 0, 23)).toBe(false);
  });

  it("permite voo quando jogador tem 3 peças", () => {
    const board = emptyBoard();
    board[0] = "white";
    board[3] = "white";
    board[6] = "white";
    const state = movingState(board);

    expect(isLegalMove(state, 0, 23)).toBe(true);
  });

  it("impede remover peça em moinho quando há peças fora de moinho", () => {
    const board = emptyBoard();
    board[0] = "black";
    board[1] = "black";
    board[2] = "black";
    board[4] = "black";
    const state = movingState(board, {
      currentPlayer: "white",
      phase: "removing",
      pendingRemovalBy: "white",
      piecesOnBoard: { white: 3, black: 4 },
    });

    expect(isLegalRemoval(state, 0)).toBe(false);
    expect(isLegalRemoval(state, 4)).toBe(true);
  });

  it("permite remover peça em moinho quando todas estão em moinho", () => {
    const board = emptyBoard();
    board[0] = "black";
    board[1] = "black";
    board[2] = "black";
    const state = movingState(board, {
      currentPlayer: "white",
      phase: "removing",
      pendingRemovalBy: "white",
      piecesOnBoard: { white: 3, black: 3 },
    });

    expect(isLegalRemoval(state, 0)).toBe(true);
  });

  it("declara vitória por menos de 3 peças", () => {
    const board = emptyBoard();
    board[0] = "white";
    board[1] = "white";
    board[3] = "black";
    board[4] = "black";
    board[5] = "black";
    const state = movingState(board, {
      piecesOnBoard: { white: 2, black: 3 },
    });

    expect(getWinner(state)).toBe("black");
  });

  it("declara vitória por ausência de movimentos", () => {
    const board = emptyBoard();
    board[0] = "white";
    board[2] = "white";
    board[21] = "white";
    board[23] = "white";
    board[1] = "black";
    board[9] = "black";
    board[14] = "black";
    board[22] = "black";
    const state = movingState(board, {
      currentPlayer: "white",
      piecesOnBoard: { white: 4, black: 4 },
    });

    expect(getWinner(state)).toBe("black");
  });

  it("undo volta o estado anterior corretamente depois de lance completo com remoção", () => {
    let state = createInitialState();
    state = applyMoveWithHistory(state, { kind: "place", to: 0 });
    state = applyMoveWithHistory(state, { kind: "place", to: 9 });
    state = applyMoveWithHistory(state, { kind: "place", to: 1 });
    state = applyMoveWithHistory(state, { kind: "place", to: 10 });
    const beforeMill = state;
    state = applyMoveWithHistory(state, { kind: "place", to: 2 });
    state = applyRemoval(state, 9);

    const undone = undoLastCompleteMove(state);

    expect(undone.board).toEqual(beforeMill.board);
    expect(undone.currentPlayer).toBe(beforeMill.currentPlayer);
    expect(undone.phase).toBe(beforeMill.phase);
    expect(undone.history).toHaveLength(beforeMill.history.length);
  });

  it("aplica movimento adjacente válido", () => {
    const board = emptyBoard();
    board[0] = "white";
    board[3] = "white";
    board[6] = "white";
    board[21] = "white";
    const state = movingState(board);

    const next = applyMovement(state, 0, 1);

    expect(next.board[0]).toBeNull();
    expect(next.board[1]).toBe("white");
  });
});
