// Movie catalogue. Posters live in public/posters/.
// `languages`: original language first, then dubbed versions (also listed in `dubbed`).
const poster = (file) => `/posters/${file}`;

export const movies = [
  { id: "shawshank-redemption", title: "The Shawshank Redemption", certificate: "U/A", rating: 9.3, votes: "3M", languages: ["English"], dubbed: [], formats: ["2D"], genre: "Drama", duration: "2h 22m", poster: poster("shawshank-redemption.png") },
  { id: "the-godfather", title: "The Godfather", certificate: "A", rating: 9.2, votes: "2.1M", languages: ["English"], dubbed: [], formats: ["2D"], genre: "Crime, Drama", duration: "2h 55m", poster: poster("the-godfather.png") },
  { id: "the-dark-knight", title: "The Dark Knight", certificate: "U/A", rating: 9.0, votes: "2.9M", languages: ["English"], dubbed: [], formats: ["2D", "IMAX 2D"], genre: "Action, Crime, Drama", duration: "2h 32m", featured: true, poster: poster("the-dark-knight.png") },
  { id: "hridayam", title: "Hridayam", certificate: "U", rating: 8.1, votes: "27K", languages: ["Malayalam", "Tamil"], dubbed: ["Tamil"], formats: ["2D"], genre: "Romance, Drama", duration: "2h 52m", poster: poster("hridayam.png") },
  { id: "vaaranam-aayiram", title: "Vaaranam Aayiram", certificate: "U", rating: 8.3, votes: "35K", languages: ["Tamil"], dubbed: [], formats: ["2D"], genre: "Romance, Drama", duration: "2h 49m", featured: true, poster: poster("vaaranam-aayiram.png") },
  { id: "jersey", title: "Jersey", certificate: "U", rating: 8.5, votes: "39K", languages: ["Telugu", "Tamil"], dubbed: ["Tamil"], formats: ["2D"], genre: "Sports, Drama", duration: "2h 37m", featured: true, poster: poster("jersey.png") },
  { id: "billa", title: "Billa", certificate: "U/A", rating: 7.0, votes: "14K", languages: ["Tamil"], dubbed: [], formats: ["2D"], genre: "Action, Crime, Thriller", duration: "2h 10m", featured: true, poster: poster("billa.png") },
  { id: "dangal", title: "Dangal", certificate: "U", rating: 8.3, votes: "210K", languages: ["Hindi", "Tamil", "Telugu"], dubbed: ["Tamil", "Telugu"], formats: ["2D"], genre: "Sports, Biography, Drama", duration: "2h 41m", featured: true, poster: poster("dangal.png") },
];

// "Malayalam, Tamil (Dubbed)"
export const languageLabel = (m) => m.languages.map((l) => (m.dubbed?.includes(l) ? `${l} (Dubbed)` : l)).join(", ");

// Shown when a poster file is missing or fails to load.
export const FALLBACK_POSTER = "https://picsum.photos/seed/cinebook-fallback/300/450";
export const handlePosterError = (e) => {
  if (e.currentTarget.src !== FALLBACK_POSTER) e.currentTarget.src = FALLBACK_POSTER;
};

// Hand-picked, in display order, for the "Movies you can't miss" row on Home.
export const MUST_WATCH_IDS = ["shawshank-redemption", "billa", "the-dark-knight", "jersey", "vaaranam-aayiram", "dangal"];

export const LANGUAGES = ["All", "Tamil", "English", "Malayalam", "Telugu", "Hindi"];

// Customer support number shown from the ticket page.
export const SUPPORT_PHONE = "+91 88258981768";

// Real Chennai mall cinemas; showtimes and screens are mock data.
export const theatres = [
  {
    id: "chn-vr", name: "PVR: VR Mall, Anna Nagar", favourite: true, cancellable: true,
    offer: "5% off for Superstars  |  Use code: STAR5",
    shows: [{ time: "09:45 AM", screen: "AUDI 6" }, { time: "01:30 PM", screen: "4DX" }, { time: "06:30 PM", screen: "ICON" }, { time: "09:50 PM", screen: "AUDI 6" }],
  },
  {
    id: "chn-phoenix", name: "INOX: Phoenix Market City, Velachery", cancellable: false,
    shows: [{ time: "11:00 AM", screen: "SCREEN 2" }, { time: "03:15 PM", screen: "IMAX" }, { time: "07:30 PM", screen: "IMAX" }, { time: "10:45 PM", screen: "SCREEN 5" }],
  },
  {
    id: "chn-marina", name: "INOX: The Marina Mall, OMR, Egatoor", cancellable: true,
    shows: [{ time: "10:30 AM", screen: "SCREEN 1" }, { time: "02:15 PM", screen: "SCREEN 3" }, { time: "06:00 PM", screen: "INSIGNIA" }, { time: "09:30 PM", screen: "SCREEN 1" }],
  },
  {
    id: "chn-theyagaraja", name: "PVR: Theyagaraja, Thiruvanmiyur", cancellable: false,
    shows: [{ time: "11:30 AM", screen: "SCREEN 1" }, { time: "03:00 PM", screen: "SCREEN 1" }, { time: "06:45 PM", screen: "SCREEN 1" }, { time: "10:15 PM", screen: "SCREEN 1" }],
  },
];

// Seat classes, top (farthest from screen) to bottom.
export const seatClasses = [
  { id: "ELITE", price: 190, rows: ["A", "B", "C", "D", "E", "F", "G"] },
  { id: "CLASSIC", price: 150, rows: ["H", "I", "J", "K", "L", "M"] },
];

// Seat numbers per row, printed right-to-left like the reference design. `null` = gangway gap.
export const rowLayout = [22, null, 21, 20, 19, 18, 17, 16, 15, 14, 13, null, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, null, 2, 1];

const hash = (str) => {
  let h = 0;
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
};

// Deterministic "sold" seats so every show looks different but stays stable.
export const isSold = (showKey, seatId) => hash(showKey + seatId) % 100 < 28;

// Which of a theatre's shows screen this movie in this language (deterministic mock, at least one).
export function showsFor(theatre, movieId, language) {
  const shows = theatre.shows.filter((s) => hash(theatre.id + movieId + language + s.time) % 3 !== 0);
  return shows.length ? shows : theatre.shows.slice(0, 1);
}

export const isDubbed = (movie, language) => !!movie.dubbed?.includes(language);

export const isBestseller = (row, num) => ["D", "E", "J", "K"].includes(row) && num >= 13 && num <= 18;

export function nextDays(count = 7) {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      iso: d.toLocaleDateString("en-CA"), // YYYY-MM-DD in local time
      day: d.toLocaleDateString("en-IN", { weekday: "short" }).toUpperCase(),
      date: d.getDate(),
      month: d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
    };
  });
}

export const formatDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

export const CONVENIENCE_FEE_PER_TICKET = 35.4; // ₹30 + 18% GST
// Coupons the user can apply at checkout (discount is on the ticket price only).
export const COUPONS = [
  { code: "STAR5", percent: 5, title: "Get 5% off on every booking", description: "5% off on the ticket price. Valid on all movies and shows." },
];

export const findCoupon = (code) => COUPONS.find((c) => c.code === code.trim().toUpperCase());
