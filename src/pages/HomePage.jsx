import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectFeaturedMovies, selectFilteredMovies, selectMustWatch } from "../store/moviesSlice";
import useBookMovie from "../hooks/useBookMovie";
import MovieCard from "../components/MovieCard";
import BottomNav from "../components/BottomNav";
import SiteHeader from "../components/SiteHeader";
import HeroCarousel from "../components/HeroCarousel";
import LanguageTabs from "../components/LanguageTabs";
import SearchBar from "../components/SearchBar";
import OfferBanner from "../components/OfferBanner";

export default function HomePage() {
  const navigate = useNavigate();
  const { city, search } = useSelector((s) => s.movies);
  const featured = useSelector(selectFeaturedMovies);
  const movies = useSelector(selectFilteredMovies);
  const mustWatch = useSelector(selectMustWatch);
  const { openMovie, languagePicker } = useBookMovie();

  return (
    <div className="screen with-nav">
      <div className="glow" />
      <SiteHeader />

      <div className="page">
        <SearchBar />
        {!search && (
          <>
            <h1 className="page-tagline">Book movie tickets</h1>
            <HeroCarousel movies={featured} onBook={openMovie} />
          </>
        )}

        <section className="section">
          <div className="section-head">
            <h3>🎬 Now showing in {city}</h3>
            <button className="link" onClick={() => navigate("/movies")}>See all ›</button>
          </div>
          <LanguageTabs />
          <div className="h-scroll movie-row">
            {movies.map((m) => <MovieCard key={m.id} movie={m} onClick={() => openMovie(m)} />)}
            {!movies.length && <p className="muted">No movies match your search.</p>}
          </div>
        </section>

        {!search && (
          <section className="section">
            <div className="section-head"><h3>⭐ Movies you can't miss</h3></div>
            <div className="h-scroll">
              {mustWatch.map((m) => <MovieCard key={m.id} movie={m} onClick={() => openMovie(m)} />)}
            </div>
          </section>
        )}

        <OfferBanner />
      </div>

      <BottomNav />
      {languagePicker}
    </div>
  );
}
