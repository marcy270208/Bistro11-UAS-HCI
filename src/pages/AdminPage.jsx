import { useState } from "react";
import { useApp, searchDishes } from "../lib/store.jsx";
import useReveal from "../hooks/useReveal.js";
import { STAFF } from "../data/biz.js";
import { money, safeAvatar } from "../lib/format.js";
import Stars from "../components/Stars.jsx";
import Ico from "../lib/icons.jsx";
import NewDishForm from "../components/modals/NewDishForm.jsx";
import OrderTicket from "../components/admin/OrderTicket.jsx";
import DishRow from "../components/admin/DishRow.jsx";
import ChatDesk from "../components/admin/ChatDesk.jsx";
import { t } from "../lib/i18n.js";

const getTabs = (lang) => [["orders", t(lang, "admin.orders", "Orders")], ["history", "History"], ["chats", t(lang, "admin.chats", "Chats")], ["dishes", t(lang, "admin.dishes", "Menu")], ["feedback", t(lang, "admin.reviews", "Reviews")], ["users", t(lang, "admin.users", "Users")]];

export default function AdminPage() {
  const app = useApp();
  const { data, ui, onSale } = app;
  const lang = ui.lang;
  useReveal([ui.adminTab, data.orders.length]);

  const orders = data.orders;
  const revenue = orders.reduce((t, o) => t + (o.status === "cancelled" ? 0 : o.totals.total), 0);
  const sold = orders.reduce((t, o) => t + o.items.reduce((n, i) => n + i.qty, 0), 0);
  const open = orders.filter(o => o.status !== "done").length;
  const live = data.reviews.filter(r => !r.hidden);
  const avg = live.length ? live.reduce((t, r) => t + r.stars, 0) / live.length : 0;
  const tally = {};
  orders.forEach(o => o.items.forEach(i => { tally[i.name] = (tally[i.name] || 0) + i.qty; }));
  const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
  const chatUnread = data.chats.reduce((n, c) => n + (c.unread?.chef || 0), 0);

  const openSheet = () => {
    const a = document.createElement('a');
    a.href = "https://docs.google.com/spreadsheets/d/1-BYsxMJ3F_oXB9OaUxPxyyoQ4uL-26v2OIoLTCEdb6M/edit?gid=0#gid=0";
    a.target = "_blank";
    a.click();
  };

  const exportOrders = async () => {
    if (isSyncing) return;
    
    const unsynced = orders.filter(o => !o.synced);
    if (!unsynced.length) {
       app.toast("No new orders to sync", "⚠️");
       openSheet();
       return;
    }
    
    setIsSyncing(true);
    app.toast("Syncing to Google Sheets...", "⏳");
    
    // Mark as synced locally FIRST to completely block duplicate clicks!
    app.write(d => {
      unsynced.forEach(o => {
        const target = d.orders.find(x => x.id === o.id);
        if (target) target.synced = true;
      });
    });
    
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
      
      app.toast("Sent to Google Sheets!", "✅");
      openSheet();
      
    } catch (err) {
      app.toast("Network error during sync", "📡");
      console.error(err);
      // Revert the local sync mark if network actually failed (though no-cors hides most errors)
      app.write(d => {
        unsynced.forEach(o => {
          const target = d.orders.find(x => x.id === o.id);
          if (target) target.synced = false;
        });
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const stats = [
    [`${t(lang, "admin.rev", "Revenue booked")}`, money(revenue), `${orders.length} ${t(lang, "admin.order_unit", "orders")}`],
    [`${t(lang, "admin.live", "Live tickets")}`, open, open ? t(lang, "admin.busy", "kitchen is busy") : t(lang, "admin.quiet", "all quiet")],
    [`${t(lang, "admin.score", "Guest score")}`, avg.toFixed(2), `${live.length} ${t(lang, "admin.reviews_unit", "reviews")}`]
  ];
  const counts = { orders: open, chats: chatUnread || data.chats.length, dishes: onSale.length, feedback: live.length };
  const tab = ui.adminTab;
  const [isSyncing, setIsSyncing] = useState(false);
  const [historyMonth, setHistoryMonth] = useState("");
  const dishQuery = ui.query.trim().toLowerCase();
  const foundDishes = searchDishes(data.menu, dishQuery).list;

  return (
    <section className="admin">
      <div className="wrap">
        <header className="admin__head">
          <div>
            <span className="eyebrow"><i className="eyebrow__dot" /> Chef console</span>
            <h2>{t(lang, "admin.board")}</h2>
          </div>
          <div className="admin__head-actions">
              <span className="live"><i /> live <small>· {STAFF.name}</small></span>
              <button className="btn btn--ghost btn--sm" onClick={exportOrders} disabled={isSyncing} style={{ border: '1px solid #d2924a', color: '#d2924a' }}>{isSyncing ? "Syncing..." : "Sync to Sheets"}</button>
              <button className="btn btn--ghost btn--sm" onClick={app.previewSite}><Ico name="eye" /> View the guest site</button>
            <button className="btn btn--ghost btn--sm" onClick={app.resetDemo}>Reset demo data</button>
            <button className="btn btn--ghost btn--sm" onClick={() => app.endSession()}>Sign out</button>
          </div>
        </header>

        <div className="stat-grid">
          {stats.map(([k, v, s], idx) => (
            <div 
              className="stat" 
              key={k} 
              onClick={idx === 0 ? exportOrders : undefined}
              style={idx === 0 ? { cursor: 'pointer' } : {}}
              title={idx === 0 ? "Sync orders to Google Sheets" : undefined}
            >
              <span>{k}</span><b>{v}</b><small>{s}</small>
            </div>
          ))}
        </div>

        <div className="admin__tabs" role="tablist">
          {getTabs(lang).map(([k, label]) => (
            <button key={k} type="button" className={tab === k ? "is-on" : ""}
                    onClick={() => app.patchUi({ adminTab: k })}>
              {label} <span>{counts[k]}</span>
            </button>
          ))}
        </div>

        {tab === "orders" && (
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
        )}

        {tab === "chats" && (
          <div className="admin__panel">
            <ChatDesk />
          </div>
        )}

        {tab === "dishes" && (
          <div className="admin__panel">
            <div className="da-bar">
              <button className="btn btn--primary btn--sm" onClick={() => app.openModal(<NewDishForm />, "modal--wide")}>
                <Ico name="plus" /> Add a new dish
              </button>
              {dishQuery ? (
                <small className="muted">
                  <b>{foundDishes.length}</b> of {data.menu.length} dishes match “{dishQuery}” ·{" "}
                  <button className="text-btn" onClick={() => app.patchUi({ query: "" })}>Clear</button>
                </small>
              ) : (
                <small className="muted">Anything you post here goes straight onto the guest board - check it with “View the guest site”.</small>
              )}
            </div>
            <div className="dish-admin">
              {foundDishes.length ? foundDishes.map(d => <DishRow key={d.id} d={d} />) : (
                <div className="empty">
                  <span>🔍</span>
                  <h4>Nothing on the board matches “{dishQuery}”</h4>
                  <p>The chef search reads dish names, tags and categories.</p>
                  <button className="btn btn--ghost btn--sm" onClick={() => app.patchUi({ query: "" })}>Clear search</button>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "feedback" && (
          <div className="admin__panel">
            <div className="feedback-admin">
              {data.reviews.length ? data.reviews.map(r => (
                <div className={`fb${r.hidden ? " is-hidden" : ""}`} key={r.id} data-fb={r.id}>
                  {(() => {
                      const acc = r.email ? app.findAccount(r.email) : null;
                      const pic = acc?.avatar ? safeAvatar(acc.avatar) : "";
                      return pic ? (
                        <img src={pic} className="avatar" style={{ width: 44, height: 44 }} alt={r.name} />
                      ) : (
                        <span className="avatar" style={{ width: 44, height: 44 }}>{(r.name || "G")[0]}</span>
                      );
                    })()}
                  <div className="fb__meta">
                    <b>{r.name} · <Stars value={r.stars} /></b>
                    <p>{r.text}</p>
                    <span style={{ fontSize: ".72rem", color: "var(--ink-3)" }}>
                      {r.dish || "the room"} · {r.date}{r.hidden ? " · hidden from guests" : ""}
                    </span>
                  </div>
                  <div className="fb__actions">
                    <button className="btn btn--ghost btn--sm" onClick={() => app.toggleReview(r.id)}>
                      {r.hidden ? "Publish" : "Hide"}
                    </button>
                    <button className="da-btn danger" aria-label="Delete review" onClick={() => app.deleteReview(r.id)}>
                      <Ico name="trash" />
                    </button>
                  </div>
                </div>
              )) : <p className="muted">No reviews yet.</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
