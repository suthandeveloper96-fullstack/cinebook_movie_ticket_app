import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRightLg, StarIcon } from "./Icons";
import { handlePosterError, languageLabel } from "../data/mockData";

// Large auto-rotating banner of featured movies: blurred poster as backdrop, sharp poster on the side.
export default function HeroCarousel({ movies, onBook }) {
  const [index, setIndex] = useState(0);
  const count = movies.length;

  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(id);
  }, [count]);

  if (!count) return null;
  const go = (step) => setIndex((i) => (i + step + count) % count);

  return (
    <div className="hero">
      <div className="hero-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {movies.map((m) => (
          <div key={m.id} className="hero-slide">
            <div className="hero-bg" style={{ backgroundImage: `url(${m.poster})` }} />
            <img className="hero-poster" src={m.poster} alt={m.title} onError={handlePosterError} />
            <div className="hero-overlay">
              <span className="hero-tag">Now showing</span>
              <h2>{m.title}</h2>
              <p>{m.certificate} • {languageLabel(m)}</p>
              <p className="hero-genre">{m.genre} • {m.duration}</p>
              <div className="hero-actions">
                <button className="btn-primary" onClick={() => onBook(m)}>Book tickets</button>
                <span className="hero-rating"><StarIcon /> {m.rating}/10</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button className="hero-arrow left" onClick={() => go(-1)} aria-label="Previous"><ChevronLeft /></button>
          <button className="hero-arrow right" onClick={() => go(1)} aria-label="Next"><ChevronRightLg /></button>
          <div className="hero-dots">
            {movies.map((m, i) => (
              <span key={m.id} className={i === index ? "active" : ""} onClick={() => setIndex(i)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
