import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../store/moviesSlice";
import { LANGUAGES } from "../data/mockData";

export default function LanguageTabs() {
  const dispatch = useDispatch();
  const language = useSelector((s) => s.movies.language);
  return (
    <div className="pill-tabs">
      {LANGUAGES.map((l) => (
        <button key={l} className={l === language ? "active" : ""} onClick={() => dispatch(setLanguage(l))}>
          {l}
        </button>
      ))}
    </div>
  );
}
