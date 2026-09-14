import { PageHeader } from "../components/ui/PageHeader.jsx";
import { WatchlistPanel } from "../components/WatchlistPanel.jsx";

export function WatchlistPage() {
  return (
    <div>
      <PageHeader
        title="Watchlist"
        subtitle="Continuously monitor your organization's domains — each is scanned live for breach, dark-web and attack-surface exposure"
      />
      <WatchlistPanel />
    </div>
  );
}
