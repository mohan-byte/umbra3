import clsx from "clsx";

// Semicircular risk gauge (0-100), pure SVG, deterministic.
export function RiskGauge({ score, trend }) {
  const clamped = Math.max(0, Math.min(100, score));
  const r = 78;
  const cx = 100;
  const cy = 100;
  const circ = Math.PI * r; // half circle
  const dash = (clamped / 100) * circ;

  const band =
    clamped >= 80 ? { label: "Severe", color: "#ff4d5e" } :
    clamped >= 60 ? { label: "Elevated", color: "#ff8a3d" } :
    clamped >= 40 ? { label: "Guarded", color: "#ffc043" } :
    { label: "Low", color: "#39d98a" };

  const up = (trend ?? 0) >= 0;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 118" className="w-full max-w-[280px]">
        <defs>
          <linearGradient id="riskGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#39d98a" />
            <stop offset="45%" stopColor="#ffc043" />
            <stop offset="75%" stopColor="#ff8a3d" />
            <stop offset="100%" stopColor="#ff4d5e" />
          </linearGradient>
        </defs>
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="#1a1f2b" strokeWidth="14" strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="url(#riskGrad)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
        />
        <text x={cx} y={cy - 10} textAnchor="middle" className="fill-ink" style={{ fontSize: 34, fontWeight: 700 }}>
          {clamped}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" style={{ fontSize: 12, fill: band.color, fontWeight: 600 }}>
          {band.label} risk
        </text>
      </svg>
      {trend !== undefined && (
        <div className={clsx("chip mt-1", up ? "bg-sev-critical/10 text-sev-critical" : "bg-ok/10 text-ok")}>
          {up ? "▲" : "▼"} {Math.abs(trend)} pts vs last 30d
        </div>
      )}
    </div>
  );
}
