import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import BottomNav from "../components/BottomNav";
import SiteHeader from "../components/SiteHeader";
import { UserIcon, TicketIcon, ChevronRightLg } from "../components/Icons";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const count = useSelector((s) => s.booking.bookings.length);

  return (
    <div className="screen with-nav">
      <div className="glow" />
      <SiteHeader />
      <div className="page narrow">
        <div className="profile-card">
          <span className="avatar"><UserIcon /></span>
          <div>
            <h2>{user.name}</h2>
            <p className="muted small">Signed in with mobile number</p>
          </div>
        </div>

        <Link to="/tickets" className="menu-row">
          <TicketIcon size={20} />
          <span>My Tickets</span>
          <span className="badge">{count}</span>
          <ChevronRightLg size={18} />
        </Link>

        <button className="btn-outline" onClick={() => { dispatch(logout()); navigate("/login"); }}>
          Sign Out
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
