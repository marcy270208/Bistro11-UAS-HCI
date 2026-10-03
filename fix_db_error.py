import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_loading = """  const [loading, setLoading] = useState(true);"""
new_loading = """  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);"""
c = c.replace(old_loading, new_loading)

old_onvalue = """  /* ── persistence + theme ── */
  useEffect(() => {
    const unsub = onValue(ref(db, 'bistro'), snapshot => {
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
  }, []);"""

# need to do regex or precise replace since I added logic to onValue
c = re.sub(r'/\* ── persistence \+ theme ── \*/.*?return \(\) => unsub\(\);\n  }, \[\]\);', old_onvalue, c, flags=re.DOTALL)

old_return = """  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "var(--bg)", color: "var(--c-text)" }}>Connecting to Kitchen...</div>;
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;"""
new_return = """  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "var(--bg)", color: "var(--c-text)" }}>Connecting to Kitchen...</div>;
  if (dbError) return <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", background: "var(--bg)", color: "var(--c-err)", padding: "2rem", textAlign: "center" }}><h2>Database Connection Failed</h2><p>{dbError}</p><p style={{marginTop: "1rem", color: "var(--c-text)", maxWidth: 500}}>Please make sure you have created the <b>Realtime Database</b> in your Firebase console and set the Security Rules to <b>Test Mode</b> (allow read/write: true).</p></div>;
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;"""
c = c.replace(old_return, new_return)

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
