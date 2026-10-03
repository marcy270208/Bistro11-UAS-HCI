with open('src/lib/storage.js', 'r', encoding='utf-8') as f:
    c = f.read()

old_loadState = """export function loadState() {
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
}"""

new_loadState = """export function loadState() {
  const d = defaults();
  let saved = null;
  let local = null;
  
  try { saved = JSON.parse(localStorage.getItem(KEY)) || null; } catch {}
  try { local = JSON.parse(localStorage.getItem("bistro-local")) || null; } catch {}
  
  // Use new local, fallback to old saved
  const state = local || saved || {};
  
  return {
    ...d,
    theme: state.theme || d.theme,
    session: state.session || d.session,
    cart: state.cart || d.cart,
    wish: state.wish || d.wish
  };
}"""

c = c.replace(old_loadState, new_loadState)

with open('src/lib/storage.js', 'w', encoding='utf-8') as f:
    f.write(c)
