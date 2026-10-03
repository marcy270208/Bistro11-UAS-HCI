import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add lastUpdated to write function
old_write = """  const write = useCallback(fn => setData(prev => { const next = structuredClone(prev); fn(next); return next; }), []);"""
new_write = """  const write = useCallback(fn => setData(prev => { const next = structuredClone(prev); fn(next); next.lastUpdated = Date.now(); return next; }), []);"""
c = c.replace(old_write, new_write)

# Add lastUpdated check to Supabase fetch
old_fetch = """        if (!error && sbData?.data) {
          setData(prev => {
            // Only overwrite if Supabase has newer data or just do a straight overwrite
            // For simplicity, we merge the accounts and orders
            const merged = { ...prev, ...sbData.data };
            saveState(merged);
            return merged;
          });
        }"""
new_fetch = """        if (!error && sbData?.data) {
          setData(prev => {
            // Prevent old Supabase data from overwriting newer local data if upsert was delayed/failed
            if (prev.lastUpdated && sbData.data.lastUpdated && prev.lastUpdated >= sbData.data.lastUpdated) {
              // Local is newer, re-sync to Supabase just in case
              saveState(prev);
              return prev;
            }
            const merged = { ...prev, ...sbData.data };
            saveState(merged);
            return merged;
          });
        }"""
c = c.replace(old_fetch, new_fetch)

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
