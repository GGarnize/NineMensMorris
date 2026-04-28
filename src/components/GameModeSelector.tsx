import type { GameMode } from "../domain/types";

interface GameModeSelectorProps {
  value: GameMode;
  onChange: (value: GameMode) => void;
}

const labels: Record<GameMode, string> = {
  "player-vs-player": "Jogador vs Jogador",
  "player-vs-ai": "Jogador vs IA",
  "ai-vs-ai": "IA vs IA",
};

export function GameModeSelector({ value, onChange }: GameModeSelectorProps) {
  return (
    <label className="field">
      <span>Modo</span>
      <select value={value} onChange={(event) => onChange(event.target.value as GameMode)}>
        {Object.entries(labels).map(([mode, label]) => (
          <option key={mode} value={mode}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
