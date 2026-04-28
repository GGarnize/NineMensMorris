import { create } from "zustand";
import { useEffect } from "react";
import { chooseAiMove } from "../ai/aiEngine";
import {
  applyCompleteMove,
  applyMoveWithHistory,
  applyMoveWithoutHistory,
  createInitialState,
  getSelectableDestinations,
  isLegalRemoval,
  pushHistory,
} from "../domain/rules";
import { undoLastCompleteMove } from "../domain/undo";
import type { Difficulty, GameMode, GameState, PositionIndex } from "../domain/types";

interface GameStore {
  state: GameState;
  legalDestinations: PositionIndex[];
  startNewGame: (gameMode?: GameMode, whiteDifficulty?: Difficulty, blackDifficulty?: Difficulty) => void;
  setGameMode: (gameMode: GameMode) => void;
  setDifficulty: (player: "white" | "black", difficulty: Difficulty) => void;
  selectPosition: (position: PositionIndex) => void;
  undo: () => void;
  playAiTurn: () => void;
  isAiTurn: () => boolean;
}

const isAiControlled = (state: GameState): boolean => {
  if (state.phase === "game-over") return false;
  if (state.gameMode === "ai-vs-ai") return true;
  return state.gameMode === "player-vs-ai" && state.currentPlayer === "black";
};

const getDifficultyForPlayer = (state: GameState): Difficulty =>
  state.currentPlayer === "white" ? state.whiteDifficulty : state.blackDifficulty;

export const useGameStore = create<GameStore>((set, get) => ({
  state: createInitialState(),
  legalDestinations: [],

  startNewGame: (gameMode, whiteDifficulty, blackDifficulty) => {
    const current = get().state;
    set({
      state: createInitialState(
        gameMode ?? current.gameMode,
        whiteDifficulty ?? current.whiteDifficulty,
        blackDifficulty ?? current.blackDifficulty,
      ),
      legalDestinations: [],
    });
  },

  setGameMode: (gameMode) => {
    const current = get().state;
    set({
      state: createInitialState(gameMode, current.whiteDifficulty, current.blackDifficulty),
      legalDestinations: [],
    });
  },

  setDifficulty: (player, difficulty) => {
    const current = get().state;
    const whiteDifficulty = player === "white" ? difficulty : current.whiteDifficulty;
    const blackDifficulty = player === "black" ? difficulty : current.blackDifficulty;
    set({
      state: createInitialState(current.gameMode, whiteDifficulty, blackDifficulty),
      legalDestinations: [],
    });
  },

  selectPosition: (position) => {
    const current = get().state;
    if (isAiControlled(current)) return;

    if (current.phase === "placing") {
      const next = applyMoveWithHistory(current, { kind: "place", to: position });
      set({ state: next, legalDestinations: [] });
      return;
    }

    if (current.phase === "removing") {
      if (!isLegalRemoval(current, position)) return;
      const next = applyMoveWithoutHistory(current, { kind: "remove", remove: position });
      set({ state: next, legalDestinations: [] });
      return;
    }

    if (current.phase !== "moving") return;

    if (current.selectedPosition !== null && get().legalDestinations.includes(position)) {
      const next = applyMoveWithHistory(current, {
        kind: "move",
        from: current.selectedPosition,
        to: position,
      });
      set({ state: next, legalDestinations: [] });
      return;
    }

    if (current.board[position] === current.currentPlayer) {
      const legalDestinations = getSelectableDestinations(current, position);
      set({
        state: { ...current, selectedPosition: position },
        legalDestinations,
      });
      return;
    }

    set({ state: { ...current, selectedPosition: null }, legalDestinations: [] });
  },

  undo: () => {
    const previous = undoLastCompleteMove(get().state);
    set({ state: previous, legalDestinations: [] });
  },

  playAiTurn: () => {
    const current = get().state;
    if (!isAiControlled(current)) return;
    const aiMove = chooseAiMove(current, getDifficultyForPlayer(current));
    if (!aiMove) return;
    const next = {
      ...applyCompleteMove(current, aiMove),
      history: pushHistory(current),
    };
    set({ state: next, legalDestinations: [] });
  },

  isAiTurn: () => isAiControlled(get().state),
}));

export function useAiTurns() {
  const state = useGameStore((store) => store.state);
  const isAiTurn = useGameStore((store) => store.isAiTurn);
  const playAiTurn = useGameStore((store) => store.playAiTurn);

  useEffect(() => {
    if (!isAiTurn()) return;
    const timer = window.setTimeout(() => {
      playAiTurn();
    }, 450);
    return () => window.clearTimeout(timer);
  }, [state, isAiTurn, playAiTurn]);
}
