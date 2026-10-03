import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

start_str = "// Sync from Supabase on first load"
end_str = "}, []);"

start_idx = c.find(start_str)
end_idx = c.find(end_str, start_idx) + len(end_str)

if start_idx != -1 and end_idx != -1:
    replacement = """// Sync from Supabase on first load
    useEffect(() => {
      supabase.from('app_data').select('data').eq('id', 'bistro').single().then(({ data: sbData, error }) => {
        if (!error && sbData?.data) {
          setData(prev => {
            if (prev.lastUpdated && (!sbData.data.lastUpdated || prev.lastUpdated >= sbData.data.lastUpdated)) {
              saveState(prev);
              return prev;
            }
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
    
    c = c[:start_idx] + replacement + c[end_idx:]

    with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
        f.write(c)
