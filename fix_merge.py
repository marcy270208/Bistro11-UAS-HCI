import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

pattern = r"    // Sync from Supabase on first load\s*useEffect\(\(\) => \{\s*supabase\.from\('app_data'\)\.select\('data'\)\.eq\('id', 'bistro'\)\.single\(\)\.then\(\(\{ data: sbData, error \}\) => \{\s*if \(\!error && sbData\?\.data\) \{\s*setData\(prev => \{\s*// Only overwrite if Supabase has newer data or just do a straight overwrite\s*// For simplicity, we merge the accounts and orders\s*const merged = \{ \.\.\.prev, \.\.\.sbData\.data \};\s*saveState\(merged\);\s*return merged;\s*\}\);\s*\}\s*\}\);\s*\}, \[\]\);"

replacement = """    // Sync from Supabase on first load
    useEffect(() => {
      supabase.from('app_data').select('data').eq('id', 'bistro').single().then(({ data: sbData, error }) => {
        if (!error && sbData?.data) {
          setData(prev => {
            // Prevent old Supabase data from overwriting newer local data
            if (prev.lastUpdated && (!sbData.data.lastUpdated || prev.lastUpdated >= sbData.data.lastUpdated)) {
              saveState(prev);
              return prev;
            }
            // Intelligently merge: keep local session, cart, and wish!
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
    }, []);"""

c = re.sub(pattern, replacement, c)

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
