import { useState } from "react";
import { seatClasses } from "../data/mockData";

const vehicle = (n) => (n === 1 ? "🚲" : n === 2 ? "🛵" : n <= 4 ? "🛺" : n <= 6 ? "🚗" : "🚌");

// Bottom sheet asking "How many seats?" before seat selection.
export default function TicketCountSheet({ initial, onConfirm, onClose }) {
  const [count, setCount] = useState(initial);

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <h3>How many seats?</h3>
        <div className="sheet-vehicle">{vehicle(count)}</div>
        <div className="count-row">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button key={n} className={n === count ? "active" : ""} onClick={() => setCount(n)}>
              {n}
            </button>
          ))}
        </div>
        <div className="sheet-prices">
          {seatClasses.map((c) => (
            <div key={c.id}><small>{c.id}</small><b>₹{c.price}</b><span className="green">Available</span></div>
          ))}
        </div>
        <button className="btn-primary" onClick={() => onConfirm(count)}>Select Seats</button>
      </div>
    </div>
  );
}
