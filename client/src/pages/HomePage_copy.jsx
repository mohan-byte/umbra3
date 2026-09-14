import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldHalf, ArrowRight, Radar, Skull, Bug, Crosshair, Fingerprint, Network,
  Check, Menu, X, Activity, Github, Database,
} from "lucide-react";

const FEATURES = [
  { icon: Radar, title: "Domain Scan", desc: "Run a live exposure scan on any domain — breach records, leaked credentials, attack surface and code exposure, aggregated in seconds." },
  { icon: Skull, title: "Dark Web Radar", desc: "Search real ransomware leak-site postings across 396+ groups' .onion blogs, surfaced over a safe clearnet feed — no Tor required." },
  { icon: Bug, title: "CVE Intelligence", desc: "Track newly published vulnerabilities from the National Vulnerability Database and search by product, vendor, or CVE id." },
  { icon: Fingerprint, title: "Fresh Stealer Intel", desc: "See which employees and users have credentials circulating in active infostealer logs — with recency, not just historical dumps." },
  { icon: Crosshair, title: "Continuous Watchlist", desc: "Monitor your organization's domains around the clock. Every scan is saved to your account so you can track exposure over time." },
  { icon: Network, title: "Attack Surface Mapping", desc: "Discover subdomains via certificate transparency logs and public code repositories that reference your domain." },
];

const SOURCES = [
  { icon: Database, name: "HIBP" },
  { icon: ShieldHalf, name: "NVD" },
  { icon: Skull, name: "ransomware.live" },
  { icon: Network, name: "crt.sh" },
  { icon: Github, name: "GitHub" },
  { icon: Fingerprint, name: "Hudson Rock" },
];

const STEPS = [
  { n: "01", title: "Create your workspace", desc: "Sign up in under a minute — no credit card required to start scanning." },
  { n: "02", title: "Add your domains", desc: "Watch as many domains as you need. Umbra scans each one immediately and re-checks it on demand." },
  { n: "03", title: "Act on real findings", desc: "See exactly what's exposed — breaches, leaked credentials, dark-web listings — and remediate before attackers do." },
];

const PLANS = [
  { name: "Starter", price: "$299", per: "/mo", features: ["3 domains", "Breach + credential monitoring", "Weekly reports", "Email alerts"] },
  { name: "Business", price: "$999", per: "/mo", highlight: true, features: ["25 domains", "Dark-web + ransomware monitoring", "CVE + attack-surface intel", "Slack + webhook alerts", "API access"] },
  { name: "Enterprise", price: "Custom", per: "", features: ["Unlimited domains", "Takedown & remediation", "Dedicated analyst", "SSO + SIEM/SOAR", "Paid dark-web feeds included"] },
];

function fmt(n) {
  return typeof n === "number" ? n.toLocaleString("en-US") : n;
}

export function HomePage() {
  const [stats, setStats] = useState({ totalGroups: 0, recentCount: 0, last7d: 0 });
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/darkweb/global")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setStats({ totalGroups: d.totalGroups ?? 0, recentCount: d.stats?.recentCount ?? 0, last7d: d.stats?.last7d ?? 0 });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="umbra-bg min-h-screen text-ink">
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-base-970/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
          <img src="/images/cvehouse.png" alt="Umbra" className="w-[70px] h-auto object-contain"/>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-ink-soft md:flex">
            <a href="#features" className="hover:text-ink">Features</a>
            <a href="#sources" className="hover:text-ink">Data sources</a>
            <a href="#pricing" className="hover:text-ink">Pricing</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login" className="btn-ghost">Sign in</Link>
            <Link to="/signup" className="btn-primary">Get started free</Link>
          </div>

          <button className="text-ink-soft md:hidden" onClick={() => setNavOpen((o) => !o)}>
            {navOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {navOpen && (
          <div className="border-t border-white/[0.06] px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-3 text-sm text-ink-soft">
              <a href="#features" onClick={() => setNavOpen(false)}>Features</a>
              <a href="#sources" onClick={() => setNavOpen(false)}>Data sources</a>
              <a href="#pricing" onClick={() => setNavOpen(false)}>Pricing</a>
              <div className="mt-2 flex flex-col gap-2">
                <Link to="/login" className="btn-ghost w-full" onClick={() => setNavOpen(false)}>Sign in</Link>
                <Link to="/signup" className="btn-primary w-full" onClick={() => setNavOpen(false)}>Get started free</Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 text-center lg:px-8 lg:pt-24">
        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs text-ink-soft">
          <Activity size={12} className="text-ok" /> Live dark-web feed · updated continuously
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          Know what the <span className="gradient-text">dark web knows</span> about your company.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
          Umbra continuously scans breach dumps, infostealer logs, ransomware leak sites and public
          code for your domain's fingerprints — and tells you exactly what's exposed, before
          attackers act on it.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/signup" className="btn-primary px-6 py-3 text-[15px]">
            Get started free <ArrowRight size={17} />
          </Link>
          <Link to="/login" className="btn-ghost px-6 py-3 text-[15px]">Sign in</Link>
        </div>
        <p className="mt-3 text-xs text-ink-faint">No credit card required · scan your first domain in under a minute</p>

        {/* live stats strip */}
        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-4">
          <StatTile value={fmt(stats.totalGroups)} label="Ransomware groups tracked" />
          <StatTile value={fmt(stats.recentCount)} label="Recent leak-site victims" />
          <StatTile value={fmt(stats.last7d)} label="New in the last 7 days" />
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Everything you need to see your exposure</h2>
          <p className="mt-2 text-sm text-ink-faint">One workspace for breach, dark-web, vulnerability and attack-surface intelligence.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="panel panel-hover p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/[0.14] text-brand-soft">
                <Icon size={19} />
              </div>
              <div className="mt-3.5 text-sm font-semibold text-ink">{title}</div>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-faint">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] bg-white/[0.015]">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Up and running in three steps</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="relative">
                <div className="mono text-3xl font-bold text-brand/40">{s.n}</div>
                <div className="mt-2 text-sm font-semibold text-ink">{s.title}</div>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-faint">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sources ─────────────────────────────────────────────────────── */}
      <section id="sources" className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Built on real intelligence sources</h2>
          <p className="mt-2 text-sm text-ink-faint">No synthetic data. Every result traces back to a live, public source.</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SOURCES.map(({ icon: Icon, name }) => (
            <div key={name} className="panel flex flex-col items-center gap-2 p-4 text-center">
              <Icon size={20} className="text-ink-soft" />
              <span className="text-xs font-medium text-ink-soft">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="border-t border-white/[0.06] bg-white/[0.015]">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Simple, transparent pricing</h2>
            <p className="mt-2 text-sm text-ink-faint">Start free, upgrade as your monitoring needs grow.</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {PLANS.map((p) => (
              <div key={p.name} className={`panel flex flex-col p-6 ${p.highlight ? "border-brand/50 shadow-glow" : ""}`}>
                {p.highlight && <span className="chip mb-3 w-fit bg-brand/[0.15] text-brand-soft">Most popular</span>}
                <div className="text-sm font-semibold text-ink">{p.name}</div>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-3xl font-bold text-ink">{p.price}</span>
                  <span className="mb-1 text-xs text-ink-faint">{p.per}</span>
                </div>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-ink-soft"><Check size={14} className="mt-0.5 shrink-0 text-ok" /> {f}</li>
                  ))}
                </ul>
                <Link to="/signup" className={`mt-6 w-full text-center ${p.highlight ? "btn-primary" : "btn-ghost"}`}>Get started</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Find out what's exposed before attackers do.</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-faint">Create your workspace and run your first live scan in under a minute.</p>
        <Link to="/signup" className="btn-primary mx-auto mt-6 w-fit px-6 py-3 text-[15px]">
          Get started free <ArrowRight size={17} />
        </Link>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] px-4 py-8 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2 text-xs text-ink-faint">
            <ShieldHalf size={14} className="text-brand-soft" /> © 2026 CVE House · Umbra Dark Web Threat Intelligence
          </div>
          <div className="flex items-center gap-5 text-xs text-ink-faint">
            <Link to="/login" className="hover:text-ink-soft">Sign in</Link>
            <Link to="/signup" className="hover:text-ink-soft">Get started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatTile({ value, label }) {
  return (
    <div className="panel p-4">
      <div className="stat-num text-2xl font-bold text-ink sm:text-3xl">{value}</div>
      <div className="mt-1 text-[11px] leading-tight text-ink-faint">{label}</div>
    </div>
  );
}
