import { useMemo, useState } from "react";
import clsx from "clsx";
import { Search, Loader2, Skull } from "lucide-react";
import { VictimCard } from "./VictimCard.jsx";

export function RadarFeed({ initialVictims, groups }) {
  const [victims, setVictims] = useState(initialVictims);
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("all");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const runSearch = async (term) => {
    const clean = term.trim();
    if (!clean) { setVictims(initialVictims); setSearched(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/darkweb/search?q=${encodeURIComponent(clean)}`);
      const data = await res.json();
      setVictims(data.victims ?? []);
      setSearched(true);
    } finally { setLoading(false); }
  };

  const filtered = useMemo(
    () => (group === "all" ? victims : victims.filter((v) => v.group === group)),
    [victims, group],
  );

  return (
    <div className="space-y-4">
      <form onSubmit={(e) => { e.preventDefault(); runSearch(q); }} className="panel flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search leak-site victims — company, sector, domain…"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/25"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary sm:w-32">
          {loading ? <Loader2 size={15} className="animate-spin" /> : "Search"}
        </button>
      </form>

      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => setGroup("all")} className={clsx("chip border", group === "all" ? "border-brand/50 bg-brand/[0.15] text-ink" : "border-white/[0.08] bg-white/[0.03] text-ink-soft hover:border-white/[0.16]")}>
          All groups
        </button>
        {groups.slice(0, 10).map((g) => (
          <button key={g} onClick={() => setGroup(g)} className={clsx("chip border", group === g ? "border-sev-critical/50 bg-sev-critical/[0.14] text-sev-critical" : "border-white/[0.08] bg-white/[0.03] text-ink-soft hover:border-white/[0.16]")}>
            {g}
          </button>
        ))}
      </div>

      <div className="text-xs text-ink-faint">
        {searched ? `${filtered.length} match(es)` : `${filtered.length} recent victims`}{group !== "all" ? ` · ${group}` : ""}
      </div>

      {filtered.length === 0 ? (
        <div className="panel flex flex-col items-center gap-2 p-10 text-center text-sm text-ink-faint">
          <Skull size={26} className="text-ink-faint" /> No leak-site victims match that query.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((v, i) => <VictimCard key={i} v={v} />)}
        </div>
      )}
    </div>
  );
}
