import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In dev, `npm run dev` here (port 5173) proxies /api to the Express server
// (port 3001, `npm run dev` in ../server) so you get instant HMR without
// CORS headaches. In production, `npm run build` outputs to dist/ and the
// Express server serves those static files directly on its own port —
// there is no separate client server in production.
export default defineConfig({
  plugins: [react()],
  server: {
    host:true,
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
