const rs = (n) => `₹${n.toFixed(2)}`;

// Confirmation dialog showing the refund breakdown before cancelling.
export default function CancelSheet({ ticket, refund, onConfirm, onClose }) {
  const { bill } = ticket;
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet cancel-sheet" onClick={(e) => e.stopPropagation()}>
        <h3>Cancel this booking?</h3>
        <p className="muted small">
          {ticket.movieTitle} • {ticket.seats.length} ticket(s) • {ticket.seats.join(", ")}
        </p>

        <div className="refund-box">
          <div><span>Amount paid</span><span>{rs(bill.total)}</span></div>
          <div><span>Convenience fee (non-refundable)</span><span className="red">- {rs(bill.convenience)}</span></div>
          <div className="refund-total"><span>Refund amount</span><span>{rs(refund)}</span></div>
        </div>
        <p className="muted small">Refund goes to your original payment method in 5–7 working days.</p>

        <div className="sheet-actions">
          <button className="btn-outline" onClick={onClose}>Keep ticket</button>
          <button className="btn-danger" onClick={onConfirm}>Yes, cancel</button>
        </div>
      </div>
    </div>
  );
}
