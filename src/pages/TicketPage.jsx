import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { formatDate, handlePosterError } from "../data/mockData";
import { classForSeat, cancelBooking, cancellationInfo } from "../store/bookingSlice";
import { CloseIcon, PhoneIcon } from "../components/Icons";
import CancelSheet from "../components/CancelSheet";
import SupportDialog from "../components/SupportDialog";

const rs = (n) => `Rs.${n.toFixed(2)}`;

export default function TicketPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ticket = useSelector((s) => s.booking.bookings.find((b) => b.id === id));
  const [showDetails, setShowDetails] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  if (!ticket) return <Navigate to="/tickets" replace />;
  const { bill } = ticket;
  const cancelled = ticket.status === "cancelled";
  const cancel = cancellationInfo(ticket);

  return (
    <div className="screen ticket-screen">
      <header className="ticket-top">
        <span />
        <h2>Your Ticket</h2>
        <button className="icon-btn" onClick={() => navigate("/")} aria-label="Close"><CloseIcon /></button>
      </header>

      {cancelled && (
        <div className="cancelled-banner">
          <b>Booking cancelled</b>
          <span>
            Refund of ₹{ticket.refund.toFixed(2)} will reach your original payment method in 5–7 working days.
          </span>
        </div>
      )}

      <div className={`ticket ${cancelled ? "is-cancelled" : ""}`}>
        <div className="ticket-movie">
          <img src={ticket.poster} alt={ticket.movieTitle} onError={handlePosterError} />
          <div>
            <h3>{ticket.movieTitle} ({ticket.certificate})</h3>
            <p>{ticket.language}{ticket.dubbed && " (Dubbed)"}, {ticket.format}</p>
            <p>{formatDate(ticket.date)} | {ticket.showTime}</p>
            <p>{ticket.theatreName}</p>
          </div>
          <span className="m-ticket">M-Ticket</span>
        </div>

        <button className="ticket-toggle" onClick={() => setShowDetails((v) => !v)}>
          Tap to {showDetails ? "hide" : "view"} details
        </button>

        {showDetails && (
          <div className="ticket-details">
            <p className="muted">{ticket.seats.length} Ticket(s)</p>
            <h2>{ticket.screen}</h2>
            <p className="muted small">{classForSeat(ticket.seats[0])?.id} - {ticket.seats.join(", ")}</p>
            {cancelled ? (
              <div className="qr void">CANCELLED</div>
            ) : (
              <div className="qr"><QRCodeSVG value={`${ticket.id}|${ticket.theatreId}|${ticket.date}|${ticket.showTime}|${ticket.seats.join(",")}`} size={120} /></div>
            )}
            <p className="booking-id">BOOKING ID: {ticket.id}</p>
          </div>
        )}

        <p className="cancel-note">{cancelled ? `Cancelled on ${new Date(ticket.cancelledAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}` : cancel.reason}</p>

        <button className="support" onClick={() => setSupportOpen(true)}><PhoneIcon /><span>Contact<br />support</span></button>

        <div className="ticket-divider" />

        <div className="bill">
          <div className="bill-total">
            <span>Total Amount {bill.discount > 0 && <em>₹{bill.discount.toFixed(2)} saved</em>}</span>
            <b>{rs(bill.total)}</b>
          </div>
          <div><span>Ticket price ({ticket.seats.length})</span><span>{rs(bill.ticketPrice)}</span></div>
          <div><span>Convenience fees</span><span>{rs(bill.convenience)}</span></div>
          {bill.discount > 0 && (
            <div><span>Discount{bill.couponCode && ` (${bill.couponCode})`}</span><span className="green">- {rs(bill.discount)}</span></div>
          )}
          <div><span>Smile Donation (1)</span><span>+ {rs(bill.donation)}</span></div>
          {cancelled && (
            <div className="bill-refund"><span>Refunded</span><span>{rs(ticket.refund)}</span></div>
          )}
        </div>
      </div>

      {cancel.allowed && (
        <button className="btn-cancel" onClick={() => setConfirming(true)}>
          Cancel booking · Refund ₹{cancel.refund.toFixed(2)}
        </button>
      )}

      <Link to="/tickets" className="btn-outline">My Tickets</Link>

      {supportOpen && <SupportDialog onClose={() => setSupportOpen(false)} />}

      {confirming && cancel.allowed && (
        <CancelSheet
          ticket={ticket}
          refund={cancel.refund}
          onClose={() => setConfirming(false)}
          onConfirm={() => { dispatch(cancelBooking(ticket.id)); setConfirming(false); }}
        />
      )}
    </div>
  );
}
