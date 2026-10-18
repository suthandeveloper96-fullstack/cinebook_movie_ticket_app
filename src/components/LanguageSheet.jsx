import { isDubbed } from "../data/mockData";
import { CloseIcon } from "./Icons";

// "Select language" picker shown before booking a movie that plays in several languages.
export default function LanguageSheet({ movie, preferred, onSelect, onClose }) {
  // Put the language the user is filtering by first.
  const options = [...movie.languages].sort((a, b) => (b === preferred) - (a === preferred));

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet lang-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <div>
            <h3>{movie.title}</h3>
            <p className="muted small">Select language</p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><CloseIcon size={20} /></button>
        </div>

        <div className="lang-options">
          {options.map((lang) => (
            <button key={lang} className="lang-option" onClick={() => onSelect(lang)}>
              <span className="lang-name">
                {lang}
                {isDubbed(movie, lang) ? <em className="tag dubbed">Dubbed</em> : <em className="tag original">Original</em>}
                {lang === preferred && <em className="tag pref">Your filter</em>}
              </span>
              <span className="lang-formats">
                {movie.formats.map((f) => <span key={f}>{f}</span>)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
