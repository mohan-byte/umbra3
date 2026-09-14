/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      opacity: { 8: "0.08", 12: "0.12", 15: "0.15" },
      colors: {
        base: {
          970: "#050609",
          950: "#070810",
          900: "#0a0c15",
          850: "#0e1019",
          800: "#12141f",
          750: "#171a27",
          700: "#1f2333",
          600: "#2b3042",
          500: "#3a4157",
        },
        ink: {
          DEFAULT: "#eef1f8",
          soft: "#aab3c8",
          faint: "#6d7691",
        },
        brand: {
          DEFAULT: "#7c5cff",
          soft: "#a892ff",
          dim: "#5a41c9",
        },
        cyan: {
          DEFAULT: "#22d3ee",
          dim: "#0e7490",
        },
        sev: {
          critical: "#ff415b",
          high: "#ff8a3d",
          medium: "#ffce4a",
          low: "#4db8ff",
          info: "#7c8598",
        },
        ok: "#2fd98a",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 18px 40px -22px rgba(0,0,0,0.8)",
        glow: "0 0 0 1px rgba(124,92,255,0.4), 0 0 40px -8px rgba(124,92,255,0.55)",
        glowcyan: "0 0 0 1px rgba(34,211,238,0.35), 0 0 40px -10px rgba(34,211,238,0.5)",
      },
      keyframes: {
        pulseglow: { "0%,100%": { opacity: "0.55" }, "50%": { opacity: "1" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        fadeup: { "0%": { opacity: "0", transform: "translateY(6px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        sweep: { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
      },
      animation: {
        pulseglow: "pulseglow 2.4s ease-in-out infinite",
        shimmer: "shimmer 1.8s infinite",
        fadeup: "fadeup 0.4s ease-out both",
        sweep: "sweep 4s linear infinite",
      },
    },
  },
  plugins: [],
};
