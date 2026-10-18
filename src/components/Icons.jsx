// Small inline SVG icon set, stroke-based so they inherit `color`.
const Svg = ({ children, size = 22, fill = "none", ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {children}
  </svg>
);

export const BackIcon = (p) => <Svg {...p}><path d="M15 18l-6-6 6-6" /></Svg>;
export const ChevronRight = (p) => <Svg size={12} {...p}><path d="M9 18l6-6-6-6" /></Svg>;
export const SearchIcon = (p) => <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></Svg>;
export const BellIcon = (p) => <Svg {...p}><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 01-3.4 0" /></Svg>;
export const ScanIcon = (p) => <Svg {...p}><path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M7 12h10" /></Svg>;
export const HeartIcon = ({ filled, ...p }) => (
  <Svg size={16} fill={filled ? "currentColor" : "none"} {...p}>
    <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 000-7.8z" />
  </Svg>
);
export const InfoIcon = (p) => <Svg size={14} {...p}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h0" /></Svg>;
export const PencilIcon = (p) => <Svg size={12} {...p}><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></Svg>;
export const PhoneIcon = (p) => <Svg size={20} {...p}><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" /></Svg>;
export const CloseIcon = (p) => <Svg {...p}><path d="M18 6L6 18M6 6l12 12" /></Svg>;
export const StarIcon = (p) => <Svg size={12} fill="currentColor" stroke="none" {...p}><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" /></Svg>;

export const HomeIcon = (p) => <Svg {...p}><path d="M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" /></Svg>;
export const FilmIcon = (p) => <Svg {...p}><rect x="2" y="6" width="14" height="12" rx="2" /><path d="M16 10l6-3v10l-6-3" /></Svg>;
export const TicketIcon = (p) => <Svg {...p}><path d="M3 8a2 2 0 002-2h14a2 2 0 002 2v2a2 2 0 000 4v2a2 2 0 00-2 2H5a2 2 0 00-2-2v-2a2 2 0 000-4z" /><path d="M13 6v2M13 11v2M13 16v2" /></Svg>;
export const ExpandIcon = (p) => <Svg {...p}><path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3" /></Svg>;
export const CollapseIcon = (p) => <Svg {...p}><path d="M8 3v3a2 2 0 01-2 2H3M21 8h-3a2 2 0 01-2-2V3M3 16h3a2 2 0 012 2v3M16 21v-3a2 2 0 012-2h3" /></Svg>;
export const ChevronLeft =(p) => <Svg {...p}><path d="M15 18l-6-6 6-6" /></Svg>;
export const ChevronRightLg = (p) => <Svg {...p}><path d="M9 18l6-6-6-6" /></Svg>;
export const PinIcon = (p) => <Svg size={14} {...p}><path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></Svg>;
export const UserIcon = (p) => <Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></Svg>;


// Windows does not render flag emoji, so draw it.
export const IndiaFlag = () => (
  <svg width="22" height="15" viewBox="0 0 30 20" className="flag">
    <rect width="30" height="20" fill="#fff" />
    <rect width="30" height="6.67" fill="#FF9933" />
    <rect y="13.33" width="30" height="6.67" fill="#138808" />
    <circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" strokeWidth=".8" />
  </svg>
);

