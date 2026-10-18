import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatDate, handlePosterError } from "../data/mockData";
import BottomNav from "../components/BottomNav";
import SiteHeader from "../components/SiteHeader";

export default function TicketsPage() {
  const bookings = useSelector((s) => s.booking.bookings);

  return (
    <div className="screen with-nav">
      <div className="glow" />
      <SiteHeader />
      <div className="page">
        <h1 className="page-tagline">My Tickets</h1>
        {!bookings.length && (
          <div className="empty">
            <div className="empty-art">🎟️</div>
            <h3>No bookings yet</h3>
            <p className="muted">Your movie tickets will appear here.</p>
            <Link to="/movies" className="btn-primary inline">Browse movies</Link>
          </div>
        )}
        <div className="order-grid">
          {bookings.map((b) => (
            <Link key={b.id} to={`/ticket/${b.id}`} className={`order-card ${b.status === "cancelled" ? "cancelled" : ""}`}>
              <img src={b.poster} alt={b.movieTitle} onError={handlePosterError} />
              <div>
                <h4>{b.movieTitle} <span className="muted small">• {b.language}{b.dubbed && " (Dubbed)"}</span></h4>
                <p>{formatDate(b.date)} | {b.showTime}</p>
                <p>{b.theatreName}</p>
                <p className="muted small">Seats: {b.seats.join(", ")} • ₹{b.bill.total.toFixed(2)}</p>
                {b.status === "cancelled" && (
                  <span className="status-badge">Cancelled · ₹{b.refund.toFixed(2)} refunded</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
