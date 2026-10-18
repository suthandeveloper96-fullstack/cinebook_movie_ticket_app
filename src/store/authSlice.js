import { createSlice } from "@reduxjs/toolkit";
import { loadUserBookings } from "./persist";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {
    // payload: { user, bookings } - bookingSlice swaps in this user's bookings in the same action
    login(state, { payload }) {
      state.user = payload.user; // { name, method, phone }
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

// Logs in and loads only this user's saved bookings.
export const loginUser = (user) => (dispatch) => dispatch(login({ user, bookings: loadUserBookings(user) }));

export default authSlice.reducer;
