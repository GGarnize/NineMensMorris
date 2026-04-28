import type { Player, PositionIndex } from "../../domain/types";

interface BoardPointProps {
  position: PositionIndex;
  x: number;
  y: number;
  occupant: Player | null;
  selected: boolean;
  legalDestination: boolean;
  legalRemoval: boolean;
  disabled: boolean;
  onClick: (position: PositionIndex) => void;
}

export function BoardPoint({
  position,
  x,
  y,
  occupant,
  selected,
  legalDestination,
  legalRemoval,
  disabled,
  onClick,
}: BoardPointProps) {
  const legal = legalDestination || legalRemoval;
  const fill =
    occupant === "white" ? "#f8fafc" : occupant === "black" ? "#111827" : legal ? "#fde68a" : "#332419";
  const stroke = selected ? "#f59e0b" : legalRemoval ? "#ef4444" : legalDestination ? "#22c55e" : "#d7a84f";

  return (
    <g className={disabled ? "board-point disabled" : "board-point"}>
      <circle
        cx={x}
        cy={y}
        r={occupant ? 19 : 8}
        fill={fill}
        stroke={stroke}
        strokeWidth={selected || legal ? 5 : 3}
        onClick={() => !disabled && onClick(position)}
      />
      <circle className="point-hit-area" cx={x} cy={y} r={28} onClick={() => !disabled && onClick(position)} />
    </g>
  );
}
