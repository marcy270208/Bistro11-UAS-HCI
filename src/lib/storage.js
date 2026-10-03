import { supabase } from "./supabase.js";
/* localStorage persistence + the seeded default state. */
import { MENU, LOCAL_BY_ID } from "../data/menu.js";
import { SEED_ACCOUNTS, SEED_REVIEWS, REVIEW_SEED_BY_ID } from "../data/biz.js";
import { SEED_CHATS, CHAT_SEED_BY_ID, VISITOR_THREAD } from "../data/knowledge.js";

export const KEY = "bistro-eleven.v3";
export const SEED_VER = 2;

/* a guest's chat belongs to their account; everyone else shares the anonymous thread */
export const threadKey = session =>
  (session?.kind === "user" ? `c-${String(session.email).toLowerCase()}` : VISITOR_THREAD);

export const emptyVault = () => ({ cart: {}, wish: [] });

export const defaults = () => ({
  seedVer: SEED_VER,
  lang: "en",
  theme: matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  session: null, /* { kind: "user" | "staff", email } */
  accounts: structuredClone(SEED_ACCOUNTS),
  vault: { [SEED_ACCOUNTS[0].email.toLowerCase()]: { cart: {}, wish: ["m1", "b2"] } },
  cart: {},
  wish: [],
  orders: [],
  reviews: structuredClone(SEED_REVIEWS),
  chats: structuredClone(SEED_CHATS),
  menu: structuredClone(MENU)
});

export function loadState() {
  const d = defaults();
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY)) || null; } catch { saved = null; }
  if (!saved) return d;
  if (saved.seedVer !== SEED_VER) {
    saved.menu = d.menu;
    saved.reviews = d.reviews;
    saved.orders = [];   /* stored totals belong to the old currency */
    saved.seedVer = SEED_VER;
  }
  const merged = {
    ...d, ...saved,
    accounts: Array.isArray(saved.accounts) && saved.accounts.length ? saved.accounts : d.accounts,
    chats: Array.isArray(saved.chats) ? saved.chats : d.chats,
    vault: { ...d.vault, ...(saved.vault || {}) }
  };
  /* a session pointing at a deleted account can't be honoured */
  if (merged.session && merged.session.kind === "user" &&
      !merged.accounts.some(a => a.email.toLowerCase() === merged.session.email.toLowerCase()))
    merged.session = null;
  /* boards saved before the seed fix still call the yoghurt soup vegan */
  const soup = merged.menu.find(d => d.id === "s4");
  if (soup) soup.tags = (soup.tags || []).filter(t => t !== "vegan");
  /* chats used to be one shared board, so a signed-in guest's history sat in the visitor thread */
  const shared = merged.chats.find(c => c.id === VISITOR_THREAD && c.email);
  if (shared) {
    const own = threadKey({ kind: "user", email: shared.email });
    if (merged.chats.some(c => c.id === own)) merged.chats = merged.chats.filter(c => c !== shared);
    else {
      shared.id = own;
      shared.name = merged.accounts.find(a => a.email.toLowerCase() === String(shared.email).toLowerCase())?.name
        || shared.name || "Guest";
    }
  }
  /* Indonesian copy shipped after most boards were already saved */
  localise(merged);
  return merged;
}

/* a stored record still wearing its seed wording gets the pair it was saved without;
   anything the chef rewrote keeps only its own language and falls back to English */
function localise(d) {
  (d.menu || []).forEach(item => {
    const s = LOCAL_BY_ID[item.id];
    if (!s) return;
    if (!item.name_id && item.name === s.name) item.name_id = s.name_id;
    if (!item.desc_id && item.desc === s.desc) { item.desc_id = s.desc_id; item.ing_id = s.ing_id; }
  });
  (d.reviews || []).forEach(r => {
    const s = REVIEW_SEED_BY_ID[r.id];
    if (s && !r.text_id) r.text_id = s.text_id;
  });
  (d.chats || []).forEach(c => (c.msgs || []).forEach(m => {
    const s = CHAT_SEED_BY_ID[m.id];
    if (s && !m.text_id && m.from === s.from) m.text_id = s.text_id;
  }));
}

export function saveState(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); return true; }
  catch { return false; }
}
