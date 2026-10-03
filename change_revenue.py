import re

with open('src/pages/AdminPage.jsx', 'r', encoding='utf-8') as f:
    adminJsx = f.read()

# Replace the revenue stat with Google Sheets text
adminJsx = re.sub(
    r'\["revenue", t\("Revenue booked", "Pendapatan tercatat"\), money\(revenue\), t\(plural\(orders\.length, "order"\), `\$\{orders\.length\} pesanan`\), "sheet"\]',
    '["revenue", t("Google Sheets", "Google Sheets"), t("Open Sheet", "Buka Sheet"), t(plural(orders.length, "order"), `${orders.length} pesanan`), "sheet"]',
    adminJsx
)

with open('src/pages/AdminPage.jsx', 'w', encoding='utf-8') as f:
    f.write(adminJsx)
