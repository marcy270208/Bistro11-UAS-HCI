import re

i18n_path = 'src/lib/i18n.js'
with open(i18n_path, 'r', encoding='utf-8') as f:
    i18n_content = f.read()

en_updates = """    "cart.title": "Your order",
    "cart.empty": "Your basket is empty",
    "cart.empty_desc": "Nothing in here yet. Close the drawer and tap on some dishes.",
    "cart.close": "Close",
    "cart.subtotal": "Subtotal",
    "cart.checkout": "Checkout",
    "checkout.title": "Checkout",
    "checkout.type": "Order type",
    "checkout.delivery": "Delivery",
    "checkout.pickup": "Pickup",
    "checkout.table": "At the table",
    "checkout.details": "Details",
    "checkout.name": "Name",
    "checkout.phone": "Phone",
    "checkout.address": "Address",
    "checkout.email": "Email receipt to (optional)",
    "checkout.slot": "Time slot",
    "checkout.table_no": "Table number",
    "checkout.kitchen": "Kitchen notes",
    "checkout.contactless": "Contactless delivery",
    "checkout.spice": "Spice level",
    "checkout.payment": "Payment",
    "checkout.promo": "Promo code",
    "checkout.apply": "Apply",
    "checkout.summary": "Summary",
    "checkout.fee": "Fee",
    "checkout.tax": "Tax",
    "checkout.service": "Service",
    "checkout.total": "Total to pay",
    "checkout.place": "Send to kitchen",
    "checkout.cancel": "Cancel",
    "admin.board": "Service board",
    "admin.orders": "Live tickets",
    "admin.dishes": "Menu & stock",
    "admin.chats": "Tables & chats",
    "admin.settings": "Settings",
    "tracker.status": "Order status",
    "tracker.cancel": "Close tracker",
"""

id_updates = """    "cart.title": "Pesanan Anda",
    "cart.empty": "Keranjang Anda kosong",
    "cart.empty_desc": "Belum ada apa-apa di sini. Tutup laci ini dan pilih beberapa hidangan.",
    "cart.close": "Tutup",
    "cart.subtotal": "Subtotal",
    "cart.checkout": "Bayar",
    "checkout.title": "Pembayaran",
    "checkout.type": "Jenis pesanan",
    "checkout.delivery": "Pesan antar",
    "checkout.pickup": "Ambil sendiri",
    "checkout.table": "Di meja",
    "checkout.details": "Detail",
    "checkout.name": "Nama",
    "checkout.phone": "Telepon",
    "checkout.address": "Alamat",
    "checkout.email": "Kirim struk ke email (opsional)",
    "checkout.slot": "Waktu",
    "checkout.table_no": "Nomor meja",
    "checkout.kitchen": "Catatan dapur",
    "checkout.contactless": "Pengiriman tanpa kontak",
    "checkout.spice": "Tingkat pedas",
    "checkout.payment": "Pembayaran",
    "checkout.promo": "Kode promo",
    "checkout.apply": "Terapkan",
    "checkout.summary": "Ringkasan",
    "checkout.fee": "Biaya",
    "checkout.tax": "Pajak",
    "checkout.service": "Layanan",
    "checkout.total": "Total bayar",
    "checkout.place": "Kirim ke dapur",
    "checkout.cancel": "Batal",
    "admin.board": "Papan dapur",
    "admin.orders": "Pesanan aktif",
    "admin.dishes": "Menu & stok",
    "admin.chats": "Meja & chat",
    "admin.settings": "Pengaturan",
    "tracker.status": "Status pesanan",
    "tracker.cancel": "Tutup pelacak",
"""

i18n_content = i18n_content.replace(
    '    "badge.veg": "Veggie",',
    '    "badge.veg": "Veggie",\n' + en_updates
)

i18n_content = i18n_content.replace(
    '    "badge.veg": "Vegetarian",',
    '    "badge.veg": "Vegetarian",\n' + id_updates
)

with open(i18n_path, 'w', encoding='utf-8') as f:
    f.write(i18n_content)

# Update CartDrawer.jsx
with open('src/components/CartDrawer.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
if 'import { t }' not in c:
    c = c.replace('import Checkout from "./modals/Checkout.jsx";', 'import Checkout from "./modals/Checkout.jsx";\nimport { t } from "../lib/i18n.js";')
    c = c.replace('const { ui, cartList, cartCount, setQty, closeDrawer, patchUi, openModal, goSection, asCustomer } = useApp();', 'const { ui, cartList, cartCount, setQty, closeDrawer, patchUi, openModal, goSection, asCustomer } = useApp();\n  const lang = ui.lang;')
    c = c.replace('<h2>Your order</h2>', '<h2>{t(lang, "cart.title")}</h2>')
    c = c.replace('<h4>Your basket is empty</h4>', '<h4>{t(lang, "cart.empty")}</h4>')
    c = c.replace('<p>Nothing in here yet. Close the drawer and tap on some dishes.</p>', '<p>{t(lang, "cart.empty_desc")}</p>')
    c = c.replace('onClick={closeDrawer}>Close</button>', 'onClick={closeDrawer}>{t(lang, "cart.close")}</button>')
    c = c.replace('<span>Subtotal</span>', '<span>{t(lang, "cart.subtotal")}</span>')
    c = c.replace('<span>Checkout</span>', '<span>{t(lang, "cart.checkout")}</span>')
    with open('src/components/CartDrawer.jsx', 'w', encoding='utf-8') as f: f.write(c)

# Update AdminPage.jsx
with open('src/pages/AdminPage.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
if 'import { t }' not in c:
    c = c.replace('import { useApp } from "../lib/store.jsx";', 'import { useApp } from "../lib/store.jsx";\nimport { t } from "../lib/i18n.js";')
    c = c.replace('const { ui, data, counts, addDish, resetDemo, leaveAuth } = useApp();', 'const { ui, data, counts, addDish, resetDemo, leaveAuth } = useApp();\n  const lang = ui.lang;')
    c = c.replace('<h2>Service board</h2>', '<h2>{t(lang, "admin.board")}</h2>')
    c = c.replace('const TABS = [', 'const getTabs = (lang) => [')
    c = c.replace('["orders", "Live tickets"],', '["orders", t(lang, "admin.orders")],')
    c = c.replace('["dishes", "Menu & stock"],', '["dishes", t(lang, "admin.dishes")],')
    c = c.replace('["chats", "Tables & chats"]', '["chats", t(lang, "admin.chats")]')
    c = c.replace('TABS.map(([k, label])', 'getTabs(lang).map(([k, label])')
    with open('src/pages/AdminPage.jsx', 'w', encoding='utf-8') as f: f.write(c)
