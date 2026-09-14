import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { Plus, Loader2, Trash2, RefreshCw, Crosshair, Skull, KeyRound, Database, ArrowRight } from "lucide-react";
import { apiFetch } from "../lib/api.js";

const STARTER_DOMAINS = ["adobe.com", "dropbox.com"];

const bandCls = {
  severe: "text-sev-critical bg-sev-critical/[0.12]",
  elevated: "text-sev-high bg-sev-high/[0.12]",
  guarded: "text-sev-medium bg-sev-medium/[0.12]",
  low: "text-ok bg-ok/[0.12]",
};

export function WatchlistPanel() {
  const [rows, setRows] = useState([]);
  const [input, setInput] = useState("");
  const [ready, setReady] = useState(false);
  const seeded = useRef(false);

  const load = useCallback(async () => {
    const res = await apiFetch("/api/watchlist");
    const data = await res.json();
    setRows(
      (data.domains || []).map((d) => ({
        domain: d.domain,
        loading: !d.scan,
        scan: d.scan || undefined,
      })),
    );
    return data.domains || [];
  }, []);

  const addDomain = useCallback(async (domain) => {
    setRows((prev) => {
      if (prev.some((r) => r.domain === domain)) return prev;
      return [{ domain, loading: true }, ...prev];
    });
    try {
      const res = await apiFetch("/api/watchlist", { method: "POST", body: { domain } });
      const data = await res.json();
      setRows((prev) =>
        prev.map((r) => (r.domain === domain ? { ...r, loading: false, scan: data.scan, error: data.error } : r)),
      );
    } catch (e) {
      setRows((prev) => prev.map((r) => (r.domain === domain ? { ...r, loading: false, error: "failed to add" } : r)));
    }
  }, []);

  const rescan = useCallback(async (domain) => {
    setRows((prev) => prev.map((r) => (r.domain === domain ? { ...r, loading: true, error: undefined } : r)));
    try {
      const res = await apiFetch(`/api/watchlist/${encodeURIComponent(domain)}/rescan`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "scan failed");
      setRows((prev) => prev.map((r) => (r.domain === domain ? { ...r, loading: false, scan: data.scan } : r)));
    } catch (e) {
      setRows((prev) => prev.map((r) => (r.domain === domain ? { ...r, loading: false, error: e.message } : r)));
    }
  }, []);

  const remove = useCallback(async (domain) => {
    setRows((prev) => prev.filter((r) => r.domain !== domain));
    await apiFetch(`/api/watchlist/${encodeURIComponent(domain)}`, { method: "DELETE" });
  }, []);

  // On first load, fetch persisted watchlist; if empty, seed with starter
  // domains (mirrors the original demo's localStorage default).
  useEffect(() => {
    (async () => {
      const existing = await load();
      setReady(true);
      if (existing.length === 0 && !seeded.current) {
        seeded.current = true;
        STARTER_DOMAINS.forEach((d) => addDomain(d));
      } else {
        existing.filter((d) => !d.scan).forEach((d) => rescan(d.domain));
      }
    })();
  }, [load, addDomain, rescan]);

  const add = () => {
    const d = input.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
    if (!d || rows.some((r) => r.domain === d)) { setInput(""); return; }
    setInput("");
    addDomain(d);
  };

  return (
    <div className="space-y-4">
      <div className="panel flex flex-col gap-2 p-3.5 sm:flex-row">
        <input
          value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a domain to monitor — e.g. yourcompany.com"
          className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/25"
        />
        <button onClick={add} className="btn-primary"><Plus size={15} /> Add to watchlist</button>
      </div>

      {ready && rows.length === 0 && (
        <div className="panel flex flex-col items-center gap-2 p-10 text-center text-sm text-ink-faint">
          <Crosshair size={26} /> No domains monitored yet. Add one above.
        </div>
      )}

      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.domain} className="panel panel-hover p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/[0.12] text-brand-soft"><Crosshair size={18} /></div>
                <div>
                  <div className="mono text-sm font-semibold text-ink">{r.domain}</div>
                  {r.loading ? (
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-faint"><Loader2 size={11} className="animate-spin" /> scanning…</div>
                  ) : r.error ? (
                    <div className="mt-0.5 text-xs text-sev-medium">{r.error}</div>
                  ) : r.scan ? (
                    <div className="mt-0.5 text-xs text-ink-faint">risk score {r.scan.summary.riskScore}/100</div>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {r.scan && !r.loading && (
                  <>
                    <span className={clsx("chip font-semibold capitalize", bandCls[r.scan.summary.riskBand])}>{r.scan.summary.riskBand}</span>
                    <Metric icon={KeyRound} value={r.scan.summary.credentialRecords} tone="text-sev-critical" title="leaked records" />
                    <Metric icon={Skull} value={r.scan.summary.ransomwareHits} tone={r.scan.summary.darkWebListed ? "text-sev-critical" : "text-ink-faint"} title="dark-web listings" />
                    <Metric icon={Database} value={r.scan.summary.totalBreaches} tone="text-sev-high" title="breaches" />
                  </>
                )}
                <button onClick={() => rescan(r.domain)} className="text-ink-faint hover:text-ink" title="Re-scan"><RefreshCw size={15} /></button>
                <Link to={`/scan?domain=${encodeURIComponent(r.domain)}`} className="text-ink-faint hover:text-brand-soft" title="Full report"><ArrowRight size={16} /></Link>
                <button onClick={() => remove(r.domain)} className="text-ink-faint hover:text-sev-critical" title="Remove"><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-ink-faint">Watchlist and scan history are stored in Postgres via Prisma. In production this is per-organization with scheduled re-scans and alerting when new exposure appears.</p>
    </div>
  );
}

function Metric({ icon: Icon, value, tone, title }) {
  return (
    <span className="hidden items-center gap-1 text-xs sm:flex" title={title}>
      <Icon size={13} className={tone} /> <span className="stat-num text-ink">{value.toLocaleString()}</span>
    </span>
  );
}
