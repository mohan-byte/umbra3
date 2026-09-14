// Relative time helper.
export function timeAgo(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime();
  if (diff < 0) return "just now";
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(months / 12)}y ago`;
}

// ── Taxonomy: labels + colors ──────────────────────────────────────────────
export const severityMeta = {
  critical: { label: "Critical", color: "text-sev-critical", bg: "bg-sev-critical/12", dot: "bg-sev-critical" },
  high: { label: "High", color: "text-sev-high", bg: "bg-sev-high/12", dot: "bg-sev-high" },
  medium: { label: "Medium", color: "text-sev-medium", bg: "bg-sev-medium/12", dot: "bg-sev-medium" },
  low: { label: "Low", color: "text-sev-low", bg: "bg-sev-low/12", dot: "bg-sev-low" },
  info: { label: "Info", color: "text-sev-info", bg: "bg-sev-info/12", dot: "bg-sev-info" },
};

export const severityRank = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
