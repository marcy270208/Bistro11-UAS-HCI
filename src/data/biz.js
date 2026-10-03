/* Business details, credentials and seed content - edit contact info here. */

export const STAFF = { user: "chef", pass: "bistro11", name: "Chef Rian", title: "Kitchen manager" };

export const SEED_ACCOUNTS = [
  {
    name: "Rania Putri", email: "rania@example.com", pass: "bistro123",
    phone: "0811 2233 4455", address: "Jl. Lantern No. 11, Jakarta Selatan", avatar: ""
  }
];

export const SEED_REVIEWS = [
  { id: "r1", name: "Nadia P.", stars: 5, dish: "Beef Tasting Trio", date: "2026-09-24",
    text: "The trio is worth the walk across town. Braised short rib fell apart under the spoon and nobody rushed us out of the table.", hidden: false },
  { id: "r2", name: "Marcus O.", stars: 5, dish: "The Eleven Cheeseburger", date: "2026-09-21",
    text: "Ordered it with the buttermilk chicken for the table and everything landed hot at once. That is harder than it sounds.", hidden: false },
  { id: "r3", name: "Sekar A.", stars: 4, dish: "Pesto Farfalle, Blistered Tomato", date: "2026-09-18",
    text: "Genuinely good pesto - not the bitter jar kind. I would happily take it down to Rp110.000 and give me more tomato.", hidden: false },
  { id: "r4", name: "Tom H.", stars: 5, dish: "Butter Croissant", date: "2026-09-15",
    text: "Came for coffee, left with four croissants. The layers actually shatter. Ask the bakery person what the ferment is.", hidden: false },
  { id: "r5", name: "Ines D.", stars: 4, dish: "Strawberry & Lime Cordial Fizz", date: "2026-09-09",
    text: "Refreshing and not too sweet, which is rare for a mocktail. Room was loud by nine so book the counter.", hidden: false }
];

export const PROMOS = {
  BISTRO11: { type: "pct", value: 11, label: "Eleven percent off" },
  FIRSTBITE: { type: "flat", value: 40000, label: "Rp40.000 off your first order" },
  LATEPASS: { type: "pct", value: 20, label: "Late kitchen discount" }
};

/* how the guest settles the bill - [key, icon, label, hint] */
export const PAY_METHODS = [
  ["qris", "📱", "QRIS", "scan it now"],
  ["card", "💳", "Card", "Visa · Mastercard"],
  ["cash", "💵", "Cash", "rider or counter"],
  ["transfer", "🏦", "Bank transfer", "virtual account"]
];
export const payLabel = k => PAY_METHODS.find(p => p[0] === k)?.[2] || "";

export const BIZ = {
  name: "Bistro Eleven",
  tagline: "A neighbourhood kitchen with eleven seats and no shortcuts.",
  street: ["Jl. Lantern No. 11", "Kebayoran Baru, Jakarta Selatan 12160"],
  phoneTel: "+62217220011",
  phoneShow: "+62 21 722 0011",
  wa: "6281122334455",
  email: "halo@bistroeleven.id",
  hours: [["Mon - Thu", "11:30 - 22:00"], ["Fri - Sat", "11:30 - 23:30"], ["Sunday", "09:00 - 21:00"]],
  mapQuery: "https://www.google.com/maps/search/?api=1&query=Jl.+Lantern+No+11+Kebayoran+Baru+Jakarta",
  socials: {
    instagram: "https://instagram.com/bistro.eleven",
    facebook: "https://facebook.com/bistroeleven",
    x: "https://x.com/bistroeleven",
    tiktok: "https://tiktok.com/@bistro.eleven"
  },
  payments: ["Visa", "Mastercard", "GoPay", "OVO", "Cash"]
};

export const TAX_RATE = 0.0825;
export const SERVICE_RATE = 0.05;
export const DELIVERY_FEE = 39000;
export const FREE_OVER = 360000;
export const PICKUP_FEE = 12000;
export const SPICE_WORDS = [
  "no chilli at all", "just a warm hum", "medium - the house balance",
  "properly hot", "fire. signed for it."
];
