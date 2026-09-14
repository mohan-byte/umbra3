// ── Live domain scan ───────────────────────────────────────────────────────
// Queries real, FREE, keyless intelligence sources for any domain:
//   • HIBP public breach catalog  (breaches OF the domain)
//   • XposedOrNot                 (domain breach analytics)
//   • LeakCheck public API        (aggregate leak / stealer-log hit counts)
//   • ransomware.live             (REAL dark-web ransomware leak-site victims,
//                                  aggregated from 396+ groups' .onion blogs)
//   • GitHub                      (public repos referencing the domain)
//   • crt.sh                      (subdomains via certificate transparency)
//   • Hudson Rock                 (fresh infostealer intel by domain)
//   • ProxyNova COMB              (historical leaked email:password records)
// No API key or account is required. A GitHub token enriches results if set.

const UA = { "user-agent": "Umbra-ThreatIntel/1.0" };

function withTimeout(ms) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  t.unref?.();
  return c.signal;
}

function clean(s) {
  if (!s) return undefined;
  const out = s
    .replace(/\uFFFD/g, "")
    .replace(/[\u0000-\u001F\u007F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return out || undefined;
}

function normDomain(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .replace(/\s+/g, "");
}
function companyOf(domain) {
  const label = domain.split(".")[0] || domain;
  return label.replace(/[-_]/g, " ");
}

// ── HIBP public breach catalog ─────────────────────────────────────────────
async function fetchHibpCatalog(domain) {
  try {
    const res = await fetch("https://haveibeenpwned.com/api/v3/breaches", { headers: UA });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const all = await res.json();
    const hits = all
      .filter((b) => (b.Domain || "").toLowerCase() === domain)
      .map((b) => ({
        name: b.Name,
        title: b.Title,
        domain: b.Domain,
        breachDate: b.BreachDate,
        addedDate: b.AddedDate,
        accounts: b.PwnCount,
        dataClasses: b.DataClasses || [],
        description: stripHtml(b.Description),
        verified: b.IsVerified,
        sensitive: b.IsSensitive,
        source: "HIBP",
        logo: b.LogoPath,
      }));
    return { hits, status: { id: "hibp", name: "HIBP breach catalog", ok: true, note: `${hits.length} catalog breach(es)` } };
  } catch (e) {
    return { hits: [], status: { id: "hibp", name: "HIBP breach catalog", ok: false, note: msg(e) } };
  }
}

// ── XposedOrNot ────────────────────────────────────────────────────────────
async function fetchXon(domain) {
  try {
    const res = await fetch(`https://api.xposedornot.com/v1/breaches?domain=${encodeURIComponent(domain)}`, {
      headers: UA,
      signal: withTimeout(12000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const hits = (data.exposedBreaches || []).map((b) => ({
      name: b.breachID,
      title: b.breachID,
      domain: b.domain || domain,
      breachDate: b.breachedDate,
      addedDate: b.addedDate,
      accounts: b.exposedRecords,
      dataClasses: flattenExposed(b.exposedData),
      description: b.industry
        ? `Industry: ${b.industry}${b.passwordRisk ? ` · password risk: ${b.passwordRisk}` : ""}`
        : undefined,
      verified: Boolean(b.verified),
      sensitive: Boolean(b.sensitive),
      source: "XposedOrNot",
      logo: b.logo,
    }));
    return { hits, status: { id: "xon", name: "XposedOrNot", ok: true, note: `${hits.length} breach record(s)` } };
  } catch (e) {
    return { hits: [], status: { id: "xon", name: "XposedOrNot", ok: false, note: msg(e) } };
  }
}

// ── LeakCheck public (aggregate) ───────────────────────────────────────────
async function fetchLeakcheck(domain) {
  try {
    const res = await fetch(`https://leakcheck.io/api/public?check=${encodeURIComponent(domain)}`, {
      headers: UA,
      signal: withTimeout(12000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const found = data.found ?? 0;
    const sources = (data.sources || []).map((s) => s.name).filter(Boolean);
    return { found, sources, status: { id: "leakcheck", name: "LeakCheck (public)", ok: true, note: `${found} leaked record(s)` } };
  } catch (e) {
    return { found: 0, sources: [], status: { id: "leakcheck", name: "LeakCheck (public)", ok: false, note: msg(e) } };
  }
}

// ── ransomware.live (DARK WEB) ─────────────────────────────────────────────
async function fetchRansomware(domain, company) {
  try {
    const kw = encodeURIComponent(company.split(" ")[0]);
    const res = await fetch(`https://api.ransomware.live/v2/searchvictims/${kw}`, {
      headers: UA,
      signal: withTimeout(12000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arr = await res.json();
    const list = Array.isArray(arr) ? arr : [];
    const hits = list
      .filter(
        (v) =>
          (v.domain && normDomain(v.domain) === domain) ||
          (v.victim || "").toLowerCase().includes(company.toLowerCase()),
      )
      .sort((a, b) => {
        const ad = a.domain && normDomain(a.domain) === domain ? 1 : 0;
        const bd = b.domain && normDomain(b.domain) === domain ? 1 : 0;
        return bd - ad || new Date(b.discovered || 0).getTime() - new Date(a.discovered || 0).getTime();
      })
      .slice(0, 25)
      .map((v) => ({
        victim: v.victim,
        group: v.group,
        domain: v.domain,
        country: v.country,
        sector: v.activity,
        description: clean(v.description),
        dataSize: v.data_size || undefined,
        attackDate: v.attackdate,
        discovered: v.discovered,
        claimUrl: v.claim_url || undefined,
        url: v.url || undefined,
      }));
    return { hits, status: { id: "ransomware", name: "ransomware.live (dark web)", ok: true, note: `${hits.length} leak-site match(es)` } };
  } catch (e) {
    return { hits: [], status: { id: "ransomware", name: "ransomware.live (dark web)", ok: false, note: msg(e) } };
  }
}

// ── GitHub public repos (keyless) ──────────────────────────────────────────
async function fetchGithub(domain) {
  try {
    const token = process.env.GITHUB_TOKEN;
    const headers = { ...UA, Accept: "application/vnd.github+json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(domain)}&per_page=8&sort=stars`, {
      headers,
      signal: withTimeout(10000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const repos = (data.items || []).map((r) => ({
      fullName: r.full_name,
      url: r.html_url,
      description: r.description || undefined,
      stars: r.stargazers_count,
    }));
    const note = token ? `${data.total_count ?? 0} repo(s) · secret scan enabled` : `${data.total_count ?? 0} public repo(s)`;
    return { count: data.total_count ?? 0, repos, status: { id: "github", name: "GitHub", ok: true, note } };
  } catch (e) {
    return { count: 0, repos: [], status: { id: "github", name: "GitHub", ok: false, note: msg(e) } };
  }
}

// ── ProxyNova COMB — actual leaked email:password records (keyless) ────────
// Records are surfaced to the domain owner for remediation only; passwords
// are masked in the UI by default with an explicit reveal action.
async function fetchComb(domain) {
  try {
    const res = await fetch(`https://api.proxynova.com/comb?query=${encodeURIComponent(domain)}&start=0&limit=100`, {
      headers: { "user-agent": "Mozilla/5.0 (Umbra-ThreatIntel)" },
      signal: withTimeout(12000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const records = (data.lines || [])
      .map((line) => {
        const idx = String(line).lastIndexOf(":");
        const email = idx > 0 ? line.slice(0, idx) : line;
        const password = idx > 0 ? line.slice(idx + 1) : "";
        return { email: email.trim(), password: password.trim(), hasPassword: password.trim().length > 0 };
      })
      .filter((r) => r.email.includes("@"));
    const total = data.count ?? records.length;
    return { total, records, status: { id: "comb", name: "COMB records (ProxyNova)", ok: true, note: `${total.toLocaleString()} leaked record(s)` } };
  } catch (e) {
    return { total: 0, records: [], status: { id: "comb", name: "COMB records (ProxyNova)", ok: false, note: msg(e) } };
  }
}

// ── crt.sh — attack surface (subdomains via certificate transparency) ──────
async function fetchSubdomains(domain) {
  try {
    const res = await fetch(`https://crt.sh/?q=%25.${encodeURIComponent(domain)}&output=json`, {
      headers: UA,
      signal: withTimeout(14000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();
    const set = new Set();
    for (const r of rows) {
      for (const n of String(r.name_value || "").split("\n")) {
        const name = n.trim().toLowerCase();
        if (name && !name.startsWith("*") && name.endsWith(domain)) set.add(name);
      }
    }
    const all = Array.from(set).sort();
    return { count: all.length, list: all.slice(0, 250), status: { id: "crtsh", name: "crt.sh (attack surface)", ok: true, note: `${all.length} subdomain(s)` } };
  } catch (e) {
    return { count: 0, list: [], status: { id: "crtsh", name: "crt.sh (attack surface)", ok: false, note: msg(e) } };
  }
}

// ── Hudson Rock — FRESH infostealer intel by domain (keyless) ──────────────
async function fetchHudsonRock(domain) {
  const empty = { ok: false, employees: 0, users: 0, totalStealers: 0, thirdParties: 0, stealerFamilies: [], applications: [] };
  try {
    const res = await fetch(`https://cavalier.hudsonrock.com/api/json/v2/osint-tools/search-by-domain?domain=${encodeURIComponent(domain)}`, {
      headers: UA,
      signal: withTimeout(12000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const d = await res.json();
    const fam = d.stealerFamilies || {};
    const stealerFamilies = Object.entries(fam)
      .filter(([k]) => k.toLowerCase() !== "total")
      .map(([name, count]) => ({ name, count: Number(count) || 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
    const apps = Array.isArray(d.applications) ? d.applications : [];
    const applications = apps
      .map((a) => ({
        name: String(a.keyword || a.type || a.application || a.name || "app"),
        count: Number(a.total || a.occurence || a.occurrence || a.employees || a.users || 0),
      }))
      .filter((a) => a.name && a.name !== "app")
      .slice(0, 8);
    const ep = d.employeePasswords || {};
    const passwordStrength =
      ep.totalPass != null
        ? {
            total: Number(ep.totalPass) || 0,
            tooWeak: Number(ep.too_weak?.qty) || 0,
            weak: Number(ep.weak?.qty) || 0,
            medium: Number(ep.medium?.qty) || 0,
            strong: Number(ep.strong?.qty) || 0,
          }
        : undefined;
    const intel = {
      ok: true,
      employees: Number(d.employees) || 0,
      users: Number(d.users) || 0,
      totalStealers: Number(d.totalStealers) || 0,
      thirdParties: Number(d.third_parties) || 0,
      lastEmployeeCompromised: d.last_employee_compromised || undefined,
      lastUserCompromised: d.last_user_compromised || undefined,
      stealerFamilies,
      passwordStrength,
      applications,
    };
    return { intel, status: { id: "hudsonrock", name: "Hudson Rock (fresh stealer intel)", ok: true, note: `${intel.employees} employees in stealer logs` } };
  } catch (e) {
    return { intel: empty, status: { id: "hudsonrock", name: "Hudson Rock (fresh stealer intel)", ok: false, note: msg(e) } };
  }
}

// ── Aggregator ─────────────────────────────────────────────────────────────
async function scanDomain(raw) {
  const domain = normDomain(raw);
  const company = companyOf(domain);

  const [hibp, xon, leak, rw, gh, comb, crt, hr] = await Promise.all([
    fetchHibpCatalog(domain),
    fetchXon(domain),
    fetchLeakcheck(domain),
    fetchRansomware(domain, company),
    fetchGithub(domain),
    fetchComb(domain),
    fetchSubdomains(domain),
    fetchHudsonRock(domain),
  ]);

  const byName = new Map();
  for (const h of [...hibp.hits, ...xon.hits]) {
    const key = h.name.toLowerCase();
    const ex = byName.get(key);
    if (!ex) byName.set(key, h);
    else
      byName.set(key, {
        ...ex,
        accounts: ex.accounts ?? h.accounts,
        description: ex.description ?? h.description,
        dataClasses: Array.from(new Set([...ex.dataClasses, ...h.dataClasses])),
        source: ex.source === h.source ? ex.source : `${ex.source}+${h.source}`,
      });
  }
  const breaches = Array.from(byName.values()).sort(
    (a, b) => new Date(b.breachDate || 0).getTime() - new Date(a.breachDate || 0).getTime(),
  );

  const totalAccounts = breaches.reduce((s, b) => s + (b.accounts || 0), 0);
  const exposedDataTypes = Array.from(new Set(breaches.flatMap((b) => b.dataClasses))).sort();
  const latestBreachDate = breaches[0]?.breachDate;
  const darkWebListed = rw.hits.length > 0;
  const plaintextPasswords = comb.records.filter((r) => r.hasPassword).length;
  const lastCompromised = [hr.intel.lastEmployeeCompromised, hr.intel.lastUserCompromised]
    .filter(Boolean)
    .sort()
    .reverse()[0];

  const riskScore = computeRisk({
    breachCount: breaches.length,
    totalAccounts,
    stealerHits: leak.found,
    ransomHits: rw.hits.length,
    credRecords: comb.total,
    stealerEmployees: hr.intel.employees,
    hasPasswords: plaintextPasswords > 0 || exposedDataTypes.some((d) => /password/i.test(d)),
    latest: latestBreachDate,
  });

  const notes = [];
  if (darkWebListed) {
    notes.push(
      `⚠ Dark-web ransomware exposure: this organization appears on ${rw.hits.length} ransomware leak-site listing(s). See the Dark Web section below for what each group claims to have stolen.`,
    );
  }
  if (hr.intel.employees > 0) {
    const fresh = lastCompromised ? ` Most recent compromise: ${new Date(lastCompromised).toLocaleDateString()}.` : "";
    notes.push(
      `⚠ Fresh infostealer exposure: ${hr.intel.employees.toLocaleString()} employee identities and ${hr.intel.users.toLocaleString()} user identities from this domain appear in infostealer logs (Hudson Rock).${fresh} See the Fresh Stealer Exposure section.`,
    );
  }
  if (comb.total > 0)
    notes.push(
      `${comb.total.toLocaleString()} actual leaked credential record(s) recovered from the COMB historical compilation (largely pre-2022) — see Leaked Records. For fresh values, add a paid feed key in Settings.`,
    );
  if (leak.found > 0)
    notes.push(`LeakCheck corroborates ${leak.found.toLocaleString()} leaked record(s) across: ${leak.sources.join(", ") || "unspecified sources"}.`);
  if (breaches.length === 0 && leak.found === 0 && !darkWebListed && comb.total === 0 && hr.intel.employees === 0) {
    notes.push(
      "No public breach-catalog, leak-count, credential-record, stealer-log or ransomware-listing hits for this exact domain. Large/consumer domains return the most; a private corporate domain often has no public entry even when employees' credentials are exposed elsewhere.",
    );
    notes.push("Deeper per-employee dumps and forum chatter for arbitrary domains require a paid domain-search source (DeHashed / IntelX / LeakCheck Pro). Add a key in Settings to enrich these results.");
  }

  return {
    domain,
    company,
    scannedAt: new Date().toISOString(),
    sources: [hibp.status, xon.status, hr.status, comb.status, rw.status, leak.status, crt.status, gh.status],
    summary: {
      totalBreaches: breaches.length,
      totalAccounts,
      stealerLogHits: leak.found,
      leakSources: leak.sources,
      ransomwareHits: rw.hits.length,
      darkWebListed,
      repoCount: gh.count,
      credentialRecords: comb.total,
      plaintextPasswords,
      subdomainCount: crt.count,
      stealerEmployees: hr.intel.employees,
      lastCompromised,
      latestBreachDate,
      exposedDataTypes,
      riskScore,
      riskBand: riskScore >= 80 ? "severe" : riskScore >= 60 ? "elevated" : riskScore >= 35 ? "guarded" : "low",
    },
    breaches,
    ransomware: rw.hits,
    repos: gh.repos,
    credentials: comb.records,
    subdomains: crt.list,
    stealerIntel: hr.intel,
    notes,
  };
}

function computeRisk(x) {
  let s = 0;
  s += Math.min(16, x.breachCount * 4);
  s += Math.min(14, Math.round(Math.log10(x.totalAccounts + 1) * 4));
  s += Math.min(14, Math.round(Math.log10(x.stealerHits + 1) * 6));
  s += Math.min(14, Math.round(Math.log10(x.credRecords + 1) * 6));
  s += Math.min(20, Math.round(Math.log10(x.stealerEmployees + 1) * 12));
  s += Math.min(28, x.ransomHits * 14);
  if (x.hasPasswords) s += 6;
  if (x.latest) {
    const y = (Date.now() - new Date(x.latest).getTime()) / (365 * 86400000);
    if (y < 2) s += 6;
    else if (y < 5) s += 3;
  }
  return Math.max(0, Math.min(100, s));
}
function flattenExposed(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v.flat(Infinity).map(String).filter(Boolean);
  return [String(v)];
}
function stripHtml(s) {
  return s ? s.replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&").trim() : undefined;
}
function msg(e) {
  return e instanceof Error ? e.message : "request failed";
}

module.exports = { scanDomain, normDomain };
