import { supabase } from "./supabase.js";
/* localStorage persistence + the seeded default state. */
import { MENU } from "../data/menu.js";
import { SEED_ACCOUNTS, SEED_REVIEWS } from "../data/biz.js";
import { SEED_CHATS } from "../data/knowledge.js";

export const KEY = "bistro-eleven.v3";
export const SEED_VER = 2;

export const emptyVault = () => ({ cart: {}, wish: [] });

export const defaults = () => ({
  seedVer: SEED_VER,
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
  return merged;
}

export function saveState(s) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    
    // Fire and forget to Supabase
    supabase.from('app_data').upsert({ id: 'bistro', data: s }).then(({ error }) => {
      if (error) console.error("Supabase sync failed:", error.message);
    });
    
    return true;
  }
  catch { return false; }
}
