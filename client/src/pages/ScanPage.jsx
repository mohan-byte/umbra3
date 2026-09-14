import { useSearchParams } from "react-router-dom";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { ScanView } from "../components/ScanView.jsx";

export function ScanPage() {
  const [params] = useSearchParams();
  const domain = params.get("domain") ?? "";

  return (
    <div>
      <PageHeader
        title="Domain Scan"
        subtitle="Type any domain to pull its real dark-web & breach exposure — live, from free public sources, no API key required"
      />
      <ScanView key={domain} initialDomain={domain} />
    </div>
  );
}
