import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../store/moviesSlice";
import { SearchIcon, CloseIcon } from "./Icons";

export default function SearchBar() {
  const dispatch = useDispatch();
  const search = useSelector((s) => s.movies.search);
  return (
    <div className="search-bar">
      <SearchIcon size={18} />
      <input placeholder={'Search "The Dark Knight"'} value={search} onChange={(e) => dispatch(setSearch(e.target.value))} />
      {search && (
        <button className="icon-btn" onClick={() => dispatch(setSearch(""))} aria-label="Clear">
          <CloseIcon size={16} />
        </button>
      )}
    </div>
  );
}
