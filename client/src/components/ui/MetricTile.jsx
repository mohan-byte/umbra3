import clsx from "clsx";

const tone = {
  brand: "text-brand-soft bg-brand/[0.14]",
  cyan: "text-cyan bg-cyan/[0.12]",
  critical: "text-sev-critical bg-sev-critical/[0.12]",
  high: "text-sev-high bg-sev-high/[0.12]",
  medium: "text-sev-medium bg-sev-medium/[0.12]",
  low: "text-sev-low bg-sev-low/[0.12]",
  ok: "text-ok bg-ok/[0.12]",
};

export function MetricTile({ icon: Icon, value, label, sub, accent = "brand", className }) {
  return (
    <div className={clsx("panel panel-hover p-4", className)}>
      <div className={clsx("flex h-9 w-9 items-center justify-center rounded-xl", tone[accent])}>
        <Icon size={18} />
      </div>
      <div className="mt-3 stat-num truncate text-[26px] font-semibold leading-none text-ink">{value}</div>
      <div className="mt-1.5 text-sm text-ink-soft">{label}</div>
      {sub && <div className="mt-0.5 truncate text-xs text-ink-faint">{sub}</div>}
    </div>
  );
}
