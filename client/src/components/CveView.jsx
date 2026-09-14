import { useMemo, useState } from "react";
import clsx from "clsx";
import { Search, Loader2, Bug, ExternalLink } from "lucide-react";
import { SeverityBadge } from "./ui/SeverityBadge.jsx";
import { severityRank } from "../lib/format.js";

const SEVS = ["all", "critical", "high", "medium", "low"];

export function CveView({ recent }) {
  const [items, setItems] = useState(recent);
  const [q, setQ] = useState("");
  const [sev, setSev] = useState("all");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("recent");

  const search = async (term) => {
    const clean = term.trim();
    if (!clean) { setItems(recent); setMode("recent"); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/cve?q=${encodeURIComponent(clean)}`);
      const data = await res.json();
      setItems(data.items ?? []);
      setMode("search");
    } finally { setLoading(false); }
  };

  const rows = useMemo(
    () => items
      .filter((c) => (sev === "all" ? true : c.severity === sev))
      .sort((a, b) => severityRank[b.severity] - severityRank[a.severity] || (b.cvss ?? 0) - (a.cvss ?? 0)),
    [items, sev],
  );

  return (
    <div className="space-y-4">
      <form onSubmit={(e) => { e.preventDefault(); search(q); }} className="panel flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search product, vendor or CVE id — e.g. openssl, fortinet, CVE-2024-3094"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/25"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
          {SEVS.map((s) => (
            <button key={s} type="button" onClick={() => setSev(s)} className={clsx("rounded-lg px-2.5 py-1 text-xs font-medium capitalize", sev === s ? "bg-brand/20 text-ink" : "text-ink-faint hover:text-ink-soft")}>{s}</button>
          ))}
        </div>
        <button type="submit" disabled={loading} className="btn-primary sm:w-28">
          {loading ? <Loader2 size={15} className="animate-spin" /> : "Search"}
        </button>
      </form>

      <div className="text-xs text-ink-faint">
        {mode === "recent" ? "Recently published CVEs (last 8 days), highest severity first" : `${rows.length} result(s)`}
      </div>

      {rows.length === 0 ? (
        <div className="panel flex flex-col items-center gap-2 p-10 text-center text-sm text-ink-faint">
          <Bug size={26} /> No CVEs to show. Try a product name or a CVE id.
        </div>
      ) : (
        <div className="space-y-2.5">
          {rows.map((c) => (
            <div key={c.id} className="panel panel-hover p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <a href={`https://nvd.nist.gov/vuln/detail/${c.id}`} target="_blank" rel="noreferrer" className="mono text-sm font-semibold text-ink hover:text-brand-soft">{c.id}</a>
                  <SeverityBadge severity={c.severity} />
                  {c.cvss != null && <span className="chip bg-white/[0.05] text-ink-soft">CVSS {c.cvss.toFixed(1)}</span>}
                  {c.cwe && <span className="chip bg-white/[0.05] text-ink-faint">{c.cwe}</span>}
                </div>
                <div className="text-xs text-ink-faint">{c.published ? new Date(c.published).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : ""}</div>
              </div>
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-ink-soft">{c.description}</p>
              {c.refs.length > 0 && (
                <a href={c.refs[0]} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-brand-soft hover:text-brand">
                  <ExternalLink size={11} /> reference
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
