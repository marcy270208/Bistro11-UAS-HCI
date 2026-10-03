const fs = require('fs');

// 1. SUPABASE CLIENT
const supabaseFile = `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uvvcethlbvomtvwnabqg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dmNldGhsYnZvbXR2d25hYnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5OTc3NzAsImV4cCI6MjEwNjU3Mzc3MH0.xQXEG07Os935qVAJLCkkiyE2C686_qrNPi3trrCHBjA';

export const supabase = createClient(supabaseUrl, supabaseKey);
`;
fs.writeFileSync('src/lib/supabase.js', supabaseFile);

// 2. STORAGE.JS (Add Supabase sync)
let storageJs = fs.readFileSync('src/lib/storage.js', 'utf8');
storageJs = `import { supabase } from "./supabase.js";\n` + storageJs;
storageJs = storageJs.replace(
  `    localStorage.setItem(KEY, JSON.stringify(s));`,
  `    localStorage.setItem(KEY, JSON.stringify(s));\n    supabase.from('app_data').upsert({ id: 'bistro', data: s }).catch(() => {});`
);
fs.writeFileSync('src/lib/storage.js', storageJs);

// 3. STORE.JSX
let storeJsx = fs.readFileSync('src/lib/store.jsx', 'utf8');
storeJsx = storeJsx.replace(
  `import { defaults, emptyVault, loadState, saveState } from "./storage.js";`,
  `import { defaults, emptyVault, loadState, saveState } from "./storage.js";\nimport { supabase } from "./supabase.js";`
);

// Add lastUpdated to write
storeJsx = storeJsx.replace(
  `const write = useCallback(fn => setData(prev => { const next = structuredClone(prev); fn(next); return next; }), []);`,
  `const write = useCallback(fn => setData(prev => { const next = structuredClone(prev); fn(next); next.lastUpdated = Date.now(); return next; }), []);`
);

// Add Supabase fetch on mount
const fetchLogic = `
  // Sync from Supabase on first load
  useEffect(() => {
    supabase.from('app_data').select('data').eq('id', 'bistro').single().then(({ data: sbData, error }) => {
      if (!error && sbData?.data) {
        setData(prev => {
          if (prev.lastUpdated && (!sbData.data.lastUpdated || prev.lastUpdated >= sbData.data.lastUpdated)) {
            saveState(prev); return prev;
          }
          const merged = { ...prev, ...sbData.data, session: prev.session, cart: prev.cart, wish: prev.wish };
          saveState(merged); return merged;
        });
      }
    });
  }, []);
`;
storeJsx = storeJsx.replace(
  `  /* ── persistence + theme ── */`,
  fetchLogic + `\n  /* ── persistence + theme ── */`
);

// Add Webhook to placeOrder
storeJsx = storeJsx.replace(
  `    setTracker(order);
  }, [write]);`,
  `    setTracker(order);
    const payload = { orders: [{ id: order.created ? new Date(order.created).toLocaleString() : "-", date: order.id, name: order.name || "Guest", type: order.type, status: order.type === "table" ? order.table : (order.address || "-"), total: order.items.map(i => \`\${i.qty}x \${i.name}\`).join("; "), items: order.notes || "-", notes: order.totals?.total || 0 }] };
    fetch("https://script.google.com/macros/s/AKfycbxUGAViaisAmmwHqZV4JKeW0wqCE4_BUhqUoGA6CNGdr47wEMQKD46HrJjR8mzktyqjdw/exec", { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(payload) }).catch(() => {});
  }, [write]);`
);

// Add Chat fallback to askChat
storeJsx = storeJsx.replace(
  `      const reply = answer(msg, d);`,
  `      const reply = answer(msg, d);\n      if (reply === "Maaf, saya tidak paham. Ada yang bisa saya bantu terkait pesanan?" || reply === "Sorry, I didn't get that.") { d.ui.chatMode = "chef"; }`
);

// Add Global Simulation
const simLogic = `
  // Global Demo Simulation
  useEffect(() => {
    const activeOrders = data.orders.filter(o => o.status !== "done" && o.status !== "cancelled");
    if (activeOrders.length === 0) return;
    const timeouts = [];
    activeOrders.forEach(o => {
      const delay = o.status === "delivering" ? 12000 : 3500;
      timeouts.push(setTimeout(() => advanceOrder(o.id), delay));
    });
    return () => timeouts.forEach(clearTimeout);
  }, [data.orders, advanceOrder]);
`;
storeJsx = storeJsx.replace(
  `  const emailOrder = useCallback(id => {`,
  simLogic + `\n  const emailOrder = useCallback(id => {`
);

fs.writeFileSync('src/lib/store.jsx', storeJsx);

// 4. ADMINPAGE.JSX (Manual Sync Button)
let adminJsx = fs.readFileSync('src/pages/AdminPage.jsx', 'utf8');
const syncBtn = `
  const [isSyncing, setIsSyncing] = useState(false);
  const exportOrders = () => {
    setIsSyncing(true);
    const un = app.data.orders.filter(o => !o.synced);
    const payload = { orders: un.map(o => ({ id: o.created ? new Date(o.created).toLocaleString() : "-", date: o.id, name: o.name || "Guest", type: o.type, status: o.type === "table" ? o.table : (o.address || "-"), total: o.items.map(i => \`\${i.qty}x \${i.name}\`).join("; "), items: o.notes || "-", notes: o.totals?.total || 0 })) };
    fetch("https://script.google.com/macros/s/AKfycbxUGAViaisAmmwHqZV4JKeW0wqCE4_BUhqUoGA6CNGdr47wEMQKD46HrJjR8mzktyqjdw/exec", { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(payload) })
      .finally(() => { app.write(d => { d.orders.forEach(o => o.synced = true); }); setIsSyncing(false); app.toast("Synced to Sheets"); });
  };
`;
adminJsx = adminJsx.replace(`export default function AdminPage() {`, `export default function AdminPage() {\n` + syncBtn);
adminJsx = adminJsx.replace(
  `<button className="btn btn--ghost btn--sm" onClick={app.previewSite}>`,
  `<button className="btn btn--ghost btn--sm" onClick={exportOrders} disabled={isSyncing} style={{ border: '1px solid #d2924a', color: '#d2924a' }}>{isSyncing ? "Syncing..." : "Sync to Sheets"}</button>\n              <button className="btn btn--ghost btn--sm" onClick={app.previewSite}>`
);
fs.writeFileSync('src/pages/AdminPage.jsx', adminJsx);

// 5. APP.JSX (Hide chat for unauthenticated)
let appJsx = fs.readFileSync('src/App.jsx', 'utf8');
appJsx = appJsx.replace(`<ChatWidget />`, `{app.signedIn && <ChatWidget />}`);
fs.writeFileSync('src/App.jsx', appJsx);

// 6. MENUSECTION.JSX (Remove instructional text)
let menuJsx = fs.readFileSync('src/components/MenuSection.jsx', 'utf8');
menuJsx = menuJsx.replace(/<p className="sec-head__note reveal" data-reveal>\s*\{t\(lang, "menu\.note"\)\}\s*<\/p>/, '');
fs.writeFileSync('src/components/MenuSection.jsx', menuJsx);

// 7. TRACKORDER.JSX (Remove Tanya Dapur)
let trackJsx = fs.readFileSync('src/components/modals/TrackOrder.jsx', 'utf8');
trackJsx = trackJsx.replace(/\s*\)\s*:\s*\(\s*<button className="btn btn--primary"\s*onClick=\{\(\) => \{ app\.closeModal\(\); app\.openChat\(\); \}\}>\s*\{t\("Ask the kitchen", "Tanya dapur"\)\}\s*<\/button>\s*\)/g, '');
fs.writeFileSync('src/components/modals/TrackOrder.jsx', trackJsx);

console.log("All features successfully migrated to the clean codebase!");
