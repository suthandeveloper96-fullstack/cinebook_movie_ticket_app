import { NavLink } from "react-router-dom";
import { HomeIcon, FilmIcon, TicketIcon, UserIcon } from "./Icons";

export const tabs = [
  { to: "/", label: "For you", Icon: HomeIcon, end: true },
  { to: "/movies", label: "Movies", Icon: FilmIcon },
  { to: "/tickets", label: "My Tickets", Icon: TicketIcon },
  { to: "/profile", label: "Profile", Icon: UserIcon },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {tabs.map(({ to, label, Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? "active" : "")}>
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
