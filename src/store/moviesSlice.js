import { createSlice, createSelector } from "@reduxjs/toolkit";
import { movies, theatres, MUST_WATCH_IDS } from "../data/mockData";

const moviesSlice = createSlice({
  name: "movies",
  initialState: { list: movies, theatres, city: "Chennai", search: "", language: "All" },
  reducers: {
    setSearch(state, { payload }) {
      state.search = payload;
    },
    setLanguage(state, { payload }) {
      state.language = payload;
    },
  },
});

export const { setSearch, setLanguage } = moviesSlice.actions;

export const selectMovieById = (id) => (state) => state.movies.list.find((m) => m.id === id);
export const selectTheatreById = (id) => (state) => state.movies.theatres.find((t) => t.id === id);

export const selectFeaturedMovies = createSelector([(s) => s.movies.list], (list) => list.filter((m) => m.featured));

export const selectFilteredMovies = createSelector(
  [(s) => s.movies.list, (s) => s.movies.search, (s) => s.movies.language],
  (list, search, language) => {
    const q = search.trim().toLowerCase();
    return list.filter(
      (m) => (!q || m.title.toLowerCase().includes(q)) && (language === "All" || m.languages.includes(language))
    );
  }
);

export const selectMustWatch = createSelector([(s) => s.movies.list], (list) =>
  MUST_WATCH_IDS.map((id) => list.find((m) => m.id === id)).filter(Boolean)
);

export default moviesSlice.reducer;
