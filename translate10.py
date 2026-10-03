import re

with open('src/pages/AdminPage.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

if 'import { t }' not in c:
    c = c.replace('import ChatDesk from "../components/admin/ChatDesk.jsx";', 'import ChatDesk from "../components/admin/ChatDesk.jsx";\nimport { t } from "../lib/i18n.js";')

c = c.replace('const getTabs = (lang) => [["orders", "Orders"], ["chats", "Chats"], ["dishes", "Menu"], ["feedback", "Reviews"]];', 'const getTabs = (lang) => [["orders", t(lang, "admin.orders", "Orders")], ["chats", t(lang, "admin.chats", "Chats")], ["dishes", t(lang, "admin.dishes", "Menu")], ["feedback", t(lang, "admin.reviews", "Reviews")]];')

c = c.replace('["Revenue booked", money(revenue), `${orders.length} orders`]', '[`${t(lang, "admin.rev", "Revenue booked")}`, money(revenue), `${orders.length} ${t(lang, "admin.order_unit", "orders")}`]')
c = c.replace('["Live tickets", open, open ? "kitchen is busy" : "all quiet"]', '[`${t(lang, "admin.live", "Live tickets")}`, open, open ? t(lang, "admin.busy", "kitchen is busy") : t(lang, "admin.quiet", "all quiet")]')
c = c.replace('["Plates fired", sold, top ? `top: ${top[0]}` : "no sales yet"]', '[`${t(lang, "admin.plates", "Plates fired")}`, sold, top ? `${t(lang, "admin.top", "top")}: ${top[0]}` : t(lang, "admin.nosales", "no sales yet")]')
c = c.replace('["Guest score", avg.toFixed(2), `${live.length} reviews`]', '[`${t(lang, "admin.score", "Guest score")}`, avg.toFixed(2), `${live.length} ${t(lang, "admin.reviews_unit", "reviews")}`]')

c = c.replace('<h2>Service board</h2>', '<h2>{t(lang, "admin.board", "Service board")}</h2>')

with open('src/pages/AdminPage.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

# i18n updates
with open('src/lib/i18n.js', 'r', encoding='utf-8') as f:
    i18n = f.read()

admin_en = """    "admin.orders": "Orders",
    "admin.chats": "Chats",
    "admin.dishes": "Menu",
    "admin.reviews": "Reviews",
    "admin.rev": "Revenue booked",
    "admin.order_unit": "orders",
    "admin.live": "Live tickets",
    "admin.busy": "kitchen is busy",
    "admin.quiet": "all quiet",
    "admin.plates": "Plates fired",
    "admin.top": "top",
    "admin.nosales": "no sales yet",
    "admin.score": "Guest score",
    "admin.reviews_unit": "reviews",
    "admin.board": "Service board",
"""

admin_id = """    "admin.orders": "Pesanan",
    "admin.chats": "Percakapan",
    "admin.dishes": "Menu",
    "admin.reviews": "Ulasan",
    "admin.rev": "Pendapatan",
    "admin.order_unit": "pesanan",
    "admin.live": "Pesanan aktif",
    "admin.busy": "dapur sedang sibuk",
    "admin.quiet": "sepi",
    "admin.plates": "Hidangan dibuat",
    "admin.top": "teratas",
    "admin.nosales": "belum ada penjualan",
    "admin.score": "Skor tamu",
    "admin.reviews_unit": "ulasan",
    "admin.board": "Papan dapur",
"""

i18n = i18n.replace(
    '    "dish.s4.name": "Velvet Roasted Carrot Soup",',
    admin_en + '\n    "dish.s4.name": "Velvet Roasted Carrot Soup",'
)
i18n = i18n.replace(
    '    "dish.s4.name": "Sup Wortel Panggang Beludru",',
    admin_id + '\n    "dish.s4.name": "Sup Wortel Panggang Beludru",'
)

with open('src/lib/i18n.js', 'w', encoding='utf-8') as f:
    f.write(i18n)


