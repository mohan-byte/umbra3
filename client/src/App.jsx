import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { SignupPage } from "./pages/SignupPage.jsx";
import { OverviewPage } from "./pages/OverviewPage.jsx";
import { ScanPage } from "./pages/ScanPage.jsx";
import { RadarPage } from "./pages/RadarPage.jsx";
import { VulnerabilitiesPage } from "./pages/VulnerabilitiesPage.jsx";
import { WatchlistPage } from "./pages/WatchlistPage.jsx";
import { SettingsPage } from "./pages/SettingsPage.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected — requires a valid session (JWT) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<OverviewPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/radar" element={<RadarPage />} />
          <Route path="/vulnerabilities" element={<VulnerabilitiesPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
