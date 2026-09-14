import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Circle, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = (user?.name || user?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-white/[0.06] bg-base-970/70 px-4 backdrop-blur-xl lg:px-6">
      <form
        onSubmit={(e) => { e.preventDefault(); if (q.trim()) navigate(`/scan?domain=${encodeURIComponent(q.trim())}`); }}
        className="relative flex-1 md:max-w-lg"
      >
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Scan any domain — e.g. adobe.com…"
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/25"
        />
      </form>

      <div className="ml-auto flex items-center gap-2.5">

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] py-1.5 pl-2 pr-2.5 hover:border-white/[0.16]"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/20 text-sm font-semibold text-brand-soft">
              {initials}
            </div>
            <div className="hidden text-left leading-tight sm:block">
              <div className="max-w-[140px] truncate text-xs font-semibold text-ink">{user?.name || "Account"}</div>
              <div className="max-w-[140px] truncate text-[10px] text-ink-faint">{user?.email}</div>
            </div>
            <ChevronDown size={14} className="text-ink-faint" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-white/[0.08] bg-base-900 shadow-panel">
                <div className="border-b border-white/[0.06] px-3.5 py-3">
                  <div className="truncate text-sm font-medium text-ink">{user?.name}</div>
                  <div className="truncate text-xs text-ink-faint">{user?.email}</div>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); logout(); navigate("/"); }}
                  className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-ink-soft hover:bg-white/[0.04] hover:text-sev-critical"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
