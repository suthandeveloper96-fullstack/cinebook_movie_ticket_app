import { useNavigate } from "react-router-dom";
import { BackIcon } from "./Icons";

// Back-arrow header used on the booking flow screens.
export default function TopBar({ title, subtitle, dark = false, children }) {
  const navigate = useNavigate();
  return (
    <header className={`topbar ${dark ? "dark" : ""}`}>
      <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back">
        <BackIcon />
      </button>
      <div className="topbar-title">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="topbar-actions">{children}</div>
    </header>
  );
}
