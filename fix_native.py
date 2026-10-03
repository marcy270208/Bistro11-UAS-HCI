import re

with open('src/pages/AdminPage.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

if 'useState' not in c:
    c = c.replace('import { useApp', 'import { useState } from "react";\nimport { useApp')

with open('src/pages/AdminPage.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

with open('src/components/modals/TrackOrder.jsx', 'r', encoding='utf-8') as f:
    t = f.read()

bad = """          ) : near ? (
            <button className="btn btn--primary" onClick={() => app.receiveOrder(orderId)}>
              {t("Order received", "Pesanan sudah diterima")}
            </button>}
        </div>"""

good = """          ) : near && (
            <button className="btn btn--primary" onClick={() => app.receiveOrder(orderId)}>
              {t("Order received", "Pesanan sudah diterima")}
            </button>
          )}
        </div>"""

t = t.replace(bad, good)
with open('src/components/modals/TrackOrder.jsx', 'w', encoding='utf-8') as f:
    f.write(t)
