import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Remove Firebase imports
c = c.replace('import { db } from "./firebase.js";\nimport { ref, onValue, set } from "firebase/database";\n', '')

# 2. Revert write
old_write = """  /* every mutation gets a private copy, like the old imperative `S` */
  const write = useCallback(fn => setData(prev => { 
    const next = structuredClone(prev); 
    fn(next); 
    
    // Save local parts to localStorage
    const local = { 
      session: next.session, 
      cart: next.cart, 
      wish: next.wish, 
      theme: next.theme 
    };
    try { localStorage.setItem("bistro-local", JSON.stringify(local)); } catch {}

    // Push global parts to Firebase (throttle/debounce not strictly needed for this demo, but good practice)
    const server = {
      accounts: next.accounts || [],
      vault: next.vault || {},
      orders: next.orders || [],
      reviews: next.reviews || [],
      chats: next.chats || [],
      menu: next.menu || [],
      seedVer: next.seedVer
    };
    set(ref(db, 'bistro'), server);
    
    return next; 
  }), []);"""

new_write = """  /* every mutation gets a private copy, like the old imperative `S` */
  const write = useCallback(fn => setData(prev => { const next = structuredClone(prev); fn(next); return next; }), []);"""
c = c.replace(old_write, new_write)

# 3. Revert AppProvider start
old_provider = """export function AppProvider({ children }) {
  const [data, setData] = useState(loadState);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);"""

new_provider = """export function AppProvider({ children }) {
  const [data, setData] = useState(loadState);"""
c = c.replace(old_provider, new_provider)

# 4. Revert useEffect
old_persistence = """  /* ── persistence + theme ── */
  useEffect(() => {
    console.log("Connecting to Firebase...");
    const timeoutId = setTimeout(() => {
      console.warn("Firebase connection timeout after 15s.");
      setDbError("Koneksi ke database Firebase sangat lambat atau terblokir. Pastikan internet stabil dan tidak ada Ad-Blocker.");
      setLoading(false);
    }, 15000);

    const unsub = onValue(ref(db, 'bistro'), snapshot => {
      clearTimeout(timeoutId);
      setDbError(null); // Clear error if it finally connects
      console.log("Received data from Firebase!");
      const serverData = snapshot.val();
      if (serverData) {
        // Only merge if data exists on server
        setData(prev => {
           // If we receive data from server, we should make sure we keep our local session/cart
           const next = { ...prev, ...serverData };
           // Ensure arrays exist
           next.accounts = next.accounts || [];
           next.orders = next.orders || [];
           next.reviews = next.reviews || [];
           next.chats = next.chats || [];
           next.menu = next.menu || [];
           next.vault = next.vault || {};
           
           // Cleanup you@example
           const len = next.accounts.length;
           next.accounts = next.accounts.filter(a => !a.email.includes("you@example"));
           if (next.accounts.length !== len) {
              if (next.session && next.session.email.includes("you@example")) {
                  next.session = null;
              }
           }
           return next;
        });
        setLoading(false);
      } else {
        // First time initialization! Push the seeded data to the DB
        set(ref(db, 'bistro'), {
          accounts: data.accounts,
          vault: data.vault,
          orders: data.orders,
          reviews: data.reviews,
          chats: data.chats,
          menu: data.menu,
          seedVer: data.seedVer
        }).then(() => setLoading(false))
          .catch(err => { setDbError(err.message); setLoading(false); });
      }
    }, error => {
       console.error("Firebase Error:", error);
       setDbError(error.message);
       setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => { document.documentElement.dataset.theme = data.theme; }, [data.theme]);"""

new_persistence = """  /* ── persistence + theme ── */
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
  useEffect(() => { document.documentElement.dataset.theme = data.theme; }, [data.theme]);"""
c = c.replace(old_persistence, new_persistence)

# 5. Revert return
old_return = """  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "var(--bg)", color: "var(--c-text)" }}>Connecting to Kitchen...</div>;
  if (dbError) return <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", background: "var(--bg)", color: "var(--c-err)", padding: "2rem", textAlign: "center" }}><h2>Database Connection Failed</h2><p>{dbError}</p><p style={{marginTop: "1rem", color: "var(--c-text)", maxWidth: 500}}>Please make sure you have created the <b>Realtime Database</b> in your Firebase console and set the Security Rules to <b>Test Mode</b> (allow read/write: true).</p></div>;
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;"""
new_return = """  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;"""
c = c.replace(old_return, new_return)

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

