import { ADJACENCY } from "./board";
import { formsMill, getRemovablePositions } from "./mill";
import { getLegalMoves } from "./moveGenerator";
import type { Board, Difficulty, GameMode, GamePhase, GameState, Move, Player, PositionIndex } from "./types";
import { getOpponent } from "./types";
import { getWinner } from "./winner";

const TOTAL_PIECES = 9;

const cloneBoard = (board: Board): Board => [...board] as Board;

export function createInitialState(
  gameMode: GameMode = "player-vs-player",
  whiteDifficulty: Difficulty = 1,
  blackDifficulty: Difficulty = 1,
): GameState {
  return {
    board: Array.from({ length: 24 }, () => null) as Board,
    currentPlayer: "white",
    phase: "placing",
    piecesToPlace: { white: TOTAL_PIECES, black: TOTAL_PIECES },
    piecesOnBoard: { white: 0, black: 0 },
    selectedPosition: null,
    pendingRemovalBy: null,
    gameMode,
    whiteDifficulty,
    blackDifficulty,
    winner: null,
    message: "Brancas começam colocando uma peça.",
    history: [],
  };
}

export function createSnapshot(state: GameState): GameState {
  return {
    ...state,
    board: cloneBoard(state.board),
    piecesToPlace: { ...state.piecesToPlace },
    piecesOnBoard: { ...state.piecesOnBoard },
    history: state.history.map((snapshot) => createSnapshot({ ...snapshot, history: [] })),
  };
}

export function snapshotForHistory(state: GameState): GameState {
  return createSnapshot(state);
}

export function pushHistory(state: GameState): GameState[] {
  return [...state.history, snapshotForHistory(state)].slice(-3);
}

export function isPositionEmpty(board: Board, position: PositionIndex): boolean {
  return board[position] === null;
}

export function canFly(state: GameState, player: Player): boolean {
  return state.phase === "moving" && state.piecesOnBoard[player] === 3;
}

export function isLegalMove(state: GameState, from: PositionIndex, to: PositionIndex, player = state.currentPlayer): boolean {
  if (state.phase !== "moving") {
    return false;
  }
  if (state.board[from] !== player || state.board[to] !== null) {
    return false;
  }
  return canFly(state, player) || ADJACENCY[from].includes(to);
}

export function isLegalRemoval(state: GameState, position: PositionIndex, player = state.currentPlayer): boolean {
  if (state.phase !== "removing" || state.pendingRemovalBy !== player) {
    return false;
  }
  return getRemovablePositions(state.board, getOpponent(player)).includes(position);
}

function nextPlayablePhase(state: GameState, nextPlayer: Player): GamePhase {
  if (state.piecesToPlace.white > 0 || state.piecesToPlace.black > 0) {
    return "placing";
  }
  const winner = getWinner({ ...state, currentPlayer: nextPlayer, phase: "moving" });
  return winner ? "game-over" : "moving";
}

function describeTurn(state: GameState): string {
  if (state.phase === "game-over") {
    return `${state.winner === "white" ? "Brancas" : "Pretas"} venceram.`;
  }
  if (state.phase === "removing" && state.pendingRemovalBy) {
    return `${state.pendingRemovalBy === "white" ? "Brancas" : "Pretas"} formaram moinho e devem remover uma peça.`;
  }
  const color = state.currentPlayer === "white" ? "Brancas" : "Pretas";
  if (state.phase === "placing") {
    return `${color} devem colocar uma peça.`;
  }
  if (state.piecesOnBoard[state.currentPlayer] === 3) {
    return `${color} podem voar para qualquer ponto vazio.`;
  }
  return `${color} devem mover para um ponto adjacente.`;
}

function finalizeTurn(state: GameState, nextPlayer: Player): GameState {
  const phase = nextPlayablePhase(state, nextPlayer);
  const winner = phase === "game-over" ? getWinner({ ...state, currentPlayer: nextPlayer, phase }) : null;
  const nextState: GameState = {
    ...state,
    currentPlayer: nextPlayer,
    phase,
    selectedPosition: null,
    pendingRemovalBy: null,
    winner,
  };
  return {
    ...nextState,
    message: describeTurn(nextState),
  };
}

export function applyPlacement(state: GameState, position: PositionIndex): GameState {
  if (state.phase !== "placing" || !isPositionEmpty(state.board, position)) {
    return state;
  }

  const player = state.currentPlayer;
  const board = cloneBoard(state.board);
  board[position] = player;
  const nextState: GameState = {
    ...state,
    board,
    piecesToPlace: { ...state.piecesToPlace, [player]: state.piecesToPlace[player] - 1 },
    piecesOnBoard: { ...state.piecesOnBoard, [player]: state.piecesOnBoard[player] + 1 },
    selectedPosition: null,
  };

  if (formsMill(board, position, player)) {
    const removingState = {
      ...nextState,
      phase: "removing" as const,
      pendingRemovalBy: player,
      message: describeTurn({ ...nextState, phase: "removing", pendingRemovalBy: player }),
    };
    return removingState;
  }

  return finalizeTurn(nextState, getOpponent(player));
}

export function applyMovement(state: GameState, from: PositionIndex, to: PositionIndex): GameState {
  if (!isLegalMove(state, from, to)) {
    return state;
  }

  const player = state.currentPlayer;
  const board = cloneBoard(state.board);
  board[from] = null;
  board[to] = player;
  const nextState: GameState = {
    ...state,
    board,
    selectedPosition: null,
  };

  if (formsMill(board, to, player)) {
    return {
      ...nextState,
      phase: "removing",
      pendingRemovalBy: player,
      message: describeTurn({ ...nextState, phase: "removing", pendingRemovalBy: player }),
    };
  }

  return finalizeTurn(nextState, getOpponent(player));
}

export function applyRemoval(state: GameState, position: PositionIndex): GameState {
  if (!isLegalRemoval(state, position)) {
    return state;
  }

  const remover = state.pendingRemovalBy ?? state.currentPlayer;
  const opponent = getOpponent(remover);
  const board = cloneBoard(state.board);
  board[position] = null;
  const nextState: GameState = {
    ...state,
    board,
    piecesOnBoard: { ...state.piecesOnBoard, [opponent]: state.piecesOnBoard[opponent] - 1 },
  };

  return finalizeTurn(nextState, opponent);
}

export function applyMoveWithoutHistory(state: GameState, move: Move): GameState {
  if (state.phase === "game-over") {
    return state;
  }
  if (move.kind === "place") {
    return applyPlacement(state, move.to);
  }
  if (move.kind === "move") {
    return applyMovement(state, move.from, move.to);
  }
  return applyRemoval(state, move.remove);
}

export function applyCompleteMove(state: GameState, moves: Move[]): GameState {
  let nextState = state;
  for (const move of moves) {
    nextState = applyMoveWithoutHistory(nextState, move);
  }
  return nextState;
}

export function applyMoveWithHistory(state: GameState, move: Move): GameState {
  const nextState = applyMoveWithoutHistory(state, move);
  if (nextState === state) {
    return state;
  }
  return {
    ...nextState,
    history: pushHistory(state),
  };
}

export function getSelectableDestinations(state: GameState, position: PositionIndex): PositionIndex[] {
  if (state.phase !== "moving" || state.board[position] !== state.currentPlayer) {
    return [];
  }
  return getLegalMoves(state)
    .filter((move): move is Extract<Move, { kind: "move" }> => move.kind === "move" && move.from === position)
    .map((move) => move.to);
}
