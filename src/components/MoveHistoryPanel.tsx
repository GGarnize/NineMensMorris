import { useGameStore } from "../store/useGameStore";

export function MoveHistoryPanel() {
  const historyLength = useGameStore((store) => store.state.history.length);

  return (
    <section className="panel">
      <h2>Histórico</h2>
      <p>{historyLength}/3 lances completos disponíveis para desfazer.</p>
      <ol className="history-list">
        {Array.from({ length: historyLength }, (_, index) => (
          <li key={index} className="history-item">
            Lance completo #{index + 1}
          </li>
        ))}
      </ol>
    </section>
  );
}
