import { StarIcon } from "./Icons";
import { handlePosterError } from "../data/mockData";

export default function MovieCard({ movie, onClick }) {
  return (
    <div className="movie-card" onClick={onClick}>
      <div className="poster">
        <img src={movie.poster} alt={movie.title} loading="lazy" onError={handlePosterError} />
        <span className="cert">{movie.certificate}</span>
        <div className="rating-bar">
          <StarIcon className="star" /> {movie.rating}/10 <span>{movie.votes} votes</span>
        </div>
      </div>
      <h4>{movie.title}</h4>
      <p>{movie.languages[0]}{movie.languages.length > 1 && ` + ${movie.languages.length - 1} more`} • {movie.genre}</p>
    </div>
  );
}
