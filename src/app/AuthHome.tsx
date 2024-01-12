import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TimerPage from "../pages/TimerPage";
import Home from "../pages/Home";

export default function AuthHome() {
  return (
    <main>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/timer" element={<TimerPage />} />
        </Routes>
      </Router>
    </main>
  );
}
