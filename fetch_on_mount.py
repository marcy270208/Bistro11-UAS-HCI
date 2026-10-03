import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# We need to import supabase
if 'import { supabase }' not in c:
    c = c.replace('import { money, r0, uid } from "./format.js";', 'import { money, r0, uid } from "./format.js";\nimport { supabase } from "./supabase.js";')

# In AppProvider, we need to add a useEffect to fetch from supabase on mount
fetch_effect = """
  // Sync from Supabase on first load
  useEffect(() => {
    supabase.from('app_data').select('data').eq('id', 'bistro').single().then(({ data: sbData, error }) => {
      if (!error && sbData?.data) {
        setData(prev => {
          // Only overwrite if Supabase has newer data or just do a straight overwrite
          // For simplicity, we merge the accounts and orders
          const merged = { ...prev, ...sbData.data };
          saveState(merged);
          return merged;
        });
      }
    });
  }, []);
"""

# Insert right after `const [toasts, setToasts] = useState([]);`
# Wait, `timers` is after toasts. Let's insert before `const patchUi`
c = c.replace('  const patchUi = useCallback', fetch_effect + '\n  const patchUi = useCallback')

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
