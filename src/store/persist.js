// localStorage helpers. Each user's bookings live under their own key so one
// account never sees another account's tickets on the same browser.
const APP_KEY = "cinebook-state"; // { auth, takenSeats } - no personal booking data
const userBookingsKey = (user) => `cinebook-bookings:${user.phone}`;

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode etc.) */
  }
};

export const loadAppState = () => read(APP_KEY, {});
export const saveAppState = (state) => write(APP_KEY, state);

export const loadUserBookings = (user) => (user?.phone ? read(userBookingsKey(user), []) : []);
export const saveUserBookings = (user, bookings) => user?.phone && write(userBookingsKey(user), bookings);
