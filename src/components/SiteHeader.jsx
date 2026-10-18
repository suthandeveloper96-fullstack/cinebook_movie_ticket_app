import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { tabs } from "./BottomNav";
import { PinIcon, ExpandIcon, CollapseIcon } from "./Icons";

// Toggles browser full screen (hidden where the Fullscreen API is unavailable, e.g. iPhone Safari).
function FullscreenButton() {
  const [isFull, setIsFull] = useState(() => !!document.fullscreenElement);

  useEffect(() => {
    const onChange = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  if (!document.fullscreenEnabled) return null;

  const toggle = () =>
    (isFull ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {});

  return (
    <button className="icon-btn fullscreen-btn" onClick={toggle} title={isFull ? "Exit full screen" : "Full screen"}>
      {isFull ? <CollapseIcon size={18} /> : <ExpandIcon size={18} />}
    </button>
  );
}

export const Logo = ({ big = false }) => (
  <span className={`logo ${big ? "big" : ""}`}>
    cinebook
    <small>MOVIE TICKETS</small>
  </span>
);

// Top header. On desktop it also carries the main navigation.
export default function SiteHeader({ children }) {
  const city = useSelector((s) => s.movies.city);
  return (
    <header className="site-header">
      <div className="brand-block">
        <Link to="/"><Logo /></Link>
        <span className="city-pill"><PinIcon /> {city}</span>
      </div>
      <nav className="desktop-nav">
        {tabs.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? "active" : "")}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="header-icons">
        {children}
        <FullscreenButton />
      </div>
    </header>
  );
}
