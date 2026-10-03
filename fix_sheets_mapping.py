import re

with open('src/pages/AdminPage.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_export = """  const exportOrders = async () => {
    if (!orders.length) return app.toast("No orders to sync", "⚠️");
    
    app.toast("Syncing to Google Sheets...", "⏳");
    
    const payload = {
      orders: orders.map(o => ({
        id: o.id,
        date: new Date(o.ts).toLocaleString(),
        name: o.name || "Guest",
        type: o.type,
        status: o.status,
        total: o.totals.total,
        items: o.items.map(i => `${i.qty}x ${i.name}`).join("; "),
        notes: o.notes || "-"
      }))
    };

    try {
      // Using no-cors prevents CORS blocking from Google's 302 redirects
      await fetch("https://script.google.com/macros/s/AKfycbxUGAViaisAmmwHqZV4JKeW0wqCE4_BUhqUoGA6CNGdr47wEMQKD46HrJjR8mzktyqjdw/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain"
        },
        body: JSON.stringify(payload)
      });
      
      app.toast("Sent to Google Sheets!", "✅");
    } catch (err) {
      app.toast("Network error during sync", "📡");
      console.error(err);
    }
  };"""

new_export = """  const exportOrders = async () => {
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
      window.open("https://docs.google.com/spreadsheets/u/0/", "_blank");
      
    } catch (err) {
      app.toast("Network error during sync", "📡");
      console.error(err);
    }
  };"""

c = c.replace(old_export, new_export)

with open('src/pages/AdminPage.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
