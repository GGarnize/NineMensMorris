import { BOARD_LINES, POSITIONS } from "../../domain/board";

export function BoardLines() {
  return (
    <g className="board-lines">
      {BOARD_LINES.map(([from, to]) => {
        const start = POSITIONS[from];
        const end = POSITIONS[to];
        return (
          <line
            key={`${from}-${to}`}
            className="board-line"
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
          />
        );
      })}
    </g>
  );
}
