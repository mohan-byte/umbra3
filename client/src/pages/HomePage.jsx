import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldHalf, ArrowRight, Radar, Skull, Bug, Crosshair, Fingerprint, Network,
  Check, Menu, X, Activity, Github, Database, Users, Building2, Server,
  Lock, Layers, Terminal, CloudCog, GitBranch, ChevronDown, KeyRound,
  ShieldCheck, HelpCircle, Quote, Star, BookOpen, LifeBuoy, Newspaper,
  GitCommit, Rocket, Briefcase, Mail, Twitter, Linkedin, ArrowUpRight,
} from "lucide-react";
import { RiskGauge } from "../components/ui/RiskGauge.jsx";
import { MetricTile } from "../components/ui/MetricTile.jsx";
import { SeverityBadge } from "../components/ui/SeverityBadge.jsx";
import { VictimCard } from "../components/VictimCard.jsx";

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

// Mega-menu navigation
const NAV_MENUS = [
  {
    key: "product",
    label: "Product",
    columns: [
      {
        heading: "Monitor",
        items: [
          { icon: Radar, title: "Domain Scan", desc: "Live exposure scan for any domain", href: "#features" },
          { icon: Skull, title: "Dark Web Radar", desc: "Ransomware leak-site search", href: "#threat-map" },
          { icon: Bug, title: "CVE Intelligence", desc: "Live NVD vulnerability feed", href: "#features" },
        ],
      },
      {
        heading: "Protect",
        items: [
          { icon: Crosshair, title: "Watchlist", desc: "Continuous domain monitoring", href: "#spotlight" },
          { icon: Network, title: "Attack Surface", desc: "Subdomain & code exposure mapping", href: "#features" },
          { icon: Fingerprint, title: "Stealer Intel", desc: "Fresh infostealer credential hits", href: "#features" },
        ],
      },
    ],
  },
  {
    key: "solutions",
    label: "Solutions",
    items: [
      { icon: ShieldCheck, title: "Security teams", desc: "Continuous exposure monitoring for your SOC" },
      { icon: Briefcase, title: "MSSPs & resellers", desc: "Multi-tenant monitoring across client domains" },
      { icon: Building2, title: "Compliance & risk", desc: "Evidence for vendor & third-party risk reviews" },
      { icon: Rocket, title: "Startups & SMBs", desc: "Enterprise-grade monitoring, no security team required" },
    ],
  },
  {
    key: "resources",
    label: "Resources",
    items: [
      { icon: BookOpen, title: "Documentation" },
      { icon: Terminal, title: "API reference" },
      { icon: Newspaper, title: "Blog" },
      { icon: GitCommit, title: "Changelog" },
      { icon: LifeBuoy, title: "Support center" },
    ],
  },
];

const SPOTLIGHTS = [
  {
    tag: "Domain Scan",
    title: "See your exposure the moment you type a domain",
    desc: "Umbra sweeps breach catalogs, leaked-credential dumps, ransomware leak sites, certificate-transparency logs and public code repositories — then rolls it into a single risk score in seconds.",
    bullets: ["Live results, never a cached snapshot", "Every finding traces back to a real source", "Exportable for remediation & reporting"],
    mock: "scan",
  },
  {
    tag: "Continuous Watchlist",
    title: "Monitor every domain you own, automatically",
    desc: "Add a domain once. Umbra keeps re-scanning it and keeps a full history in Postgres, so you can see exposure trend up or down over time — not just a one-off report.",
    bullets: ["Persistent scan history, per domain", "One-click re-scan on demand", "Built for teams managing many domains"],
    mock: "watchlist",
  },
  {
    tag: "Dark Web Radar",
    title: "Search real ransomware leak-site activity",
    desc: "A live, searchable feed of leak-site postings aggregated from hundreds of ransomware groups' blogs — filterable by group, sector, or company name.",
    bullets: ["396+ ransomware groups tracked", "No Tor client required", "Updated continuously"],
    mock: "radar",
  },
];

const TESTIMONIALS = [
  { quote: "We replaced three separate breach-monitoring tools with Umbra's watchlist. The scan history alone has paid for the subscription.", name: "Priya Nair", role: "Head of Security, Northbridge Cloud" },
  { quote: "The dark-web radar caught a leak-site listing for one of our subsidiaries two days before our usual feed did.", name: "Marcus Webb", role: "SOC Lead, Vantage Systems" },
  { quote: "As an MSSP we needed something we could run across every client domain without buying five different licenses. This is it.", name: "Elena Sørensen", role: "Founder, Meridian Labs" },
];

const FAQS = [
  { q: "Do you access the dark web directly?", a: "No. Umbra never connects to Tor or .onion sites. It aggregates ransomware leak-site data through ransomware.live, a clearnet API that already does that crawling safely — so there's nothing to install and nothing risky to run." },
  { q: "Is this legal to use on any domain?", a: "Umbra only reads public, already-published sources — breach catalogs, certificate transparency logs, public code repos, and leak-site listings that are already public. We recommend only running deep scans on domains you own or are authorized to assess." },
  { q: "How fresh is the data?", a: "Every scan and search queries live sources in real time. Nothing shown in a report is synthetic or pre-cached — if a source has no data for your domain, we say so." },
  { q: "What happens to my scan history?", a: "Domains you add to your watchlist are tied to your account so you can track trends over time. One-off scans are logged for service reliability but aren't linked back to your account beyond your own history." },
  { q: "Can I cancel anytime?", a: "Yes — Starter and Business are month-to-month with no long-term contract. Enterprise plans are billed per your agreement." },
  { q: "What's included in Enterprise?", a: "Unlimited domains, a dedicated analyst, SIEM/SOAR integration, takedown & remediation support, and access to paid dark-web feeds on top of everything in Business." },
];

const SECURITY_POINTS = [
  { icon: Lock, text: "Passwords hashed with bcrypt — never stored in plain text" },
  { icon: ShieldCheck, text: "Sessions secured with signed, short-lived JWTs" },
  { icon: Layers, text: "Per-account data isolation — your watchlist is never visible to other accounts" },
  { icon: Server, text: "No third-party ad trackers anywhere on this site" },
];

const TICKER_ITEMS = [
  "Live · Scanning breach catalogs",
  "Live · Checking dark-web leak sites",
  "Live · Indexing newly published CVEs",
  "Live · Mapping certificate-transparency records",
  "Live · Cross-referencing infostealer logs",
  "Live · Watching ransomware group activity",
];

const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Domain Scan", href: "#features" },
      { label: "Dark Web Radar", href: "#threat-map" },
      { label: "CVE Intelligence", href: "#features" },
      { label: "Watchlist", href: "#spotlight" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { label: "Security teams", href: "#" },
      { label: "MSSPs & resellers", href: "#" },
      { label: "Compliance & risk", href: "#" },
      { label: "Startups & SMBs", href: "#" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API reference", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Support center", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Terms of service", href: "#" },
      { label: "Privacy policy", href: "#" },
    ],
  },
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

// A realistic-looking preview of the actual dashboard UI, built from the app's
// real presentational components (RiskGauge, MetricTile, SeverityBadge,
// VictimCard) with representative sample data — not a live scan.
function ProductPreview() {
  const sampleVictim = {
    victim: "Sample Manufacturing Co.",
    group: "LockCipher",
    country: "United States",
    sector: "Manufacturing",
    description: "Illustrative leak-site listing shown for preview purposes only.",
    discovered: new Date().toISOString(),
  };

  return (
    <div className="panel relative mx-auto w-full max-w-5xl overflow-hidden p-0">
      <style>{`
        @keyframes umbraScanBeam { 0% { transform: translateX(-10%); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateX(110%); opacity: 0; } }
        .umbra-scan-beam { animation: umbraScanBeam 4.5s ease-in-out infinite; }
      `}</style>

      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-sev-critical/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-sev-medium/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-ok/60" />
        <div className="mono ml-3 flex-1 truncate rounded-md bg-white/[0.03] px-3 py-1 text-[11px] text-ink-faint">
          app.umbra.security/scan?domain=acme-corp.com
        </div>
        <span className="chip bg-ok/[0.12] text-ok">live</span>
      </div>

      {/* scanning beam overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-10 bottom-0 overflow-hidden">
        <div className="umbra-scan-beam absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-brand/[0.08] to-transparent" />
      </div>

      <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="panel flex flex-col items-center p-4">
            <RiskGauge score={62} trend={-8} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:col-span-8">
          <MetricTile icon={Database} accent="high" value="8" label="Known breaches" sub="212K accounts" />
          <MetricTile icon={KeyRound} accent="critical" value="41,209" label="Leaked records" sub="COMB · historical" />
          <MetricTile icon={Skull} accent="critical" value="1" label="Dark-web listings" sub="ransomware leak sites" />
          <MetricTile icon={Network} accent="cyan" value="63" label="Subdomains" sub="attack surface" />
        </div>
        <div className="md:col-span-12">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-ink-soft">
            <Skull size={13} className="text-sev-critical" /> Dark web — sample finding
            <SeverityBadge severity="high" className="ml-auto" />
          </div>
          <VictimCard v={sampleVictim} />
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const [stats, setStats] = useState({ totalGroups: 0, recentCount: 0, last7d: 0 });
  const [navOpen, setNavOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const closeTimer = useRef(null);

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

  const openMenuNow = (key) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(key);
  };
  const closeMenuSoon = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  const submitSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    // Front-end only for now — wire this up to your mailing-list provider
    // of choice (or a small /api/newsletter route) when you're ready.
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div className="umbra-bg min-h-screen text-ink">
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-base-970/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/images/cvehouse.png" alt="Umbra" className="h-auto w-[70px] object-contain" />
          </Link>

          <nav className="hidden items-center gap-1 text-sm text-ink-soft md:flex">
            {NAV_MENUS.map((menu) => (
              <div key={menu.key} className="relative" onMouseEnter={() => openMenuNow(menu.key)} onMouseLeave={closeMenuSoon}>
                <button
                  className="flex items-center gap-1 rounded-lg px-3 py-2 hover:text-ink"
                  onClick={() => setOpenMenu((m) => (m === menu.key ? null : menu.key))}
                >
                  {menu.label}
                  <ChevronDown size={14} className={`transition-transform duration-150 ${openMenu === menu.key ? "rotate-180" : ""}`} />
                </button>

                {openMenu === menu.key && (
                  <div
                    onMouseEnter={() => openMenuNow(menu.key)}
                    onMouseLeave={closeMenuSoon}
                    className={`absolute left-1/2 top-full z-40 mt-1.5 -translate-x-1/2 rounded-2xl border border-white/[0.08] bg-base-900 p-4 shadow-panel ${menu.columns ? "w-[560px]" : "w-[300px]"}`}
                  >
                    {menu.columns ? (
                      <div className="grid grid-cols-2 gap-6">
                        {menu.columns.map((col) => (
                          <div key={col.heading}>
                            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{col.heading}</div>
                            <div className="space-y-0.5">
                              {col.items.map((item) => (
                                <a key={item.title} href={item.href} onClick={() => setOpenMenu(null)} className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-white/[0.04]">
                                  <item.icon size={16} className="mt-0.5 shrink-0 text-brand-soft" />
                                  <span>
                                    <span className="block text-sm font-medium text-ink">{item.title}</span>
                                    <span className="block text-xs text-ink-faint">{item.desc}</span>
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        {menu.items.map((item) => (
                          <a
                            key={item.title}
                            href="#"
                            onClick={(e) => { e.preventDefault(); setOpenMenu(null); }}
                            className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-white/[0.04]"
                          >
                            <item.icon size={16} className="mt-0.5 shrink-0 text-brand-soft" />
                            <span>
                              <span className="block text-sm font-medium text-ink">{item.title}</span>
                              {item.desc && <span className="block text-xs text-ink-faint">{item.desc}</span>}
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <a href="#pricing" className="rounded-lg px-3 py-2 hover:text-ink">Pricing</a>
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
            <nav className="flex flex-col gap-1 text-sm text-ink-soft">
              {NAV_MENUS.map((menu) => (
                <div key={menu.key} className="border-b border-white/[0.05] py-1.5">
                  <button
                    className="flex w-full items-center justify-between py-1.5 text-left font-medium text-ink"
                    onClick={() => setMobileAccordion((m) => (m === menu.key ? null : menu.key))}
                  >
                    {menu.label}
                    <ChevronDown size={15} className={`transition-transform ${mobileAccordion === menu.key ? "rotate-180" : ""}`} />
                  </button>
                  {mobileAccordion === menu.key && (
                    <div className="space-y-1 pb-2 pl-1">
                      {(menu.columns ? menu.columns.flatMap((c) => c.items) : menu.items).map((item) => (
                        <a
                          key={item.title}
                          href={item.href || "#"}
                          onClick={(e) => { if (!item.href) e.preventDefault(); setNavOpen(false); }}
                          className="flex items-center gap-2 py-1.5 text-xs text-ink-faint"
                        >
                          <item.icon size={13} className="text-brand-soft" /> {item.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a href="#pricing" onClick={() => setNavOpen(false)} className="py-2.5 font-medium text-ink">Pricing</a>
              <div className="mt-2 flex flex-col gap-2">
                <Link to="/login" className="btn-ghost w-full" onClick={() => setNavOpen(false)}>Sign in</Link>
                <Link to="/signup" className="btn-primary w-full" onClick={() => setNavOpen(false)}>Get started free</Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-6xl overflow-hidden px-4 pb-14 pt-16 text-center lg:px-8 lg:pt-24">
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
        <div className="relative mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-4">
          <StatTile value={fmt(stats.totalGroups)} label="Ransomware groups tracked" />
          <StatTile value={fmt(stats.recentCount)} label="Recent leak-site victims" />
          <StatTile value={fmt(stats.last7d)} label="New in the last 7 days" />
        </div>

        {/* live activity ticker */}
        <div className="relative mx-auto mt-8 max-w-3xl overflow-hidden rounded-full border border-white/[0.06] bg-white/[0.02] py-2">
          <style>{`
            @keyframes umbraMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
            .umbra-marquee { animation: umbraMarquee 24s linear infinite; }
          `}</style>
          <div className="umbra-marquee flex w-max items-center gap-8 whitespace-nowrap px-4 text-[11px] text-ink-faint">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ok" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* product preview */}
        <div className="relative mt-14">
          <ProductPreview />
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

      {/* ── Product spotlights ──────────────────────────────────────────── */}
      <section id="spotlight" className="border-y border-white/[0.06] bg-white/[0.015]">
        <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 lg:px-8">
          {SPOTLIGHTS.map((s, i) => (
            <div key={s.tag} className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div>
                <span className="chip bg-brand/[0.14] text-brand-soft">{s.tag}</span>
                <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-faint">{s.desc}</p>
                <ul className="mt-4 space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-ink-soft"><Check size={15} className="mt-0.5 shrink-0 text-ok" /> {b}</li>
                  ))}
                </ul>
              </div>
              <SpotlightMock kind={s.mock} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Global threat map ───────────────────────────────────────────── */}
      <section id="threat-map" className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
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

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Trusted by security teams</h2>
          <p className="mt-2 text-sm text-ink-faint">Illustrative feedback from teams like yours.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="panel flex flex-col p-5">
              <Quote size={18} className="text-brand-soft" />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">"{t.quote}"</p>
              <div className="mt-4 flex items-center gap-0.5 text-sev-medium">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} fill="currentColor" strokeWidth={0} />)}
              </div>
              <div className="mt-2 text-sm font-semibold text-ink">{t.name}</div>
              <div className="text-xs text-ink-faint">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sources ─────────────────────────────────────────────────────── */}
      <section id="sources" className="border-y border-white/[0.06] bg-white/[0.015]">
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

      {/* ── Security ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="chip bg-ok/[0.12] text-ok"><ShieldCheck size={12} /> Security by default</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Built to handle sensitive findings responsibly</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-faint">
              Umbra surfaces sensitive exposure data, so the platform itself is held to a higher bar.
            </p>
          </div>
          <div className="space-y-3">
            {SECURITY_POINTS.map((p) => (
              <div key={p.text} className="panel flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ok/[0.12] text-ok">
                  <p.icon size={16} />
                </div>
                <span className="text-sm text-ink-soft">{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] bg-white/[0.015]">
        <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Frequently asked questions</h2>
          </div>
          <div className="mt-8 space-y-2.5">
            {FAQS.map((f, i) => (
              <div key={f.q} className="panel overflow-hidden">
                <button
                  onClick={() => setOpenFaq((o) => (o === i ? -1 : i))}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left text-sm font-medium text-ink"
                >
                  <span className="flex items-center gap-2.5"><HelpCircle size={15} className="shrink-0 text-brand-soft" /> {f.q}</span>
                  <ChevronDown size={15} className={`shrink-0 text-ink-faint transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <p className="px-4 pb-4 pl-[42px] text-sm leading-relaxed text-ink-faint">{f.a}</p>}
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
      <footer className="border-t border-white/[0.06] px-4 pt-14 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 pb-12 sm:grid-cols-3 lg:grid-cols-6">
            <div className="col-span-2 sm:col-span-3 lg:col-span-2">
              <img src="/images/cvehouse.png" alt="Umbra" className="h-auto w-[64px] object-contain" />
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-ink-faint">
                Umbra is CVE House's continuous dark-web and breach exposure monitoring product —
                live domain scans, ransomware leak-site search, CVE intelligence and a persistent
                watchlist, all in one workspace.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <a href="#" aria-label="Umbra on X" className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-ink-faint hover:border-white/[0.16] hover:text-ink">
                  <Twitter size={14} />
                </a>
                <a href="#" aria-label="Umbra on LinkedIn" className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-ink-faint hover:border-white/[0.16] hover:text-ink">
                  <Linkedin size={14} />
                </a>
                <a href="#" aria-label="Umbra on GitHub" className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-ink-faint hover:border-white/[0.16] hover:text-ink">
                  <Github size={14} />
                </a>
              </div>
            </div>

            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading}>
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-faint">{col.heading}</div>
                <ul className="mt-3 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-sm text-ink-soft hover:text-ink">{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* newsletter */}
          <div className="flex flex-col items-start gap-4 border-t border-white/[0.06] py-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-ink"><Mail size={15} className="text-brand-soft" /> Get product & threat-research updates</div>
              <p className="mt-1 text-xs text-ink-faint">Occasional emails. Unsubscribe anytime.</p>
            </div>
            <form onSubmit={submitSubscribe} className="flex w-full max-w-sm items-center gap-2">
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
              <button type="submit" className="btn-primary shrink-0 px-4 py-2 text-sm">Subscribe <ArrowUpRight size={14} /></button>
            </form>
          </div>
          {subscribed && <p className="pb-4 text-xs text-ok">Thanks — you're on the list.</p>}

          <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] py-6 sm:flex-row">
            <div className="flex items-center gap-2 text-xs text-ink-faint">
              <ShieldHalf size={14} className="text-brand-soft" /> © 2026 CVE House · Umbra Dark Web Threat Intelligence
            </div>
            <div className="flex items-center gap-5 text-xs text-ink-faint">
              <a href="#" className="hover:text-ink-soft">Terms</a>
              <a href="#" className="hover:text-ink-soft">Privacy</a>
              <Link to="/login" className="hover:text-ink-soft">Sign in</Link>
              <Link to="/signup" className="hover:text-ink-soft">Get started</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SpotlightMock({ kind }) {
  if (kind === "watchlist") {
    const rows = [
      { domain: "acme-corp.com", band: "elevated", score: 58 },
      { domain: "acme-payments.io", band: "low", score: 12 },
      { domain: "acme-labs.dev", band: "severe", score: 86 },
    ];
    const bandCls = {
      severe: "text-sev-critical bg-sev-critical/[0.12]",
      elevated: "text-sev-high bg-sev-high/[0.12]",
      guarded: "text-sev-medium bg-sev-medium/[0.12]",
      low: "text-ok bg-ok/[0.12]",
    };
    return (
      <div className="panel p-4">
        <div className="mb-3 flex items-center justify-between text-xs text-ink-faint">
          <span>Watchlist</span>
          <span className="chip bg-white/[0.05] text-ink-faint">3 domains</span>
        </div>
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.domain} className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
              <span className="mono text-sm text-ink">{r.domain}</span>
              <div className="flex items-center gap-2">
                <span className="mono text-xs text-ink-faint">{r.score}/100</span>
                <span className={`chip font-semibold capitalize ${bandCls[r.band]}`}>{r.band}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "radar") {
    const victims = [
      { victim: "Sample Logistics Group", group: "BlackHarbor", country: "Germany", sector: "Logistics", description: "Illustrative preview — not a real leak-site posting.", discovered: new Date().toISOString() },
      { victim: "Sample Retail Holdings", group: "RustLocker", country: "Canada", sector: "Retail", description: "Illustrative preview — not a real leak-site posting.", discovered: new Date(Date.now() - 86400000 * 2).toISOString() },
    ];
    return (
      <div className="space-y-3">
        {victims.map((v, i) => <VictimCard key={i} v={v} />)}
      </div>
    );
  }

  // "scan" (default)
  return (
    <div className="panel p-4">
      <div className="mb-3 flex items-center justify-between text-xs text-ink-faint">
        <span className="mono">acme-corp.com</span>
        <span className="chip bg-ok/[0.12] text-ok">scan complete</span>
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <RiskGauge score={62} trend={-8} />
        <div className="grid flex-1 grid-cols-2 gap-3">
          <MetricTile icon={Database} accent="high" value="8" label="Breaches" />
          <MetricTile icon={KeyRound} accent="critical" value="41K" label="Leaked records" />
        </div>
      </div>
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
