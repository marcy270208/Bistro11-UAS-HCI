import re

with open('src/pages/AdminPage.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add exportOrders function
export_fn = """  const chatUnread = data.chats.reduce((n, c) => n + (c.unread?.chef || 0), 0);

  const exportOrders = () => {
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

c = c.replace('  const chatUnread = data.chats.reduce((n, c) => n + (c.unread?.chef || 0), 0);', export_fn)

# 2. Add onClick to the stats mapping
old_map = """        <div className="stat-grid">
          {stats.map(([k, v, s]) => (
            <div className="stat" key={k}><span>{k}</span><b>{v}</b><small>{s}</small></div>
          ))}
        </div>"""

new_map = """        <div className="stat-grid">
          {stats.map(([k, v, s], idx) => (
            <div 
              className="stat" 
              key={k} 
              onClick={idx === 0 ? exportOrders : undefined}
              style={idx === 0 ? { cursor: 'pointer' } : {}}
              title={idx === 0 ? "Download orders as CSV" : undefined}
            >
              <span>{k}</span><b>{v}</b><small>{s}</small>
            </div>
          ))}
        </div>"""

c = c.replace(old_map, new_map)

with open('src/pages/AdminPage.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
