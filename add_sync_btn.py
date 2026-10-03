import re

with open('src/pages/AdminPage.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

btn_code = """            <div className="admin__head-actions">
              <span className="live"><i /> live <small>A {STAFF.name}</small></span>
              <button className="btn btn--ghost btn--sm" onClick={exportOrders} disabled={isSyncing}>{isSyncing ? "Syncing..." : "Sync to Sheets"}</button>
              <button className="btn btn--ghost btn--sm" onClick={app.previewSite}><Ico name="eye" /> View the guest site</button>"""

if 'Sync to Sheets' not in c:
    c = c.replace("""            <div className="admin__head-actions">
              <span className="live"><i /> live <small>A {STAFF.name}</small></span>
              <button className="btn btn--ghost btn--sm" onClick={app.previewSite}><Ico name="eye" /> View the guest site</button>""", btn_code)

with open('src/pages/AdminPage.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
