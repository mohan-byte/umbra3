import { useEffect, useState } from "react";
import clsx from "clsx";
import { Check, Plug, CircleCheck, KeyRound, Lock } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader.jsx";

const stateMeta = {
  live: { label: "Live · keyless", cls: "bg-ok/[0.12] text-ok" },
  keyed: { label: "Live · key set", cls: "bg-ok/[0.12] text-ok" },
  "keyless-optional": { label: "Active · key optional", cls: "bg-sev-medium/[0.12] text-sev-medium" },
  paid: { label: "Add paid key to enrich", cls: "bg-white/[0.05] text-ink-faint" },
};

const PLANS = [
  { name: "Starter", price: "$299", per: "/mo", features: ["3 domains", "Breach + credential monitoring", "Weekly reports", "Email alerts"], cta: "Downgrade" },
  { name: "Business", price: "$999", per: "/mo", current: true, features: ["25 assets", "Dark-web + ransomware monitoring", "CVE + attack-surface intel", "Slack + webhook alerts", "API access"], cta: "Current plan" },
  { name: "Enterprise", price: "Custom", per: "", features: ["Unlimited assets", "Takedown & remediation", "Dedicated analyst", "SIEM / SOAR + SSO", "Paid dark-web feeds included"], cta: "Contact sales" },
];

export function SettingsPage() {
  // The env-derived "keyed" state lives on the server (Vite can't read
  // process.env for arbitrary secrets), so we fetch it once on mount.
  const [envFlags, setEnvFlags] = useState({ NVD_API_KEY: false, GITHUB_TOKEN: false, THREATFOX_API_KEY: false, DEHASHED_API_KEY: false, INTELX_API_KEY: false });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings/sources")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data && !cancelled) setEnvFlags(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const srcs = [
    { name: "Hudson Rock", role: "Fresh infostealer exposure (counts, families, recency)", state: "live" },
    { name: "COMB (ProxyNova)", role: "Actual leaked credential records (historical)", state: "live" },
    { name: "HIBP breach catalog", role: "Known breaches per domain", state: "live" },
    { name: "XposedOrNot", role: "Breach analytics & exposed data types", state: "live" },
    { name: "LeakCheck (public)", role: "Aggregate leak / stealer counts", state: "live" },
    { name: "ransomware.live", role: "Dark-web ransomware leak sites", state: "live" },
    { name: "crt.sh", role: "Attack surface (subdomains)", state: "live" },
    { name: "NVD", role: "CVE / vulnerability feed", state: envFlags.NVD_API_KEY ? "keyed" : "live" },
    { name: "GitHub", role: "Public code exposure" + (envFlags.GITHUB_TOKEN ? " + secret scanning" : ""), state: envFlags.GITHUB_TOKEN ? "keyed" : "keyless-optional" },
    { name: "abuse.ch ThreatFox", role: "Malware IOC feed", state: envFlags.THREATFOX_API_KEY ? "keyed" : "keyless-optional" },
    { name: "DeHashed", role: "Per-record credentials & PII (paid)", state: envFlags.DEHASHED_API_KEY ? "keyed" : "paid" },
    { name: "Intelligence X", role: "Deep dark-web / forum / paste (paid)", state: envFlags.INTELX_API_KEY ? "keyed" : "paid" },
  ];
  const liveCount = srcs.filter((s) => s.state === "live" || s.state === "keyed").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Data sources, integrations and subscription" />

      <div className="panel p-5">
        <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-ink">
          <Plug size={16} className="text-brand-soft" /> Intelligence sources
          <span className="chip bg-ok/[0.12] text-ok">{liveCount} live</span>
        </div>
        <p className="mb-4 text-xs text-ink-faint">
          Umbra runs on {liveCount} free, keyless live sources out of the box. Add optional keys in{" "}
          <span className="mono text-ink-soft">server/.env</span> to unlock higher limits, secret scanning and paid per-record feeds.
        </p>
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          {srcs.map((s) => {
            const m = stateMeta[s.state];
            const live = s.state === "live" || s.state === "keyed";
            return (
              <div key={s.name} className="flex items-start justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                <div className="flex items-start gap-2.5">
                  {live ? <CircleCheck size={16} className="mt-0.5 text-ok" /> : s.state === "paid" ? <Lock size={15} className="mt-0.5 text-ink-faint" /> : <KeyRound size={15} className="mt-0.5 text-sev-medium" />}
                  <div>
                    <div className="text-sm font-medium text-ink">{s.name}</div>
                    <div className="text-xs text-ink-faint">{s.role}</div>
                  </div>
                </div>
                <span className={clsx("chip shrink-0", m.cls)}>{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-3 text-sm font-semibold text-ink">Subscription</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.name} className={clsx("panel flex flex-col p-5", p.current && "border-brand/50 shadow-glow")}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-ink">{p.name}</div>
                {p.current && <span className="chip bg-brand/[0.15] text-brand-soft">Active</span>}
              </div>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-2xl font-bold text-ink">{p.price}</span>
                <span className="mb-1 text-xs text-ink-faint">{p.per}</span>
              </div>
              <ul className="mt-4 flex-1 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-ink-soft"><Check size={14} className="mt-0.5 shrink-0 text-ok" /> {f}</li>
                ))}
              </ul>
              <button disabled={p.current} className={clsx("mt-4 w-full", p.current ? "btn-ghost cursor-default" : "btn-primary")}>{p.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
