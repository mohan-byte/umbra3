// ── Vulnerability Intelligence (CVEs) ──────────────────────────────────────
// Real CVE data from NVD (National Vulnerability Database), free & keyless.
// A free NVD_API_KEY raises rate limits; set it in .env to enable heavier
// querying. Clearnet HTTPS only.

const UA = { "user-agent": "Umbra-ThreatIntel/1.0" };
const API = "https://services.nvd.nist.gov/rest/json/cves/2.0";

function sevFromScore(score, label) {
  if (label) {
    const l = label.toLowerCase();
    if (l === "critical") return "critical";
    if (l === "high") return "high";
    if (l === "medium") return "medium";
    if (l === "low") return "low";
  }
  if (score == null) return "info";
  if (score >= 9) return "critical";
  if (score >= 7) return "high";
  if (score >= 4) return "medium";
  if (score > 0) return "low";
  return "info";
}

function normalize(v) {
  const c = v.cve;
  const m =
    c.metrics?.cvssMetricV31?.[0] ||
    c.metrics?.cvssMetricV30?.[0] ||
    c.metrics?.cvssMetricV2?.[0];
  const cvss = m?.cvssData?.baseScore;
  const severity = sevFromScore(cvss, m?.cvssData?.baseSeverity);
  const description =
    c.descriptions?.find((d) => d.lang === "en")?.value ||
    c.descriptions?.[0]?.value ||
    "(no description)";
  const cwe = c.weaknesses?.[0]?.description?.find((d) => d.lang === "en")?.value;
  return {
    id: c.id,
    published: c.published,
    lastModified: c.lastModified,
    cvss,
    severity,
    vector: m?.cvssData?.vectorString,
    description,
    cwe: cwe && cwe.startsWith("CWE") ? cwe : undefined,
    refs: (c.references || []).slice(0, 5).map((r) => r.url),
    source: c.sourceIdentifier,
  };
}

async function query(params) {
  const key = process.env.NVD_API_KEY;
  const headers = { ...UA };
  if (key) headers.apiKey = key;
  const res = await fetch(`${API}?${params}`, { headers });
  if (!res.ok) throw new Error(`NVD ${res.status}`);
  const data = await res.json();
  return (data.vulnerabilities || []).map(normalize);
}

async function getRecentCVEs() {
  try {
    const end = new Date();
    const start = new Date(end.getTime() - 8 * 86400000);
    const params = `pubStartDate=${encodeURIComponent(start.toISOString())}&pubEndDate=${encodeURIComponent(end.toISOString())}&resultsPerPage=60`;
    const items = await query(params);
    return items.sort(
      (a, b) =>
        (b.cvss ?? 0) - (a.cvss ?? 0) ||
        new Date(b.published || 0).getTime() - new Date(a.published || 0).getTime(),
    );
  } catch {
    return [];
  }
}

async function searchCVEs(keyword) {
  const kw = (keyword || "").trim();
  if (!kw) return [];
  try {
    if (/^cve-\d{4}-\d+$/i.test(kw)) {
      return await query(`cveId=${encodeURIComponent(kw.toUpperCase())}`);
    }
    const items = await query(`keywordSearch=${encodeURIComponent(kw)}&resultsPerPage=40`);
    return items.sort(
      (a, b) => new Date(b.published || 0).getTime() - new Date(a.published || 0).getTime(),
    );
  } catch {
    return [];
  }
}

module.exports = { getRecentCVEs, searchCVEs };
