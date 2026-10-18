import { useSelector } from "react-redux";
import { selectFilteredMovies } from "../store/moviesSlice";
import useBookMovie from "../hooks/useBookMovie";
import MovieCard from "../components/MovieCard";
import BottomNav from "../components/BottomNav";
import SiteHeader from "../components/SiteHeader";
import LanguageTabs from "../components/LanguageTabs";
import SearchBar from "../components/SearchBar";

export default function MoviesPage() {
  const city = useSelector((s) => s.movies.city);
  const movies = useSelector(selectFilteredMovies);
  const { openMovie, languagePicker } = useBookMovie();

  return (
    <div className="screen with-nav">
      <div className="glow" />
      <SiteHeader />
      <div className="page">
        <SearchBar />
        <h1 className="page-tagline">Movies in {city}</h1>
        <LanguageTabs />
        <div className="movie-grid">
          {movies.map((m) => <MovieCard key={m.id} movie={m} onClick={() => openMovie(m)} />)}
        </div>
        {!movies.length && <p className="muted center">No movies match your filters.</p>}
      </div>
      <BottomNav />
      {languagePicker}
    </div>
  );
}
