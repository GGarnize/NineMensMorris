import { useGameStore } from "../store/useGameStore";

const playerLabel = {
  white: "Brancas",
  black: "Pretas",
};

export function GameStatusPanel() {
  const state = useGameStore((store) => store.state);
  const canUndo = useGameStore((store) => store.state.history.length > 0);
  const undo = useGameStore((store) => store.undo);
  const isAiTurn = useGameStore((store) => store.isAiTurn());

  return (
    <section className="panel status-panel">
      <h2>Status</h2>
      <p className="message">{state.message}</p>
      <div className="status-grid">
        <span>Turno</span>
        <strong>{playerLabel[state.currentPlayer]}</strong>
        <span>Fase</span>
        <strong>{state.phase}</strong>
        <span>Peças a colocar</span>
        <strong>
          {state.piecesToPlace.white} / {state.piecesToPlace.black}
        </strong>
        <span>Peças no tabuleiro</span>
        <strong>
          {state.piecesOnBoard.white} / {state.piecesOnBoard.black}
        </strong>
      </div>
      <button type="button" onClick={undo} disabled={!canUndo || isAiTurn}>
        Desfazer
      </button>
    </section>
  );
}
