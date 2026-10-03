import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_place = """  const placeOrder = useCallback(order => {
    write(d => {
      d.orders.unshift(order);
      const email = d.session?.kind === "user" ? d.session.email : null;
      const acc = email && d.accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
      if (acc) {
        for (const [k, v] of Object.entries({ name: order.name, phone: order.phone, address: order.address }))
          if (v && v !== "-") acc[k] = v;
      }
      d.cart = {};
      syncVault(d);
    });
    setTracker(order);
  }, [write]);"""

new_place = """  const placeOrder = useCallback(order => {
    write(d => {
      // Mark it as synced initially so manual sync doesn't duplicate it
      order.synced = true;
      d.orders.unshift(order);
      const email = d.session?.kind === "user" ? d.session.email : null;
      const acc = email && d.accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
      if (acc) {
        for (const [k, v] of Object.entries({ name: order.name, phone: order.phone, address: order.address }))
          if (v && v !== "-") acc[k] = v;
      }
      d.cart = {};
      syncVault(d);
    });
    setTracker(order);
    
    // Auto-sync to Google Sheets in the background
    const payload = {
      orders: [{
        id: order.created ? new Date(order.created).toLocaleString() : "-",
        date: order.id,
        name: order.name || "Guest",
        type: order.type,
        status: order.type === "table" ? order.table : (order.address || "-"),
        total: order.items.map(i => `${i.qty}x ${i.name}`).join("; "),
        items: order.notes || "-",
        notes: money(order.totals?.total || 0)
      }]
    };
    fetch("https://script.google.com/macros/s/AKfycbxUGAViaisAmmwHqZV4JKeW0wqCE4_BUhqUoGA6CNGdr47wEMQKD46HrJjR8mzktyqjdw/exec", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload)
    }).catch(e => console.error("Sheet sync failed", e));
    
  }, [write]);"""

c = c.replace(old_place, new_place)

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
