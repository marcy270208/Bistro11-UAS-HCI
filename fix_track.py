import re

with open('src/components/modals/TrackOrder.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '              <button className="btn btn--primary" onClick={() => app.receiveOrder(orderId)}>\n                {t("Order received", "Pesanan sudah diterima")}\n              </button>}',
    '              <button className="btn btn--primary" onClick={() => app.receiveOrder(orderId)}>\n                {t("Order received", "Pesanan sudah diterima")}\n              </button>\n            ) : null}'
)

with open('src/components/modals/TrackOrder.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
