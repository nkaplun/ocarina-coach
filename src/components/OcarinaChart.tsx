import { HOLES, getFingering, type HoleId } from "@/lib/fingerings";
import { noteLabel, type Note } from "@/lib/notes";

type OcarinaChartProps = { note: Note };

const COVERED_FILL = "#1f2937";
const OPEN_FILL = "#ffffff";

/**
 * Where each hole sits in our own simple drawing (viewBox 320 x 190).
 * Finger holes sit on the body; thumb holes are on the underside, so they
 * are drawn below the body. Sub-holes are small, beside each middle finger.
 */
const HOLE_POSITIONS: Record<HoleId, { x: number; y: number; r: number }> = {
  "L-index": { x: 62, y: 102, r: 11 },
  "L-middle": { x: 90, y: 84, r: 11 },
  "L-ring": { x: 118, y: 70, r: 11 },
  "L-pinky": { x: 142, y: 50, r: 10 },
  "L-sub": { x: 104, y: 106, r: 6 },
  "L-thumb": { x: 104, y: 172, r: 11 },
  "R-index": { x: 192, y: 102, r: 11 },
  "R-middle": { x: 220, y: 84, r: 11 },
  "R-ring": { x: 248, y: 70, r: 10 },
  "R-pinky": { x: 272, y: 52, r: 9 },
  "R-sub": { x: 234, y: 106, r: 6 },
  "R-thumb": { x: 220, y: 172, r: 11 },
};

/** "C5 fingering. Covered: left thumb, …" or "F6 fingering. All holes open." */
function chartLabel(note: Note, covered: ReadonlySet<HoleId>): string {
  const names = HOLES.filter((hole) => covered.has(hole.id)).map(
    (hole) => hole.name,
  );
  const holesText =
    names.length === 0 ? "All holes open." : `Covered: ${names.join(", ")}.`;
  return `${noteLabel(note)} fingering. ${holesText}`;
}

export function OcarinaChart({ note }: OcarinaChartProps) {
  const covered = new Set(getFingering(note) ?? []);

  return (
    <svg
      role="img"
      aria-label={chartLabel(note, covered)}
      viewBox="0 0 320 190"
      className="w-full max-w-md"
    >
      <path
        d="M20 110 C 20 60, 90 30, 170 30 C 230 30, 290 20, 310 30 C 300 70, 250 140, 160 145 C 80 150, 20 140, 20 110 Z"
        fill="#d6b98c"
        stroke="#8a6d45"
        strokeWidth={2}
      />
      {HOLES.map(({ id }) => {
        const { x, y, r } = HOLE_POSITIONS[id];
        const isCovered = covered.has(id);
        return (
          <circle
            key={id}
            data-hole={id}
            data-covered={isCovered ? "true" : "false"}
            cx={x}
            cy={y}
            r={r}
            fill={isCovered ? COVERED_FILL : OPEN_FILL}
            stroke={COVERED_FILL}
            strokeWidth={2}
          />
        );
      })}
    </svg>
  );
}
