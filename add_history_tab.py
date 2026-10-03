import re

with open('src/pages/AdminPage.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add "history" to tabs
c = c.replace(
    '["orders", t(lang, "admin.tab.orders", "Live tickets")],',
    '["orders", t(lang, "admin.tab.orders", "Live tickets")],\n    ["history", "History"],'
)

# 2. Add historyDate state
c = c.replace(
    'const [isSyncing, setIsSyncing] = useState(false);',
    'const [isSyncing, setIsSyncing] = useState(false);\n  const [historyMonth, setHistoryMonth] = useState("");'
)

# 3. Separate active orders and history orders
c = c.replace(
    'const activeOrders = orders.filter(o => o.status !== "done" && o.status !== "cancelled");',
    '' # wait, it's currently `const open = orders.filter(o => o.status !== "done").length;`
)
# Let's replace the render of orders directly
old_panel = """        {tab === "orders" && (
          <div className="admin__panel">
            {orders.length ? (
              <div className="ticket-rail">{orders.map(o => <OrderTicket key={o.id} o={o} />)}</div>
            ) : (
              <div className="empty">
                <span>🍽️</span>
                <h4>No tickets yet</h4>
                <p>Place an order in the Guest view and it prints here.</p>
              </div>
            )}
          </div>
        )}"""

new_panel = """        {tab === "orders" && (
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

c = c.replace(old_panel, new_panel)

with open('src/pages/AdminPage.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
