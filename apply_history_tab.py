import re

with open('src/pages/AdminPage.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add "history" to tabs
c = re.sub(
    r'\["orders",([^\]]+)\],',
    r'["orders",\1], ["history", "History"],',
    c
)

# 2. Update orders panel and add history panel
# We look for the start of the orders panel
orders_panel_regex = r'\{tab === "orders" && \(\s*<div className="admin__panel">\s*\{orders\.length \?\s*\(\s*<div className="ticket-rail">\{orders\.map\(o => <OrderTicket key=\{o\.id\} o=\{o\} />\)\}</div>\s*\)\s*:\s*\(\s*<div className="empty">.*?</div>\s*\)\s*\}\s*</div>\s*\)\}'

new_panel = """{tab === "orders" && (
          <div className="admin__panel">
            {orders.filter(o => o.status !== "done" && o.status !== "cancelled").length ? (
              <div className="ticket-rail">{orders.filter(o => o.status !== "done" && o.status !== "cancelled").map(o => <OrderTicket key={o.id} o={o} />)}</div>
            ) : (
              <div className="empty">
                <span>🍽️</span>
                <h4>No active tickets</h4>
                <p>Kitchen is clear!</p>
              </div>
            )}
          </div>
        )}
        
        {tab === "history" && (
          <div className="admin__panel">
            <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
              <label>Filter by month:</label>
              <input 
                type="month" 
                value={historyMonth} 
                onChange={(e) => setHistoryMonth(e.target.value)} 
                style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #444", background: "#222", color: "#fff" }}
              />
              {historyMonth && <button className="btn btn--ghost btn--sm" onClick={() => setHistoryMonth("")}>Clear</button>}
            </div>
            {orders.filter(o => (o.status === "done" || o.status === "cancelled") && (!historyMonth || new Date(o.created).toISOString().startsWith(historyMonth))).length ? (
              <div className="ticket-rail">
                {orders.filter(o => (o.status === "done" || o.status === "cancelled") && (!historyMonth || new Date(o.created).toISOString().startsWith(historyMonth))).map(o => <OrderTicket key={o.id} o={o} />)}
              </div>
            ) : (
              <div className="empty">
                <span>📅</span>
                <h4>No history found</h4>
                <p>No completed orders match this date.</p>
              </div>
            )}
          </div>
        )}"""

c = re.sub(orders_panel_regex, new_panel, c, flags=re.DOTALL)

with open('src/pages/AdminPage.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
