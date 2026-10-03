/* ═══════════════════════════════════════════════════════════
   The assistant's brain: no network, no model - it reads the
   knowledge base in src/data/knowledge.js and answers from the
   live menu, so a dish the chef adds today is answerable today.
   ═══════════════════════════════════════════════════════════ */
import { TOPICS, CHAT_SUGGESTIONS } from "../data/knowledge.js";
import { STAFF } from "../data/biz.js";
import { money } from "./format.js";

const STOP = new Set([
  "the", "a", "an", "and", "with", "for", "to", "of", "in", "is", "are", "do", "does", "you", "your",
  "we", "our", "i", "me", "my", "it", "its", "on", "how", "what", "whats", "any", "have", "has",
  "there", "this", "that", "can", "could", "would", "please", "tell", "give", "want", "need",
  "makanan", "apa", "yang", "ini", "itu", "ada", "berapa", "saya", "kamu", "juga", "saja", "untuk"
]);

const norm = s => String(s || "").toLowerCase().replace(/['’]/g, "");
const clean = s => ` ${norm(s).replace(/[^a-z0-9?]+/g, " ").replace(/\s+/g, " ").trim()} `;
/* long keys match as stems ("deliver" → "delivery"); tiny ones must stand as whole words */
const hit = (msg, k) => {
  const key = norm(k).trim();
  const tiny = key.length <= 2;
  if (!msg.includes(tiny ? ` ${key} ` : key)) return 0;
  return (key.includes(" ") ? 3 : 2) + (tiny || msg.includes(` ${key} `) ? 1 : 0);
};
const hits = (msg, keys) => keys.reduce((n, k) => n + hit(msg, k), 0);

/* cards under an answer: whichever dish names actually appear in the text we wrote */
const cardsFor = (text, onSale) =>
  onSale.filter(d => text.toLowerCase().includes(d.name.toLowerCase())).slice(0, 3).map(d => d.id);

const DISH_FIELDS = [
  { keys: ["alergen", "allergen", "gluten", "nut", "kacang", "dairy", "susu", "lactose", "egg", "telur", "soy", "kedelai", "sesame", "wijen", "seafood", "ikan", "udang", "shrimp", "fish", "sulphite", "sulfite"],
    line: d => d.alg?.length
      ? `${d.name} carries ${d.alg.join(", ")}. Everything else on that plate is listed on its card, and the kitchen can swap components - mention it in the order note.`
      : `${d.name} has no declared allergens on the board. The kitchen still runs one fryer and one grill, so cross-contact is possible if it is a true allergy.` },
  { keys: ["harga", "price", "cost", "berapa", "mahal", "murah", "expensive", "cheap"],
    line: d => `${d.name} is ${money(d.price)}, served for one. Tax and service are added at checkout, delivery is separate.` },
  { keys: ["ingredient", "bahan", "isi", "made of", "what is in", "whats in", "resep", "recipe", "sauce", "saus"],
    line: d => `${d.name} is built from ${(d.ing || []).slice(0, 6).map(i => i[1]).join(", ")}. The full list sits on the dish card under Ingredients.` },
  { keys: ["lama", "how long", "wait", "minute", "menit", "prep", "ready", "fire"],
    line: d => `${d.name} fires in about ${d.mins} minutes. If the pass is busy I would call it ${d.mins + 10}.` },
  { keys: ["kcal", "kalori", "calorie", "diet", "healthy", "sehat", "protein", "gizi"],
    line: d => `${d.name} is ${d.kcal} kcal per plate. ${d.cat === "Drinks" ? "That is the whole glass." : "It is one of the lighter plates on the board."}` },
  { keys: ["pedas", "spicy", "chilli", "chili", "cabai", "hot", "level"],
    line: d => d.badge === "hot"
      ? `${d.name} is flagged hot - the house chilli level. We can dial it back if you say so in the note.`
      : `${d.name} is not spicy as written. The house chilli oil goes on request, at any level you want.` },
  { keys: ["vegan", "nabati", "plant", "vegetarian", "veggie", "sayur", "daging", "meat"],
    line: d => {
      const t = d.tags || [];
      if (t.includes("vegan")) return `${d.name} is fully plant-based - no dairy, no honey, nothing from an animal.`;
      if (t.includes("vegetarian") || d.badge === "veg") return `${d.name} is vegetarian but not vegan: it does carry dairy${d.alg?.includes("Dairy") ? "" : " or egg"}. Ask us to build it without and we will try.`;
      return `${d.name} is not a vegetarian plate - ${d.alg?.includes("Fish") ? "it is built on the fish" : "it goes out with the meat"}. I can name the vegan ones if you want.`;
    } },
  { keys: ["order", "pesan", "beli", "add", "checkout", "cart", "keranjang"],
    line: d => `${d.name} is ${money(d.price)} and ready in ${d.mins} minutes - tap the card to put it in your basket.` }
];

function dishAnswer(d, msg) {
  const field = DISH_FIELDS.find(f => hits(msg, f.keys) > 0);
  const text = field
    ? field.line(d)
    : `${d.name} - ${d.desc} It is ${money(d.price)}, ready in ${d.mins} minutes, ${d.kcal} kcal${d.alg?.length ? `, with ${d.alg.join(", ")}` : ""}. Guests rate it ${Number(d.rating).toFixed(1)} out of five.`;
  return { text, dishes: [d.id], chips: ["Any allergens in it?", "How long does it take?", "What is the chef's pick?"] };
}

function dishMention(msg, onSale, blindTo = new Set()) {
  return onSale.filter(d => {
    const name = norm(d.name);
    if (msg.includes(` ${name} `)) return true;
    return name.split(/[^a-z0-9]+/).some(w =>
      w.length > 3 && !STOP.has(w) && !blindTo.has(w) && msg.includes(` ${w} `));
  });
}

/** One guest message in, one assistant reply out. */
export function answer(raw, menu) {
  const msg = clean(raw);
  const onSale = liveMenu(menu);
  const ctx = { menu: onSale, onSale, count: onSale.length, q: msg };

  const scored = TOPICS.map(t => ({ t, s: hits(msg, t.keys) })).filter(x => x.s > 0).sort((a, b) => b.s - a.s);
  const top = scored[0]?.t || null;
  const named = dishMention(msg, onSale, new Set(top?.keys || []));

  if (named.length === 1) return dishAnswer(named[0], msg);
  if (named.length > 1) {
    const few = named.slice(0, 3);
    return {
      text: `I can hear more than one plate in that - ${few.map(d => d.name).join(", ")}. Which one shall I read out to you?`,
      dishes: few.map(d => d.id),
      chips: few.map(d => `Tell me about ${d.name}`)
    };
  }

  if (top) {
    const also = (scored.find(x => x.t !== top && x.s >= scored[0].s - 1) || {}).t;
    const text = also ? `${top.text(ctx)}\n${also.text(ctx)}` : top.text(ctx);
    const chips = [...new Set([...(top.chips || []), ...(also?.chips || [])])].slice(0, 3);
    const dishes = [...new Set([...cardsFor(top.text(ctx), onSale), ...(also ? cardsFor(also.text(ctx), onSale) : [])])].slice(0, 3);
    return { text, chips, dishes, go: top.go || also?.go };
  }

  return {
    text: `I did not catch that one. I am good on the menu, allergens, prices, delivery, payment and our hours - or leave the question here and ${STAFF.name} will answer it between services.`,
    chips: CHAT_SUGGESTIONS.slice(0, 3),
    dishes: [],
    go: "menu"
  };
}

/** First line the assistant says when a guest opens the panel. */
export function opening(menu) {
  const onSale = liveMenu(menu);
  return {
    text: `Welcome to Bistro Eleven. I know all ${onSale.length} plates on the board, what is in them, and how the kitchen runs. Ask away.`,
    chips: CHAT_SUGGESTIONS.slice(0, 3),
    dishes: [],
    at: new Date().toISOString(),
    from: "bot"
  };
}

export function liveMenu(menu) { return (menu || []).filter(d => d.available !== false); }
export { CHAT_SUGGESTIONS };
