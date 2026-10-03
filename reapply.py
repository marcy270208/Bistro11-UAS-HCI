import os
import re

# 1. SUPABASE CLIENT
supabaseFile = """import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uvvcethlbvomtvwnabqg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dmNldGhsYnZvbXR2d25hYnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5OTc3NzAsImV4cCI6MjEwNjU3Mzc3MH0.xQXEG07Os935qVAJLCkkiyE2C686_qrNPi3trrCHBjA';

export const supabase = createClient(supabaseUrl, supabaseKey);
"""
with open('src/lib/supabase.js', 'w', encoding='utf-8') as f:
    f.write(supabaseFile)

# 2. STORAGE.JS (Add Supabase sync)
with open('src/lib/storage.js', 'r', encoding='utf-8') as f:
    storageJs = f.read()
storageJs = 'import { supabase } from "./supabase.js";\n' + storageJs
storageJs = storageJs.replace(
    "    localStorage.setItem(KEY, JSON.stringify(s));",
    "    localStorage.setItem(KEY, JSON.stringify(s));\n    supabase.from('app_data').upsert({ id: 'bistro', data: s }).catch(() => {});"
)
with open('src/lib/storage.js', 'w', encoding='utf-8') as f:
    f.write(storageJs)

# 3. STORE.JSX (Supabase + Simulation)
with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    storeJsx = f.read()

storeJsx = storeJsx.replace(
    'import { defaults, emptyVault, loadState, saveState, threadKey } from "./storage.js";',
    'import { defaults, emptyVault, loadState, saveState, threadKey } from "./storage.js";\nimport { supabase } from "./supabase.js";'
)

storeJsx = storeJsx.replace(
    'const write = useCallback(fn => setData(prev => { const next = structuredClone(prev); fn(next); return next; }), []);',
    'const write = useCallback(fn => setData(prev => { const next = structuredClone(prev); fn(next); next.lastUpdated = Date.now(); return next; }), []);'
)

fetchLogic = """
  // Sync from Supabase on first load
  useEffect(() => {
    supabase.from('app_data').select('data').eq('id', 'bistro').single().then(({ data: sbData, error }) => {
      if (!error && sbData?.data) {
        setData(prev => {
          if (prev.lastUpdated && (!sbData.data.lastUpdated || prev.lastUpdated >= sbData.data.lastUpdated)) {
            saveState(prev); return prev;
          }
          const merged = { ...prev, ...sbData.data, session: prev.session, cart: prev.cart, wish: prev.wish, accounts: prev.accounts };
          saveState(merged); return merged;
        });
      }
    });
  }, []);
"""
storeJsx = storeJsx.replace(
    '  /* \U0001f4be persistence + theme \U0001f4be */',
    fetchLogic + '\n  /* \U0001f4be persistence + theme \U0001f4be */'
)

simLogic = """
  // Global Demo Simulation
  useEffect(() => {
    const activeOrders = data.orders.filter(o => o.status !== "done" && o.status !== "cancelled");
    if (activeOrders.length === 0) return;
    const timeouts = [];
    activeOrders.forEach(o => {
      const delay = o.status === "delivering" ? 12000 : 1200;
      timeouts.push(setTimeout(() => advanceOrder(o.id), delay));
    });
    return () => timeouts.forEach(clearTimeout);
  }, [data.orders, advanceOrder]);
"""
storeJsx = storeJsx.replace(
    '  const receiveOrder = useCallback(id => {',
    simLogic + '\n  const receiveOrder = useCallback(id => {'
)

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(storeJsx)

# 4. APP.JSX (Hide chat for unauthenticated)
with open('src/App.jsx', 'r', encoding='utf-8') as f:
    appJsx = f.read()
appJsx = appJsx.replace('<ChatWidget />', '{app.signedIn && <ChatWidget />}')
with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(appJsx)

# 5. MENUSECTION.JSX (Remove instructional text)
with open('src/components/MenuSection.jsx', 'r', encoding='utf-8') as f:
    menuJsx = f.read()
menuJsx = re.sub(r'<p className="sec-head__note reveal" data-reveal>\s*\{t\(lang, "menu\.note"\)\}\s*<\/p>', '', menuJsx)
with open('src/components/MenuSection.jsx', 'w', encoding='utf-8') as f:
    f.write(menuJsx)

# 6. TRACKORDER.JSX (Remove Tanya Dapur)
with open('src/components/modals/TrackOrder.jsx', 'r', encoding='utf-8') as f:
    trackJsx = f.read()
trackJsx = re.sub(r'\s*\)\s*:\s*\(\s*<button className="btn btn--primary"\s*onClick=\{\(\) => \{ app\.closeModal\(\); app\.openChat\(\); \}\}>\s*\{t\("Ask the kitchen", "Tanya dapur"\)\}\s*<\/button>\s*\)', '', trackJsx)
with open('src/components/modals/TrackOrder.jsx', 'w', encoding='utf-8') as f:
    f.write(trackJsx)

print("Re-applied mods successfully!")
