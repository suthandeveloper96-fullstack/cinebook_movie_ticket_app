import { useEffect, useState } from "react";
import { SUPPORT_PHONE } from "../data/mockData";
import { CloseIcon, PhoneIcon } from "./Icons";

// Small popup with the customer support number.
export default function SupportDialog({ onClose }) {
  const [copied, setCopied] = useState(false);

  // Esc closes the dialog
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_PHONE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked; the number is still visible */
    }
  };

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="support-dialog" role="dialog" aria-modal="true" aria-labelledby="support-title" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn dialog-close" onClick={onClose} aria-label="Close"><CloseIcon size={18} /></button>
        <span className="support-icon"><PhoneIcon /></span>
        <h3 id="support-title">Contact support</h3>
        <p className="muted small">Call us for help with your booking</p>
        <p className="support-number">{SUPPORT_PHONE}</p>
        <div className="support-actions">
          <a className="btn-primary" href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}>Call</a>
          <button className="btn-outline" onClick={copy}>{copied ? "✓ Copied" : "Copy"}</button>
        </div>
      </div>
    </div>
  );
}
