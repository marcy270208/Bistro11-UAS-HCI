import re

with open('src/components/modals/TrackOrder.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'\(\s*<button className="btn btn--primary" onClick=\{\(\) => app\.receiveOrder\(orderId\)\}>\s*\{t\("Order received", "Pesanan sudah diterima"\)\}\s*<\/button>\}',
    '( <button className="btn btn--primary" onClick={() => app.receiveOrder(orderId)}> {t("Order received", "Pesanan sudah diterima")} </button> ) : null}',
    content
)

with open('src/components/modals/TrackOrder.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
