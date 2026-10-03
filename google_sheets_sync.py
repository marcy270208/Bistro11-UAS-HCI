import re

with open('src/pages/AdminPage.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace exportOrders logic
old_export = """  const exportOrders = () => {
    if (!orders.length) return app.toast("No orders to export", "⚠️");
    let csv = "Order ID,Date,Name,Email,Type,Status,Total,Items,Notes\\n";
    orders.forEach(o => {
      const escape = (text) => `"${String(text || "").replace(/"/g, '""')}"`;
      const items = o.items.map(i => `${i.qty}x ${i.name}`).join("; ");
      csv += [
        escape(o.id),
        escape(new Date(o.ts).toLocaleString()),
        escape(o.name),
        escape(o.email),
        escape(o.type),
        escape(o.status),
        escape(o.totals.total),
        escape(items),
        escape(o.notes)
      ].join(",") + "\\n";
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Bistro-Orders-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    app.toast("Orders exported to CSV", "📥");
  };"""

new_export = """  const exportOrders = async () => {
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
      const res = await fetch("https://script.google.com/macros/s/AKfycbxUGAViaisAmmwHqZV4JKeW0wqCE4_BUhqUoGA6CNGdr47wEMQKD46HrJjR8mzktyqjdw/exec", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === "success") {
        app.toast("Data synced to Google Sheets!", "✅");
      } else {
        app.toast("Failed to sync data", "❌");
        console.error(data.message);
      }
    } catch (err) {
      app.toast("Network error during sync", "📡");
      console.error(err);
    }
  };"""

c = c.replace(old_export, new_export)

# Also update the tooltip logic
c = c.replace('title={idx === 0 ? "Download orders as CSV" : undefined}', 'title={idx === 0 ? "Sync orders to Google Sheets" : undefined}')

with open('src/pages/AdminPage.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
