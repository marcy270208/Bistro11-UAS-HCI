import re

with open('src/pages/AdminPage.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# We need to add `isSyncing` state
if 'const [isSyncing, setIsSyncing] = useState(false);' not in c:
    c = c.replace('  const dishQuery = ui.query.trim().toLowerCase();', '  const [isSyncing, setIsSyncing] = useState(false);\n  const dishQuery = ui.query.trim().toLowerCase();')
    # add useState if not imported
    if 'import { useState } from "react";' not in c:
        c = 'import { useState } from "react";\n' + c

old_export = """  const exportOrders = async () => {
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

new_export = """  const exportOrders = async () => {
    if (isSyncing) return;
    
    const unsynced = orders.filter(o => !o.synced);
    if (!unsynced.length) {
       app.toast("No new orders to sync", "⚠️");
       window.open("https://docs.google.com/spreadsheets/d/1-BYsxMJ3F_oXB9OaUxPxyyoQ4uL-26v2OIoLTCEdb6M/edit?gid=0#gid=0", "_blank");
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
      window.open("https://docs.google.com/spreadsheets/d/1-BYsxMJ3F_oXB9OaUxPxyyoQ4uL-26v2OIoLTCEdb6M/edit?gid=0#gid=0", "_blank");
      
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
  };"""

c = c.replace(old_export, new_export)

with open('src/pages/AdminPage.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
