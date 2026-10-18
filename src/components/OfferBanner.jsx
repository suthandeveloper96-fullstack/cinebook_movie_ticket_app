import { useEffect, useState } from "react";
import { COUPONS } from "../data/mockData";

// Home promo for a coupon, with one-tap copy of the code.
export default function OfferBanner({ coupon = COUPONS[0] }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
    } catch {
      setCopied(false); // clipboard blocked; the code is still visible to type in
    }
  };

  return (
    <div className="offer-banner">
      <div>
        <b>{coupon.title}</b>
        <p>Use code <span className="code">{coupon.code}</span> at checkout</p>
        <p className="offer-desc">{coupon.description}</p>
      </div>
      <div className="offer-side">
        <span className="offer-emoji">🍿</span>
        <button className={`copy-btn ${copied ? "done" : ""}`} onClick={copy}>
          {copied ? "✓ Copied" : "Copy code"}
        </button>
      </div>
    </div>
  );
}
