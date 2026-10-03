/* ═══════════════════════════════════════════════════════════════
   Bistro Eleven — app
   ═══════════════════════════════════════════════════════════════ */
(() => {
"use strict";

/* ══════════════ 1. utilities ══════════════ */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => "$" + n.toFixed(2);
const uid = p => p + Math.random().toString(36).slice(2, 7).toUpperCase();
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const plural = (n, w) => n === 1 ? `1 ${w}` : `${n} ${w}s`;

const store = {
  key: "bistro-eleven.v2",
  read() { try { return JSON.parse(localStorage.getItem(this.key)) || null; } catch { return null; } },
  write(o) {
    try { localStorage.setItem(this.key, JSON.stringify(o)); return true; }
    catch (e) { toast("Storage is full — remove your profile photo to keep saving.", "⚠️"); return false; }
  }
};

/* ══════════════ 2. state ══════════════ */
const SEED_VER = 1;

const emptyVault = () => ({ cart: {}, wish: [] });

const defaults = () => ({
  seedVer: SEED_VER,
  theme: matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  session: null,                                  // { kind: "user" | "staff", email }
  accounts: structuredClone(SEED_ACCOUNTS),
  vault: { [SEED_ACCOUNTS[0].email.toLowerCase()]: { cart: {}, wish: ["m1", "b2"] } },
  user: { name: "Guest", email: "", phone: "", address: "", avatar: "" },
  cart: {},
  wish: [],
  orders: [],
  reviews: structuredClone(SEED_REVIEWS),
  menu: structuredClone(MENU)
});

let S = (() => {
  const saved = store.read();
  const d = defaults();
  if (!saved) return d;
  if (saved.seedVer !== SEED_VER) { saved.menu = d.menu; saved.reviews = d.reviews; saved.seedVer = SEED_VER; }
  const merged = { ...d, ...saved,
    user: { ...d.user, ...(saved.user || {}) },
    accounts: Array.isArray(saved.accounts) && saved.accounts.length ? saved.accounts : d.accounts,
    vault: { ...d.vault, ...(saved.vault || {}) } };
  if (merged.session && merged.session.kind === "user" &&
      !merged.accounts.some(a => a.email.toLowerCase() === merged.session.email.toLowerCase()))
    merged.session = null;
  return merged;
})();

const findAccount = email =>
  S.accounts.find(a => a.email.toLowerCase() === String(email || "").toLowerCase()) || null;
const isStaff  = () => !!S.session && S.session.kind === "staff";
const signedIn = () => !!S.session;
const me       = () => S.session && S.session.kind === "user" ? findAccount(S.session.email) : null;
const vaultOf  = email => (S.vault[String(email).toLowerCase()] ||= emptyVault());

const save = () => {
  const a = me();
  if (a) { const v = vaultOf(a.email); v.cart = S.cart; v.wish = S.wish; }
  store.write(S);
};

/* the active identity, mirrored so checkout/reviews/account keep working */
const syncUser = () => {
  const a = me();
  S.user = a ? { name: a.name, email: a.email, phone: a.phone || "", address: a.address || "", avatar: a.avatar || "" }
    : isStaff() ? { name: STAFF.name, email: STAFF.user, phone: "", address: "", avatar: "" }
    : { name: "Guest", email: "", phone: "", address: "", avatar: "" };
};

/* write back onto the real account record; undefined keys are left alone */
function writeMe(patch) {
  const a = me(); if (!a) return;
  const nextEmail = patch.email && patch.email.toLowerCase() !== a.email.toLowerCase() ? patch.email : null;
  for (const [k, v] of Object.entries(patch)) if (v !== undefined && k !== "email") a[k] = v;
  if (nextEmail) {
    const oldKey = a.email.toLowerCase();
    a.email = nextEmail;
    const moved = S.vault[oldKey];
    if (moved) { delete S.vault[oldKey]; S.vault[nextEmail.toLowerCase()] = moved; }
    S.session.email = nextEmail;
  }
  syncUser();
}

const dishById = id => S.menu.find(d => d.id === id);
const cartList = () => Object.entries(S.cart)
  .map(([id, q]) => ({ d: dishById(id), q })).filter(x => x.d && x.q > 0);
const cartCount = () => cartList().reduce((n, x) => n + x.q, 0);
const myOrders = () => { const e = me()?.email.toLowerCase(); return e ? S.orders.filter(o => (o.email || "").toLowerCase() === e) : []; };

/* ══════════════ 3. broken-image fallback ══════════════ */
const PALETTE = { Starters:"#7ba05b", Mains:"#b16d2a", "Pizza & Pasta":"#c8552f",
  Desserts:"#b0455c", Bakery:"#d5a246", Drinks:"#5b7ba0" };

document.addEventListener("error", e => {
  const img = e.target;
  if (!(img instanceof HTMLImageElement) || img.dataset.fb) return;
  img.dataset.fb = "1";
  const label = img.dataset.fbLabel || "Bistro Eleven";
  const tone  = PALETTE[img.dataset.fbTone] || "#b16d2a";
  img.src = "data:image/svg+xml," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${tone}"/><stop offset="1" stop-color="#211a14"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#g)"/>
      <text x="200" y="150" font-family="Georgia,serif" font-size="58" fill="rgba(255,255,255,.92)"
        text-anchor="middle">${esc(label.trim()[0] || "X")}</text>
      <text x="200" y="188" font-family="Helvetica,sans-serif" font-size="15" letter-spacing="3"
        fill="rgba(255,255,255,.6)" text-anchor="middle">BISTRO ELEVEN</text>
    </svg>`);
}, true);

const imgTag = (src, alt, cat) =>
  `<img src="${src}" alt="${esc(alt)}" loading="lazy" decoding="async"
     data-fb-label="${esc(alt)}" data-fb-tone="${esc(cat || "")}">`;

/* ══════════════ 4. reveal on scroll ══════════════ */
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

function initReveal() {
  const io = new IntersectionObserver(entries => {
    for (const en of entries) if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
  }, { threshold: 0.06, rootMargin: "0px 0px -4% 0px" });
  $$("[data-reveal]:not(.is-in), .is-stagger:not(.is-in), .stat:not(.is-in)").forEach(el => io.observe(el));
  return io;
}
let revealIO = null;

/* ══════════════ 5. toasts ══════════════ */
function toast(msg, icon = "✅") {
  const n = document.createElement("div");
  n.className = "toast";
  n.innerHTML = `<i>${icon}</i><span>${esc(msg)}</span>`;
  $("#toasts").appendChild(n);
  setTimeout(() => { n.classList.add("out"); setTimeout(() => n.remove(), 400); }, 2600);
}

/* ══════════════ 6. theme ══════════════ */
function applyTheme() {
  document.documentElement.dataset.theme = S.theme;
  save();
}
$("#btn-theme").addEventListener("click", () => {
  S.theme = S.theme === "light" ? "dark" : "light";
  applyTheme();
  toast(S.theme === "dark" ? "Evening service — dark mode" : "Daylight seating — light mode",
        S.theme === "dark" ? "🌙" : "☀️");
});

/* ══════════════ 7. header chrome ══════════════ */
const hdr = $("#hdr");
addEventListener("scroll", () => hdr.classList.toggle("is-stuck", scrollY > 24), { passive: true });

function goSection(id) {
  if (isStaff()) { showView("admin"); setAdminTab("dishes"); return; }
  showView("guest");
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
}
document.addEventListener("click", e => {
  const a = e.target.closest("[data-nav]");
  if (!a) return;
  e.preventDefault();
  goSection(a.dataset.nav);
});

/* ══════════════ 8. views + authentication ══════════════ */
function showView(which) {
  $("#view-auth").hidden  = which !== "auth";
  $("#view-guest").hidden = which !== "guest";
  $("#view-admin").hidden = which !== "admin";
  document.querySelector(".ftr").style.display = which === "admin" ? "none" : "";
}

let authFrom = 0;

function showAuth(reason) {
  if (signedIn()) return;
  setAuthTab("in");
  authFrom = scrollY;
  closeDrawer(); closeModal();
  showView("auth");
  const note = $("#auth-note");
  note.hidden = !reason;
  note.textContent = reason || "";
  scrollTo(0, 0);
  setTimeout(() => { const f = $(".auth__form:not([hidden]) input"); if (f) f.focus(); }, 60);
}

function setAuthTab(name) {
  $$(".auth__tabs button").forEach(b => b.classList.toggle("is-on", b.dataset.authTab === name));
  ["in", "up", "staff"].forEach(k => { $("#form-" + k).hidden = k !== name; });
  $$(".auth__form .field").forEach(f => f.classList.remove("err"));
}
$$(".auth__tabs button").forEach(b => b.addEventListener("click", () => setAuthTab(b.dataset.authTab)));
$("#auth-browse").addEventListener("click", () => { showView("guest"); scrollTo(0, authFrom); });
$("#btn-login").addEventListener("click", () => showAuth(""));

/* one gate for every action that needs a customer */
function asCustomer(reason) {
  if (me()) return true;
  if (isStaff()) { toast("You’re in the kitchen — sign out to order as a guest.", "👨‍🍳"); return false; }
  showAuth(reason || "Sign in or create an account to put plates on your order.");
  return false;
}

function beginSession(kind, email) {
  S.session = { kind, email };
  syncUser();
  const a = me();
  if (a) { const v = vaultOf(a.email); S.cart = { ...v.cart }; S.wish = [...v.wish]; }
  else { S.cart = {}; S.wish = []; }
  save();
  paintChrome(); renderChips(); renderMenu(); renderCart(); syncPips(); paintHeaderAvatar();
  closeModal();
  showView(kind === "staff" ? "admin" : "guest");
  if (kind === "staff") { renderAdmin(); scrollTo(0, 0); }
  else scrollTo(0, authFrom);
}

function endSession(quiet) {
  save();
  S.session = null; syncUser(); S.cart = {}; S.wish = [];
  save();
  paintChrome(); renderChips(); renderMenu(); renderCart(); syncPips(); paintHeaderAvatar();
  closeDrawer();
  showView("guest");
  if (!quiet) { toast("Signed out — your basket is saved with your account.", "👋"); scrollTo(0, 0); }
}

function paintChrome() {
  const a = me();
  $("#btn-account").hidden = !signedIn();
  $("#btn-account").dataset.role = isStaff() ? "admin" : "user";
  $("#btn-login").hidden = signedIn();
  const who = isStaff() ? STAFF.name : (a ? a.name : "Guest");
  $("#hdr-name").textContent = who.split(" ")[0];
  const tag = $("#hdr-role");
  tag.hidden = !isStaff();
  tag.textContent = isStaff() ? "Staff" : "";
  paintHeaderAvatar();
}

const badEmail = v => !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v);
const fieldErr = (input, on) => input.closest(".field")?.classList.toggle("err", !!on);

$("#form-in").addEventListener("submit", e => {
  e.preventDefault();
  const email = $("#in-email").value.trim(), acc = findAccount(email);
  const okMail = !badEmail(email);
  fieldErr($("#in-email"), !okMail);
  fieldErr($("#in-pass"), okMail && !!acc && acc.pass !== $("#in-pass").value);
  if (!okMail) { $("#in-err").textContent = "That doesn’t look like an email address."; fieldErr($("#in-pass"), false); return; }
  if (!acc) { setAuthTab("up"); $("#up-email").value = email; toast("No account uses that email yet — create one.", "📝"); return; }
  if (acc.pass !== $("#in-pass").value) { $("#in-err").textContent = "That password doesn’t match this account."; return; }
  beginSession("user", acc.email);
  toast("Welcome back, " + acc.name.split(" ")[0], "🍽️");
});

$("#form-up").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#up-name").value.trim(), email = $("#up-email").value.trim(), pass = $("#up-pass").value;
  const taken = !badEmail(email) && findAccount(email);
  const okName = name.length >= 2, okMail = !badEmail(email) && !taken, okPass = pass.length >= 6;
  fieldErr($("#up-name"), !okName); fieldErr($("#up-email"), !okMail); fieldErr($("#up-pass"), !okPass);
  if (!(okName && okMail && okPass)) {
    $("#up-err").textContent = taken ? "That email already has an account — sign in instead."
      : "Check your name, a valid email and a password of 6 or more characters.";
    return;
  }
  S.accounts.push({ name, email, pass, phone: $("#up-phone").value.trim(), address: $("#up-addr").value.trim(), avatar: "" });
  beginSession("user", email);
  toast("Account created — welcome to Bistro Eleven, " + name.split(" ")[0], "🎉");
});

$("#form-staff").addEventListener("submit", e => {
  e.preventDefault();
  const ok = $("#sf-user").value.trim().toLowerCase() === STAFF.user.toLowerCase()
    && $("#sf-pass").value === STAFF.pass;
  fieldErr($("#sf-user"), !ok); fieldErr($("#sf-pass"), !ok);
  if (!ok) { $("#sf-err").textContent = "Those credentials don’t match the kitchen."; return; }
  beginSession("staff", STAFF.user);
  toast("Chef console open — signed in as " + STAFF.name, "👨‍🍳");
});

$("#auth-demo").addEventListener("click", () => {
  const a = S.accounts[0];
  if (!a) return;
  $("#in-email").value = a.email; $("#in-pass").value = a.pass;
  fieldErr($("#in-email"), false); fieldErr($("#in-pass"), false);
  toast("Demo details filled in — press Sign in.", "✨");
});

/* ══════════════ 9. search ══════════════ */
const sheet = $("#search-sheet"), searchInput = $("#search-input");
let query = "";

function toggleSearch(on) {
  const want = on ?? sheet.hidden;
  sheet.hidden = !want;
  $("#btn-search").classList.toggle("is-on", want);
  if (want) setTimeout(() => searchInput.focus(), 60);
  else searchInput.blur();
}
$("#btn-search").addEventListener("click", () => toggleSearch());
$("#search-clear").addEventListener("click", () => { searchInput.value = ""; setQuery(""); });
searchInput.addEventListener("input", () => setQuery(searchInput.value));
searchInput.addEventListener("keydown", e => {
  if (e.key === "Escape") { toggleSearch(false); }
  if (e.key === "Enter") { goSection("menu"); }
});
addEventListener("keydown", e => {
  if (e.key === "Escape") { toggleSearch(false); closeDrawer(); closeModal(); }
  if (e.key === "/" && document.activeElement !== searchInput && !/input|textarea|select/i.test(document.activeElement.tagName)) {
    e.preventDefault(); toggleSearch(true);
  }
});

/* prefix-first matching: typing "p" surfaces dishes whose words start with p */
function matchDish(d, q) {
  if (!q) return { hit: true, exact: true };
  const words = (d.name + " " + (d.tags || []).join(" ") + " " + d.cat).toLowerCase()
    .split(/[^a-z0-9]+/).filter(Boolean);
  if (words.some(w => w.startsWith(q))) return { hit: true, exact: true };
  if (d.name.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q)) return { hit: true, exact: false };
  return { hit: false, exact: false };
}

function setQuery(v) {
  query = v.trim().toLowerCase();
  const list = renderMenu();
  const hint = $("#search-hint");
  if (!query) {
    hint.textContent = "Prefix search — one letter is enough. Press / anywhere to jump here.";
    return;
  }
  const n = list.length;
  hint.innerHTML = n === 0
    ? `Nothing on the board matches “${esc(query)}”.`
    : `<b>${n}</b> ${n === 1 ? "dish" : "dishes"} match “${esc(query)}”` +
      (list.exact === false ? ` — none start with it, so we widened to contains` : "");
}

/* ══════════════ 10. filtering / sorting ══════════════ */
let activeCat = "All", sortBy = "featured", wishOnly = false;

function visible() {
  let list = S.menu.filter(d => d.available !== false);
  if (activeCat !== "All") list = list.filter(d => d.cat === activeCat);
  if (wishOnly) list = list.filter(d => S.wish.includes(d.id));
  let exact = true;
  if (query) {
    const strict = list.filter(d => matchDish(d, query).exact);
    if (strict.length) list = strict;
    else { list = list.filter(d => matchDish(d, query).hit); exact = false; }
  }
  const s = { "price-asc": (a,b)=>a.price-b.price, "price-desc": (a,b)=>b.price-a.price,
    rating: (a,b)=>b.rating-a.rating, az: (a,b)=>a.name.localeCompare(b.name) }[sortBy];
  if (s) list = [...list].sort(s);
  list.exact = exact;
  return list;
}

function renderChips() {
  const counts = { All: S.menu.filter(d => d.available !== false).length };
  CATEGORIES.forEach(c => counts[c] = S.menu.filter(d => d.cat === c && d.available !== false).length);
  const cats = ["All", ...CATEGORIES];
  $("#chips").innerHTML = cats.map(c =>
    `<button class="chip ${c === activeCat ? "is-on" : ""}" data-cat="${esc(c)}">
       ${esc(c === "All" ? "Everything" : c)}<span class="chip__n">${counts[c] || 0}</span>
     </button>`).join("");
}
$("#chips").addEventListener("click", e => {
  const b = e.target.closest("[data-cat]"); if (!b) return;
  activeCat = b.dataset.cat;
  renderChips(); renderMenu();
});
$("#sort-select").addEventListener("change", e => { sortBy = e.target.value; renderMenu(); });
$("#chip-wish-only").addEventListener("click", () => {
  wishOnly = !wishOnly;
  $("#chip-wish-only").classList.toggle("is-on", wishOnly);
  $("#chip-wish-only").setAttribute("aria-pressed", wishOnly);
  renderMenu();
  if (wishOnly && !S.wish.length) toast("No saved dishes yet — tap the heart on any plate", "🤍");
});
document.addEventListener("click", e => {
  const j = e.target.closest("[data-jump-cat]"); if (!j) return;
  activeCat = j.dataset.jumpCat; wishOnly = false;
  $("#chip-wish-only").classList.remove("is-on");
  renderChips(); renderMenu(); goSection("menu");
});
$("#empty-reset").addEventListener("click", () => {
  activeCat = "All"; wishOnly = false; query = ""; searchInput.value = "";
  $("#chip-wish-only").classList.remove("is-on");
  renderChips(); renderMenu(); setQuery("");
});

/* ══════════════ 11. menu grid ══════════════ */
const badgeMap = { chef: ["Chef's pick", "tag"], hot: ["Spicy", "tag tag--hot"],
  new: ["New", "tag tag--new"], veg: ["Veggie", "tag tag--veg"] };

function dishCard(d) {
  const q = S.cart[d.id] || 0;
  const saved = S.wish.includes(d.id);
  const bd = d.badge ? badgeMap[d.badge] : null;
  return `
  <article class="dish" data-id="${d.id}">
    <div class="dish__media">
      ${imgTag(d.img, d.name, d.cat)}
      <div class="dish__scrim"></div>
      <div class="dish__badge">${bd ? `<span class="${bd[1]}">${bd[0]}</span>` : ""}<span class="tag">${esc(d.cat)}</span></div>
      <button class="heart ${saved ? "is-on" : ""}" data-fav="${d.id}"
              aria-label="Save ${esc(d.name)} to wishlist" aria-pressed="${saved}">
        <svg viewBox="0 0 24 24"><path d="M12 20.3s-7.6-4.6-7.6-9.7A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.6 3c0 5.1-7.6 9.7-7.6 9.7z"/></svg>
      </button>
    </div>
    <div class="dish__body">
      <div class="dish__top">
        <h3 class="dish__name">${esc(d.name)}</h3>
        <span class="dish__price">${money(d.price)}</span>
      </div>
      <p class="dish__desc">${esc(d.desc)}</p>
      <div class="dish__meta">
        <span class="star">★ ${d.rating.toFixed(1)}</span>
        <span>⏱ ${d.mins} min</span>
        <span>🔥 ${d.kcal} kcal</span>
      </div>
      <div class="dish__foot">
        <button class="dish__details" data-details="${d.id}">
          Details <svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
        </button>
        ${q ? `<div class="dish__qty">
                <button data-dec="${d.id}" aria-label="One less">−</button><b>${q}</b>
                <button data-inc="${d.id}" aria-label="One more">+</button></div>`
             : `<button class="dish__add" data-add="${d.id}">
                <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> Add to cart</button>`}
      </div>
    </div>
  </article>`;
}

function renderMenu() {
  const list = visible(), grid = $("#menu-grid");
  const meta = $("#result-meta"), empty = $("#menu-empty");
  const label = wishOnly ? "saved dishes" : activeCat === "All" ? "the full board" : activeCat.toLowerCase();

  if (list.length) {
    meta.hidden = false;
    meta.innerHTML = `Showing <b>${list.length}</b> of ${S.menu.filter(d => d.available !== false).length} · ${esc(label)}` +
      (query ? ` · matching “<b>${esc(query)}</b>”` : "") +
      (list.exact === false ? ` <small>(no dish starts with that — widened to contains)</small>` : "");
  } else meta.hidden = true;

  empty.hidden = list.length > 0;
  if (!list.length) $("#empty-msg").textContent = query
    ? `Nothing on the board begins with “${query}”.`
    : wishOnly ? "You haven't saved anything yet." : "That section is empty right now.";

  grid.classList.remove("is-stagger", "is-in");
  grid.innerHTML = list.map(dishCard).join("");
  void grid.offsetWidth;                       // reflow so the cascade replays on every filter change
  grid.classList.add("is-stagger");
  requestAnimationFrame(() => grid.classList.add("is-in"));
  return list;
}

/* card interactions (delegated) */
document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  if (add) { if (asCustomer("Sign in to put this plate on your order.")) addToCart(add.dataset.add, 1, add); return; }
  const inc = e.target.closest("[data-inc]");
  if (inc) { if (asCustomer()) addToCart(inc.dataset.inc, 1, inc); return; }
  const dec = e.target.closest("[data-dec]");
  if (dec) { if (asCustomer()) addToCart(dec.dataset.dec, -1, dec); return; }
  const det = e.target.closest("[data-details]");
  if (det) { openDish(det.dataset.details); return; }
  const fav = e.target.closest("[data-fav]");
  if (fav) { if (asCustomer("Sign in to save dishes — your hearts live in your account.")) toggleWish(fav.dataset.fav, fav); return; }
});

/* ══════════════ 12. wishlist ══════════════ */
function toggleWish(id, btn) {
  const i = S.wish.indexOf(id);
  const on = i < 0;
  if (on) S.wish.push(id); else S.wish.splice(i, 1);
  save(); syncPips();
  $$(`[data-fav="${id}"]`).forEach(h => h.classList.toggle("is-on", on));
  if (btn) {
    btn.classList.add("burst"); setTimeout(() => btn.classList.remove("burst"), 620);
    if (on) flyTo(btn, "❤️");
  }
  const d = dishById(id);
  toast(on ? `Saved ${d.name} to your wishlist` : `Removed ${d.name}`, on ? "❤️" : "🤍");
  if (wishOnly) renderMenu();
}
function flyTo(from, char) {
  const a = from.getBoundingClientRect(), b = $("#btn-wish").getBoundingClientRect();
  const f = document.createElement("span");
  f.className = "dish__fav-fly"; f.textContent = char;
  f.style.left = (a.left + a.width / 2) + "px"; f.style.top = (a.top + a.height / 2) + "px";
  f.style.setProperty("--fx", (b.left + b.width / 2 - a.left - a.width / 2) + "px");
  f.style.setProperty("--fy", (b.top + b.height / 2 - a.top - a.height / 2) + "px");
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 900);
}
$("#btn-wish").addEventListener("click", () => {
  if (!asCustomer("Sign in to keep a saved list — hearts are stored with your account.")) return;
  wishOnly = !wishOnly;
  $("#chip-wish-only").classList.toggle("is-on", wishOnly);
  renderMenu(); goSection("menu");
  toast(wishOnly ? "Showing your saved dishes" : "Back to the whole board", "❤️");
});

/* ══════════════ 13. cart ══════════════ */
function addToCart(id, delta, srcEl) {
  S.cart[id] = Math.max(0, (S.cart[id] || 0) + delta);
  if (!S.cart[id]) delete S.cart[id];
  save(); syncPips();
  const card = (srcEl && srcEl.closest(".dish")) || document.querySelector(`.dish[data-id="${id}"]`);
  if (card) {
    const foot = card.querySelector(".dish__foot");
    const q = S.cart[id] || 0;
    if (q) {
      foot.querySelectorAll(".dish__qty").forEach(n => n.querySelector("b").textContent = q);
      if (!foot.querySelector(".dish__qty")) swapFoot(card, id);
    } else swapFoot(card, id);
  }
  if (delta > 0) {
    const d = dishById(id);
    toast(`${d.name} added — ${money(d.price)}`, "🛒");
    bump($("#btn-cart"));
  }
  if (!$("#cart-drawer").hidden) renderCart();
}
function swapFoot(card, id) {
  const q = S.cart[id] || 0;
  const foot = card.querySelector(".dish__foot");
  const details = foot.querySelector(".dish__details");
  foot.querySelector(".dish__qty,.dish__add")?.remove();
  details.insertAdjacentHTML("afterend", q
    ? `<div class="dish__qty"><button data-dec="${id}" aria-label="One less">−</button><b>${q}</b>
       <button data-inc="${id}" aria-label="One more">+</button></div>`
    : `<button class="dish__add" data-add="${id}"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> Add to cart</button>`);
}
function bump(el) { el.animate([{ transform: "scale(1)" }, { transform: "scale(1.22) rotate(-8deg)" }, { transform: "scale(1)" }], { duration: 420, easing: "cubic-bezier(.22,1,.36,1)" }); }

function syncPips() {
  const n = cartCount(), w = S.wish.length;
  const cp = $("#cart-pip"), wp = $("#wish-pip");
  cp.hidden = n === 0; cp.textContent = n;
  wp.hidden = w === 0; wp.textContent = w;
  $("#cart-count").textContent = plural(n, "item") + " on the table";
}

function renderCart() {
  const items = cartList(), body = $("#cart-items");
  $("#cart-empty").hidden = items.length > 0;
  body.hidden = items.length === 0;
  body.innerHTML = items.map(({ d, q }) => `
    <div class="ci" data-ci="${d.id}">
      ${imgTag(d.img, d.name, d.cat)}
      <div class="ci__info">
        <b>${esc(d.name)}</b>
        <span>${esc(d.cat)} · ${money(d.price)} each</span>
      </div>
      <div class="ci__right">
        <span class="ci__price">${money(d.price * q)}</span>
        <div class="stepper">
          <button data-dec="${d.id}" aria-label="One less">−</button><b>${q}</b>
          <button data-inc="${d.id}" aria-label="One more">+</button>
        </div>
      </div>
    </div>`).join("");
  const sub = items.reduce((t, x) => t + x.d.price * x.q, 0);
  $("#cart-sub").textContent = money(sub);
  $("#cart-checkout-amt").textContent = money(sub);
  $("#cart-checkout").disabled = !items.length;
}

function openDrawer() {
  if (!asCustomer("Sign in to open your basket.")) return;
  renderCart();
  $("#backdrop").hidden = false; $("#cart-drawer").hidden = false;
  document.body.classList.add("is-locked");
}
function closeDrawer() {
  const dr = $("#cart-drawer");
  if (dr.hidden) return;
  dr.classList.add("is-out");
  $("#backdrop").style.animation = "fade .35s reverse";
  setTimeout(() => { dr.hidden = true; dr.classList.remove("is-out"); $("#backdrop").hidden = true;
    $("#backdrop").style.animation = ""; document.body.classList.remove("is-locked"); }, 380);
}
$("#btn-cart").addEventListener("click", () => $("#cart-drawer").hidden ? openDrawer() : closeDrawer());
$("#cart-close").addEventListener("click", closeDrawer);
$("#cart-browse").addEventListener("click", () => { closeDrawer(); goSection("menu"); });
$("#backdrop").addEventListener("click", closeDrawer);
$("#cart-checkout").addEventListener("click", () => {
  if (!asCustomer("Sign in so we know who this order belongs to.")) return;
  closeDrawer(); openCheckout();
});

/* ══════════════ 14. modal plumbing ══════════════ */
const mroot = $("#modal-root");
function openModal(html, cls = "") {
  mroot.innerHTML = `<div class="modal ${cls}" role="dialog" aria-modal="true">${html}</div>`;
  mroot.hidden = false;
  document.body.classList.add("is-locked");
  mroot.querySelector(".modal").querySelector("[data-autofocus]")?.focus();
}
function closeModal() {
  if (mroot.hidden) return;
  const m = mroot.querySelector(".modal");
  m?.classList.add("is-out");
  setTimeout(() => { mroot.hidden = true; mroot.innerHTML = ""; document.body.classList.remove("is-locked"); }, 300);
}
mroot.addEventListener("mousedown", e => { if (e.target === mroot) closeModal(); });
document.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeModal(); });

const modalHead = (t, s) => `<button class="modal__x" data-close aria-label="Close">
  <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
  <div class="modal__head"><h3>${t}</h3>${s ? `<p>${s}</p>` : ""}</div>`;

/* ══════════════ 15. dish detail — ingredients ══════════════ */
function openDish(id) {
  const d = dishById(id); if (!d) return;
  const q = S.cart[id] || 0;
  openModal(`
    <div class="dd__hero">${imgTag(d.img, d.name, d.cat)}<span class="dd__price-tag">${money(d.price)}</span></div>
    ${modalHead(esc(d.name), `<span class="stars">${starHTML(d.rating)}</span> ${d.rating.toFixed(1)} · ${d.reviews} guest reviews · ${d.mins} min from the pass`)}
    <div class="modal__body">
      <p class="dd__lead">${esc(d.desc)}</p>
      <div class="dd__sec">
        <h4>What goes in it</h4>
        <ul class="ing">${d.ing.map((x, i) =>
          `<li style="animation-delay:${i * 45}ms"><i>${x[0] || "•"}</i>${esc(x[1])}</li>`).join("")}</ul>
      </div>
      ${d.alg.length ? `<div class="dd__sec"><h4>Allergens</h4>
        <div class="allergens">${d.alg.map(a => `<span class="allergen">⚠ ${esc(a)}</span>`).join("")}</div></div>` : ""}
      <div class="dd__sec">
        <h4>Per serving</h4>
        <div class="nutri">
          <div><b>${d.kcal}</b><span>kcal</span></div>
          <div><b>${Math.round(d.kcal * 0.045)}g</b><span>protein</span></div>
          <div><b>${Math.round(d.kcal * 0.09)}g</b><span>carbs</span></div>
          <div><b>${Math.round(d.kcal * 0.038)}g</b><span>fat</span></div>
        </div>
      </div>
      <div class="dd__sec">
        <h4>Kitchen note</h4>
        <p class="dd__lead" style="margin:0">${esc(kitchenNote(d))}</p>
      </div>
    </div>
    <div class="modal__foot">
      <button class="btn btn--ghost" data-fav="${d.id}">${S.wish.includes(d.id) ? "❤️ Saved" : "🤍 Save this dish"}</button>
      <button class="btn btn--primary" data-add="${d.id}" data-close>
        ${q ? `Add another · ${money(d.price)}` : `Add to cart · ${money(d.price)}`}
      </button>
    </div>`, "modal--wide");
}
function kitchenNote(d) {
  if (d.cat === "Drinks") return "Made to order at the bar. Tell us the ice level in your notes and we will honour it.";
  if (d.cat === "Bakery") return "Baked at 06:00. Anything left after 19:00 goes to the shelter on Lantern Lane, never back in the case.";
  if (d.cat === "Desserts") return "Held chilled and finished at the pass. Can be made for the table in about ten minutes.";
  if (d.alg.length) return `Contains ${d.alg.join(", ").toLowerCase()}. Swap any element out — the kitchen is happy to adapt, just say the word in your notes.`;
  return "Cooked strictly to order. Nothing on this plate has been sitting under a lamp.";
}
const starHTML = r => {
  const full = Math.round(r);
  return [1,2,3,4,5].map(i => `<span class="${i <= full ? "" : "off"}">★</span>`).join("");
};

/* ══════════════ 16. totals ══════════════ */
const r2 = n => Math.round((n + Number.EPSILON) * 100) / 100;

function totals(orderType, promoCode) {
  const sub = r2(cartList().reduce((t, x) => t + x.d.price * x.q, 0));
  const tax = r2(sub * 0.0825);
  const service = r2(sub * 0.05);
  const delivery = orderType === "delivery" ? (sub > 45 ? 0 : 4.9) : orderType === "pickup" ? 1.5 : 0;
  let discount = 0;
  const p = promoCode && PROMOS[promoCode.toUpperCase()];
  if (p) discount = r2(Math.min(p.type === "pct" ? sub * p.value / 100 : p.value, sub));
  const total = Math.max(0, r2(sub + tax + service + delivery - discount));
  return { sub, tax, service, delivery, discount, total, promo: p };
}

/* ══════════════ 17. checkout — the order form ══════════════ */
let coState = { type: "delivery", spice: 2, promo: "", contactless: true };

function openCheckout() {
  const items = cartList();
  if (!items.length) { toast("Your basket is empty", "🧺"); return; }
  const u = S.user;
  const slots = ["18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30"];
  openModal(`
    ${modalHead("Set your order", "Five questions the kitchen actually asks before it fires your ticket.")}
    <div class="co">
      <form class="co__form" id="co-form" novalidate>
        <div class="field">
          <label>How are we getting this to you?</label>
          <div class="seg">
            ${[["delivery","🛵","Delivery","22–35 min"],["pickup","🥡","Pickup","15 min","" ],["table","🍷","At the table","now"]]
              .map(([v,i,t,s]) => `<label><input type="radio" name="otype" value="${v}" ${coState.type===v?"checked":""}>
              <span>${i}</span><b>${t}</b><small>${s}</small></label>`).join("")}
          </div>
        </div>

        <div class="row2">
          <div class="field"><label for="co-name">Name on the ticket</label>
            <input id="co-name" name="name" value="${esc(u.name === "Guest" ? "" : u.name)}" placeholder="e.g. Nadia" data-autofocus>
            <small class="field__err">We need a name to call out.</small></div>
          <div class="field"><label for="co-phone">Phone</label>
            <input id="co-phone" name="phone" inputmode="tel" value="${esc(u.phone)}" placeholder="+1 555 000 0000">
            <small class="field__err">At least 7 digits, so the rider can reach you.</small></div>
        </div>

        <div class="field" id="addr-field"><label for="co-addr">Delivery address</label>
          <input id="co-addr" name="address" value="${esc(u.address)}" placeholder="Street, unit, postcode">
          <small class="field__err">Where is the door?</small></div>

        <div class="row2">
          <div class="field"><label for="co-slot">${coState.type === "table" ? "Sitting time" : "Ready at"}</label>
            <select id="co-slot" name="slot">${slots.map(s => `<option>${s}</option>`).join("")}</select></div>
          <div class="field" id="table-field" hidden><label for="co-table">Table number</label>
            <input id="co-table" name="table" type="number" min="1" max="11" value="4"><small>Eleven tables, no more.</small></div>
        </div>

        <div class="field">
          <label for="co-spice">Heat dial — how much chilli on the pass?</label>
          <div class="range">
            <input id="co-spice" name="spice" type="range" min="0" max="4" step="1" value="${coState.spice}">
            <div class="range__labels"><span>None</span><span>Warm</span><span>Medium</span><span>Hot</span><span>Fire</span></div>
            <span class="range__now" id="spice-now"></span>
          </div>
        </div>

        <label class="switch" for="co-contact">
          <span><b>Contactless hand-off</b><small>Rider leaves it at the door and steps back.</small></span>
          <input type="checkbox" id="co-contact" ${coState.contactless ? "checked" : ""}><span class="track"></span>
        </label>

        <div class="field"><label for="co-notes">Notes for the kitchen</label>
          <textarea id="co-notes" name="notes" placeholder="Allergies, well-done, no onion, ring the bell twice…"></textarea></div>

        <div class="field"><label for="co-email">Receipt email (optional)</label>
          <input id="co-email" name="email" type="email" value="${esc(u.email)}" placeholder="you@example.com">
          <small class="field__err">That email doesn't look right.</small></div>
      </form>

      <aside class="co__side">
        <h4>Your basket</h4>
        <div class="co-list">${items.map(({ d, q }) =>
          `<div><span>${q}× ${esc(d.name)}</span><b>${money(d.price * q)}</b></div>`).join("")}</div>
        <h4>Promo</h4>
        <div class="promo">
          <input id="co-promo" placeholder="BISTRO11" value="${esc(coState.promo)}">
          <button type="button" id="co-apply">Apply</button>
        </div>
        <div class="co-totals" id="co-totals"></div>
        <button class="btn btn--primary btn--block" id="co-send">Send to the kitchen</button>
        <small style="text-align:center;color:var(--ink-3);font-size:.72rem">Try code BISTRO11 · FIRSTBITE · LATEPASS</small>
      </aside>
    </div>`, "modal--wide");

  const form = $("#co-form");
  form.addEventListener("input", e => {
    if (e.target.name === "otype") {
      coState.type = e.target.value;
      $("#addr-field").hidden = coState.type !== "delivery";
      $("#table-field").hidden = coState.type !== "table";
      $("#co-slot").closest(".field").querySelector("label").textContent =
        coState.type === "table" ? "Sitting time" : "Ready at";
      paintTotals();
    }
    if (e.target.name === "spice") { coState.spice = +e.target.value; paintSpice(); }
    e.target.closest(".field")?.classList.remove("err");
  });
  $("#co-contact").addEventListener("change", e => coState.contactless = e.target.checked);
  $("#co-apply").addEventListener("click", () => {
    const code = $("#co-promo").value.trim().toUpperCase();
    if (!code) { coState.promo = ""; paintTotals(); return; }
    if (!PROMOS[code]) { toast(`“${code}” isn't a code we know`, "🎟️"); return; }
    coState.promo = code; paintTotals(); toast(`${PROMOS[code].label} applied`, "🎉");
  });
  $("#co-send").addEventListener("click", () => submitOrder(form));
  paintSpice(); paintTotals();
  $("#addr-field").hidden = coState.type !== "delivery";
  $("#table-field").hidden = coState.type !== "table";
}
const SPICE_WORDS = ["no chilli at all","just a warm hum","medium — the house balance","properly hot","fire. signed for it."];
function paintSpice() { $("#spice-now").textContent = SPICE_WORDS[coState.spice]; }
function paintTotals() {
  const t = totals(coState.type, coState.promo);
  const fee = coState.type === "table" ? "Service" : coState.type === "pickup" ? "Pickup tray" : "Delivery";
  $("#co-totals").innerHTML = `
    <div class="line"><span>Subtotal</span><b>${money(t.sub)}</b></div>
    <div class="line line--muted"><span>Kitchen tax 8.25%</span><span>${money(t.tax)}</span></div>
    <div class="line line--muted"><span>Service 5%</span><span>${money(t.service)}</span></div>
    <div class="line line--muted"><span>${fee}</span><span>${t.delivery === 0 ? "Free" : money(t.delivery)}</span></div>
    ${t.discount ? `<div class="line line--muted"><span class="disc">${esc(t.promo.label)}</span><span class="disc">−${money(t.discount)}</span></div>` : ""}
    <div class="line grand"><span>Total</span><b>${money(t.total)}</b></div>`;
}

function submitOrder(form) {
  const f = new FormData(form);
  const need = [];
  const bad = (id, ok) => { const fl = $("#" + id).closest(".field"); fl.classList.toggle("err", !ok); if (!ok) need.push(id); };
  const name = (f.get("name") || "").toString().trim();
  const phone = (f.get("phone") || "").toString().replace(/\D/g, "");
  const addr = (f.get("address") || "").toString().trim();
  const email = (f.get("email") || "").toString().trim();
  bad("co-name", name.length >= 2);
  bad("co-phone", phone.length >= 7);
  bad("co-addr", coState.type !== "delivery" || addr.length >= 6);
  bad("co-email", !email || /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email));
  if (need.length) {
    form.querySelector(".field.err input")?.focus();
    toast("A couple of fields still need you", "✍️");
    return;
  }
  const t = totals(coState.type, coState.promo);
  const order = {
    id: uid("BE-"), email: me()?.email || "",
    name, phone, address: coState.type === "delivery" ? addr : "—",
    type: coState.type, slot: f.get("slot"), table: f.get("table") || "",
    spice: coState.spice, notes: (f.get("notes") || "").toString().trim(),
    contactless: coState.contactless, promo: coState.promo,
    items: cartList().map(({ d, q }) => ({ id: d.id, name: d.name, price: d.price, qty: q, cat: d.cat })),
    totals: t, status: "new", created: Date.now(), eta: 22 + Math.floor(Math.random() * 12)
  };
  S.orders.unshift(order);
  writeMe({ name, phone, email, address: coState.type === "delivery" ? addr : undefined });
  S.cart = {}; save(); syncPips(); renderMenu();
  closeModal();
  runTracker(order);
}

/* ══════════════ 18. order tracker animation ══════════════ */
const CIRC = 2 * Math.PI * 52;
function runTracker(order) {
  const steps = {
    delivery: ["Ticket on the pass","In the kitchen","Plating & boxing","Rider on the way"],
    pickup:   ["Ticket on the pass","In the kitchen","Plating & boxing","Waiting at the counter"],
    table:    ["Ticket on the pass","In the kitchen","Plating at the pass","Being set at table " + (order.table || "—")]
  }[order.type];

  const el = $("#tracker");
  $("#tracker-steps").innerHTML = steps.map((s, i) => `<li data-i="${i}"><i>${i + 1}</i>${esc(s)}</li>`).join("");
  $("#ring-fg").style.strokeDasharray = CIRC;
  $("#ring-fg").style.strokeDashoffset = CIRC;
  $("#ring-pct").textContent = "0%";
  $("#tracker-title").textContent = "Sending your ticket to the pass…";
  $("#tracker-sub").textContent = `Order ${order.id} · ${plural(order.items.reduce((n, i) => n + i.qty, 0), "item")} · ${money(order.totals.total)}`;
  el.hidden = false;
  document.body.classList.add("is-locked");

  const titles = [
    ["Sending your ticket to the pass…","The kitchen printer just woke up."],
    ["Fire!","Your dishes are on the burners now."],
    ["Plating and boxing","Sauce goes in last so nothing sails."],
    [order.type === "delivery" ? "The rider just left" : order.type === "pickup" ? "Ready at the counter" : "On its way to your table",
      `Estimated ${order.eta} minutes from the first ticket.`]
  ];
  const per = 1750; let i = 0;

  const tick = () => {
    const pct = ((i + 1) / steps.length) * 100;
    $("#ring-fg").style.strokeDashoffset = CIRC * (1 - (i + 1) / steps.length);
    $("#ring-pct").textContent = Math.round(pct) + "%";
    $$("#tracker-steps li").forEach((li, n) => {
      li.classList.toggle("is-done", n < i + 1 && n !== i);
      li.classList.toggle("is-active", n === i);
      if (n < i) { li.classList.remove("is-active"); li.querySelector("i").textContent = "✓"; }
    });
    $("#tracker-title").textContent = titles[i][0];
    $("#tracker-sub").textContent = titles[i][1];
    i++;
    if (i < steps.length) setTimeout(tick, per);
    else setTimeout(() => {
      $$("#tracker-steps li").forEach(li => { li.classList.remove("is-active"); li.classList.add("is-done");
        li.querySelector("i").textContent = "✓"; });
      setTimeout(() => {
        el.classList.add("is-out");
        setTimeout(() => { el.hidden = true; el.classList.remove("is-out");
          document.body.classList.remove("is-locked"); showBill(order); }, 460);
      }, 700);
    }, 900);
  };
  setTimeout(tick, 700);
}

/* ══════════════ 19. bill ══════════════ */
function showBill(order) {
  const t = order.totals;
  const bars = Array.from({ length: 42 }, (_, i) =>
    `<i style="height:${28 + ((i * 37) % 60)}%;animation-delay:${i * 12}ms"></i>`).join("");
  openModal(`
    <div class="bill">
      <div class="bill__top">
        <div class="bill__ok"><svg viewBox="0 0 24 24"><path d="M5 13l4.5 4.5L19 8"/></svg></div>
        <h3>Order confirmed</h3>
        <p>${esc(order.name)} — the kitchen has your ticket.</p>
      </div>
      <div class="bill__body">
        <div class="bill__meta">
          <div><span>Order</span><b>${order.id}</b></div>
          <div><span>Placed</span><b>${new Date(order.created).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</b></div>
          <div><span>Style</span><b>${order.type === "table" ? "Table " + esc(order.table || "—") : order.type[0].toUpperCase() + order.type.slice(1)}</b></div>
          <div><span>Ready</span><b>${esc(order.slot)} · ~${order.eta} min</b></div>
        </div>
        <div class="bill__items">
          ${order.items.map(i => `<div><span>${esc(i.name)} <i>×${i.qty}</i></span><b>${money(i.price * i.qty)}</b></div>`).join("")}
        </div>
        <div class="bill__sum">
          <div><span>Subtotal</span><span>${money(t.sub)}</span></div>
          <div><span>Kitchen tax 8.25%</span><span>${money(t.tax)}</span></div>
          <div><span>Service 5%</span><span>${money(t.service)}</span></div>
          <div><span>${order.type === "delivery" ? "Delivery" : order.type === "pickup" ? "Pickup tray" : "Table service"}</span>
            <span>${t.delivery === 0 ? "Free" : money(t.delivery)}</span></div>
          ${t.discount ? `<div><span class="disc">${esc(t.promo.label)}</span><span class="disc">−${money(t.discount)}</span></div>` : ""}
          <div class="grand"><span>Total paid</span><b>${money(t.total)}</b></div>
        </div>
        ${order.notes ? `<div class="ticket__note">“${esc(order.notes)}” — passed to the chef.</div>` : ""}
      </div>
      <div class="bill__foot">
        <button class="btn btn--ghost" id="bill-print">Print copy</button>
        <button class="btn btn--primary" data-close>Back to the menu</button>
      </div>
      <div class="barcode">${bars}</div>
      <div class="bill__zip">BISTRO · ELEVEN · ${order.id}</div>
    </div>`, "modal--slim");

  $("#bill-print").addEventListener("click", () => {
    toast("Sent to the printer at the pass", "🖨️");
    S.orders.find(o => o.id === order.id).printed = true; save();
  });
  renderAdmin();
}

/* ══════════════ 20. reviews ══════════════ */
function renderReviews() {
  const live = S.reviews.filter(r => !r.hidden);
  const avg = live.length ? live.reduce((t, r) => t + r.stars, 0) / live.length : 0;
  $("#rev-avg").textContent = avg.toFixed(1);
  $("#rev-stars").innerHTML = `<span class="stars">${starHTML(avg)}</span>`;
  $("#rev-count").textContent = `${live.length} ${live.length === 1 ? "review" : "reviews"} · last 30 days`;
  $("#review-list").innerHTML = live.slice(0, 8).map(r => `
    <article class="review" data-reveal>
      <div class="review__head">
        <span class="avatar">${esc(r.name[0] || "G")}</span>
        <span class="review__who"><b>${esc(r.name)}</b><span>${new Date(r.date).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}</span></span>
        <span class="stars">${starHTML(r.stars)}</span>
      </div>
      <p class="review__body">“${esc(r.text)}”</p>
      ${r.dish ? `<span class="review__dish">ordered · ${esc(r.dish)}</span>` : ""}
    </article>`).join("");
}
$("#btn-write-review").addEventListener("click", () => {
  if (!asCustomer("Sign in to leave a review — we keep them tied to your account.")) return;
  openReviewForm();
});
function openReviewForm() {
  const dishes = S.menu.map(d => `<option value="${esc(d.name)}">${esc(d.name)}</option>`).join("");
  openModal(`
    ${modalHead("Tell the kitchen", "Reviews go straight to the pass. Be honest — the chef reads them at midnight.")}
    <form class="modal__body" id="rev-form" novalidate>
      <div class="field"><label>How was it?</label>
        <div class="picker" id="picker">${[1,2,3,4,5].map(i =>
          `<button type="button" data-s="${i}" aria-label="${i} stars"><svg viewBox="0 0 24 24"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9-4.3-4.1 5.9-.8z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>`).join("")}</div>
        <small class="field__err">Pick a star count first.</small></div>
      <div class="row2">
        <div class="field"><label for="rv-name">Your name</label>
          <input id="rv-name" value="${esc(me()?.name || "")}" placeholder="How the table knows you" data-autofocus>
          <small class="field__err">A name, please.</small></div>
        <div class="field"><label for="rv-dish">What did you order?</label>
          <select id="rv-dish"><option value="">Just the room</option>${dishes}</select></div>
      </div>
      <div class="field"><label for="rv-text">Your review</label>
        <textarea id="rv-text" placeholder="The food, the noise, the wait — all of it helps."></textarea>
        <small class="field__err">Give us at least a sentence (12 characters).</small></div>
    </div>
    <div class="modal__foot">
      <button class="btn btn--ghost" data-close>Not now</button>
      <button class="btn btn--primary" id="rev-send">Post the review</button>
    </div>`);

  let stars = 0;
  $("#picker").addEventListener("click", e => {
    const b = e.target.closest("[data-s]"); if (!b) return;
    stars = +b.dataset.s;
    $$("#picker button").forEach(x => x.classList.toggle("on", +x.dataset.s <= stars));
    $("#picker").closest(".field").classList.remove("err");
    b.animate([{ transform: "scale(1)" }, { transform: "scale(1.5) rotate(14deg)" }, { transform: "scale(1)" }], { duration: 420 });
  });
  $("#rev-send").addEventListener("click", () => {
    const name = $("#rv-name").value.trim(), text = $("#rv-text").value.trim();
    const ok = v => v.length >= 2;
    $("#rv-name").closest(".field").classList.toggle("err", !ok(name));
    $("#rv-text").closest(".field").classList.toggle("err", text.length < 12);
    $("#picker").closest(".field").classList.toggle("err", !stars);
    if (!ok(name) || text.length < 12 || !stars) { toast("Still missing a star rating, name and a sentence", "⭐"); return; }
    S.reviews.unshift({ id: uid("R"), email: me()?.email || "", name, stars, text,
      dish: $("#rv-dish").value, date: new Date().toISOString().slice(0, 10), hidden: false });
    save(); closeModal(); renderReviews();
    requestAnimationFrame(() => { revealIO?.disconnect(); revealIO = initReveal(); });
    toast("Review posted — thank you, the kitchen will read it", "⭐");
    goSection("reviews");
  });
}

/* ══════════════ 21. account settings ══════════════ */
$("#btn-account").addEventListener("click", () => openAccount());
document.addEventListener("click", e => {
  const o = e.target.closest("[data-open]"); if (!o) return;
  e.preventDefault();
  const k = o.dataset.open;
  if (k === "account") openAccount();
  if (k === "wishlist") { wishOnly = true; $("#chip-wish-only").classList.add("is-on"); renderMenu(); goSection("menu"); }
  if (k === "orders") openAccount("orders");
});

function openAccount(tab = "profile") {
  if (isStaff()) { showView("admin"); setAdminTab("dishes"); scrollTo(0, 0); return; }
  const a = me();
  if (!a) { showAuth("Sign in to open your account."); return; }
  const u = a;
  const pic = /^data:image\/[a-z+.-]+;base64,[a-z0-9+/=]+$/i.test(u.avatar || "") ? u.avatar : "";
  const mine = myOrders();
  openModal(`
    ${modalHead("Account settings", "Your details, your saved plates and everything you've ordered here.")}
    <div class="modal__body">
      <div class="acc__top">
        <div class="acc__pic">
          <span class="avatar" id="acc-avatar">${pic ? `<img src="${pic}" alt="">` : esc(initial(u.name))}</span>
          <span class="acc__picbtn"><input type="file" id="acc-file" accept="image/*">
            <button type="button" id="acc-pic" aria-label="Change photo">
            <svg viewBox="0 0 24 24"><path d="M4 20h4L20 8l-4-4L4 16v4z"/><path d="M14.5 5.5l4 4"/></svg></button></span>
        </div>
        <div class="acc__who">
          <b id="acc-shown">${esc(u.name)}</b>
          <span>${esc(u.email || "no email yet")} · ${plural(S.wish.length, "saved dish")}</span>
        </div>
        <button type="button" class="link-btn acc__out" id="acc-out">Sign out</button>
      </div>
      <div class="acc__tabs">
        <button class="is-on" data-at="profile">Profile</button>
        <button data-at="orders">Orders</button>
        <button data-at="saved">Saved</button>
      </div>
      <form id="acc-form" novalidate>
        <div data-pane="profile">
          <div class="field"><label for="ac-name">Full name</label>
            <input id="ac-name" value="${esc(u.name)}" placeholder="Your name"><small class="field__err">Name is required.</small></div>
          <div class="row2">
            <div class="field"><label for="ac-email">Email</label>
              <input id="ac-email" type="email" value="${esc(u.email)}" placeholder="you@example.com"><small class="field__err">Check that email.</small></div>
            <div class="field"><label for="ac-phone">Phone</label>
              <input id="ac-phone" inputmode="tel" value="${esc(u.phone)}" placeholder="+1 555 000 0000"><small class="field__err">At least 7 digits.</small></div>
          </div>
          <div class="field"><label for="ac-addr">Delivery address</label>
            <textarea id="ac-addr" rows="2" placeholder="Street, unit, postcode">${esc(u.address)}</textarea>
            <small class="field__err">Where should we deliver?</small></div>
        </div>
        <div data-pane="orders" hidden>${mine.length ? mine.map(o => {
          const first = o.items[0] && dishById(o.items[0].id);
          return `
          <div class="mini-order">
            ${imgTag(first ? first.img : GALLERY[0].img, o.id, first ? first.cat : "Mains")}
            <div><b>${o.id} · ${esc(o.type)}</b><small>${plural(o.items.reduce((n,i)=>n+i.qty,0),"item")} · ${new Date(o.created).toLocaleDateString()}</small></div>
            <span class="pill pill--${o.status}">${STATUS_LABEL[o.status] || o.status}</span>
          </div>`; }).join("") : `<p class="muted">No orders yet. The first ticket is waiting.</p>`}</div>
        <div data-pane="saved" hidden>${S.wish.length ? `<div class="co-list">${S.wish.map(id => {
          const d = dishById(id); return d ? `<div><span>${esc(d.name)}</span><b>${money(d.price)}</b></div>` : ""; }).join("")}</div>
          <button type="button" class="btn btn--ghost btn--sm" id="acc-clear-wish">Clear wishlist</button>`
          : `<p class="muted">Tap the ♥ on any dish and it lands here.</p>`}</div>
      </form>
    </div>
    <div class="modal__foot">
      <button class="btn btn--ghost" data-close>Cancel</button>
      <button class="btn btn--primary" id="acc-save">Save changes</button>
    </div>`, "modal--wide");

  $$(".acc__tabs button").forEach(b => b.addEventListener("click", () => {
    $$(".acc__tabs button").forEach(x => x.classList.toggle("is-on", x === b));
    $$("[data-pane]").forEach(p => p.hidden = p.dataset.pane !== b.dataset.at);
  }));
  if (tab !== "profile") $(`.acc__tabs [data-at="${tab}"]`)?.click();
  $("#acc-out").addEventListener("click", () => { closeModal(); endSession(); });

  $("#acc-pic").addEventListener("click", () => $("#acc-file").click());
  $("#acc-file").addEventListener("change", e => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!/^image\//.test(file.type)) { toast("That file isn't an image", "🖼️"); return; }
    readAndShrink(file, dataUrl => {
      writeMe({ avatar: dataUrl }); save();
      $("#acc-avatar").innerHTML = `<img src="${dataUrl}" alt="">`;
      paintHeaderAvatar();
      toast("Profile photo updated", "📸");
    });
  });
  const cw = $("#acc-clear-wish");
  cw?.addEventListener("click", () => { S.wish = []; save(); syncPips(); renderMenu(); closeModal(); toast("Wishlist cleared", "🤍"); });

  $("#acc-save").addEventListener("click", () => {
    const name = $("#ac-name").value.trim(), email = $("#ac-email").value.trim(),
          phone = $("#ac-phone").value.trim(), addr = $("#ac-addr").value.trim();
    const set = (el, ok) => el.closest(".field").classList.toggle("err", !ok);
    const clash = email && email.toLowerCase() !== a.email.toLowerCase() && findAccount(email);
    const okName = name.length >= 2, okMail = !email || (!clash && /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)),
          okPhone = !phone || phone.replace(/\D/g, "").length >= 7;
    set($("#ac-name"), okName); set($("#ac-email"), okMail); set($("#ac-phone"), okPhone);
    if (!okName || !okMail || !okPhone) {
      toast(clash ? "Another account already uses that email" : "Check the highlighted fields", clash ? "🔒" : "✍️");
      return;
    }
    writeMe({ name, email: email || a.email, phone, address: addr });
    save(); paintHeaderAvatar(); paintChrome(); closeModal();
    toast(`Saved. Welcome back, ${name.split(" ")[0]}`, "👤");
  });
}
const initial = n => (n || "G").trim()[0]?.toUpperCase() || "G";
const safePic = () => (/^data:image\/[a-z+.-]+;base64,[a-z0-9+/=]+$/i.test(S.user.avatar || "") ? S.user.avatar : "");
function paintHeaderAvatar() {
  const a = $("#hdr-avatar"), pic = safePic();
  a.innerHTML = pic ? `<img src="${pic}" alt="">` :
    `<svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c1.3-3.7 4-5.5 7-5.5s5.7 1.8 7 5.5"/></svg>`;
}
function readAndShrink(file, done) {
  const fr = new FileReader();
  fr.onload = () => {
    const im = new Image();
    im.onload = () => {
      const max = 220, sc = Math.min(1, max / Math.max(im.width, im.height));
      const c = document.createElement("canvas");
      c.width = Math.round(im.width * sc); c.height = Math.round(im.height * sc);
      c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      done(c.toDataURL("image/jpeg", 0.82));
    };
    im.onerror = () => toast("Couldn't read that image", "⚠️");
    im.src = fr.result;
  };
  fr.readAsDataURL(file);
}

/* ══════════════ 22. gallery ══════════════ */
function renderGallery() {
  $("#scatter").innerHTML = GALLERY.map(g => `
    <figure data-cap="${esc(g.cap)}">
      ${imgTag(g.img, g.cap, "Mains")}
    </figure>`).join("");
}

/* ══════════════ 23. admin / chef console ══════════════ */
const STATUS_FLOW = ["new", "cooking", "ready", "delivering", "done"];
const STATUS_LABEL = { new: "New", cooking: "Cooking", ready: "Ready", delivering: "Out", done: "Served" };

function renderAdmin() {
  if (!isStaff()) { syncAdminCounts(); return; }
  const orders = S.orders;
  const revenue = orders.reduce((t, o) => t + (o.status === "cancelled" ? 0 : o.totals.total), 0);
  const sold = orders.reduce((t, o) => t + o.items.reduce((n, i) => n + i.qty, 0), 0);
  const live = S.reviews.filter(r => !r.hidden);
  const avg = live.length ? live.reduce((t, r) => t + r.stars, 0) / live.length : 0;
  const tally = {};
  orders.forEach(o => o.items.forEach(i => tally[i.name] = (tally[i.name] || 0) + i.qty));
  const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
  const open = orders.filter(o => o.status !== "done").length;

  const stats = [
    ["Revenue booked", money(revenue), `${orders.length} orders`],
    ["Live tickets", open, open ? "kitchen is busy" : "all quiet"],
    ["Plates fired", sold, top ? `top: ${top[0]}` : "no sales yet"],
    ["Guest score", avg.toFixed(2), `${live.length} reviews`]
  ];
  $("#admin-stats").innerHTML = stats.map(([k, v, s]) =>
    `<div class="stat"><span>${k}</span><b>${v}</b><small>${esc(s)}</small></div>`).join("");
  requestAnimationFrame(() => $$(".stat").forEach(x => x.classList.add("is-in")));

  $("#ticket-rail").innerHTML = orders.length ? orders.map(orderTicket).join("") :
    `<div class="empty"><span>🧾</span><h4>No tickets yet</h4><p>Place an order in the Guest view and it prints here.</p></div>`;

  $("#dish-admin").innerHTML = S.menu.map(d => {
    const on = d.available !== false;
    return `
    <div class="da-row" data-drow="${d.id}">
      ${imgTag(d.img, d.name, d.cat)}
      <div><div class="da-name">${esc(d.name)}</div><div class="da-cat">${esc(d.cat)} · ★${d.rating.toFixed(1)}</div></div>
      <input class="da-price" type="number" step="0.5" min="0" value="${d.price}" data-price="${d.id}"
             style="width:88px;padding:8px 10px;border-radius:9px;border:1px solid var(--line-2);background:var(--surface-2)">
      <span class="da-stock">${on ? "● on the board" : "○ off the board"}</span>
      <button class="da-btn ${on ? "is-on-av" : "is-off"}" data-toggle="${d.id}"
              aria-label="${on ? "Take" : "Put"} ${esc(d.name)} ${on ? "off" : "on"} the board"
              title="${on ? "Take off the board" : "Put back on the board"}">
        ${on ? `<svg viewBox="0 0 24 24"><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/></svg>`
             : `<svg viewBox="0 0 24 24"><path d="M4 4l16 16"/><path d="M9.6 5.9A9.6 9.6 0 0 1 12 5.8c6 0 9.5 6.2 9.5 6.2a17 17 0 0 1-3.3 4M6.4 7.9A16.6 16.6 0 0 0 2.5 12S6 18.2 12 18.2c1.3 0 2.5-.3 3.5-.7"/></svg>`}
      </button>
      <button class="da-btn" data-edit="${d.id}" title="Edit ingredients"><svg viewBox="0 0 24 24"><path d="M4 20h4L20 8l-4-4L4 16v4z"/></svg></button>
      <button class="da-btn danger" data-del="${d.id}" title="Remove from board"><svg viewBox="0 0 24 24"><path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13"/></svg></button>
    </div>`; }).join("");

  $("#feedback-admin").innerHTML = S.reviews.length ? S.reviews.map(r => `
    <div class="fb ${r.hidden ? "is-hidden" : ""}" data-fb="${r.id}">
      <span class="avatar" style="width:44px;height:44px">${esc(r.name[0] || "G")}</span>
      <div class="fb__meta">
        <b>${esc(r.name)} · <span class="stars">${starHTML(r.stars)}</span></b>
        <p>${esc(r.text)}</p>
        <span style="font-size:.72rem;color:var(--ink-3)">${esc(r.dish || "the room")} · ${r.date} ${r.hidden ? "· hidden from guests" : ""}</span>
      </div>
      <div class="fb__actions">
        <button class="btn btn--ghost btn--sm" data-hide="${r.id}">${r.hidden ? "Publish" : "Hide"}</button>
        <button class="da-btn danger" data-rdel="${r.id}"><svg viewBox="0 0 24 24"><path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13"/></svg></button>
      </div>
    </div>`).join("") : `<p class="muted">No reviews yet.</p>`;

  syncAdminCounts();
  const who = $("#admin-who");
  if (who) who.textContent = "· " + STAFF.name;
}
function syncAdminCounts() {
  $("#tab-orders-n").textContent = S.orders.filter(o => o.status !== "done").length;
  $("#tab-dishes-n").textContent = S.menu.filter(d => d.available !== false).length;
  $("#tab-feedback-n").textContent = S.reviews.filter(r => !r.hidden).length;
}
function orderTicket(o) {
  const next = STATUS_FLOW[Math.min(STATUS_FLOW.indexOf(o.status) + 1, STATUS_FLOW.length - 1)];
  return `<article class="ticket" data-t="${o.id}">
    <div class="ticket__head">
      <span class="ticket__id">${o.id}<small>${esc(o.name)} · ${o.type}${o.type === "table" ? " #" + esc(o.table || "—") : ""}</small></span>
      <span class="pill pill--${o.status}">${STATUS_LABEL[o.status] || o.status}</span>
    </div>
    <div class="ticket__body">
      ${o.items.map(i => `<div class="ticket__line"><span>${i.qty}× ${esc(i.name)}</span><b>${money(i.price * i.qty)}</b></div>`).join("")}
      <div class="ticket__line"><span>Heat level</span><b>${SPICE_WORDS[o.spice].split(" ")[0]}</b></div>
      ${o.contactless && o.type === "delivery" ? `<div class="ticket__line"><span>Hand-off</span><b>Contactless</b></div>` : ""}
      ${o.notes ? `<div class="ticket__note">“${esc(o.notes)}”</div>` : ""}
    </div>
    <div class="ticket__foot">
      <span class="ticket__total">${money(o.totals.total)} · ${o.slot}</span>
      ${o.status !== "done" ? `<button class="btn btn--primary btn--sm" data-adv="${o.id}">${o.status === "new" ? "Start cooking" : STATUS_LABEL[next] || "Next"}</button>` : ""}
      <button class="da-btn" data-receipt="${o.id}" title="Open receipt"><svg viewBox="0 0 24 24"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/></svg></button>
    </div>
  </article>`;
}
$("#view-admin").addEventListener("click", e => {
  const adv = e.target.closest("[data-adv]");
  if (adv) {
    const o = S.orders.find(x => x.id === adv.dataset.adv);
    o.status = STATUS_FLOW[Math.min(STATUS_FLOW.indexOf(o.status) + 1, STATUS_FLOW.length - 1)];
    save(); renderAdmin();
    toast(`${o.id} → ${STATUS_LABEL[o.status]}`, "🔔");
    return;
  }
  const rec = e.target.closest("[data-receipt]");
  if (rec) { const o = S.orders.find(x => x.id === rec.dataset.receipt); showBill(o); return; }

  const tg = e.target.closest("[data-toggle]");
  if (tg) {
    const d = dishById(tg.dataset.toggle);
    d.available = d.available === false ? true : false;
    save(); renderAdmin(); renderMenu(); renderChips();
    toast(`${d.name} is ${d.available ? "back on the board" : "off the board"}`, d.available ? "✅" : "🚫");
    return;
  }
  const ed = e.target.closest("[data-edit]");
  if (ed) { editDish(ed.dataset.edit); return; }
  const del = e.target.closest("[data-del]");
  if (del) {
    const d = dishById(del.dataset.del);
    d.available = false; delete S.cart[d.id]; save();
    renderAdmin(); renderMenu(); renderChips(); syncPips(); renderCart();
    toast(`${d.name} removed from the board`, "🗑️");
    return;
  }
  const hd = e.target.closest("[data-hide]");
  if (hd) {
    const r = S.reviews.find(x => x.id === hd.dataset.hide);
    r.hidden = !r.hidden; save(); renderAdmin(); renderReviews();
    toast(r.hidden ? "Review hidden from guests" : "Review published", r.hidden ? "🙈" : "📣");
    return;
  }
  const rd = e.target.closest("[data-rdel]");
  if (rd) {
    S.reviews = S.reviews.filter(x => x.id !== rd.dataset.rdel);
    save(); renderAdmin(); renderReviews(); toast("Review deleted", "🗑️");
  }
});
$("#dish-admin").addEventListener("input", e => {
  const p = e.target.closest("[data-price]"); if (!p) return;
  const d = dishById(p.dataset.price);
  const v = parseFloat(p.value);
  if (!isFinite(v) || v < 0) return;
  d.price = Math.round(v * 100) / 100;
  save(); renderMenu();
});
function setAdminTab(name) {
  $$(".admin__tabs button").forEach(x => x.classList.toggle("is-on", x.dataset.tab === name));
  ["orders", "dishes", "feedback"].forEach(p => { $("#panel-" + p).hidden = p !== name; });
}
$$(".admin__tabs button").forEach(b => b.addEventListener("click", () => setAdminTab(b.dataset.tab)));
$("#admin-exit").addEventListener("click", () => endSession());
const onlySafeSrc = s => /^https:\/\/\S+$/i.test(s) || /^data:image\/[a-z+.-]+;base64,[a-z0-9+/=]+$/i.test(s) ? s : "";

function newDish() {
  const cats = CATEGORIES.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join("");
  const ph = "https://images.unsplash.com/photo-…";
  openModal(`
    ${modalHead("Add a dish", "Fill the ticket and it goes straight onto the guest board.")}
    <div class="modal__body">
      <div class="row2">
        <div class="field"><label for="nd-name">Dish name</label>
          <input id="nd-name" placeholder="e.g. Miso Butter Ramen" data-autofocus>
          <small class="field__err">Give the dish a name.</small></div>
        <div class="field"><label for="nd-cat">Category</label>
          <select id="nd-cat">${cats}</select></div>
      </div>
      <div class="row2">
        <div class="field"><label for="nd-price">Price ($)</label>
          <input id="nd-price" type="number" step="0.5" min="0.5" placeholder="14">
          <small class="field__err">Enter a price above zero.</small></div>
        <div class="field"><label for="nd-badge">Badge on the card</label>
          <select id="nd-badge"><option value="">None</option><option value="new">New</option>
            <option value="chef">Chef's pick</option><option value="hot">Spicy</option><option value="veg">Veggie</option></select></div>
      </div>
      <div class="row2">
        <div class="field"><label for="nd-mins">Minutes from the pass</label>
          <input id="nd-mins" type="number" min="1" value="18"></div>
        <div class="field"><label for="nd-kcal">kcal per serving</label>
          <input id="nd-kcal" type="number" min="1" value="520"></div>
      </div>
      <div class="field"><label for="nd-desc">What the guest reads</label>
        <textarea id="nd-desc" rows="2" placeholder="Two lines on what it is and how we cook it."></textarea>
        <small class="field__err">A short description, please.</small></div>
      <div class="field"><label for="nd-ing">Ingredients — one per line, emoji then text</label>
        <textarea id="nd-ing" rows="5" placeholder="🍜 Hand-pulled noodles&#10;🥚 Soft egg"></textarea>
        <small>Format: <code>🧈 French butter</code>. The emoji is optional.</small></div>
      <div class="field"><label for="nd-alg">Allergens, comma separated</label>
        <input id="nd-alg" placeholder="Gluten, Egg"></div>
      <div class="field"><label for="nd-img">Photo link</label>
        <input id="nd-img" type="url" placeholder="${ph}">
        <small>Or <button type="button" class="link-btn" id="nd-pick">upload a photo from this device</button>.</small>
        <small class="field__err">Use a full https:// image link, or upload one.</small></div>
      <div class="nd-preview" id="nd-preview" hidden></div>
    </div>
    <div class="modal__foot">
      <button class="btn btn--ghost" data-close>Cancel</button>
      <button class="btn btn--primary" id="nd-save">Put it on the board</button>
    </div>`, "modal--wide");

  let img = "";
  const preview = src => {
    const box = $("#nd-preview");
    box.hidden = !src;
    box.innerHTML = src ? imgTag(src, "New dish preview", $("#nd-cat").value) : "";
  };
  $("#nd-img").addEventListener("input", e => { img = onlySafeSrc(e.target.value.trim()); preview(img); });
  $("#nd-pick").addEventListener("click", () => {
    const inp = document.createElement("input");
    inp.type = "file"; inp.accept = "image/*";
    inp.addEventListener("change", () => {
      const file = inp.files?.[0]; if (!file) return;
      if (!/^image\//.test(file.type)) { toast("That file isn't an image", "🖼️"); return; }
      readAndShrink(file, dataUrl => { img = dataUrl; $("#nd-img").value = ""; preview(img); });
    }, { once: true });
    inp.click();
  });

  $("#nd-save").addEventListener("click", () => {
    const name = $("#nd-name").value.trim(), desc = $("#nd-desc").value.trim(),
          price = parseFloat($("#nd-price").value), mins = parseInt($("#nd-mins").value, 10),
          kcal = parseInt($("#nd-kcal").value, 10);
    const bad = (el, on) => el.closest(".field").classList.toggle("err", !!on);
    const okName = name.length >= 2, okPrice = isFinite(price) && price > 0, okDesc = desc.length >= 8;
    bad($("#nd-name"), !okName); bad($("#nd-price"), !okPrice);
    bad($("#nd-img"), !img); bad($("#nd-desc"), !okDesc);
    if (!okName || !okPrice || !img || !okDesc) { toast("Name, price, photo and description are needed", "✍️"); return; }
    const ing = $("#nd-ing").value.split("\n").map(l => l.trim()).filter(Boolean).map(l => {
      const m = l.match(/^(\S+)\s+(.*)$/); return m && /\p{Extended_Pictographic}/u.test(m[1]) ? [m[1], m[2]] : ["•", l];
    });
    const dish = {
      id: uid("X"), name, cat: $("#nd-cat").value, price: Math.round(price * 100) / 100, img,
      badge: $("#nd-badge").value || null, rating: 5, reviews: 0,
      mins: mins > 0 ? mins : 18, kcal: kcal > 0 ? kcal : 520, desc,
      ing: ing.length ? ing : [["•", "Made to the chef's recipe"]],
      alg: $("#nd-alg").value.split(",").map(s => s.trim()).filter(Boolean),
      tags: ($("#nd-cat").value + " " + name).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean),
      available: true
    };
    S.menu.push(dish);
    activeCat = "All"; wishOnly = false; query = "";
    searchInput.value = "";
    $("#chip-wish-only").classList.remove("is-on");
    save(); closeModal();
    renderChips(); renderMenu(); renderAdmin(); syncPips();
    requestAnimationFrame(() => { revealIO?.disconnect(); revealIO = initReveal(); });
    toast(`${dish.name} is on the board — guests can order it now`, "🆕");
  });
}
$("#admin-new-dish").addEventListener("click", newDish);

function editDish(id) {
  const d = dishById(id);
  openModal(`
    ${modalHead("Edit " + esc(d.name), "Change the price or rewrite what the guest sees in Details.")}
    <div class="modal__body">
      <div class="row2">
        <div class="field"><label>Price</label><input id="ed-price" type="number" step="0.5" min="0" value="${d.price}"></div>
        <div class="field"><label>Prep minutes</label><input id="ed-mins" type="number" min="1" value="${d.mins}"></div>
      </div>
      <div class="field"><label>Description</label><textarea id="ed-desc" rows="2">${esc(d.desc)}</textarea></div>
      <div class="field"><label>Ingredients — one per line, emoji then text</label>
        <textarea id="ed-ing" rows="8">${esc(d.ing.map(x => `${x[0]} ${x[1]}`).join("\n"))}</textarea>
        <small>Format: <code>🧈 French butter</code>. The emoji is optional.</small></div>
    </div>
    <div class="modal__foot">
      <button class="btn btn--ghost" data-close>Cancel</button>
      <button class="btn btn--primary" id="ed-save">Save dish</button>
    </div>`);
  $("#ed-save").addEventListener("click", () => {
    const price = parseFloat($("#ed-price").value), mins = parseInt($("#ed-mins").value, 10);
    const ing = $("#ed-ing").value.split("\n").map(l => l.trim()).filter(Boolean).map(l => {
      const m = l.match(/^(\S+)\s+(.*)$/); return m && /\p{Extended_Pictographic}/u.test(m[1]) ? [m[1], m[2]] : ["•", l];
    });
    Object.assign(d, {
      price: isFinite(price) && price >= 0 ? price : d.price,
      mins: mins > 0 ? mins : d.mins,
      desc: $("#ed-desc").value.trim() || d.desc,
      ing: ing.length ? ing : d.ing
    });
    save(); closeModal(); renderAdmin(); renderMenu();
    toast(`${d.name} updated on the board`, "👨‍");
  });
}
$("#admin-seed").addEventListener("click", () => {
  S.orders = []; S.reviews = structuredClone(SEED_REVIEWS); S.menu = structuredClone(MENU);
  S.cart = {}; S.wish = ["m1", "b2"];
  save(); renderAdmin(); renderMenu(); renderChips(); renderReviews(); syncPips();
  toast("Demo service reset", "♻️");
});

/* ══════════════ 24. contact + footer from BIZ ══════════════ */
const ICON = {
  ig:   '<rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.3 6.7h.01"/>',
  fb:   '<circle cx="12" cy="12" r="9"/><path d="M15.2 8.4h-1.5a2.1 2.1 0 0 0-2.1 2.1V21"/><path d="M9.9 12.3h4.5"/>',
  x:    '<path d="M4.4 4l15.2 16M19.6 4 4.4 20"/>',
  tt:   '<path d="M14.2 3.6v9.9a3.4 3.4 0 1 1-2.8-3.35"/><path d="M14.2 3.6c.6 2.6 2.3 4 4.9 4.2"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3.6 6.6 12 13l8.4-6.4"/>',
  tel:  '<path d="M6.6 3.5h2.1l1.5 3.8-1.9 1.4a10.5 10.5 0 0 0 4.9 4.9l1.4-1.9 3.8 1.5v2.1a2 2 0 0 1-2.2 2A16.4 16.4 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"/>',
  wa:   '<path d="M4.2 19.8 5.5 15.6A8 8 0 1 1 8.9 19z"/><path d="M9.2 9.4c.5 2.9 2.5 4.9 5.4 5.4"/>',
  pin:  '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  dir:  '<path d="M3 11 21 3l-8 18-2-7z"/>'
};
const svg = d => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;

function renderVisit() {
  $("#visit-dl").innerHTML = [
    ["Address", esc(BIZ.street.join(", "))],
    ["Hours", BIZ.hours.map(h => `${esc(h[0])} ${esc(h[1])}`).join("<br>")],
    ["Phone", `<a href="tel:${esc(BIZ.phoneTel)}">${esc(BIZ.phoneShow)}</a>`],
    ["Email", `<a href="mailto:${esc(BIZ.email)}">${esc(BIZ.email)}</a>`]
  ].map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join("");
  $("#visit-pin").textContent = `${BIZ.name} · ${BIZ.street[0]}`;
  $("#visit-directions").href = BIZ.mapQuery;
}

function renderFooter() {
  $("#ftr-tag").textContent = BIZ.tagline;
  const socials = [
    ["ig", "Instagram", BIZ.socials.instagram, "@" + BIZ.socials.instagram.split("/").pop()],
    ["fb", "Facebook",  BIZ.socials.facebook,  "Bistro Eleven"],
    ["x",  "X",         BIZ.socials.x,         "@" + BIZ.socials.x.split("/").pop()],
    ["tt", "TikTok",    BIZ.socials.tiktok,    "@" + BIZ.socials.tiktok.split("/").pop()]
  ];
  $("#ftr-social").innerHTML = socials.map(([ic, label, href, handle]) =>
    `<a href="${esc(href)}" target="_blank" rel="noopener" title="${esc(handle)}" aria-label="${label}">${svg(ICON[ic])}</a>`).join("");

  $("#ftr-contact").innerHTML = [
    [ICON.mail, "Email", `<a href="mailto:${esc(BIZ.email)}">${esc(BIZ.email)}</a>`, "Replies within a day"],
    [ICON.tel,  "Phone", `<a href="tel:${esc(BIZ.phoneTel)}">${esc(BIZ.phoneShow)}</a>`, "Reservations and large orders"],
    [ICON.wa,   "WhatsApp", `<a href="https://wa.me/${esc(BIZ.wa)}" target="_blank" rel="noopener">Chat with the host</a>`,
       "+" + esc(BIZ.wa)]
  ].map(([ic, k, v, s]) =>
    `<div class="ftr__row">${svg(ic)}<div><b>${esc(k)}</b>${v}<small>${esc(s)}</small></div></div>`).join("");

  $("#ftr-loc").innerHTML = [
    [ICON.pin, "Address", BIZ.street.map(esc).join("<br>"),
      `<a href="${esc(BIZ.mapQuery)}" target="_blank" rel="noopener">Open in Google Maps</a>`],
    [ICON.dir, "Getting here", "Arrival station, 4 min walk", "Riverside car park, lane B"]
  ].map(([ic, k, v, extra]) =>
    `<div class="ftr__row">${svg(ic)}<div><b>${esc(k)}</b>${v}<small>${extra}</small></div></div>`).join("");

  $("#ftr-hours").innerHTML = BIZ.hours.map(([d, h]) => `<div><span>${esc(d)}</span><b>${esc(h)}</b></div>`).join("");
  $("#ftr-pay").innerHTML = BIZ.payments.map(p => `<span>${esc(p)}</span>`).join("");
  $("#ftr-legal").innerHTML = `© ${new Date().getFullYear()} ${esc(BIZ.name)} · All rights reserved · Made on Lantern Lane`;
}
$("#ftr-account").addEventListener("click", () => openAccount());

/* ══════════════ 25. misc wiring ══════════════ */
$("#hero-reserve").addEventListener("click", () => { goSection("menu"); toast("Pick your plates — the board is below", "🍽️"); });
$("#visit-order").addEventListener("click", () => { cartCount() ? openDrawer() : goSection("menu"); });
$("#hdr-nav").addEventListener("click", e => {
  $$("#hdr-nav a").forEach(a => a.classList.toggle("is-active", a === e.target.closest("a")));
});

/* scrollspy */
function initSpy() {
  const secs = ["menu", "story", "gallery", "reviews", "visit"].map(id => document.getElementById(id)).filter(Boolean);
  const io = new IntersectionObserver(es => {
    es.forEach(en => {
      if (!en.isIntersecting) return;
      $$("#hdr-nav a").forEach(a => a.classList.toggle("is-active", a.dataset.nav === en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach(s => io.observe(s));
}

/* ══════════════ 26. boot ══════════════ */
function boot() {
  applyTheme();
  paintChrome();
  renderChips();
  renderMenu();
  renderGallery();
  renderReviews();
  renderVisit();
  renderFooter();
  syncPips();
  revealIO = initReveal();
  initSpy();
  showView(isStaff() ? "admin" : "guest");
  if (isStaff()) { setAdminTab("orders"); renderAdmin(); }
  addEventListener("load", () => { revealIO?.disconnect(); revealIO = initReveal(); }, { once: true });
}
document.readyState === "loading" ? addEventListener("DOMContentLoaded", boot) : boot();

})();
