import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldHalf, ArrowRight, Radar, Skull, Bug, Crosshair, Fingerprint, Network,
  Check, Menu, X, Activity, Github, Database, Users, Building2, Server,
  Lock, Layers, Terminal, CloudCog, GitBranch,
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

// Fictional client roster — original logotypes only (icon + wordmark), no third-party marks.
const CLIENTS = [
  { icon: Server, name: "Northbridge Cloud" },
  { icon: Lock, name: "Vantage Systems" },
  { icon: Layers, name: "Ledger & Point" },
  { icon: Terminal, name: "Circuit Works" },
  { icon: CloudCog, name: "Halden Group" },
  { icon: GitBranch, name: "Meridian Labs" },
];

// Threat nodes plotted on the globe grid (viewBox 0 0 600 600, circle r=230 @ 300,300).
const GLOBE_NODES = [
  { x: 170, y: 190, tone: "brand", delay: "0s", label: "Leak-site posting · Manufacturing" },
  { x: 270, y: 150, tone: "ok", delay: "0.6s", label: "New CVE indexed" },
  { x: 380, y: 185, tone: "brand", delay: "1.2s", label: "Stealer log match · Finance" },
  { x: 430, y: 260, tone: "ok", delay: "1.8s", label: "Domain scan completed" },
  { x: 220, y: 300, tone: "brand", delay: "0.3s", label: "Credential dump indexed" },
  { x: 330, y: 340, tone: "brand", delay: "0.9s", label: "Leak-site posting · Healthcare" },
  { x: 400, y: 320, tone: "ok", delay: "1.5s", label: "Subdomain discovered" },
  { x: 260, y: 410, tone: "brand", delay: "2.1s", label: "Ransomware group activity" },
  { x: 190, y: 400, tone: "ok", delay: "0.45s", label: "Attack surface updated" },
];

const GLOBE_ARCS = [
  "M170,190 Q300,110 380,185",
  "M380,185 Q460,220 430,260",
  "M220,300 Q280,250 330,340",
  "M260,410 Q220,405 190,400",
  "M270,150 Q350,240 400,320",
];

function fmt(n) {
  return typeof n === "number" ? n.toLocaleString("en-US") : n;
}

function GlobeGraphic({ variant = "section", className = "" }) {
  const decorative = variant === "hero";
  return (
    <div className={`relative ${className}`} aria-hidden={decorative}>
      <svg
        viewBox="0 0 600 600"
        className={decorative ? "opacity-[0.22]" : "opacity-100"}
        style={{ width: "100%", height: "auto" }}
      >
        <style>{`
          @keyframes umbraPing {
            0% { r: 4; opacity: 0.9; }
            75% { r: 22; opacity: 0; }
            100% { r: 22; opacity: 0; }
          }
          @keyframes umbraFlow {
            to { stroke-dashoffset: -240; }
          }
          @keyframes umbraSpin {
            to { transform: rotate(360deg); }
          }
          .umbra-globe-grid { animation: umbraSpin 90s linear infinite; transform-origin: 300px 300px; }
          .umbra-arc { stroke-dasharray: 6 10; animation: umbraFlow 6s linear infinite; }
          .umbra-ping { animation: umbraPing 2.8s ease-out infinite; }
        `}</style>

        {/* outer boundary */}
        <circle cx="300" cy="300" r="230" fill="none" className="text-ink-faint" stroke="currentColor" strokeOpacity="0.25" />

        {/* lat/long grid, slow-rotating */}
        <g className="umbra-globe-grid text-ink-faint" stroke="currentColor" strokeOpacity="0.18" fill="none">
          <ellipse cx="300" cy="300" rx="230" ry="230" />
          <ellipse cx="300" cy="300" rx="150" ry="230" />
          <ellipse cx="300" cy="300" rx="60" ry="230" />
          <ellipse cx="300" cy="300" rx="230" ry="150" />
          <ellipse cx="300" cy="300" rx="230" ry="60" />
        </g>

        {/* connecting arcs */}
        <g className="text-brand-soft" stroke="currentColor" strokeOpacity="0.5" fill="none" strokeWidth="1.5">
          {GLOBE_ARCS.map((d, i) => (
            <path key={i} d={d} className="umbra-arc" />
          ))}
        </g>

        {/* threat / activity nodes */}
        {GLOBE_NODES.map((n, i) => (
          <g key={i} className={n.tone === "brand" ? "text-brand" : "text-ok"}>
            <circle cx={n.x} cy={n.y} r="3.5" fill="currentColor" />
            <circle
              cx={n.x}
              cy={n.y}
              r="4"
              fill="currentColor"
              fillOpacity="0.5"
              className="umbra-ping"
              style={{ animationDelay: n.delay }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
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
            <a href="#threat-map" className="hover:text-ink">Threat map</a>
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
              <a href="#threat-map" onClick={() => setNavOpen(false)}>Threat map</a>
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
      <section className="relative mx-auto max-w-6xl overflow-hidden px-4 pb-16 pt-16 text-center lg:px-8 lg:pt-24">
        {/* decorative rotating globe behind the headline */}
        <div className="pointer-events-none absolute right-[-120px] top-[-60px] hidden w-[560px] lg:block xl:right-[-60px]">
          <GlobeGraphic variant="hero" />
        </div>

        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs text-ink-soft">
          <Activity size={12} className="text-ok" /> Live dark-web feed · updated continuously
        </div>
        <h1 className="relative mx-auto max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          Know what the <span className="gradient-text">dark web knows</span> about your company.
        </h1>
        <p className="relative mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
          Umbra continuously scans breach dumps, infostealer logs, ransomware leak sites and public
          code for your domain's fingerprints — and tells you exactly what's exposed, before
          attackers act on it.
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/signup" className="btn-primary px-6 py-3 text-[15px]">
            Get started free <ArrowRight size={17} />
          </Link>
          <Link to="/login" className="btn-ghost px-6 py-3 text-[15px]">Sign in</Link>
        </div>
        <p className="relative mt-3 text-xs text-ink-faint">No credit card required · scan your first domain in under a minute</p>

        {/* live stats strip */}
        <div className="relative mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-4">
          <StatTile value={fmt(stats.totalGroups)} label="Ransomware groups tracked" />
          <StatTile value={fmt(stats.recentCount)} label="Recent leak-site victims" />
          <StatTile value={fmt(stats.last7d)} label="New in the last 7 days" />
        </div>
      </section>

      {/* ── Trusted by / client logos ───────────────────────────────────── */}
      <section className="border-y border-white/[0.06] bg-white/[0.015]">
        <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div className="flex items-center gap-6 text-sm text-ink-soft">
              <span className="flex items-center gap-2">
                <Users size={16} className="text-brand-soft" />
                <strong className="text-ink">4,200+</strong> analysts using Umbra daily
              </span>
              <span className="hidden h-4 w-px bg-white/[0.1] sm:block" />
              <span className="hidden items-center gap-2 sm:flex">
                <Building2 size={16} className="text-brand-soft" />
                <strong className="text-ink">1,300+</strong> organizations monitored
              </span>
            </div>
            <div className="grid grid-cols-3 gap-x-8 gap-y-4 sm:grid-cols-6">
              {CLIENTS.map(({ icon: Icon, name }) => (
                <div key={name} className="flex items-center gap-1.5 text-ink-faint opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0">
                  <Icon size={16} />
                  <span className="text-xs font-semibold tracking-tight">{name}</span>
                </div>
              ))}
            </div>
          </div>
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

      {/* ── Global threat map ───────────────────────────────────────────── */}
      <section id="threat-map" className="border-y border-white/[0.06] bg-white/[0.015]">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Watching the exposure surface, worldwide</h2>
            <p className="mt-2 text-sm text-ink-faint">Every dot is a scan, leak-site posting, or credential match indexed somewhere on the globe right now.</p>
          </div>

          <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="mx-auto w-full max-w-md">
              <GlobeGraphic />
            </div>

            <div className="space-y-3">
              <div className="panel flex items-center justify-between p-4">
                <div className="flex items-center gap-2 text-sm text-ink-soft">
                  <span className="h-2 w-2 rounded-full bg-brand" /> Leak-site postings tracked
                </div>
                <span className="mono text-lg font-bold text-ink">{fmt(stats.totalGroups)}</span>
              </div>
              <div className="panel flex items-center justify-between p-4">
                <div className="flex items-center gap-2 text-sm text-ink-soft">
                  <span className="h-2 w-2 rounded-full bg-ok" /> New victims, last 7 days
                </div>
                <span className="mono text-lg font-bold text-ink">{fmt(stats.last7d)}</span>
              </div>
              {GLOBE_NODES.slice(0, 4).map((n, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-lg px-4 py-2 text-xs text-ink-faint">
                  <span className={`h-1.5 w-1.5 rounded-full ${n.tone === "brand" ? "bg-brand" : "bg-ok"}`} />
                  {n.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
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
      </section>

      {/* ── Sources ─────────────────────────────────────────────────────── */}
      <section id="sources" className="border-t border-white/[0.06] bg-white/[0.015]">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
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
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
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
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-4xl overflow-hidden px-4 py-20 text-center lg:px-8">
        <div className="pointer-events-none absolute left-1/2 top-1/2 w-[520px] -translate-x-1/2 -translate-y-1/2 opacity-[0.12]">
          <GlobeGraphic variant="hero" />
        </div>
        <h2 className="relative text-2xl font-bold tracking-tight sm:text-3xl">Find out what's exposed before attackers do.</h2>
        <p className="relative mx-auto mt-3 max-w-md text-sm text-ink-faint">Create your workspace and run your first live scan in under a minute.</p>
        <Link to="/signup" className="btn-primary relative mx-auto mt-6 w-fit px-6 py-3 text-[15px]">
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
