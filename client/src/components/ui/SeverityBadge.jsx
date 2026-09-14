import clsx from "clsx";
import { severityMeta } from "../../lib/format.js";

export function SeverityBadge({ severity, className }) {
  const m = severityMeta[severity];
  return (
    <span className={clsx("chip", m.bg, m.color, className)}>
      <span className={clsx("h-1.5 w-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}
