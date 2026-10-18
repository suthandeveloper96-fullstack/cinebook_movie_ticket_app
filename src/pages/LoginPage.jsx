import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../store/authSlice";
import { IndiaFlag } from "../components/Icons";
import { Logo } from "../components/SiteHeader";

const slides = [
  { art: "🎬", text: "Every new release, every cinema in your city. All in one place." },
  { art: "🍿", text: "Pick your favourite seats in seconds and skip the queue." },
  { art: "🎟️", text: "Your M-Ticket is ready the moment you book. Just scan and walk in." },
];

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const from = useLocation().state?.from; // page the user tried to open before logging in
  const [slide, setSlide] = useState(0);
  const [phone, setPhone] = useState("");
  const signedIn = useSelector((s) => !!s.auth.user);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 3000);
    return () => clearInterval(id);
  }, []);

  const finish = (user) => {
    dispatch(loginUser(user));
    navigate(from ?? "/", { replace: true });
  };

  const validPhone = /^[6-9]\d{9}$/.test(phone); // Indian mobile numbers start with 6-9

  if (signedIn) return <Navigate to="/" replace />;

  return (
    <div className="screen login">
      <div className="login-hero">
        <Logo big />
        <div className="carousel">
          <div className="carousel-art">{slides[slide].art}</div>
          <p>{slides[slide].text}</p>
          <div className="dots">
            {slides.map((_, i) => (
              <span key={i} className={i === slide ? "active" : ""} onClick={() => setSlide(i)} />
            ))}
          </div>
        </div>
      </div>

      <div className="login-panel">
      <h2 className="login-title">Get Started</h2>

      <form
        className="login-actions"
        onSubmit={(e) => { e.preventDefault(); validPhone && finish({ name: "+91 " + phone, method: "phone", phone }); }}
      >
        <label className="login-label" htmlFor="phone">Enter your mobile number</label>
        <div className="phone-input">
          <IndiaFlag />
          <span>+91</span>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={10}
            placeholder="10-digit mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          />
        </div>
        {phone.length === 10 && !validPhone && <p className="coupon-error">Enter a valid Indian mobile number</p>}
        <button className="btn-primary" disabled={!validPhone}>Continue</button>
      </form>

      <p className="terms">
        I agree to the<br />
        <a href="#">Terms &amp; Conditions</a> and <a href="#">Privacy Policy</a>
      </p>
      </div>
    </div>
  );
}
