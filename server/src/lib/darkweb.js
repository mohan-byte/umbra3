// ── Global dark-web feed ───────────────────────────────────────────────────
// Real ransomware leak-site intelligence via ransomware.live, which crawls
// 396+ ransomware groups' .onion leak blogs and exposes them over a free
// clearnet HTTPS API. IMPORTANT: this connects only to that clearnet API —
// the server never touches Tor or any .onion / threat-actor infrastructure.

const UA = { "user-agent": "Umbra-ThreatIntel/1.0" };
const API = "https://api.ransomware.live/v2";

function clean(s) {
  if (!s) return undefined;
  // eslint-disable-next-line no-control-regex
  const out = s
    .replace(/\uFFFD/g, "")
    .replace(/[\u0000-\u001F\u007F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return out || undefined;
}

function mapVictim(v) {
  return {
    victim: clean(v.victim) || v.victim,
    group: v.group,
    domain: v.domain || undefined,
    country: v.country || undefined,
    sector: v.activity || undefined,
    description: clean(v.description),
    dataSize: v.data_size || undefined,
    attackDate: v.attackdate,
    discovered: v.discovered,
    claimUrl: v.claim_url || undefined,
    url: v.url || undefined,
  };
}

function tally(items, top = 6) {
  const m = new Map();
  for (const i of items) m.set(i, (m.get(i) ?? 0) + 1);
  return Array.from(m.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, top);
}

function timelineByDay(victims, days) {
  const buckets = new Map();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const v of victims) {
    if (!v.discovered) continue;
    const key = new Date(v.discovered).toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }));
}

async function getGlobalDarkWeb() {
  try {
    const [rv, gr] = await Promise.all([
      fetch(`${API}/recentvictims`, { headers: UA }),
      fetch(`${API}/groups`, { headers: UA }),
    ]);
    const victimsRaw = rv.ok ? await rv.json() : [];
    const groupsRaw = gr.ok ? await gr.json() : [];
    const victims = (Array.isArray(victimsRaw) ? victimsRaw : []).map(mapVictim);

    const now = Date.now();
    const weekAgo = now - 7 * 86400000;
    const last7d = victims.filter(
      (v) => v.discovered && new Date(v.discovered).getTime() >= weekAgo,
    ).length;

    return {
      ok: true,
      fetchedAt: new Date().toISOString(),
      totalGroups: Array.isArray(groupsRaw) ? groupsRaw.length : 0,
      victims,
      stats: {
        recentCount: victims.length,
        last7d,
        topGroups: tally(victims.map((v) => v.group)),
        topCountries: tally(victims.map((v) => v.country).filter(Boolean)),
        topSectors: tally(victims.map((v) => v.sector).filter(Boolean)),
        timeline: timelineByDay(victims, 21),
      },
    };
  } catch {
    return {
      ok: false,
      fetchedAt: new Date().toISOString(),
      totalGroups: 0,
      victims: [],
      stats: { recentCount: 0, last7d: 0, topGroups: [], topCountries: [], topSectors: [], timeline: [] },
    };
  }
}

// Search the leak-site feed by keyword (company/domain).
async function searchDarkWeb(keyword) {
  try {
    const res = await fetch(`${API}/searchvictims/${encodeURIComponent(keyword)}`, { headers: UA });
    if (!res.ok) return [];
    const arr = await res.json();
    return (Array.isArray(arr) ? arr : [])
      .map(mapVictim)
      .sort((a, b) => new Date(b.discovered || 0).getTime() - new Date(a.discovered || 0).getTime());
  } catch {
    return [];
  }
}

module.exports = { getGlobalDarkWeb, searchDarkWeb };
