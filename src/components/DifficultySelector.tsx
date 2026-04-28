import type { Difficulty } from "../domain/types";

interface DifficultySelectorProps {
  label: string;
  value: Difficulty;
  disabled?: boolean;
  onChange: (value: Difficulty) => void;
}

const levels: Difficulty[] = [1, 2, 3, 4, 5];

export function DifficultySelector({
  label,
  value,
  disabled = false,
  onChange,
}: DifficultySelectorProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value) as Difficulty)}
      >
        {levels.map((level) => (
          <option key={level} value={level}>
            Nível {level}
          </option>
        ))}
      </select>
    </label>
  );
}
