import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import {
  Search, Loader2, ShieldAlert, Database, KeyRound, Skull, Network, Github,
  CheckCircle2, XCircle, Info, Radar, Eye, EyeOff, Download, RefreshCw, ChevronDown,
  Fingerprint, Clock, Users, Cpu,
} from "lucide-react";
import { RiskGauge } from "./ui/RiskGauge.jsx";
import { MetricTile } from "./ui/MetricTile.jsx";
import { VictimCard } from "./VictimCard.jsx";
import { apiFetch } from "../lib/api.js";

const fmt = (n) => n.toLocaleString("en-US");
function fdate(s) {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
const maskPw = (p) => (!p ? "—" : p.length <= 2 ? "••" : p.slice(0, 1) + "•".repeat(Math.min(10, p.length - 1)));

export function ScanView({ initialDomain = "" }) {
  const [domain, setDomain] = useState(initialDomain);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const run = useCallback(async (d) => {
    const clean = d.trim();
    if (!clean) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await apiFetch(`/api/scan?domain=${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan failed");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scan failed");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (initialDomain) run(initialDomain); }, [initialDomain, run]);

  return (
    <div className="space-y-6">
      <form onSubmit={(e) => { e.preventDefault(); run(domain); }} className="panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-faint" />
          <input
            value={domain} onChange={(e) => setDomain(e.target.value)} autoFocus
            placeholder="Enter any domain — e.g. adobe.com, yourcompany.com"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3.5 pl-12 pr-3 text-[15px] text-ink placeholder:text-ink-faint focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/25"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary py-3.5 sm:w-44">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Scanning…</> : <><Radar size={16} /> Run scan</>}
        </button>
      </form>

      {loading && <ScanSkeleton domain={domain} />}

      {error && (
        <div className="panel flex items-center gap-2 border-sev-critical/40 p-4 text-sm text-sev-critical">
          <XCircle size={16} /> {error}
        </div>
      )}

      {result && !loading && <Results result={result} onRescan={() => run(result.domain)} />}

      {!result && !loading && !error && (
        <div className="panel p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/[0.12] text-brand-soft">
            <Radar size={26} />
          </div>
          <div className="mt-4 text-base font-semibold text-ink">Live cyber threat intelligence scan</div>
          <p className="mx-auto mt-1.5 max-w-lg text-sm text-ink-faint">
            Aggregates real breach records, dark-web ransomware listings, leaked credentials, attack
            surface and public code exposure — from free public sources, no API key required.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-ink-faint">
            {["adobe.com", "dropbox.com", "canva.com", "tesla.com"].map((d) => (
              <button key={d} onClick={() => { setDomain(d); run(d); }} className="chip border border-white/[0.08] bg-white/[0.03] text-ink-soft hover:border-brand/50">{d}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Results({ result, onRescan }) {
  const s = result.summary;
  const bandColor = { severe: "text-sev-critical", elevated: "text-sev-high", guarded: "text-sev-medium", low: "text-ok" }[s.riskBand];

  return (
    <div className="space-y-5 animate-fadeup">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-ink-faint">Exposure report</div>
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            <span className="mono">{result.domain}</span>
            <span className={clsx("ml-3 text-base font-semibold capitalize", bandColor)}>{s.riskBand} risk</span>
          </h2>
        </div>
        <button onClick={onRescan} className="btn-ghost"><RefreshCw size={14} /> Re-scan</button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {result.sources.map((src) => (
          <span key={src.id} className={clsx("chip", src.ok ? "bg-ok/[0.12] text-ok" : "bg-white/[0.05] text-ink-faint")} title={src.note}>
            {src.ok ? <CheckCircle2 size={12} /> : <XCircle size={12} />} {src.name}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="panel flex flex-col justify-center p-5 lg:col-span-4">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium text-ink">
            <ShieldAlert size={16} className="text-sev-high" /> Exposure risk score
          </div>
          <RiskGauge score={s.riskScore} />
          <p className="mt-2 text-center text-xs text-ink-faint">Weighted across breaches, dark-web listings, leaked records, stealer logs & recency.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:col-span-8 xl:grid-cols-3">
          <MetricTile icon={Fingerprint} accent="critical" value={fmt(s.stealerEmployees)} label="Employees in stealer logs" sub={s.lastCompromised ? `latest ${fdate(s.lastCompromised)} · fresh` : "fresh infostealer data"} />
          <MetricTile icon={Skull} accent={s.darkWebListed ? "critical" : "ok"} value={fmt(s.ransomwareHits)} label="Dark-web listings" sub="ransomware leak sites" />
          <MetricTile icon={KeyRound} accent="high" value={fmt(s.credentialRecords)} label="Leaked records" sub="COMB · historical" />
          <MetricTile icon={Database} accent="high" value={fmt(s.totalBreaches)} label="Known breaches" sub={`${fmt(s.totalAccounts)} accounts`} />
          <MetricTile icon={Network} accent="cyan" value={fmt(s.subdomainCount)} label="Subdomains" sub="attack surface" />
          <MetricTile icon={Github} accent="brand" value={fmt(s.repoCount)} label="Public repos" sub="code exposure" />
        </div>
      </div>

      {result.notes.map((n, i) => (
        <div key={i} className={clsx("panel flex items-start gap-2.5 p-4 text-xs leading-relaxed", n.startsWith("⚠") ? "border-sev-critical/30 text-ink-soft" : "border-brand/25 text-ink-soft")}>
          <Info size={15} className="mt-0.5 shrink-0 text-brand-soft" /> {n.replace(/^⚠\s*/, "")}
        </div>
      ))}

      {result.stealerIntel.ok && (result.stealerIntel.employees > 0 || result.stealerIntel.totalStealers > 0) && (
        <StealerSection intel={result.stealerIntel} />
      )}

      {result.credentials.length > 0 && <RecordsSection result={result} />}

      {result.ransomware.length > 0 && (
        <Section title="Dark Web — Ransomware Exposure" count={result.ransomware.length} icon={Skull} tone="text-sev-critical">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {result.ransomware.map((v, i) => <VictimCard key={i} v={v} />)}
          </div>
        </Section>
      )}

      {result.breaches.length > 0 && (
        <Section title="Breaches" count={result.breaches.length} icon={Database} tone="text-sev-high">
          <div className="space-y-3">
            {result.breaches.map((b) => (
              <div key={b.name} className="panel p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-ink">{b.title}</span>
                    {b.verified && <span className="chip bg-ok/[0.12] text-ok">verified</span>}
                    {b.sensitive && <span className="chip bg-sev-high/[0.12] text-sev-high">sensitive</span>}
                    <span className="chip bg-white/[0.05] text-ink-faint">{b.source}</span>
                  </div>
                  <div className="text-xs text-ink-faint">{fdate(b.breachDate)}{b.accounts ? ` · ${fmt(b.accounts)} accounts` : ""}</div>
                </div>
                {b.description && <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-ink-soft">{b.description}</p>}
                {b.dataClasses.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {b.dataClasses.map((d) => (
                      <span key={d} className={clsx("chip", /password/i.test(d) ? "bg-sev-critical/[0.12] text-sev-critical" : "bg-white/[0.05] text-ink-faint")}>{d}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {result.subdomains.length > 0 && <SubdomainSection subs={result.subdomains} />}

      {result.repos.length > 0 && (
        <Section title="Public Code Exposure" count={result.repos.length} icon={Github} tone="text-brand-soft">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {result.repos.map((r) => (
              <a key={r.fullName} href={r.url} target="_blank" rel="noreferrer" className="panel panel-hover p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="mono truncate text-sm text-ink">{r.fullName}</span>
                  <span className="chip shrink-0 bg-white/[0.05] text-ink-faint">★ {r.stars}</span>
                </div>
                {r.description && <p className="mt-1 line-clamp-2 text-xs text-ink-faint">{r.description}</p>}
              </a>
            ))}
          </div>
        </Section>
      )}

      {s.exposedDataTypes.length > 0 && (
        <Section title="Exposed Data Types" icon={ShieldAlert} tone="text-sev-medium">
          <div className="flex flex-wrap gap-1.5">
            {s.exposedDataTypes.map((t) => (
              <span key={t} className={clsx("chip", /password/i.test(t) ? "bg-sev-critical/[0.12] text-sev-critical" : "bg-white/[0.05] text-ink-soft")}>{t}</span>
            ))}
          </div>
        </Section>
      )}

      <div className="text-[11px] text-ink-faint">
        Sources: COMB (ProxyNova) · HIBP · XposedOrNot · LeakCheck · ransomware.live (dark web) · crt.sh · GitHub. Scanned {new Date(result.scannedAt).toLocaleString()}.
      </div>
    </div>
  );
}

function StealerSection({ intel }) {
  const ps = intel.passwordStrength;
  const psTotal = ps?.total || 0;
  const bars = ps ? [
    { label: "too weak", n: ps.tooWeak, cls: "bg-sev-critical" },
    { label: "weak", n: ps.weak, cls: "bg-sev-high" },
    { label: "medium", n: ps.medium, cls: "bg-sev-medium" },
    { label: "strong", n: ps.strong, cls: "bg-ok" },
  ] : [];

  return (
    <Section
      title="Fresh Stealer-Log Exposure"
      count={intel.employees}
      icon={Fingerprint}
      tone="text-sev-critical"
      actions={intel.lastEmployeeCompromised || intel.lastUserCompromised
        ? <span className="chip bg-sev-critical/[0.14] text-sev-critical"><Clock size={12} /> latest {fdate(intel.lastUserCompromised || intel.lastEmployeeCompromised)}</span>
        : undefined}
    >
      <div className="panel p-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Inline icon={Users} value={fmt(intel.employees)} label="Employees compromised" tone="text-sev-critical" />
          <Inline icon={Users} value={fmt(intel.users)} label="Users compromised" tone="text-sev-high" />
          <Inline icon={Fingerprint} value={fmt(intel.totalStealers)} label="Total stealer records" tone="text-brand-soft" />
          <Inline icon={Network} value={fmt(intel.thirdParties)} label="Third-party exposures" tone="text-cyan" />
        </div>

        {intel.stealerFamilies.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 text-xs font-medium text-ink-soft">Stealer families</div>
            <div className="flex flex-wrap gap-1.5">
              {intel.stealerFamilies.map((f) => (
                <span key={f.name} className="chip bg-white/[0.05] text-ink-soft">{f.name} <span className="mono ml-1 text-ink-faint">{fmt(f.count)}</span></span>
              ))}
            </div>
          </div>
        )}

        {ps && psTotal > 0 && (
          <div className="mt-5">
            <div className="mb-2 text-xs font-medium text-ink-soft">Compromised password strength ({fmt(psTotal)})</div>
            <div className="flex h-2.5 overflow-hidden rounded-full bg-white/[0.05]">
              {bars.map((b) => b.n > 0 && <div key={b.label} className={clsx("h-full", b.cls)} style={{ width: `${(b.n / psTotal) * 100}%` }} title={`${b.label}: ${b.n}`} />)}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-3 text-[11px] text-ink-faint">
              {bars.map((b) => <span key={b.label} className="flex items-center gap-1"><span className={clsx("h-2 w-2 rounded-full", b.cls)} /> {b.label} {b.n}</span>)}
            </div>
          </div>
        )}

        {intel.applications.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-ink-soft"><Cpu size={13} /> Applications with compromised logins</div>
            <div className="flex flex-wrap gap-1.5">
              {intel.applications.map((a) => (
                <span key={a.name} className="chip bg-white/[0.05] text-ink-soft">{a.name}{a.count ? <span className="mono ml-1 text-ink-faint">{fmt(a.count)}</span> : null}</span>
              ))}
            </div>
          </div>
        )}

        <p className="mt-4 border-t border-white/[0.06] pt-3 text-[11px] text-ink-faint">
          Source: Hudson Rock — fresh infostealer intelligence. Free tier shows counts, families & recency; actual credential values require a paid feed (add a key in Settings).
        </p>
      </div>
    </Section>
  );
}

function Inline({ icon: Icon, value, label, tone }) {
  return (
    <div>
      <div className="flex items-center gap-1.5"><Icon size={14} className={tone} /><span className="stat-num text-xl font-semibold text-ink">{value}</span></div>
      <div className="mt-0.5 text-xs text-ink-faint">{label}</div>
    </div>
  );
}

function RecordsSection({ result }) {
  const [reveal, setReveal] = useState(false);
  const withPw = result.credentials.filter((r) => r.hasPassword).length;

  const exportCsv = () => {
    const rows = [["email", "password"], ...result.credentials.map((r) => [r.email, r.password])];
    const csv = rows.map((r) => r.map((c) => `"${(c || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${result.domain}-leaked-records.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Section
      title="Leaked Credential Records · historical"
      count={result.summary.credentialRecords}
      icon={KeyRound}
      tone="text-sev-high"
      actions={
        <div className="flex items-center gap-2">
          <button onClick={() => setReveal((r) => !r)} className={clsx("btn-ghost px-3 py-1.5 text-xs", reveal && "border-brand/50 text-brand-soft")}>
            {reveal ? <><EyeOff size={13} /> Hide passwords</> : <><Eye size={13} /> Reveal passwords</>}
          </button>
          <button onClick={exportCsv} className="btn-ghost px-3 py-1.5 text-xs"><Download size={13} /> CSV</button>
        </div>
      }
    >
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead className="border-b border-white/[0.06] bg-white/[0.02]">
              <tr><th className="th">Email / identity</th><th className="th">Password</th></tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {result.credentials.map((r, i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="td mono text-ink">{r.email}</td>
                  <td className="td">
                    {r.hasPassword
                      ? <span className={clsx("mono", reveal ? "text-sev-critical" : "text-ink-faint")}>{reveal ? r.password : maskPw(r.password)}</span>
                      : <span className="text-ink-faint">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] px-4 py-2.5 text-xs text-ink-faint">
          <span>Showing {result.credentials.length} of {result.summary.credentialRecords.toLocaleString()} records · {withPw} include a password</span>
          <span>Source: COMB historical compilation (largely pre-2022) · for owner remediation</span>
        </div>
      </div>
    </Section>
  );
}

function SubdomainSection({ subs }) {
  const [open, setOpen] = useState(false);
  const shown = open ? subs : subs.slice(0, 12);
  return (
    <Section title="Attack Surface — Subdomains" count={subs.length} icon={Network} tone="text-cyan">
      <div className="panel p-4">
        <div className="flex flex-wrap gap-1.5">
          {shown.map((d) => <span key={d} className="mono chip bg-white/[0.04] text-ink-soft">{d}</span>)}
        </div>
        {subs.length > 12 && (
          <button onClick={() => setOpen((o) => !o)} className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-soft hover:text-brand">
            {open ? "Show less" : `Show all ${subs.length}`} <ChevronDown size={13} className={clsx(open && "rotate-180")} />
          </button>
        )}
      </div>
    </Section>
  );
}

function Section({ title, count, icon: Icon, tone, actions, children }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Icon size={16} className={tone} /> {title}
          {count !== undefined && <span className="chip bg-white/[0.05] text-ink-faint">{count.toLocaleString()}</span>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

function ScanSkeleton({ domain }) {
  return (
    <div className="space-y-4">
      <div className="panel flex items-center gap-3 p-6 text-sm text-ink-soft">
        <Loader2 size={18} className="animate-spin text-brand-soft" />
        Sweeping breach catalogs, COMB records, dark-web ransomware feeds, attack surface & code for <span className="mono text-ink">{domain}</span>…
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
      </div>
    </div>
  );
}
