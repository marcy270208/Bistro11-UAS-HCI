import re

with open('src/pages/AdminPage.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

pattern = r'<div className="admin__head-actions">.*?<button className="btn btn--ghost btn--sm" onClick=\{app\.previewSite\}><Ico name="eye" /> View the guest site</button>'
new_code = """<div className="admin__head-actions">
              <span className="live"><i /> live <small>· {STAFF.name}</small></span>
              <button className="btn btn--ghost btn--sm" onClick={exportOrders} disabled={isSyncing} style={{ border: '1px solid #d2924a', color: '#d2924a' }}>{isSyncing ? "Syncing..." : "Sync to Sheets"}</button>
              <button className="btn btn--ghost btn--sm" onClick={app.previewSite}><Ico name="eye" /> View the guest site</button>"""

c = re.sub(pattern, new_code, c, flags=re.DOTALL)

with open('src/pages/AdminPage.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
