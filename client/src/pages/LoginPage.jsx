import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldHalf, ArrowRight, Radio, KeyRound, Database, Bell, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const highlights = [
  { icon: KeyRound, text: "Breached & stealer-logged credentials" },
  { icon: Database, text: "Leaked PII, financial, source-code & client data" },
  { icon: Radio, text: "Threat-actor chatter & ransomware leak sites" },
  { icon: Bell, text: "Real-time alerts the moment you surface" },
];

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="umbra-bg grid min-h-screen lg:grid-cols-2">
      {/* Left: brand / value prop */}
      <div className="relative hidden flex-col justify-between p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/images/cvehouse.png" alt="Umbra" className="w-[70px] h-auto object-contain"/>
        </Link>

        <div className="max-w-md">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-ink">
            Know what the dark web knows about your company.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Umbra continuously sweeps breach dumps, stealer logs, forums, markets, paste sites,
            Telegram and ransomware leak sites for your domain&apos;s fingerprints — and alerts you
            before attackers act on them.
          </p>
          <ul className="mt-6 space-y-3">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-ink-soft">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/12 text-brand-soft">
                  <Icon size={16} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-xs text-ink-faint">© 2026 CVE House · Dark Web Threat Intelligence</div>
      </div>

      {/* Right: sign-in */}
      <div className="flex items-center justify-center p-6">
        <div className="panel w-full max-w-sm p-7">
          <div className="mb-1 flex items-center gap-2 lg:hidden">
            <ShieldHalf className="h-6 w-6 text-brand-soft" />
            <span className="text-lg font-semibold text-ink">Umbra</span>
          </div>
          <h2 className="text-lg font-semibold text-ink">Sign in to Umbra</h2>
          <p className="mt-1 text-sm text-ink-faint">Access your organization&apos;s threat intelligence.</p>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-sev-critical/30 bg-sev-critical/[0.08] px-3 py-2.5 text-xs text-sev-critical">
                <AlertCircle size={14} className="shrink-0" /> {error}
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-soft">Work email</label>
              <input
                type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@yourcompany.com"
                className="w-full rounded-lg border border-base-700 bg-base-850 px-3 py-2.5 text-sm text-ink focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-soft">Password</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-base-700 bg-base-850 px-3 py-2.5 text-sm text-ink focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Sign in <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-ink-faint">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-medium text-brand-soft hover:text-brand">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
