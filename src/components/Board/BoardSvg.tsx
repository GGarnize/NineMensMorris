import { POSITIONS } from "../../domain/board";
import { getRemovablePositions } from "../../domain/mill";
import type { PositionIndex } from "../../domain/types";
import { getOpponent } from "../../domain/types";
import { useGameStore } from "../../store/useGameStore";
import { BoardLines } from "./BoardLines";
import { BoardPoint } from "./BoardPoint";

export function BoardSvg() {
  const state = useGameStore((store) => store.state);
  const legalDestinations = useGameStore((store) => store.legalDestinations);
  const selectPosition = useGameStore((store) => store.selectPosition);
  const isAiTurn = useGameStore((store) => store.isAiTurn());
  const legalRemovals =
    state.phase === "removing" && state.pendingRemovalBy
      ? getRemovablePositions(state.board, getOpponent(state.pendingRemovalBy))
      : [];

  return (
    <section className="board-card">
      <svg className="board-svg" viewBox="0 0 600 600" role="img" aria-label="Tabuleiro de Trilha">
        <BoardLines />
      {POSITIONS.map(({ id, x, y }) => (
        <BoardPoint
          key={id}
          position={id}
          x={x}
          y={y}
          occupant={state.board[id]}
          selected={state.selectedPosition === id}
          legalDestination={legalDestinations.includes(id)}
          legalRemoval={legalRemovals.includes(id)}
          disabled={isAiTurn}
          onClick={selectPosition}
        />
      ))}
      </svg>
    </section>
  );
}
