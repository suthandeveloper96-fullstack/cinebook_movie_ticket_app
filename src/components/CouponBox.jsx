import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyCoupon, removeCoupon, selectBill } from "../store/bookingSlice";
import { COUPONS, findCoupon } from "../data/mockData";

// Checkout coupon entry: type a code or tap a suggested one.
export default function CouponBox() {
  const dispatch = useDispatch();
  const couponCode = useSelector((s) => s.booking.couponCode);
  const { discount } = useSelector(selectBill);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const apply = (value) => {
    const coupon = findCoupon(value);
    if (!value.trim()) return setError("Enter a coupon code");
    if (!coupon) return setError(`"${value.trim().toUpperCase()}" is not a valid coupon`);
    dispatch(applyCoupon(coupon.code));
    setCode("");
    setError("");
  };

  if (couponCode) {
    const coupon = findCoupon(couponCode);
    return (
      <div className="coupon-box applied">
        <span className="offer-logo">✓</span>
        <div className="coupon-text">
          <b>{coupon.code} applied</b>
          <span>{discount > 0 ? `You save ₹${discount.toFixed(2)}` : `${coupon.percent}% off once you pick seats`}</span>
        </div>
        <button className="link" onClick={() => dispatch(removeCoupon())}>Remove</button>
      </div>
    );
  }

  return (
    <div className="coupon-box">
      <form className="coupon-form" onSubmit={(e) => { e.preventDefault(); apply(code); }}>
        <span className="offer-logo">%</span>
        <input
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
          maxLength={20}
        />
        <button type="submit" className="link">Apply</button>
      </form>
      {error ? (
        <p className="coupon-error">{error}</p>
      ) : (
        <div className="coupon-suggest">
          {COUPONS.map((c) => (
            <button key={c.code} type="button" onClick={() => apply(c.code)}>
              <b>{c.code}</b> · {c.percent}% off tickets
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
