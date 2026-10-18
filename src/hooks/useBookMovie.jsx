import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { startBooking } from "../store/bookingSlice";
import { nextDays } from "../data/mockData";
import LanguageSheet from "../components/LanguageSheet";

// Opening a movie: single-language movies go straight to showtimes,
// multi-language ones first ask which language to book.
export default function useBookMovie() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const filterLanguage = useSelector((s) => s.movies.language);
  const [pending, setPending] = useState(null);

  const start = (movie, language) => {
    dispatch(startBooking({ movieId: movie.id, language, date: nextDays(1)[0].iso }));
    navigate(`/movie/${movie.id}/shows`);
  };

  const openMovie = (movie) => (movie.languages.length > 1 ? setPending(movie) : start(movie, movie.languages[0]));

  const languagePicker = pending && (
    <LanguageSheet
      movie={pending}
      preferred={pending.languages.includes(filterLanguage) ? filterLanguage : null}
      onSelect={(lang) => { setPending(null); start(pending, lang); }}
      onClose={() => setPending(null)}
    />
  );

  return { openMovie, languagePicker };
}
