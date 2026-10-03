import re

i18n_path = 'src/lib/i18n.js'
with open(i18n_path, 'r', encoding='utf-8') as f:
    i18n_content = f.read()

en_updates = """    "pillars.mains.title": "Wood-Fired Mains",
    "pillars.mains.desc": "Slow-grilled over oak and vine. Cooked to order, never held under a lamp.",
    "pillars.mains.link": "Browse mains →",
    "pillars.bakery.title": "Fresh Bakery",
    "pillars.bakery.desc": "Laminated at 4am, out of the oven by seven. Butter, salt, time — that’s all.",
    "pillars.bakery.link": "Browse bakery →",
    "pillars.drinks.title": "Small-Batch Drinks",
    "pillars.drinks.desc": "Single-origin pour-overs and zero-proof cordials pressed in house.",
    "pillars.drinks.link": "Browse drinks →",
    "story.eyebrow": "OUR STORY",
    "story.title": "Eleven seats,\\none very stubborn oven",
    "story.p1": "We opened in a narrow corner unit with eleven stools and a second-hand wood oven that leaked smoke for the first three weeks. Nobody left. Turns out people will wait for a thing that is actually being cooked.",
    "story.p2": "Everything still follows that rule — the bread is laminated before sunrise, the cordials are pressed by hand, and nothing on the board has been sitting since yesterday. When you order, the ticket prints on the pass and the clock starts.",
    "story.li1.b": "Sourced daily",
    "story.li1.s": "from four farms inside the province",
    "story.li2.b": "Cooked to order",
    "story.li2.s": "— we close the kitchen at 22:30, not before",
    "story.li3.b": "Allergens listed",
    "story.li3.s": "on every dish, no exceptions",
    "visit.title": "Find the table",
    "visit.address": "ADDRESS",
    "visit.hours": "HOURS",
    "visit.phone": "PHONE",
    "visit.email": "EMAIL",
    "visit.start": "Start an order",
    "visit.dir": "Get directions",
    "footer.desc": "A neighbourhood kitchen with eleven seats and no shortcuts.",
    "footer.follow": "FOLLOW THE KITCHEN",
    "footer.explore": "EXPLORE",
    "footer.menu": "Full menu",
    "footer.story": "Our story",
    "footer.pass": "From the pass",
    "footer.guestbook": "Guest book",
    "footer.visit": "Visit us",
    "footer.account": "Account settings",
    "footer.talk": "TALK TO US",
    "footer.email": "Email",
    "footer.email.desc": "Replies within a day",
    "footer.phone": "Phone",
    "footer.phone.desc": "Reservations and large orders",
    "footer.wa": "WhatsApp",
    "footer.wa.desc": "Chat with the host",
    "footer.find": "FIND US",
    "footer.address": "Address",
    "footer.map": "Open in Google Maps",
    "footer.getting_here": "Getting here",
    "footer.getting_here.desc": "Arrival station, 4 min walk\\nRiverside car park, lane B",
    "footer.kitchen_hours": "KITCHEN HOURS",
    "footer.last_order": "Last kitchen order 30 min before close.",
    "footer.rights": "© 2026 Bistro Eleven · All rights reserved · Made on Lantern Lane",
    "chat.ask": "Ask about the menu",
"""

id_updates = """    "pillars.mains.title": "Hidangan Utama Panggang Kayu",
    "pillars.mains.desc": "Dipanggang perlahan di atas kayu ek dan rambat. Dimasak sesuai pesanan, tidak pernah dipanaskan ulang.",
    "pillars.mains.link": "Lihat hidangan utama →",
    "pillars.bakery.title": "Roti Segar",
    "pillars.bakery.desc": "Dibuat jam 4 pagi, keluar dari oven jam 7. Mentega, garam, waktu — itu saja.",
    "pillars.bakery.link": "Lihat roti →",
    "pillars.drinks.title": "Minuman Buatan Sendiri",
    "pillars.drinks.desc": "Kopi seduh manual origin tunggal dan sirup tanpa alkohol buatan sendiri.",
    "pillars.drinks.link": "Lihat minuman →",
    "story.eyebrow": "CERITA KAMI",
    "story.title": "Sebelas kursi,\\nsatu oven yang keras kepala",
    "story.p1": "Kami buka di sudut sempit dengan sebelas bangku dan oven kayu bekas yang bocor asap selama tiga minggu pertama. Tidak ada yang pergi. Ternyata orang akan menunggu sesuatu yang benar-benar dimasak.",
    "story.p2": "Semuanya masih mengikuti aturan itu — roti dibuat sebelum matahari terbit, sirup diperas dengan tangan, dan tidak ada di menu yang dibiarkan sejak kemarin. Saat Anda memesan, tiket dicetak dan jam mulai berdetak.",
    "story.li1.b": "Bahan harian",
    "story.li1.s": "dari empat peternakan di dalam provinsi",
    "story.li2.b": "Dimasak saat dipesan",
    "story.li2.s": "— kami tutup dapur jam 22:30, tidak lebih awal",
    "story.li3.b": "Alergen dicantumkan",
    "story.li3.s": "pada setiap hidangan, tanpa terkecuali",
    "visit.title": "Temukan meja",
    "visit.address": "ALAMAT",
    "visit.hours": "JAM BUKA",
    "visit.phone": "TELEPON",
    "visit.email": "EMAIL",
    "visit.start": "Mulai pesanan",
    "visit.dir": "Dapatkan arah",
    "footer.desc": "Dapur lingkungan dengan sebelas kursi dan tanpa jalan pintas.",
    "footer.follow": "IKUTI DAPUR",
    "footer.explore": "JELAJAHI",
    "footer.menu": "Menu lengkap",
    "footer.story": "Cerita kami",
    "footer.pass": "Dari dapur",
    "footer.guestbook": "Buku tamu",
    "footer.visit": "Kunjungi kami",
    "footer.account": "Pengaturan akun",
    "footer.talk": "HUBUNGI KAMI",
    "footer.email": "Email",
    "footer.email.desc": "Dibalas dalam sehari",
    "footer.phone": "Telepon",
    "footer.phone.desc": "Reservasi dan pesanan besar",
    "footer.wa": "WhatsApp",
    "footer.wa.desc": "Mengobrol dengan host",
    "footer.find": "TEMUKAN KAMI",
    "footer.address": "Alamat",
    "footer.map": "Buka di Google Maps",
    "footer.getting_here": "Rute perjalanan",
    "footer.getting_here.desc": "Stasiun kedatangan, 4 mnt jalan kaki\\nTempat parkir Riverside, jalur B",
    "footer.kitchen_hours": "JAM DAPUR",
    "footer.last_order": "Pesanan terakhir 30 menit sebelum tutup.",
    "footer.rights": "© 2026 Bistro Eleven · Hak cipta dilindungi undang-undang · Dibuat di Lantern Lane",
    "chat.ask": "Tanya tentang menu",
"""

i18n_content = i18n_content.replace(
    '    "dish.add": "Add to cart"\n  },',
    '    "dish.add": "Add to cart",\n' + en_updates + '  },'
)

i18n_content = i18n_content.replace(
    '    "dish.add": "Tambah"\n  }',
    '    "dish.add": "Tambah",\n' + id_updates + '  }'
)

with open(i18n_path, 'w', encoding='utf-8') as f:
    f.write(i18n_content)

# Update Pillars.jsx
with open('src/components/Pillars.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
if 'import { t }' not in c:
    c = c.replace('import { useApp } from "../lib/store.jsx";', 'import { useApp } from "../lib/store.jsx";\nimport { t } from "../lib/i18n.js";')
    c = c.replace('const app = useApp();', 'const app = useApp();\n  const lang = app.ui.lang;')
    c = c.replace('<h3>Wood-Fired Mains</h3>', '<h3>{t(lang, "pillars.mains.title")}</h3>')
    c = c.replace('<p>Slow-grilled over oak and vine. Cooked to order, never held under a lamp.</p>', '<p>{t(lang, "pillars.mains.desc")}</p>')
    c = c.replace('Browse mains →', '{t(lang, "pillars.mains.link")}')
    
    c = c.replace('<h3>Fresh Bakery</h3>', '<h3>{t(lang, "pillars.bakery.title")}</h3>')
    c = c.replace('<p>Laminated at 4am, out of the oven by seven. Butter, salt, time — that’s all.</p>', '<p>{t(lang, "pillars.bakery.desc")}</p>')
    c = c.replace('Browse bakery →', '{t(lang, "pillars.bakery.link")}')
    
    c = c.replace('<h3>Small-Batch Drinks</h3>', '<h3>{t(lang, "pillars.drinks.title")}</h3>')
    c = c.replace('<p>Single-origin pour-overs and zero-proof cordials pressed in house.</p>', '<p>{t(lang, "pillars.drinks.desc")}</p>')
    c = c.replace('Browse drinks →', '{t(lang, "pillars.drinks.link")}')
    with open('src/components/Pillars.jsx', 'w', encoding='utf-8') as f: f.write(c)

# Update Story.jsx
with open('src/components/Story.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
if 'import { t }' not in c:
    c = c.replace('import { pic }', 'import { t } from "../lib/i18n.js";\nimport { pic }')
    c = c.replace('export default function Story() {', 'export default function Story() {\n  const { ui } = useApp();\n  const lang = ui.lang;')
    c = 'import { useApp } from "../lib/store.jsx";\n' + c
    c = c.replace('OUR STORY', '{t(lang, "story.eyebrow")}')
    c = c.replace('Eleven seats,<br />one very stubborn oven', '{t(lang, "story.title").split("\\\\n").map((line, i) => <span key={i}>{line}<br/></span>)}')
    c = c.replace('We opened in a narrow corner unit with eleven stools and a second-hand wood oven that leaked smoke for the first three weeks. Nobody left. Turns out people will wait for a thing that is actually being cooked.', '{t(lang, "story.p1")}')
    c = c.replace('Everything still follows that rule — the bread is laminated before sunrise, the cordials are pressed by hand, and nothing on the board has been sitting since yesterday. When you order, the ticket prints on the pass and the clock starts.', '{t(lang, "story.p2")}')
    c = c.replace('<b>Sourced daily</b> from four farms inside the province', '<b>{t(lang, "story.li1.b")}</b> {t(lang, "story.li1.s")}')
    c = c.replace('<b>Cooked to order</b> — we close the kitchen at 22:30, not before', '<b>{t(lang, "story.li2.b")}</b> {t(lang, "story.li2.s")}')
    c = c.replace('<b>Allergens listed</b> on every dish, no exceptions', '<b>{t(lang, "story.li3.b")}</b> {t(lang, "story.li3.s")}')
    with open('src/components/Story.jsx', 'w', encoding='utf-8') as f: f.write(c)

# Update VisitSection.jsx
with open('src/components/VisitSection.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
if 'import { t }' not in c:
    c = c.replace('import Photo from "./Photo.jsx";', 'import Photo from "./Photo.jsx";\nimport { t } from "../lib/i18n.js";')
    c = c.replace('const app = useApp();', 'const app = useApp();\n  const lang = app.ui.lang;')
    c = c.replace('Find the table', '{t(lang, "visit.title")}')
    c = c.replace('>ADDRESS<', '>{t(lang, "visit.address")}<')
    c = c.replace('>HOURS<', '>{t(lang, "visit.hours")}<')
    c = c.replace('>PHONE<', '>{t(lang, "visit.phone")}<')
    c = c.replace('>EMAIL<', '>{t(lang, "visit.email")}<')
    c = c.replace('>Start an order<', '>{t(lang, "visit.start")}<')
    c = c.replace('>Get directions<', '>{t(lang, "visit.dir")}<')
    with open('src/components/VisitSection.jsx', 'w', encoding='utf-8') as f: f.write(c)

# Update Footer.jsx
with open('src/components/Footer.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
if 'import { t }' not in c:
    c = c.replace('import { useApp } from "../lib/store.jsx";', 'import { useApp } from "../lib/store.jsx";\nimport { t } from "../lib/i18n.js";')
    c = c.replace('const app = useApp();', 'const app = useApp();\n  const lang = app.ui.lang;')
    c = c.replace('A neighbourhood kitchen with eleven seats and no shortcuts.', '{t(lang, "footer.desc")}')
    c = c.replace('FOLLOW THE KITCHEN', '{t(lang, "footer.follow")}')
    c = c.replace('>EXPLORE<', '>{t(lang, "footer.explore")}<')
    c = c.replace('>Full menu<', '>{t(lang, "footer.menu")}<')
    c = c.replace('>Our story<', '>{t(lang, "footer.story")}<')
    c = c.replace('>From the pass<', '>{t(lang, "footer.pass")}<')
    c = c.replace('>Guest book<', '>{t(lang, "footer.guestbook")}<')
    c = c.replace('>Visit us<', '>{t(lang, "footer.visit")}<')
    c = c.replace('>Account settings<', '>{t(lang, "footer.account")}<')
    c = c.replace('>TALK TO US<', '>{t(lang, "footer.talk")}<')
    c = c.replace('>Email<', '>{t(lang, "footer.email")}<')
    c = c.replace('Replies within a day', '{t(lang, "footer.email.desc")}')
    c = c.replace('>Phone<', '>{t(lang, "footer.phone")}<')
    c = c.replace('Reservations and large orders', '{t(lang, "footer.phone.desc")}')
    c = c.replace('>WhatsApp<', '>{t(lang, "footer.wa")}<')
    c = c.replace('Chat with the host', '{t(lang, "footer.wa.desc")}')
    c = c.replace('>FIND US<', '>{t(lang, "footer.find")}<')
    c = c.replace('>Address<', '>{t(lang, "footer.address")}<')
    c = c.replace('Open in Google Maps', '{t(lang, "footer.map")}')
    c = c.replace('>Getting here<', '>{t(lang, "footer.getting_here")}<')
    c = c.replace('Arrival station, 4 min walk<br />Riverside car park, lane B', '{t(lang, "footer.getting_here.desc").split("\\\\n").map((line, i) => <span key={i}>{line}<br/></span>)}')
    c = c.replace('>KITCHEN HOURS<', '>{t(lang, "footer.kitchen_hours")}<')
    c = c.replace('Last kitchen order 30 min before close.', '{t(lang, "footer.last_order")}')
    c = c.replace('© 2026 Bistro Eleven · All rights reserved · Made on Lantern Lane', '{t(lang, "footer.rights")}')
    with open('src/components/Footer.jsx', 'w', encoding='utf-8') as f: f.write(c)

# Update ChatWidget.jsx
with open('src/components/ChatWidget.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
if 'import { t }' not in c:
    c = c.replace('import { useApp } from "../lib/store.jsx";', 'import { useApp } from "../lib/store.jsx";\nimport { t } from "../lib/i18n.js";')
    c = c.replace('const app = useApp();', 'const app = useApp();\n  const lang = app.ui.lang;')
    c = c.replace('Ask about the menu', '{t(lang, "chat.ask")}')
    with open('src/components/ChatWidget.jsx', 'w', encoding='utf-8') as f: f.write(c)

