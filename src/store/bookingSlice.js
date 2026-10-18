import { createSlice, createSelector } from "@reduxjs/toolkit";
import { seatClasses, CONVENIENCE_FEE_PER_TICKET, findCoupon } from "../data/mockData";
import { login, logout } from "./authSlice";

const initialState = {
  movieId: null,
  language: null, // e.g. "Tamil" for the Tamil-dubbed Dangal
  date: null,
  theatreId: null,
  showTime: null,
  screen: null,
  ticketCount: 2,
  selectedSeats: [], // e.g. ["H14", "H15"]
  couponCode: null, // applied coupon, e.g. "STAR5"
  bookings: [], // signed-in user's bookings only
  takenSeats: {}, // { [showKey]: ["H14", ...] } seats booked by anyone; holds no personal data
};

// Identifies one screening; works for both a booking record and the in-progress booking state.
export const showKeyOf = (b) => [b.movieId, b.language, b.theatreId, b.date, b.showTime].join("|");

export const classForSeat = (seatId) => seatClasses.find((c) => c.rows.includes(seatId[0]));
export const priceForSeat = (seatId) => classForSeat(seatId)?.price ?? 0;

export const CANCEL_CUTOFF_HOURS = 2;

// "2026-10-16" + "06:45 PM" -> local Date
export const showStart = (date, time) => {
  const [hm, ap] = time.split(" ");
  const [h, m] = hm.split(":").map(Number);
  const d = new Date(`${date}T00:00:00`);
  d.setHours((h % 12) + (ap === "PM" ? 12 : 0), m);
  return d;
};

// Whether a booking can be cancelled now, and how much is refunded (convenience fee is non-refundable).
export function cancellationInfo(booking, now = new Date()) {
  if (booking.status === "cancelled") return { allowed: false, reason: "This booking has been cancelled" };
  if (!booking.cancellable) return { allowed: false, reason: "Cancellation not available for this venue" };
  const hoursLeft = (showStart(booking.date, booking.showTime) - now) / 36e5;
  if (hoursLeft < 0) return { allowed: false, reason: "The show has already started" };
  if (hoursLeft < CANCEL_CUTOFF_HOURS)
    return { allowed: false, reason: `Cancellation closes ${CANCEL_CUTOFF_HOURS} hours before the show` };
  const refund = +(booking.bill.total - booking.bill.convenience).toFixed(2);
  return { allowed: true, refund, reason: `Cancellation available up to ${CANCEL_CUTOFF_HOURS} hours before the show` };
}

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    startBooking(state, { payload }) {
      state.movieId = payload.movieId;
      state.language = payload.language;
      state.date = payload.date;
      state.theatreId = null;
      state.showTime = null;
      state.selectedSeats = [];
      state.couponCode = null;
    },
    setBookingLanguage(state, { payload }) {
      state.language = payload;
      state.theatreId = null;
      state.showTime = null;
      state.selectedSeats = [];
    },
    setDate(state, { payload }) {
      state.date = payload;
    },
    selectShow(state, { payload }) {
      state.theatreId = payload.theatreId;
      state.showTime = payload.time;
      state.screen = payload.screen;
      state.selectedSeats = [];
    },
    setTicketCount(state, { payload }) {
      state.ticketCount = payload;
      state.selectedSeats = [];
    },
    // payload: one seat id. Ignored once the chosen ticket count is reached.
    pickSeat(state, { payload }) {
      if (state.selectedSeats.length < state.ticketCount && !state.selectedSeats.includes(payload))
        state.selectedSeats.push(payload);
    },
    unpickSeat(state, { payload }) {
      state.selectedSeats = state.selectedSeats.filter((s) => s !== payload);
    },
    // Unknown codes clear the coupon; validate with findCoupon first to show an error.
    applyCoupon(state, { payload }) {
      state.couponCode = findCoupon(payload)?.code ?? null;
    },
    removeCoupon(state) {
      state.couponCode = null;
    },
    // payload: booking id. Re-checks the rules so an expired booking can't be cancelled.
    cancelBooking(state, { payload }) {
      const booking = state.bookings.find((b) => b.id === payload);
      if (!booking) return;
      const info = cancellationInfo(booking);
      if (!info.allowed) return;
      booking.status = "cancelled";
      booking.cancelledAt = new Date().toISOString();
      booking.refund = info.refund;
      const key = showKeyOf(booking);
      state.takenSeats[key] = (state.takenSeats[key] ?? []).filter((s) => !booking.seats.includes(s));
    },
    confirmBooking(state, { payload }) {
      state.bookings.unshift(payload);
      const key = showKeyOf(payload);
      state.takenSeats[key] = [...(state.takenSeats[key] ?? []), ...payload.seats];
      state.selectedSeats = [];
      state.couponCode = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login, (state, { payload }) => {
        state.bookings = payload.bookings;
      })
      .addCase(logout, (state) => {
        state.bookings = [];
        state.selectedSeats = [];
        state.couponCode = null;
      });
  },
});

export const { startBooking, setBookingLanguage, setDate, selectShow, setTicketCount, pickSeat, unpickSeat, applyCoupon, removeCoupon, cancelBooking, confirmBooking } =
  bookingSlice.actions;

export const computeBill = (seats, couponCode) => {
  const coupon = couponCode ? findCoupon(couponCode) : null;
  const ticketPrice = seats.reduce((sum, s) => sum + priceForSeat(s), 0);
  const convenience = +(seats.length * CONVENIENCE_FEE_PER_TICKET).toFixed(2);
  const discount = coupon ? +((ticketPrice * coupon.percent) / 100).toFixed(2) : 0;
  const donation = seats.length ? 1 : 0;
  const total = +(ticketPrice + convenience - discount + donation).toFixed(2);
  return { ticketPrice, convenience, discount, couponCode: coupon?.code ?? null, donation, total };
};

export const selectBill = createSelector(
  [(state) => state.booking.selectedSeats, (state) => state.booking.couponCode],
  computeBill
);

const NO_SEATS = [];

// Seats already booked (by any user) for the show being booked, so they show as sold.
export const selectTakenSeats = (state) => state.booking.takenSeats[showKeyOf(state.booking)] ?? NO_SEATS;

export default bookingSlice.reducer;
