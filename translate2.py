import re

i18n_path = 'src/lib/i18n.js'
with open(i18n_path, 'r', encoding='utf-8') as f:
    i18n_content = f.read()

en_updates = """    "cat.Starters": "Starters",
    "cat.Mains": "Mains",
    "cat.Pizza & Pasta": "Pizza & Pasta",
    "cat.Desserts": "Desserts",
    "cat.Bakery": "Bakery",
    "cat.Drinks": "Drinks",
    "badge.chef": "Chef's pick",
    "badge.hot": "Spicy",
    "badge.new": "New",
    "badge.veg": "Veggie",
"""

id_updates = """    "cat.Starters": "Pembuka",
    "cat.Mains": "Utama",
    "cat.Pizza & Pasta": "Pizza & Pasta",
    "cat.Desserts": "Penutup",
    "cat.Bakery": "Roti",
    "cat.Drinks": "Minuman",
    "badge.chef": "Pilihan Koki",
    "badge.hot": "Pedas",
    "badge.new": "Baru",
    "badge.veg": "Vegetarian",
"""

i18n_content = i18n_content.replace(
    '    "chat.ask": "Ask about the menu",',
    '    "chat.ask": "Ask about the menu",\n' + en_updates
)

i18n_content = i18n_content.replace(
    '    "chat.ask": "Tanya tentang menu",',
    '    "chat.ask": "Tanya tentang menu",\n' + id_updates
)

with open(i18n_path, 'w', encoding='utf-8') as f:
    f.write(i18n_content)

# Update ChipBar.jsx
with open('src/components/ChipBar.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('{c === "All" ? t(lang, "chip.all") : c}', '{c === "All" ? t(lang, "chip.all") : t(lang, `cat.${c}`)}')
with open('src/components/ChipBar.jsx', 'w', encoding='utf-8') as f: f.write(c)

# Update DishCard.jsx
with open('src/components/DishCard.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('{badge && <span className={badge[1]}>{badge[0]}</span>}', '{badge && <span className={badge[1]}>{t(lang, `badge.${d.badge}`)}</span>}')
c = c.replace('<span className="tag">{d.cat}</span>', '<span className="tag">{t(lang, `cat.${d.cat}`)}</span>')
with open('src/components/DishCard.jsx', 'w', encoding='utf-8') as f: f.write(c)

# Update PhotoGallery.jsx
with open('src/components/PhotoGallery.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
if 'import { t }' not in c:
    c = c.replace('import { useApp } from "../lib/store.jsx";', 'import { useApp } from "../lib/store.jsx";\nimport { t } from "../lib/i18n.js";')
    c = c.replace('const app = useApp();', 'const app = useApp();\n  const lang = app.ui.lang;')
    c = c.replace('<span className="tag">{cat}</span>', '<span className="tag">{t(lang, `cat.${cat}`)}</span>')
    with open('src/components/PhotoGallery.jsx', 'w', encoding='utf-8') as f: f.write(c)
