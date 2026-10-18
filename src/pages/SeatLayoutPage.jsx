import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { selectMovieById, selectTheatreById } from "../store/moviesSlice";
import {
  selectShow, setTicketCount, pickSeat, unpickSeat, confirmBooking,
  selectBill, selectTakenSeats, showKeyOf,
} from "../store/bookingSlice";
import { seatClasses, rowLayout, isSold, isBestseller, formatDate, showsFor, isDubbed } from "../data/mockData";
import TopBar from "../components/TopBar";
import TicketCountSheet from "../components/TicketCountSheet";
import CouponBox from "../components/CouponBox";
import { PencilIcon } from "../components/Icons";

const makeBookingId = () =>
  "WN" + Array.from({ length: 4 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");

export default function SeatLayoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const booking = useSelector((s) => s.booking);
  const movie = useSelector(selectMovieById(booking.movieId));
  const theatre = useSelector(selectTheatreById(booking.theatreId));
  const bill = useSelector(selectBill);
  const takenSeats = useSelector(selectTakenSeats);
  // Ask for ticket count on arrival, but not when coming back with seats already picked.
  const [sheetOpen, setSheetOpen] = useState(booking.selectedSeats.length === 0);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(id);
  }, [notice]);

  const showKey = showKeyOf(booking);
  const unavailable = useMemo(() => {
    const set = new Set(takenSeats);
    seatClasses.forEach((c) => c.rows.forEach((r) => rowLayout.forEach((n) => n && isSold(showKey, r + n) && set.add(r + n))));
    return set;
  }, [showKey, takenSeats]);

  if (!movie || !theatre || !booking.showTime) return <Navigate to="/" replace />;

  const { selectedSeats, ticketCount, language } = booking;
  const languageText = `${language}${isDubbed(movie, language) ? " (Dubbed)" : ""}`;

  // One tap selects (or deselects) exactly one seat; the user picks each seat they want.
  const onSeat = (row, index) => {
    const id = row + rowLayout[index];
    if (selectedSeats.includes(id)) return dispatch(unpickSeat(id));
    if (selectedSeats.length >= ticketCount) {
      return setNotice(
        `You've already selected ${ticketCount} seat${ticketCount > 1 ? "s" : ""}. Tap a selected seat to remove it, or change the ticket count.`
      );
    }
    dispatch(pickSeat(id));
  };

  const pay = () => {
    const id = makeBookingId();
    dispatch(confirmBooking({
      id,
      movieId: movie.id,
      movieTitle: movie.title,
      certificate: movie.certificate,
      language,
      dubbed: isDubbed(movie, language),
      format: movie.formats[0],
      poster: movie.poster,
      theatreId: theatre.id,
      theatreName: theatre.name,
      screen: booking.screen,
      cancellable: theatre.cancellable,
      date: booking.date,
      showTime: booking.showTime,
      seats: [...selectedSeats].sort((a, b) => a[0].localeCompare(b[0]) || parseInt(a.slice(1)) - parseInt(b.slice(1))),
      bill,
      bookedAt: new Date().toISOString(),
    }));
    navigate(`/ticket/${id}`, { replace: true });
  };

  const complete = selectedSeats.length === ticketCount;

  return (
    <div className="screen seat-screen">
      <TopBar title={`${movie.title} - ${languageText}`} subtitle={theatre.name} />

      <div className="seat-subhead">
        <span>{formatDate(booking.date)}</span>
        <button className="link red" onClick={() => setSheetOpen(true)}>
          <PencilIcon /> {ticketCount} Ticket{ticketCount > 1 ? "s" : ""}
        </button>
      </div>
      <p className="seat-count-hint">
        {selectedSeats.length < ticketCount
          ? `Select ${ticketCount - selectedSeats.length} more seat${ticketCount - selectedSeats.length > 1 ? "s" : ""} (${selectedSeats.length}/${ticketCount} selected)`
          : `All ${ticketCount} seats selected: ${[...selectedSeats].join(", ")}`}
      </p>
      <div className="show-chips">
        {showsFor(theatre, movie.id, language).map((s) => (
          <button
            key={s.time}
            className={`show-btn ${s.time === booking.showTime ? "active" : ""}`}
            onClick={() => dispatch(selectShow({ theatreId: theatre.id, time: s.time, screen: s.screen }))}
          >
            {s.time}
            <small>{s.screen}</small>
          </button>
        ))}
      </div>

      <div className="seat-map">
        <div className="seat-map-inner">
          {seatClasses.map((cls) => (
            <div key={cls.id} className="seat-class">
              <div className="class-label">₹{cls.price} {cls.id}</div>
              {cls.rows.map((row) => (
                <div key={row} className="seat-row">
                  <span className="row-label">{row}</span>
                  {rowLayout.map((n, i) => {
                    if (n === null) return <span key={i} className="gap" />;
                    const id = row + n;
                    const sold = unavailable.has(id);
                    const selected = selectedSeats.includes(id);
                    const best = isBestseller(row, n);
                    return (
                      <button
                        key={id}
                        disabled={sold}
                        className={`seat ${sold ? "sold" : ""} ${selected ? "selected" : ""} ${best && !sold ? "best" : ""}`}
                        onClick={() => onSeat(row, i)}
                        aria-label={`Seat ${id}`}
                      >
                        {sold ? "" : n}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
          <div className="screen-curve" />
          <p className="screen-text">All eyes this way please!</p>
        </div>
      </div>

      <div className="legend">
        <span><i className="seat best" /> Bestseller</span>
        <span><i className="seat" /> Available</span>
        <span><i className="seat selected" /> Selected</span>
        <span><i className="seat sold" /> Sold</span>
      </div>

      <div className="seat-footer">
        <CouponBox />
        <button className="btn-primary" disabled={!complete} onClick={pay}>
          {complete ? (
            <>
              Pay ₹{bill.total.toFixed(2)}
              {bill.discount > 0 && <s className="was">₹{(bill.total + bill.discount).toFixed(2)}</s>}
            </>
          ) : (
            `Select ${ticketCount - selectedSeats.length} more seat(s)`
          )}
        </button>
      </div>

      {notice && <div className="toast" role="status">{notice}</div>}

      {sheetOpen && (
        <TicketCountSheet
          initial={ticketCount}
          onClose={() => setSheetOpen(false)}
          onConfirm={(n) => { dispatch(setTicketCount(n)); setSheetOpen(false); }}
        />
      )}
    </div>
  );
}
