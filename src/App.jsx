import { useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import ShowtimesPage from "./pages/ShowtimesPage";
import SeatLayoutPage from "./pages/SeatLayoutPage";
import TicketPage from "./pages/TicketPage";
import ProfilePage from "./pages/ProfilePage";
import TicketsPage from "./pages/TicketsPage";

// Every page except login needs a signed-in mobile number; after login the user returns to where they were going.
function RequireAuth({ children }) {
  const user = useSelector((s) => s.auth.user);
  const location = useLocation();
  return user ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
        <Route path="/movies" element={<RequireAuth><MoviesPage /></RequireAuth>} />
        <Route path="/tickets" element={<RequireAuth><TicketsPage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/movie/:movieId/shows" element={<RequireAuth><ShowtimesPage /></RequireAuth>} />
        <Route path="/seats" element={<RequireAuth><SeatLayoutPage /></RequireAuth>} />
        <Route path="/ticket/:id" element={<RequireAuth><TicketPage /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
