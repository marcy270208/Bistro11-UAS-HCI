import re

with open('src/lib/storage.js', 'r', encoding='utf-8') as f:
    c = f.read()

# Add supabase import
c = 'import { supabase } from "./supabase.js";\n' + c

# Modify saveState to be async and write to both
old_save = """export function saveState(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); return true; }
  catch { return false; }
}"""

new_save = """export function saveState(s) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    
    // Fire and forget to Supabase
    supabase.from('app_data').upsert({ id: 'bistro', data: s }).then(({ error }) => {
      if (error) console.error("Supabase sync failed:", error.message);
    });
    
    return true;
  }
  catch { return false; }
}"""

c = c.replace(old_save, new_save)

with open('src/lib/storage.js', 'w', encoding='utf-8') as f:
    f.write(c)
