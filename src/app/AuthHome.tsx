import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import TimerPage from "../pages/TimerPage";
import Home from "../pages/Home";
import SettingsPage from "../pages/SettingsPage";
import { faClock, faGear, faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AuthHome() {
  return (
    <Router>
      <header className="text-2xl text-red-400 flex justify-between">
        <Link className="hover:text-red-500" to="/">
          <FontAwesomeIcon icon={faHouse} />
        </Link>
        <div className="flex gap-5">
          <Link className="hover:text-red-500" to="/timer">
            <FontAwesomeIcon icon={faClock} />
          </Link>
          <Link className="hover:text-red-500" to="/settings">
            <FontAwesomeIcon icon={faGear} />
          </Link>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}
