import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldHalf, ArrowRight, Loader2, AlertCircle, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Could not create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="umbra-bg flex min-h-screen items-center justify-center p-6">
      <div className="panel w-full max-w-sm p-7">
        <Link to="/" className="mb-5 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/15 shadow-glow">
            <ShieldHalf className="h-6 w-6 text-brand-soft" />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight text-ink">Umbra</div>
            <div className="text-[10px] uppercase tracking-widest text-ink-faint">by CVE House</div>
          </div>
        </Link>

        <h2 className="text-lg font-semibold text-ink">Create your account</h2>
        <p className="mt-1 text-sm text-ink-faint">Start monitoring your domain's exposure in minutes.</p>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-sev-critical/30 bg-sev-critical/[0.08] px-3 py-2.5 text-xs text-sev-critical">
              <AlertCircle size={14} className="shrink-0" /> {error}
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-soft">Full name</label>
            <input
              type="text" required autoFocus value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Jane Analyst"
              className="w-full rounded-lg border border-base-700 bg-base-850 px-3 py-2.5 text-sm text-ink focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-soft">Work email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="analyst@yourcompany.com"
              className="w-full rounded-lg border border-base-700 bg-base-850 px-3 py-2.5 text-sm text-ink focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-soft">Password</label>
            <input
              type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-lg border border-base-700 bg-base-850 px-3 py-2.5 text-sm text-ink focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <>Create account <ArrowRight size={16} /></>}
          </button>
        </form>

        <ul className="mt-5 space-y-1.5 border-t border-white/[0.06] pt-4">
          {["Unlimited domain scans", "Live dark-web & CVE monitoring", "Persistent watchlist"].map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs text-ink-faint"><Check size={12} className="text-ok" /> {f}</li>
          ))}
        </ul>

        <div className="mt-4 text-center text-xs text-ink-faint">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-soft hover:text-brand">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
