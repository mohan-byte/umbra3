import { useEffect, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { CveView } from "../components/CveView.jsx";

export function VulnerabilitiesPage() {
  const [recent, setRecent] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/cve/recent")
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setRecent(data.items || []); })
      .finally(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <PageHeader
        title="Vulnerability Intelligence"
        subtitle="Live CVE feed from the National Vulnerability Database — track newly published flaws and search by product, vendor or CVE id"
      />
      {loaded && <CveView recent={recent} />}
    </div>
  );
}
