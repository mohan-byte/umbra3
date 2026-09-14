import { useEffect, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { RadarFeed } from "../components/RadarFeed.jsx";

export function RadarPage() {
  const [victims, setVictims] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/darkweb/global")
      .then((r) => r.json())
      .then((dw) => {
        if (cancelled) return;
        setVictims(dw.victims || []);
        setGroups((dw.stats?.topGroups || []).map((g) => g.name));
      })
      .finally(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <PageHeader
        title="Dark Web Radar"
        subtitle="Live ransomware leak-site victims aggregated from 396+ groups' .onion blogs — search for any company, sector or domain"
      />
      {loaded && <RadarFeed initialVictims={victims} groups={groups} />}
    </div>
  );
}
