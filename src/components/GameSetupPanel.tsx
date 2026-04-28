import { useGameStore } from "../store/useGameStore";
import { DifficultySelector } from "./DifficultySelector";
import { GameModeSelector } from "./GameModeSelector";

export function GameSetupPanel() {
  const gameMode = useGameStore((store) => store.state.gameMode);
  const whiteDifficulty = useGameStore((store) => store.state.whiteDifficulty);
  const blackDifficulty = useGameStore((store) => store.state.blackDifficulty);
  const setGameMode = useGameStore((store) => store.setGameMode);
  const setDifficulty = useGameStore((store) => store.setDifficulty);
  const startNewGame = useGameStore((store) => store.startNewGame);

  return (
    <section className="panel">
      <h2>Configuração</h2>
      <GameModeSelector value={gameMode} onChange={setGameMode} />
      <DifficultySelector
        label="Dificuldade brancas"
        value={whiteDifficulty}
        onChange={(difficulty) => setDifficulty("white", difficulty)}
      />
      <DifficultySelector
        label="Dificuldade pretas"
        value={blackDifficulty}
        onChange={(difficulty) => setDifficulty("black", difficulty)}
      />
      <button type="button" className="primary-button" onClick={() => startNewGame()}>
        Novo Jogo
      </button>
    </section>
  );
}
