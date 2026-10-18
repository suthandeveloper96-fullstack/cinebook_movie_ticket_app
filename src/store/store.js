import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import moviesReducer from "./moviesSlice";
import bookingReducer from "./bookingSlice";
import { loadAppState, saveAppState, loadUserBookings, saveUserBookings } from "./persist";

// Survives a refresh: login state, taken seats (shared, anonymous) and the
// signed-in user's own bookings (stored per user).
function loadState() {
  const { auth, takenSeats } = loadAppState();
  if (!auth) return undefined;
  return {
    auth,
    booking: {
      ...bookingReducer(undefined, { type: "@@init" }),
      takenSeats: takenSeats ?? {},
      bookings: loadUserBookings(auth.user),
    },
  };
}

export const store = configureStore({
  reducer: { auth: authReducer, movies: moviesReducer, booking: bookingReducer },
  preloadedState: loadState(),
});

store.subscribe(() => {
  const { auth, booking } = store.getState();
  saveAppState({ auth, takenSeats: booking.takenSeats });
  saveUserBookings(auth.user, booking.bookings);
});
