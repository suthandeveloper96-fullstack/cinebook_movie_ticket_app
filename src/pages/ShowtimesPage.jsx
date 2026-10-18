import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { selectMovieById } from "../store/moviesSlice";
import { startBooking, setBookingLanguage, setDate, selectShow } from "../store/bookingSlice";
import { nextDays, showsFor, isDubbed } from "../data/mockData";
import TopBar from "../components/TopBar";
import { HeartIcon, InfoIcon, StarIcon } from "../components/Icons";

const timeFilters = [
  { id: "morning", label: "Before 12 PM", test: (h) => h < 12 },
  { id: "afternoon", label: "12 PM - 6 PM", test: (h) => h >= 12 && h < 18 },
  { id: "night", label: "After 6 PM", test: (h) => h >= 18 },
];

const to24h = (t) => {
  const [hm, ap] = t.split(" ");
  const h = +hm.split(":")[0] % 12;
  return ap === "PM" ? h + 12 : h;
};

export default function ShowtimesPage() {
  const { movieId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const movie = useSelector(selectMovieById(movieId));
  const theatres = useSelector((s) => s.movies.theatres);
  const booking = useSelector((s) => s.booking);
  const [filter, setFilter] = useState(null);
  const [favs, setFavs] = useState(() => theatres.filter((t) => t.favourite).map((t) => t.id));
  const days = nextDays(7);

  // Deep link / refresh: make sure the booking points at this movie and one of its languages.
  useEffect(() => {
    if (movie && (booking.movieId !== movieId || !movie.languages.includes(booking.language)))
      dispatch(startBooking({ movieId, language: movie.languages[0], date: days[0].iso }));
  }, [movieId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!movie) return <Navigate to="/" replace />;
  const language = movie.languages.includes(booking.language) ? booking.language : movie.languages[0];

  const activeFilter = timeFilters.find((f) => f.id === filter);
  const toggleFav = (id) => setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  const sorted = [...theatres].sort((a, b) => favs.includes(b.id) - favs.includes(a.id));

  const openShow = (theatre, show) => {
    dispatch(selectShow({ theatreId: theatre.id, time: show.time, screen: show.screen }));
    navigate("/seats");
  };

  return (
    <div className="screen grey">
      <TopBar title={movie.title} />

      <div className="date-strip">
        {days.map((d) => (
          <button key={d.iso} className={booking.date === d.iso ? "active" : ""} onClick={() => dispatch(setDate(d.iso))}>
            <small>{d.day}</small>
            <b>{d.date}</b>
            <small>{d.month}</small>
          </button>
        ))}
      </div>

      {movie.languages.length > 1 && (
        <div className="lang-switch">
          <span className="muted small">Language</span>
          {movie.languages.map((l) => (
            <button key={l} className={`chip ${l === language ? "active" : ""}`} onClick={() => dispatch(setBookingLanguage(l))}>
              {l}{isDubbed(movie, l) && " (Dubbed)"}
            </button>
          ))}
        </div>
      )}

      <div className="format-line">
        {language}{isDubbed(movie, language) && " (Dubbed)"} • {movie.formats.join(", ")}
      </div>

      <div className="chips">
        {timeFilters.map((f) => (
          <button key={f.id} className={`chip ${filter === f.id ? "active" : ""}`} onClick={() => setFilter(filter === f.id ? null : f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="theatre-list">
        {sorted.map((t) => {
          const all = showsFor(t, movie.id, language);
          const shows = activeFilter ? all.filter((s) => activeFilter.test(to24h(s.time))) : all;
          if (!shows.length) return null;
          const fav = favs.includes(t.id);
          return (
            <div key={t.id} className="theatre-card">
              <div className="theatre-info">
              <div className="theatre-head">
                <button className={`heart ${fav ? "on" : ""}`} onClick={() => toggleFav(t.id)} aria-label="Favourite">
                  <HeartIcon filled={fav} />
                </button>
                <h4>{t.name}</h4>
                <span className="info"><InfoIcon /> INFO</span>
              </div>
              <p className="muted small">{t.cancellable ? "Cancellation available" : "Non-cancellable"}</p>
              {t.offer && <p className="offer"><StarIcon className="red" /> {t.offer}</p>}
              </div>
              <div className="show-buttons">
                {shows.map((s) => (
                  <button key={s.time} className="show-btn" onClick={() => openShow(t, s)}>
                    {s.time}
                    <small>{s.screen}</small>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="footnote">
        <span className="lang-tag">LAN</span> indicates subtitles language, if available
      </div>
    </div>
  );
}
