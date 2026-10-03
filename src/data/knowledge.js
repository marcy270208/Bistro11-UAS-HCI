/* ═══════════════════════════════════════════════════════════
   The assistant's knowledge base.
   Everything the live chat can answer lives here as plain data,
   so the chef can edit wording or keywords without touching the
   widget. `text` gets a ctx: { menu, onSale, count, money }.
   ═══════════════════════════════════════════════════════════ */
import { BIZ, PROMOS, PAY_METHODS, DELIVERY_FEE, FREE_OVER, PICKUP_FEE, STAFF } from "./biz.js";
import { money } from "../lib/format.js";

/* ids are stable - the transcript stores them, so renaming breaks old chats */
export const VISITOR_THREAD = "this-visitor";

export const CHAT_SUGGESTIONS = [
  "What is the chef's pick?",
  "Any vegan plates?",
  "How much is delivery?",
  "Do you take QRIS?",
  "Opening hours?"
];

const names = (arr, n = 4) => {
  const head = arr.slice(0, n).map(d => d.name).join(", ");
  return arr.length > n ? `${head} (+${arr.length - n} more)` : head;
};
const byTag = (menu, tag) => menu.filter(d => (d.tags || []).includes(tag));
const cheapest = menu => [...menu].sort((a, b) => a.price - b.price)[0];
const priciest = menu => [...menu].sort((a, b) => b.price - a.price)[0];
const range = menu => {
  const p = menu.map(d => d.price).sort((a, b) => a - b);
  return p.length ? `${money(p[0])} - ${money(p[p.length - 1])}` : "-";
};
const hoursLines = () => BIZ.hours.map(([d, t]) => `${d} ${t}`).join(" · ");
const promoLines = () => Object.entries(PROMOS).map(([c, p]) => `${c} - ${p.label}`).join(" · ");

/* keyed by the exact strings dish.alg uses */
const ALLERGEN_WORDS = [
  ["Tree nuts", ["nut", "peanut", "kacang", "almond", "cashew", "kaju"]],
  ["Dairy", ["dairy", "susu", "lactose", "keju", "cheese", "cream", "butter", "mentega"]],
  ["Gluten", ["gluten", "gandum", "wheat", "bread", "roti", "tepung"]],
  ["Egg", ["egg", "telur"]],
  ["Soy", ["soy", "kedelai", "tofu", "tahu"]],
  ["Sesame", ["sesame", "wijen"]],
  ["Fish", ["fish", "seafood", "ikan", "udang", "shrimp", "prawn"]],
  ["Sulphites", ["sulphite", "sulfite", "anggur"]]
];

export const TOPICS = [
  {
    id: "greet",
    keys: ["halo", "hai", "hi ", "hello", "hey", "pagi", "siang", "malam", "assalam", "good morning", "good evening", "selamat"],
    text: ({ count }) => `Hi - welcome to ${BIZ.name}. Ask me anything about the ${count} dishes on the board, allergens, prices, delivery or when we cook.`,
    chips: ["What is the chef's pick?", "Any vegan plates?"]
  },
  {
    id: "thanks",
    keys: ["thank", "thanks", "makasih", "terima kasih", "trimakasih", "nice", "great job"],
    text: () => `Anytime. If the kitchen can prep something ahead for you, just ask - ${STAFF.name} reads this board between services.`
  },
  {
    id: "menu",
    chip: "📖 What is on the menu?",
    keys: ["menu", "daftar", "makanan apa", "what do you serve", "serve", "food", "dishes", "pilihan"],
    text: ({ menu, onSale }) => `We cook ${onSale.length} plates across Starters, Mains, Pizza & Pasta, Desserts, Bakery and Drinks - everything sits between ${range(onSale)}. Categories: ${[...new Set(menu.map(d => d.cat))].join(", ")}.`,
    chips: ["What is the chef's pick?", "What is cheap?", "Any vegan plates?"],
    go: "menu"
  },
  {
    id: "hours",
    chip: "🕙 Opening hours",
    keys: ["hour", "hours", "open", "opens", "closing", "close", "tutup", "jam buka", "buka", "sampai jam", "waktu"],
    text: () => `Kitchen hours: ${hoursLines()}. Last orders go out thirty minutes before the close of each block.`,
    chips: ["Do I need a reservation?", "How far do you deliver?"]
  },
  {
    id: "where",
    keys: ["where", "address", "alamat", "lokasi", "location", "di mana", "dimana", "maps", "map", "arah"],
    text: () => `${BIZ.street[0]}, ${BIZ.street[1]}. Eleven seats at the counter and four small tables - the pin is on the Visit section, and ${BIZ.phoneShow} reaches us if you get lost.`,
    chips: ["Is there parking?", "Do I need a reservation?"],
    go: "visit"
  },
  {
    id: "parking",
    keys: ["parkir", "parking", "motor", "mobil", "car", "bike"],
    text: () => `Street parking along Jl. Lantern after 18:00, and a guarded lot two doors down for cars. Motorbikes can park in front of the window.`,
    chips: ["Where are you?"]
  },
  {
    id: "delivery",
    chip: "🛵 How much is delivery?",
    keys: ["deliver", "delivery", "kirim", "pengiriman", "gofood", "grabfood", "shopee", "ongkir", "antar", "pickup", "takeaway", "bawa pulang"],
    text: () => `Delivery is a flat ${money(DELIVERY_FEE)} anywhere in our zone and free over ${money(FREE_OVER)}. Pickup is ${money(PICKUP_FEE)} for the packaging and it is ready to collect about 20 minutes after you order.`,
    chips: ["How long does cooking take?", "Do you take QRIS?"]
  },
  {
    id: "payment",
    chip: "💳 Payment methods",
    keys: ["pay", "payment", "bayar", "qris", "card", "credit", "debit", "cash", "tunai", "transfer", "gopay", "ovo", "dana", "virtual account"],
    text: () => `${PAY_METHODS.map(p => `${p[1]} ${p[2]}`).join(" · ")} - plus ${BIZ.payments.join(", ")}. QRIS and cards are settled at the counter or with the rider.`,
    chips: ["Any promo codes?", "How much is delivery?"]
  },
  {
    id: "promo",
    keys: ["promo", "discount", "diskon", "voucher", "kode", "code", "murah sedikit", "deal"],
    text: () => `Working codes right now: ${promoLines()}. Type the code at checkout and we take it off the subtotal before tax.`,
    chips: ["Do you take QRIS?"]
  },
  {
    id: "chefpick",
    chip: "⭐ Chef's recommendation",
    keys: ["recommend", "rekomendasi", "suggest", "best", "signature", "famous", "popular", "chef pick", "chef's pick", "paling enak", "enak", "favorite", "favorit", "must try",
      "menu favorit", "makanan favorit", "rekomendasi menu", "apa yang enak", "pilihan terbaik", "what should i order", "what to order", "best seller", "terlaris", "most ordered"],
    text: ({ onSale }) => {
      const picks = onSale.filter(d => d.badge === "chef");
      const hot = onSale.filter(d => d.rating >= 4.8);
      const top = [...new Set([...picks, ...hot])].slice(0, 3);
      return `The board's regulars: ${names(top, 3)}. ${top[0] ? top[0].desc : ""}`;
    },
    chips: ["What is cheap?", "Anything spicy?"]
  },
  {
    id: "budget",
    keys: ["cheap", "murah", "budget", "afford", "expensive", "mahal", "price", "harga", "berapa harga", "termurah", "under", "below"],
    text: ({ onSale }) => {
      const lo = cheapest(onSale), hi = priciest(onSale);
      return `Plates run ${range(onSale)}. Cheapest is ${lo.name} at ${money(lo.price)}, the splurge is ${hi.name} at ${money(hi.price)}. Tell me a budget and I will pick from it.`;
    },
    chips: ["What is the chef's pick?", "Any vegan plates?"],
    go: "menu"
  },
  {
    id: "vegan",
    keys: ["vegan", "nabati", "plant based", "plant-based", "no dairy", "dairy free", "bebas susu"],
    text: ({ menu }) => {
      const v = byTag(menu, "vegan");
      return v.length
        ? `Fully plant-based right now: ${names(v)}. Everything else can be built without cheese or cream - say the word in the order note.`
        : `Nothing is labelled fully vegan today, but most plates can drop the dairy - ask me about a specific dish.`;
    },
    chips: ["Vegetarian options?", "Any allergens in those?"]
  },
  {
    id: "vegetarian",
    keys: ["vegetarian", "veggie", "sayuran", "sayur", "no meat", "tanpa daging"],
    text: ({ onSale }) => `Veggie-friendly: ${names(onSale.filter(d => d.badge === "veg" || (d.tags || []).some(t => ["vegetarian", "vegan"].includes(t))), 5)}.`,
    chips: ["Any vegan plates?"]
  },
  {
    id: "halal",
    keys: ["halal", "haram", "pork", "babi", "alcohol", "alkohol", "wine", "bacon", "gelatin"],
    text: ({ menu }) => `No pork and no lard ever enters the kitchen, and the mocktail list (${names(menu.filter(d => (d.tags || []).includes("no-alcohol")), 3)}) is alcohol-free. We are not a certified halal kitchen - alcohol is used in two sauces, so ask which before you order.`,
    chips: ["What is in that sauce?", "Any allergens in those?"]
  },
  {
    id: "allergen",
    chip: "🥜 Allergens",
    keys: ["allergen", "alergen", "allergy", "alergi", "gluten", "gandum", "lactose", "lactosa", "dairy", "susu", "nut", "kacang", "peanut", "tree nut", "soy", "kedelai", "egg", "telur", "sesame", "wijen", "seafood", "ikan", "udang", "shrimp", "sulphite", "sulfite"],
    text: ({ onSale, q = " " }) => {
      const bad = ALLERGEN_WORDS.find(([, ws]) => ws.some(w => q.includes(w)));
      if (bad) {
        const safe = onSale.filter(d => !(d.alg || []).includes(bad[0]));
        return `${bad[0]} is out of ${names(safe, 6)} - that is ${safe.length} of the ${onSale.length} plates on the board. Tap any of them and its card lists the rest. We run one fryer and one grill, so write it in the order note if this is a true allergy and the kitchen will plate it separately.`;
      }
      return `Every card lists its allergens and I can read any dish back to you. Across the board we cook with: ${[...new Set(onSale.flatMap(d => d.alg || []))].join(", ")}. Name the dish and I will list what is in it.`;
    },
    chips: ["What is in the Rainbow Bistro Bowl?", "Any vegan plates?"]
  },
  {
    id: "spicy",
    keys: ["spicy", "pedas", "chilli", "chili", "cabai", "hot", "level", "pedess"],
    text: ({ onSale }) => `Flagged hot: ${names(onSale.filter(d => d.badge === "hot"), 4)}. Anything else can be finished with the house chilli oil on request - tell us the level in the order note.`,
    chips: ["What is the chef's pick?"]
  },
  {
    id: "kids",
    keys: ["kid", "kids", "anak", "children", "baby", "bayi", "balita", "family", "keluarga"],
    text: ({ onSale }) => `Little people do well with ${names(onSale.filter(d => (d.tags || []).includes("kids") || d.badge === "veg").slice(0, 3), 3) || "the bakery counter, the pasta and the roast chicken"}. We cut nothing into halves but we plate without chilli, and high chairs live by the door.`,
    chips: ["Anything spicy?"]
  },
  {
    id: "coffee",
    keys: ["coffee", "kopi", "espresso", "latte", "cold brew", "croissant", "pastry", "roti", "bakery", "dessert", "manis", "sweet", "cake", "cokelat", "chocolate"],
    text: ({ menu }) => {
      const drinks = menu.filter(d => d.cat === "Drinks"), bake = menu.filter(d => ["Bakery", "Desserts"].includes(d.cat));
      return `Bakery and sweets: ${names(bake, 4)}. Cold and hot drinks: ${names(drinks, 4)}. The croissant laminates overnight, so the first tray lands at 07:30.`;
    },
    chips: ["What is cheap?", "Opening hours?"]
  },
  {
    id: "time",
    keys: ["how long", "lama", "wait", "waiting", "delay", "prep", "berapa lama", "cepat", "fast", "minutes"],
    text: ({ onSale }) => {
      const avg = Math.round(onSale.reduce((t, d) => t + d.mins, 0) / Math.max(1, onSale.length));
      const quick = [...onSale].sort((a, b) => a.mins - b.mins).slice(0, 2);
      return `Most plates fire in ${avg} minutes; the fastest are ${names(quick, 2)}. Delivery adds whatever the rider needs - we never send food out cold.`;
    },
    chips: ["How much is delivery?"]
  },
  {
    id: "healthy",
    keys: ["calorie", "calories", "kcal", "kalori", "diet", "healthy", "sehat", "protein", "gizi", "nutrition"],
    text: ({ onSale }) => {
      const light = [...onSale].sort((a, b) => a.kcal - b.kcal).slice(0, 3);
      return `Every card shows its kcal. The lightest three today: ${names(light, 3)}. We cook with real olive oil, so "light" is relative - nothing here is boiled and sad.`;
    },
    chips: ["Any vegan plates?", "What is the chef's pick?"]
  },
  {
    id: "booking",
    keys: ["book", "booking", "reservation", "reservasi", "table", "meja", "seat", "kursi", "tempat duduk", "walk in"],
    text: () => `Eleven counter seats and four tables, first come first served. For five or more, ring ${BIZ.phoneShow} or WhatsApp ${BIZ.wa} and we hold the back room - no deposit.`,
    chips: ["Where are you?", "Can I bring a group?"]
  },
  {
    id: "group",
    keys: ["group", "grup", "rombongan", "party", "acara", "event", "sewa", "private", "ulang tahun", "birthday"],
    text: () => `Groups of 6-14 work well: we pre-set the back room, the kitchen fires in waves so nothing lands cold, and the bill splits however you like. Message ${BIZ.phoneShow} two days ahead.`,
    chips: ["Do I need a reservation?"]
  },
  {
    id: "wifi",
    keys: ["wifi", "wi-fi", "internet", "laptop", "kerja", "work", "colokan", "socket", "charger", "stop kontak", "meeting"],
    text: () => `Wi-Fi is open, no password page - ask the counter for it. Two sockets at the left end of the counter, and the room is quietest between 14:00 and 17:00 for laptops.`,
    chips: ["Opening hours?"]
  },
  {
    id: "human",
    chip: "👨‍ Talk to a human",
    keys: ["human", "manusia", "orang", "owner", "chef", "staff", "karyawan", "hubungi", "contact", "telepon", "phone", "wa", "whatsapp", "email", "instagram", "ig"],
    text: () => `You can reach a real person: ${BIZ.phoneShow} · WhatsApp ${BIZ.wa} · ${BIZ.email}. ${STAFF.name} (${STAFF.title}) runs the pass - this assistant answers instantly so nobody waits for a reply about a price.`,
    chips: ["Do you take QRIS?", "Opening hours?"]
  },
  {
    id: "order",
    keys: ["order", "pesan", "checkout", "beli", "buy", "mau pesan", "how to order", "add to cart"],
    text: () => `Tap any dish, hit Add to cart, then Checkout - you will pick delivery or pickup, a payment method and an optional promo code. Your card and wishlist are saved to your account.`,
    chips: ["Do you take QRIS?", "How much is delivery?"],
    go: "menu"
  },
  {
    id: "account",
    keys: ["account", "akun", "login", "sign in", "daftar", "register", "password", "sandi", "wishlist", "saved"],
    text: () => `Sign in from the top-right button to keep your basket, wishlist and order history on your account. Creating one takes a name, an email and a password.`,
    chips: ["How do I order?"]
  },
  {
    id: "review",
    keys: ["review", "ulasan", "rating", "bintang", "star", "feedback", "komentar"],
    text: () => `Guests rate what they ate - the Reviews section holds them all, and the chef can hide anything unfair. Leave one after your order lands.`,
    chips: ["What is the chef's pick?"],
    go: "reviews"
  },
  {
    id: "gallery",
    keys: ["photo", "foto", "gambar", "picture", "suasana", "vibe", "interior", "galeri", "gallery"],
    text: () => `The Gallery section has the room, the bar and the pass. Tap any photo for the full frame - the food shots open too.`,
    chips: ["Where are you?"],
    go: "gallery"
  }
];

/* A conversation already on the board so the chef's inbox is not empty on first look. */
export const SEED_CHATS = [
  {
    id: "c-seed-1", name: "Rania Putri", email: "rania@example.com", phone: "0811 2233 4455",
    unread: { guest: 0, chef: 1 }, updated: "2026-09-29T10:12:00.000Z",
    msgs: [
      { id: "m1", from: "guest", text: "hi! does the pesto farfalle have nuts? my friend is allergic", at: "2026-09-29T10:05:00.000Z" },
      { id: "m2", from: "bot", text: "Yes - Pesto Farfalle, Blistered Tomato carries Tree nuts in the pesto. I would steer her to the Pomodoro or the vegan bowl instead, both nut-free.", at: "2026-09-29T10:05:00.000Z", dishes: ["p2", "s2"] },
      { id: "m3", from: "guest", text: "perfect, can we still sit at 8pm friday?", at: "2026-09-29T10:11:00.000Z" }
    ]
  }
];

export { range as priceRange };
