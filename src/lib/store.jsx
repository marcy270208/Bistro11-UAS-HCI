/* ═══════════════════════════════════════════════════════════
   One provider for data + session + UI chrome, so pages and
   components never prop-drill the basket.
   ═══════════════════════════════════════════════════════════ */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES, MENU, STATUS_FLOW } from "../data/menu.js";
import { DELIVERY_FEE, FREE_OVER, PICKUP_FEE, PROMOS, SEED_REVIEWS, SERVICE_RATE, STAFF, TAX_RATE } from "../data/biz.js";
import { VISITOR_THREAD } from "../data/knowledge.js";
import { answer, opening } from "./assistant.js";
import { defaults, emptyVault, loadState, saveState } from "./storage.js";
import { money, r0, uid } from "./format.js";
import { t as i18n_t } from "./i18n.js";
import { supabase } from "./supabase.js";

const Ctx = createContext(null);
export const useApp = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside <AppProvider>");
  return v;
};

/* prefix-first matching: one letter is enough to surface a dish */
function matchDish(d, q) {
  if (!q) return { hit: true, exact: true };
  const words = `${d.name} ${(d.tags || []).join(" ")} ${d.cat}`.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  if (words.some(w => w.startsWith(q))) return { hit: true, exact: true };
  if (d.name.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q)) return { hit: true, exact: false };
  return { hit: false, exact: false };
}

/** Prefix hits win; only when nothing starts with the term do we fall back to contains. */
function searchDishes(list, query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return { list: [...list], exact: true };
  const strict = list.filter(d => matchDish(d, q).exact);
  if (strict.length) return { list: strict, exact: true };
  return { list: list.filter(d => matchDish(d, q).hit), exact: false };
}

const vaultOf = (d, email) => (d.vault[String(email).toLowerCase()] ||= emptyVault());
const syncVault = d => {
  const e = d.session && d.session.kind === "user" ? d.session.email : null;
  if (!e) return;
  const v = vaultOf(d, e);
  v.cart = { ...d.cart };
  v.wish = [...d.wish];
};

/* one thread per browser: the guest panel and the chef desk read the same list */
const labelThread = d => {
  const t = d.chats.find(c => c.id === VISITOR_THREAD);
  if (!t) return null;
  const s = d.session;
  if (s?.kind === "user") {
    const a = d.accounts.find(x => x.email.toLowerCase() === String(s.email).toLowerCase());
    t.name = a?.name || "Guest";
    t.email = s.email;
  } else if (s?.kind === "staff") {
    t.name = `${STAFF.name} · preview`;
    t.email = "";
  } else {
    t.name = t.name === `${STAFF.name} · preview` ? "Guest" : t.name || "Guest";
  }
  return t;
};

const ensureThread = d => {
  if (!d.chats.some(c => c.id === VISITOR_THREAD))
    d.chats.unshift({ id: VISITOR_THREAD, name: "Guest", email: "", unread: { guest: 0, chef: 0 }, updated: new Date().toISOString(), msgs: [] });
  return d.chats.find(c => c.id === VISITOR_THREAD);
};

const threadOf = (d, id) => (id === VISITOR_THREAD ? ensureThread(d) : d.chats.find(c => c.id === id) || null);

export function AppProvider({ children }) {
  const [data, setData] = useState(loadState);
  const [ui, setUi] = useState(() => ({
    view: data.session?.kind === "staff" ? "admin" : "guest",
    authTab: "in", authReason: "",
    drawer: false, drawerOut: false, search: false,
    chat: false, chatOut: false, chatTyping: false,
    query: "", cat: "All", sort: "featured", wishOnly: false, adminTab: "orders", lang: "en"
  }));
  const [modal, setModal] = useState(null);
  const [tracker, setTracker] = useState(null);
  const [toasts, setToasts] = useState([]);
  const authFrom = useRef(0);
  const timers = useRef({ modal: 0, drawer: 0, chat: 0, chatOut: 0 });


  // Sync from Supabase on first load
    useEffect(() => {
      supabase.from('app_data').select('data').eq('id', 'bistro').single().then(({ data: sbData, error }) => {
        if (!error && sbData?.data) {
          setData(prev => {
            if (prev.lastUpdated && (!sbData.data.lastUpdated || prev.lastUpdated >= sbData.data.lastUpdated)) {
              saveState(prev);
              return prev;
            }
            const merged = { 
              ...prev, 
              ...sbData.data,
              session: prev.session,
              cart: prev.cart,
              wish: prev.wish
            };
            saveState(merged);
            return merged;
          });
        }
      });
    }, []);

  const patchUi = useCallback(p => setUi(u => ({ ...u, ...p })), []);
  
  const t = useCallback((key, fallback) => i18n_t(ui.lang, key, fallback), [ui.lang]);

  /* every mutation gets a private copy, like the old imperative `S` */
  const write = useCallback(fn => setData(prev => { const next = structuredClone(prev); fn(next); next.lastUpdated = Date.now(); return next; }), []);

  /* ── toasts ── */
  const toast = useCallback((msg, icon = "✅") => {
    const id = uid("t");
    setToasts(t => [...t, { id, msg, icon }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2600);
  }, []);

    /* ── persistence + theme ── */
  useEffect(() => {
    write(d => {
      const len = d.accounts.length;
      d.accounts = d.accounts.filter(a => !a.email.includes("you@example"));
      // if any got removed, syncVault just in case
      if (d.accounts.length !== len) {
         if (d.session && d.session.email.includes("you@example")) {
             d.session = null;
         }
      }
    });
  }, [write]);

  useEffect(() => {
    if (!saveState(data)) {
      toast("Storage is full - remove your profile photo to keep saving.", "⚠️");
    }
  }, [data, toast]);
  useEffect(() => { document.documentElement.dataset.theme = data.theme; }, [data.theme]);

  /* ── modal + drawer chrome ── */
  const openModal = useCallback((node, cls = "") => {
    clearTimeout(timers.current.modal);
    setModal({ node, cls, closing: false });
  }, []);
  const closeModal = useCallback(() => {
    setModal(m => (m && !m.closing ? { ...m, closing: true } : m));
    clearTimeout(timers.current.modal);
    timers.current.modal = setTimeout(() => setModal(null), 300);
  }, []);
  const openDrawer = useCallback(() => {
    setUi(u => ({ ...u, drawer: true, drawerOut: false }));
  }, []);
  const closeDrawer = useCallback(() => {
    setUi(u => (u.drawer ? { ...u, drawerOut: true } : u));
    clearTimeout(timers.current.drawer);
    timers.current.drawer = setTimeout(() => setUi(u => ({ ...u, drawer: false, drawerOut: false })), 380);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("is-locked", !!(modal || ui.drawer || tracker));
  }, [modal, ui.drawer, tracker]);

  /* ── identity ── */
  const findAccount = useCallback(
    email => data.accounts.find(a => a.email.toLowerCase() === String(email || "").toLowerCase()) || null,
    [data.accounts]);
  const isStaff = data.session?.kind === "staff";
  const signedIn = !!data.session;
  const me = data.session && data.session.kind === "user" ? findAccount(data.session.email) : null;

  const showAuth = useCallback(reason => {
    if (data.session) return;
    authFrom.current = window.scrollY;
    closeModal(); closeDrawer();
    setUi(u => ({ ...u, view: "auth", authTab: "in", authReason: reason || "", search: false }));
    window.scrollTo(0, 0);
  }, [data.session, closeModal, closeDrawer]);

  const leaveAuth = useCallback(() => {
    setUi(u => ({ ...u, view: "guest" }));
    window.scrollTo(0, authFrom.current);
  }, []);

  const asCustomer = useCallback(reason => {
    if (me) return true;
    if (isStaff) {
      toast(ui.view === "guest"
        ? "Preview is read-only - the kitchen can look but not order. Use a guest account to test checkout."
        : "You're in the kitchen - open the guest site to see the board.", "👨‍🍳");
      return false;
    }
    showAuth(reason || "Sign in or create an account to put plates on your order.");
    return false;
  }, [me, isStaff, ui.view, toast, showAuth]);

  const beginSession = useCallback((kind, email) => {
    write(d => {
      d.session = { kind, email };
      if (kind === "user") { const v = vaultOf(d, email); d.cart = { ...v.cart }; d.wish = [...v.wish]; }
      else { d.cart = {}; d.wish = []; }
    });
    closeModal();
    setUi(u => ({
      ...u,
      view: kind === "staff" ? "admin" : "guest",
      drawer: false, drawerOut: false, search: false,
      wishOnly: false, cat: "All", query: ""
    }));
    window.scrollTo(0, kind === "staff" ? 0 : authFrom.current);
  }, [write, closeModal]);

  const endSession = useCallback(quiet => {
    write(d => { 
      syncVault(d); 
      d.session = null; 
      d.cart = {}; 
      d.wish = []; 
      const t = d.chats.find(c => c.id === VISITOR_THREAD);
      if (t) { t.msgs = []; t.unread = { guest: 0, chef: 0 }; t.name = "Guest"; t.email = ""; }
    });
    closeDrawer(); closeModal();
    setUi(u => ({ ...u, view: "guest", drawer: false, drawerOut: false, wishOnly: false, cat: "All", query: "" }));
    if (!quiet) { toast("Signed out - your basket is saved with your account.", "👋"); window.scrollTo(0, 0); }
  }, [write, closeDrawer, closeModal, toast]);

  const createAccount = useCallback(account => {
    write(d => { d.accounts.push(account); vaultOf(d, account.email); });
  }, [write]);

  const deleteAccount = useCallback(email => {
    write(d => {
      d.accounts = d.accounts.filter(a => a.email.toLowerCase() !== email.toLowerCase());
      delete d.vault[email.toLowerCase()];
      if (d.session?.email?.toLowerCase() === email.toLowerCase()) {
         d.session = null;
      }
    });
    toast("Account deleted", "🗑️");
  }, [write, toast]);

  const updateMe = useCallback(patch => {
    write(d => {
      const email = d.session?.kind === "user" ? d.session.email : null;
      const acc = email && d.accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
      if (!acc) return;
      const nextEmail = patch.email && patch.email.toLowerCase() !== acc.email.toLowerCase() ? patch.email : null;
      for (const [k, v] of Object.entries(patch)) if (v !== undefined && k !== "email") acc[k] = v;
      if (nextEmail) {
        const oldKey = acc.email.toLowerCase();
        acc.email = nextEmail;
        const moved = d.vault[oldKey];
        if (moved) { delete d.vault[oldKey]; d.vault[nextEmail.toLowerCase()] = moved; }
        d.session.email = nextEmail;
      }
      syncVault(d);
    });
  }, [write]);

  const setTheme = useCallback(next => {
    write(d => { d.theme = next; });
    toast(next === "dark" ? "Evening service - dark mode" : "Daylight seating - light mode",
      next === "dark" ? "🌙" : "☀️");
  }, [write, toast]);

  /* ── menu reads ── */
  const dishById = useCallback(id => data.menu.find(d => d.id === id), [data.menu]);
  const cartList = useMemo(
    () => Object.entries(data.cart).map(([id, q]) => ({ d: data.menu.find(x => x.id === id), q }))
      .filter(x => x.d && x.q > 0),
    [data.cart, data.menu]);
  const cartCount = useMemo(() => cartList.reduce((n, x) => n + x.q, 0), [cartList]);
  const myOrders = useMemo(() => {
    const e = me?.email.toLowerCase();
    return e ? data.orders.filter(o => (o.email || "").toLowerCase() === e) : [];
  }, [data.orders, me]);

  const onSale = useMemo(() => data.menu.filter(d => d.available !== false), [data.menu]);
  const counts = useMemo(() => {
    const c = { All: onSale.length };
    CATEGORIES.forEach(cat => { c[cat] = onSale.filter(d => d.cat === cat).length; });
    return c;
  }, [onSale]);
  const results = useMemo(() => {
    let list = onSale;
    if (ui.cat !== "All") list = list.filter(d => d.cat === ui.cat);
    if (ui.wishOnly) list = list.filter(d => data.wish.includes(d.id));
    let exact = true;
    if (ui.query.trim()) {
      const found = searchDishes(list, ui.query);
      list = found.list; exact = found.exact;
    }
    const sorters = {
      "price-asc": (a, b) => a.price - b.price, "price-desc": (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating, az: (a, b) => a.name.localeCompare(b.name)
    };
    const s = sorters[ui.sort];
    return { list: s ? [...list].sort(s) : [...list], exact };
  }, [onSale, ui.cat, ui.wishOnly, ui.query, ui.sort, data.wish]);

  /* ── basket + wishlist ── */
  const setQty = useCallback((id, delta) => {
    if (!asCustomer("Sign in to put this plate on your order.")) return;
    write(d => {
      d.cart[id] = Math.max(0, (d.cart[id] || 0) + delta);
      if (!d.cart[id]) delete d.cart[id];
      syncVault(d);
    });
    if (delta > 0) {
      const dish = data.menu.find(x => x.id === id);
      if (dish) toast(`${dish.name} added - ${money(dish.price)}`, "🛒");
    }
  }, [asCustomer, write, toast, data.menu]);

  const toggleWish = useCallback(id => {
    if (!asCustomer("Sign in to save dishes - your hearts live in your account.")) return false;
    let nowOn = false;
    write(d => {
      const i = d.wish.indexOf(id);
      nowOn = i < 0;
      if (nowOn) d.wish.push(id); else d.wish.splice(i, 1);
      syncVault(d);
    });
    const dish = data.menu.find(x => x.id === id);
    toast(nowOn ? `Saved ${dish?.name} to your wishlist` : `Removed ${dish?.name}`, nowOn ? "❤️" : "🤍");
    return nowOn;
  }, [asCustomer, write, toast, data.menu]);

  const clearWish = useCallback(() => {
    write(d => { d.wish = []; syncVault(d); });
    setUi(u => ({ ...u, wishOnly: false }));
    toast("Wishlist cleared", "🤍");
  }, [write, toast]);

  const showSavedOnly = useCallback(on => {
    setUi(u => ({ ...u, wishOnly: on, cat: "All" }));
    if (on && !data.wish.length) toast("No saved dishes yet - tap the heart on any plate", "🤍");
  }, [data.wish.length]);

  const resetFilters = useCallback(() => {
    setUi(u => ({ ...u, cat: "All", wishOnly: false, query: "" }));
  }, []);

  /* ── totals + orders ── */
  const totals = useCallback((type, promoCode) => {
    const sub = r0(cartList.reduce((t, x) => t + x.d.price * x.q, 0));
    const tax = r0(sub * TAX_RATE);
    const service = r0(sub * SERVICE_RATE);
    const delivery = type === "delivery" ? (sub > FREE_OVER ? 0 : DELIVERY_FEE) : type === "pickup" ? PICKUP_FEE : 0;
    const promo = promoCode ? PROMOS[promoCode.toUpperCase()] : null;
    const discount = promo ? r0(Math.min(promo.type === "pct" ? sub * promo.value / 100 : promo.value, sub)) : 0;
    return { sub, tax, service, delivery, discount, promo, total: Math.max(0, r0(sub + tax + service + delivery - discount)) };
  }, [cartList]);

  const placeOrder = useCallback(order => {
    write(d => {
      // Mark it as synced initially so manual sync doesn't duplicate it
      order.synced = true;
      d.orders.unshift(order);
      const email = d.session?.kind === "user" ? d.session.email : null;
      const acc = email && d.accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
      if (acc) {
        for (const [k, v] of Object.entries({ name: order.name, phone: order.phone, address: order.address }))
          if (v && v !== "-") acc[k] = v;
      }
      d.cart = {};
      syncVault(d);
    });
    setTracker(order);
    
    // Auto-sync to Google Sheets in the background
    const payload = {
      orders: [{
        id: order.created ? new Date(order.created).toLocaleString() : "-",
        date: order.id,
        name: order.name || "Guest",
        type: order.type,
        status: order.type === "table" ? order.table : (order.address || "-"),
        total: order.items.map(i => `${i.qty}x ${i.name}`).join("; "),
        items: order.notes || "-",
        notes: money(order.totals?.total || 0)
      }]
    };
    fetch("https://script.google.com/macros/s/AKfycbxUGAViaisAmmwHqZV4JKeW0wqCE4_BUhqUoGA6CNGdr47wEMQKD46HrJjR8mzktyqjdw/exec", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload)
    }).catch(e => console.error("Sheet sync failed", e));
    
  }, [write]);

  const advanceOrder = useCallback(id => {
    write(d => {
      const o = d.orders.find(x => x.id === id);
      if (!o) return;
      o.status = STATUS_FLOW[Math.min(STATUS_FLOW.indexOf(o.status) + 1, STATUS_FLOW.length - 1)];
    });
    // Removed toast because it would be annoying if it auto-advances
  }, [write]);

  const setOrderStatus = useCallback((id, status) => {
    write(d => {
      const o = d.orders.find(x => x.id === id);
      if (o) o.status = status;
    });
  }, [write]);

  // Global Demo Simulation: automatically advance active orders
  useEffect(() => {
    const activeOrders = data.orders.filter(o => o.status !== "done" && o.status !== "cancelled");
    if (activeOrders.length === 0) return;
    
    const timeouts = [];
    activeOrders.forEach(o => {
      // 12 seconds for delivering animation, 3.5 seconds for kitchen stages
      const delay = o.status === "delivering" ? 12000 : 3500;
      timeouts.push(setTimeout(() => {
        advanceOrder(o.id);
      }, delay));
    });
    
    return () => timeouts.forEach(clearTimeout);
  }, [data.orders, advanceOrder]);

  const emailOrder = useCallback(id => {
    write(d => { const o = d.orders.find(x => x.id === id); if (o) o.emailed = true; });
    toast("Receipt sent to your email", "📧");
  }, [write, toast]);

  /* ── reviews ── */
  const addReview = useCallback(r => write(d => { d.reviews.unshift(r); }), [write]);
  const toggleReview = useCallback(id => {
    write(d => { const r = d.reviews.find(x => x.id === id); if (r) r.hidden = !r.hidden; });
  }, [write]);
  const deleteReview = useCallback(id => write(d => { d.reviews = d.reviews.filter(x => x.id !== id); }), [write]);

  /* ── live chat ── */
  const chatThread = useMemo(() => data.chats.find(c => c.id === VISITOR_THREAD) || null, [data.chats]);

  const pushChat = useCallback((id, msg, unread) => write(d => {
    const t = id === VISITOR_THREAD ? labelThread(d) : d.chats.find(c => c.id === id);
    if (!t) return;
    t.unread ||= { guest: 0, chef: 0 };
    const now = new Date().toISOString();
    t.msgs.push({ id: uid("m"), chips: [], dishes: [], ...msg, at: now });
    if (unread) t.unread[unread] = (t.unread[unread] || 0) + 1;
    t.updated = now;
  }), [write]);

  const openChat = useCallback(() => {
    setUi(u => ({ ...u, chat: true, chatOut: false }));
    write(d => {
      const t = ensureThread(d);
      if (!t.msgs.length) t.msgs.push({ id: uid("m"), ...opening(d.menu) });
      t.unread.guest = 0;
    });
  }, [write]);

  const closeChat = useCallback(() => {
    setUi(u => (u.chat ? { ...u, chatOut: true } : u));
    clearTimeout(timers.current.chatOut);
    timers.current.chatOut = setTimeout(() => setUi(u => ({ ...u, chat: false, chatOut: false })), 320);
  }, []);

  const askChat = useCallback((text, mode = "bot") => {
    const t = String(text || "").trim();
    if (!t) return;
    pushChat(VISITOR_THREAD, { from: "guest", text: t }, "chef");
    
    if (mode === "chef") {
      return; // Do not trigger bot answer
    }
    
    setUi(u => ({ ...u, chatTyping: true }));
    clearTimeout(timers.current.chat);
    timers.current.chat = setTimeout(() => {
      const a = answer(t, data.menu);
      setUi(u => ({ ...u, chatTyping: false, ...(a.fallback ? { chatMode: "chef" } : {}) }));
      pushChat(VISITOR_THREAD, { from: "bot", text: a.text, chips: a.chips || [], dishes: a.dishes || [], go: a.go || "" });
    }, 700 + Math.min(900, t.length * 14));
  }, [pushChat, data.menu]);

  const toggleChatMode = useCallback(mode => {
    setUi(u => {
      if (u.chatMode === mode) return u;
      
      const msg = mode === "chef" 
        ? `This one goes to ${STAFF.name}. The assistant has stepped back, so a reply arrives when the chef reads the board.`
        : `The assistant is back on the line. ${STAFF.name} still reads everything you wrote here.`;
        
      pushChat(VISITOR_THREAD, { from: "bot", text: msg });
      
      return { ...u, chatMode: mode };
    });
  }, [pushChat]);

  const chefReply = useCallback((id, text) => {
    const msg = String(text || "").trim();
    if (!msg) return;
    let who = "";
    write(d => {
      const t = threadOf(d, id);
      if (!t) return;
      who = t.name || "the guest";
      t.unread ||= { guest: 0, chef: 0 };
      const now = new Date().toISOString();
      t.msgs.push({ id: uid("m"), from: "chef", text: msg, by: STAFF.name, chips: [], dishes: [], at: now });
      t.unread.guest = (t.unread.guest || 0) + 1;
      t.updated = now;
    });
    if (who) toast(`Replied to ${who} - it lands in their chat panel`, "💬");
  }, [write, toast]);

  const readChat = useCallback((id, side) => write(d => {
    const t = threadOf(d, id);
    if (!t) return;
    t.unread ||= { guest: 0, chef: 0 };
    t.unread[side] = 0;
  }), [write]);

  const clearChat = useCallback(id => {
    write(d => {
      const t = threadOf(d, id);
      if (t) { t.msgs = []; t.unread = { guest: 0, chef: 0 }; }
    });
    toast("That conversation is cleared from the board", "🧹");
  }, [write, toast]);

  const removeChat = useCallback(id => write(d => { d.chats = d.chats.filter(c => c.id !== id); }), [write]);

  /* ── kitchen board ── */
  const addDish = useCallback(dish => {
    write(d => { d.menu.push(dish); });
    setUi(u => ({ ...u, cat: "All", wishOnly: false, query: "" }));
    toast(`${dish.name} is on the board - guests can order it now`, "🆕");
  }, [write, toast]);

  const patchDish = useCallback((id, patch) => {
    write(d => { const x = d.menu.find(m => m.id === id); if (x) Object.assign(x, patch); });
  }, [write]);

  const toggleDish = useCallback(id => {
    let name = "", on = false;
    write(d => {
      const x = d.menu.find(m => m.id === id);
      if (!x) return;
      x.available = x.available === false;
      name = x.name; on = x.available;
    });
    if (name) toast(`${name} is ${on ? "back on the board" : "off the board"}`, on ? "✅" : "🚫");
  }, [write, toast]);

  const removeDish = useCallback(id => {
    write(d => {
      const x = d.menu.find(m => m.id === id);
      if (x) x.available = false;
      delete d.cart[id];
      syncVault(d);
    });
  }, [write]);

  const resetDemo = useCallback(() => {
    write(d => {
      d.orders = [];
      d.reviews = structuredClone(SEED_REVIEWS);
      d.menu = structuredClone(MENU);
      d.cart = {};
      d.wish = ["m1", "b2"];
      syncVault(d);
    });
    toast("Demo service reset", "♻️");
  }, [write, toast]);

  /* ── navigation ── */
  const goSection = useCallback(id => {
    if (isStaff && ui.view === "admin") {
      const toMenu = id === "menu" || ui.adminTab !== "dishes";
      setUi(u => ({ ...u, view: "admin", adminTab: "dishes" }));
      if (toMenu) requestAnimationFrame(() => document.querySelector(".admin__panel")
        ?.scrollIntoView({ behavior: "smooth", block: "start" }));
      return;
    }
    setUi(u => ({ ...u, view: "guest" }));
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [isStaff, ui.view, ui.adminTab]);

  const previewSite = useCallback(() => {
    closeModal(); closeDrawer();
    setUi(u => ({ ...u, view: "guest", drawer: false, drawerOut: false, search: false }));
    window.scrollTo(0, 0);
    toast("Guest site - looking only. Nothing you tap here changes an order.", "👀");
  }, [toast, closeModal, closeDrawer]);

  const backToConsole = useCallback(() => {
    closeModal(); closeDrawer();
    setUi(u => ({ ...u, view: "admin", drawer: false, drawerOut: false, search: false }));
    window.scrollTo(0, 0);
  }, [closeModal, closeDrawer]);

  const jumpCat = useCallback(cat => {
    setUi(u => ({ ...u, cat, wishOnly: false }));
    goSection("menu");
  }, [goSection]);

  const openBasket = useCallback(() => { if (asCustomer("Sign in to open your basket.")) openDrawer(); }, [asCustomer, openDrawer]);
  const openWishlist = useCallback(() => {
    if (!asCustomer("Sign in to keep a saved list - hearts are stored with your account.")) return;
    showSavedOnly(!ui.wishOnly);
    goSection("menu");
    toast(ui.wishOnly ? "Back to the whole board" : "Showing your saved dishes", "❤️");
  }, [asCustomer, showSavedOnly, goSection, toast, ui.wishOnly]);

  const toggleSearch = useCallback(on => {
    setUi(u => {
      const want = on ?? !u.search;
      return { ...u, search: want };
    });
  }, []);

  /* keyboard: Esc closes, "/" opens search */
  useEffect(() => {
    const onKey = e => {
      const typing = /input|textarea|select/i.test(document.activeElement?.tagName || "");
      if (e.key === "Escape") {
        setUi(u => ({ ...u, search: false }));
        closeDrawer(); closeModal(); closeChat();
      }
      if (e.key === "/" && !typing) { e.preventDefault(); setUi(u => ({ ...u, search: true })); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [closeDrawer, closeModal, closeChat]);

  useEffect(() => () => {
    clearTimeout(timers.current.modal); clearTimeout(timers.current.drawer);
    clearTimeout(timers.current.chat); clearTimeout(timers.current.chatOut);
  }, []);

  const value = {
    data, ui, toasts, modal, tracker,
    isStaff, signedIn, me, findAccount,
    onSale, counts, results, cartList, cartCount, myOrders, dishById, totals,
    setUi, patchUi, write,
    toast, openModal, closeModal, openDrawer, closeDrawer, setTracker,
    showAuth, leaveAuth, asCustomer, beginSession, endSession, createAccount, deleteAccount, updateMe, setTheme,
    setQty, toggleWish, clearWish, showSavedOnly, resetFilters, setLang: (l) => patchUi({ lang: l }), t,
    placeOrder, advanceOrder, setOrderStatus, emailOrder,
    addReview, toggleReview, deleteReview,
    chatThread, openChat, closeChat, askChat, toggleChatMode, chefReply, readChat, clearChat, removeChat,
    addDish, patchDish, toggleDish, removeDish, resetDemo,
    goSection, jumpCat, openBasket, openWishlist, toggleSearch, previewSite, backToConsole
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export { defaults, searchDishes };
