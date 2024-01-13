import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import TimerPage from "../pages/TimerPage";
import Home from "../pages/Home";
import SettingsPage from "../pages/SettingsPage";

export default function AuthHome() {
  return (
    <Router>
      <header>
        <Link to="/">Home</Link>
        <Link to="/timer">Timer</Link>
        <Link to="/settings">Settings</Link>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/timer" element={<TimerPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </Router>
  );
}
