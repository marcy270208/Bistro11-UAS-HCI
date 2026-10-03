import re

with open('src/pages/AdminPage.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_export = """  const exportOrders = async () => {
    if (!orders.length) return app.toast("No orders to sync", "⚠️");
    
    app.toast("Syncing to Google Sheets...", "⏳");
    
    const payload = {
      orders: orders.map(o => ({
        id: o.created ? new Date(o.created).toLocaleString() : "-", // Col A: Waktu
        date: o.id,                                                 // Col B: Order ID
        name: o.name || "Guest",                                    // Col C: Nama
        type: o.type,                                               // Col D: Tipe
        status: o.type === "table" ? o.table : (o.address || "-"),  // Col E: Alamat/Meja
        total: o.items.map(i => `${i.qty}x ${i.name}`).join("; "),  // Col F: Daftar Makanan
        items: o.notes || "-",                                      // Col G: Catatan
        notes: o.totals?.total || 0                                 // Col H: Total Harga
      }))
    };

    try {
      await fetch("https://script.google.com/macros/s/AKfycbxUGAViaisAmmwHqZV4JKeW0wqCE4_BUhqUoGA6CNGdr47wEMQKD46HrJjR8mzktyqjdw/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain"
        },
        body: JSON.stringify(payload)
      });
      
      app.toast("Sent to Google Sheets!", "✅");
      
      // Buka Google Sheets di tab baru (ke halaman depan Google Sheets)
      window.open("https://docs.google.com/spreadsheets/d/1-BYsxMJ3F_oXB9OaUxPxyyoQ4uL-26v2OIoLTCEdb6M/edit?gid=0#gid=0", "_blank");
      
    } catch (err) {
      app.toast("Network error during sync", "📡");
      console.error(err);
    }
  };"""

new_export = """  const exportOrders = async () => {
    const unsynced = orders.filter(o => !o.synced);
    if (!unsynced.length) {
       app.toast("No new orders to sync", "⚠️");
       window.open("https://docs.google.com/spreadsheets/d/1-BYsxMJ3F_oXB9OaUxPxyyoQ4uL-26v2OIoLTCEdb6M/edit?gid=0#gid=0", "_blank");
       return;
    }
    
    app.toast("Syncing to Google Sheets...", "⏳");
    
    const payload = {
      orders: unsynced.map(o => ({
        id: o.created ? new Date(o.created).toLocaleString() : "-", 
        date: o.id,                                                 
        name: o.name || "Guest",                                    
        type: o.type,                                               
        status: o.type === "table" ? o.table : (o.address || "-"),  
        total: o.items.map(i => `${i.qty}x ${i.name}`).join("; "),  
        items: o.notes || "-",                                      
        notes: money(o.totals?.total || 0)                          
      }))
    };

    try {
      await fetch("https://script.google.com/macros/s/AKfycbxUGAViaisAmmwHqZV4JKeW0wqCE4_BUhqUoGA6CNGdr47wEMQKD46HrJjR8mzktyqjdw/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain"
        },
        body: JSON.stringify(payload)
      });
      
      app.write(d => {
        unsynced.forEach(o => {
          const target = d.orders.find(x => x.id === o.id);
          if (target) target.synced = true;
        });
      });
      
      app.toast("Sent to Google Sheets!", "✅");
      window.open("https://docs.google.com/spreadsheets/d/1-BYsxMJ3F_oXB9OaUxPxyyoQ4uL-26v2OIoLTCEdb6M/edit?gid=0#gid=0", "_blank");
      
    } catch (err) {
      app.toast("Network error during sync", "📡");
      console.error(err);
    }
  };"""

c = c.replace(old_export, new_export)

with open('src/pages/AdminPage.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
