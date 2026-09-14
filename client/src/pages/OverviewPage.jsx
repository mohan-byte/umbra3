import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Skull, Radio, Users, ArrowRight, Activity, Radar, TrendingUp, Building2, Globe } from "lucide-react";
import { MetricTile } from "../components/ui/MetricTile.jsx";
import { TrendChart } from "../components/charts/TrendChart.jsx";
import { VictimCard } from "../components/VictimCard.jsx";

const EMPTY = {
  ok: true,
  totalGroups: 0,
  victims: [],
  stats: { recentCount: 0, last7d: 0, topGroups: [], topCountries: [], topSectors: [], timeline: [] },
};

export function OverviewPage() {
  const [dw, setDw] = useState(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/darkweb/global")
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setDw(data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const { stats } = dw;
  const maxGroup = Math.max(1, ...stats.topGroups.map((g) => g.count));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-ink-faint">
            <Activity size={13} className="text-ok" /> Live cyber threat intelligence · dark-web feed online
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight">
            <span className="gradient-text">Threat Overview</span>
          </h1>
          <p className="mt-1 text-sm text-ink-faint">Global dark-web &amp; ransomware activity, updated continuously from live sources.</p>
        </div>
        <Link to="/scan" className="btn-primary"><Radar size={16} /> Scan a domain</Link>
      </div>

      {!loading && !dw.ok && (
        <div className="panel p-4 text-sm text-sev-medium">Live feed temporarily unavailable — retrying shortly.</div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile icon={Skull} accent="critical" value={stats.recentCount} label="Recent victims" sub="latest leak-site postings" />
        <MetricTile icon={TrendingUp} accent="high" value={stats.last7d} label="New this week" sub="added in last 7 days" />
        <MetricTile icon={Users} accent="brand" value={dw.totalGroups} label="Ransomware groups" sub="tracked across .onion blogs" />
        <MetricTile icon={Radio} accent="cyan" value={stats.topSectors[0]?.name ?? "—"} label="Top targeted sector" sub={`${stats.topSectors[0]?.count ?? 0} recent victims`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="panel p-5 lg:col-span-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-ink">Ransomware activity</div>
              <div className="text-xs text-ink-faint">New leak-site victims per day</div>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-ink-soft"><span className="h-2 w-2 rounded-full bg-brand" /> Victims</span>
          </div>
          <TrendChart data={stats.timeline} label="Victims" color="#7c5cff" />
        </div>

        <div className="panel p-5 lg:col-span-4">
          <div className="mb-4 text-sm font-semibold text-ink">Most active groups</div>
          <div className="space-y-2.5">
            {stats.topGroups.map((g) => (
              <div key={g.name} className="flex items-center gap-3">
                <div className="w-24 shrink-0 truncate text-xs font-medium text-ink-soft">{g.name}</div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                  <div className="h-full rounded-full bg-gradient-to-r from-sev-critical/60 to-sev-critical" style={{ width: `${(g.count / maxGroup) * 100}%` }} />
                </div>
                <div className="stat-num w-6 shrink-0 text-right text-xs text-ink">{g.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Skull size={16} className="text-sev-critical" /> Latest dark-web victims
          </div>
          <Link to="/radar" className="flex items-center gap-1 text-xs font-medium text-brand-soft hover:text-brand">
            Open Dark Web Radar <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {dw.victims.slice(0, 9).map((v, i) => <VictimCard key={i} v={v} />)}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="panel p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink"><Globe size={15} className="text-cyan" /> Top targeted countries</div>
          <div className="flex flex-wrap gap-1.5">
            {stats.topCountries.map((c) => (
              <span key={c.name} className="chip bg-white/[0.05] text-ink-soft">{c.name} <span className="mono ml-1 text-ink-faint">{c.count}</span></span>
            ))}
          </div>
        </div>
        <div className="panel p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink"><Building2 size={15} className="text-brand-soft" /> Top targeted sectors</div>
          <div className="flex flex-wrap gap-1.5">
            {stats.topSectors.map((c) => (
              <span key={c.name} className="chip bg-white/[0.05] text-ink-soft">{c.name} <span className="mono ml-1 text-ink-faint">{c.count}</span></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
