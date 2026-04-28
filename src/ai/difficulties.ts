import type { Difficulty } from "../domain/types";

export const DIFFICULTIES: { value: Difficulty; label: string; description: string }[] = [
  { value: 1, label: "Nível 1", description: "Aleatória" },
  { value: 2, label: "Nível 2", description: "Moinho e bloqueio" },
  { value: 3, label: "Nível 3", description: "Heurística" },
  { value: 4, label: "Nível 4", description: "Minimax profundidade 3" },
  { value: 5, label: "Nível 5", description: "Minimax profundidade 4" },
];

export const MINIMAX_DEPTH_BY_DIFFICULTY: Record<Difficulty, number> = {
  1: 0,
  2: 0,
  3: 1,
  4: 3,
  5: 4,
};
