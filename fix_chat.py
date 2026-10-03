with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_end = """  const endSession = useCallback(quiet => {
    write(d => { syncVault(d); d.session = null; d.cart = {}; d.wish = []; });
    closeDrawer(); closeModal();"""

new_end = """  const endSession = useCallback(quiet => {
    write(d => { 
      syncVault(d); 
      d.session = null; 
      d.cart = {}; 
      d.wish = []; 
      const t = d.chats.find(c => c.id === VISITOR_THREAD);
      if (t) { t.msgs = []; t.unread = { guest: 0, chef: 0 }; t.name = "Guest"; t.email = ""; }
    });
    closeDrawer(); closeModal();"""

c = c.replace(old_end, new_end)

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
