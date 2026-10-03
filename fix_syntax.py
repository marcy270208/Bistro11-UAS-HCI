import re

with open('src/components/modals/TrackOrder.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

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

c = c.replace(bad, good)

with open('src/components/modals/TrackOrder.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
