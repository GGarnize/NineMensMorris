export type Player = "white" | "black";
export type BoardCell = Player | null;
export type Board = BoardCell[];
export type PositionIndex = number;
export type GamePhase = "placing" | "moving" | "removing" | "game-over";
export type GameMode = "player-vs-player" | "player-vs-ai" | "ai-vs-ai";
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export type PiecesByPlayer = Record<Player, number>;

export type Winner = Player | "draw" | null;

export type Move =
  | { kind: "place"; to: PositionIndex }
  | { kind: "move"; from: PositionIndex; to: PositionIndex }
  | { kind: "remove"; remove: PositionIndex };

export interface GameState {
  board: Board;
  currentPlayer: Player;
  phase: GamePhase;
  piecesToPlace: PiecesByPlayer;
  piecesOnBoard: PiecesByPlayer;
  selectedPosition: PositionIndex | null;
  pendingRemovalBy: Player | null;
  gameMode: GameMode;
  whiteDifficulty: Difficulty;
  blackDifficulty: Difficulty;
  winner: Winner;
  message: string;
  history: GameState[];
}

export function getOpponent(player: Player): Player {
  return player === "white" ? "black" : "white";
}
