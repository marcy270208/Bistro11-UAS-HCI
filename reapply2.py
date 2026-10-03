import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    storeJsx = f.read()

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
    '  useEffect(() => {\n    if (!saveState(data))',
    fetchLogic + '\n  useEffect(() => {\n    if (!saveState(data))'
)

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(storeJsx)

print("Applied fetchLogic!")
