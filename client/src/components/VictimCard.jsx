import { Building2, Globe, Clock, HardDrive, Skull, ExternalLink } from "lucide-react";
import { timeAgo } from "../lib/format.js";

export function VictimCard({ v }) {
  const when = v.discovered || v.attackDate;
  return (
    <div className="panel panel-hover flex flex-col p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sev-critical/[0.12] text-sev-critical">
            <Skull size={17} />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-ink">{v.victim}</div>
            {v.domain && <div className="mono truncate text-xs text-ink-faint">{v.domain}</div>}
          </div>
        </div>
        <span className="chip shrink-0 bg-sev-critical/[0.14] font-semibold text-sev-critical">{v.group}</span>
      </div>

      {v.description && (
        <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-ink-soft">{v.description}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-ink-faint">
        {v.sector && <span className="flex items-center gap-1"><Building2 size={11} /> {v.sector}</span>}
        {v.country && <span className="flex items-center gap-1"><Globe size={11} /> {v.country}</span>}
        {v.dataSize && <span className="flex items-center gap-1"><HardDrive size={11} /> {v.dataSize}</span>}
        {when && <span className="flex items-center gap-1"><Clock size={11} /> {timeAgo(when)}</span>}
        {v.claimUrl && (
          <span className="flex items-center gap-1 text-ink-faint"><ExternalLink size={11} /> leak-site listing</span>
        )}
      </div>
    </div>
  );
}
