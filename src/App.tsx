import { GameSetupPanel } from "./components/GameSetupPanel";
import { GameStatusPanel } from "./components/GameStatusPanel";
import { MoveHistoryPanel } from "./components/MoveHistoryPanel";
import { BoardSvg } from "./components/Board/BoardSvg";
import { getRemovablePositions } from "./domain/mill";
import { getOpponent } from "./domain/types";
import { useAiTurns, useGameStore } from "./store/useGameStore";

export default function App() {
  useAiTurns();
  const state = useGameStore((store) => store.state);
  const legalDestinations = useGameStore((store) => store.legalDestinations);
  const selectPosition = useGameStore((store) => store.selectPosition);
  const isAiTurn = useGameStore((store) => store.isAiTurn());
  const legalRemovals =
    state.phase === "removing" && state.pendingRemovalBy
      ? getRemovablePositions(state.board, getOpponent(state.pendingRemovalBy))
      : [];

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Trilha / Moinho</p>
          <h1>Nine Men's Morris</h1>
          <p>
            Coloque, mova, voe com três peças e remova peças ao fechar moinhos.
          </p>
        </div>
      </section>

      <section className="game-layout">
        <aside className="panel-column">
          <GameSetupPanel />
          <GameStatusPanel />
        </aside>

        <BoardSvg />

        <aside className="panel-column">
          <MoveHistoryPanel />
        </aside>
      </section>
    </main>
  );
}
