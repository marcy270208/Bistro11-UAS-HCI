import re
import os

i18n_path = 'src/lib/i18n.js'
with open(i18n_path, 'r', encoding='utf-8') as f:
    i18n_content = f.read()

en_updates = """    "detail.drag": "drag to change the angle",
    "detail.reviews": "guest reviews",
    "detail.pass": "min from the pass",
    "detail.ing": "What goes in it",
    "detail.alg": "Allergens",
    "detail.nutri": "Per serving",
    "detail.protein": "protein",
    "detail.carbs": "carbs",
    "detail.fat": "fat",
    "detail.note": "Kitchen note",
    "detail.saved": "Saved",
    "detail.save": "Save this dish",
    "detail.add": "Add to order",
    "dish.s4.name": "Velvet Roasted Carrot Soup",
    "dish.s4.desc": "Slow-roasted carrots blended with coconut, finished with yoghurt and toasted almonds.",
    "dish.s5.name": "Eleven Sushi Boat",
    "dish.s5.desc": "Eighteen pieces rolled to order — tuna, salmon, avocado and the house spicy sauce.",
    "dish.s6.name": "Beef Tasting Trio",
    "dish.s6.desc": "Three cuts off the same animal — cured, slow-braised and charred over oak.",
    "dish.m1.name": "Pan-Seared Salmon Ribbons",
    "dish.m1.desc": "Crisp-skirted salmon over spinach and courgette ribbons with a lime beurre blanc.",
    "dish.m2.name": "The Eleven Cheeseburger",
    "dish.m2.desc": "Two dry-aged patties, molten cheddar, house sauce and pickles in a potato bun.",
    "dish.m3.name": "Buttermilk Chicken & Fries",
    "dish.m3.desc": "Twenty-four hours in buttermilk, fried hard. Served with skin-on chips and chilli mayo.",
"""

id_updates = """    "detail.drag": "geser untuk mengubah sudut",
    "detail.reviews": "ulasan tamu",
    "detail.pass": "mnt dari dapur",
    "detail.ing": "Komposisi",
    "detail.alg": "Alergen",
    "detail.nutri": "Per porsi",
    "detail.protein": "protein",
    "detail.carbs": "karbo",
    "detail.fat": "lemak",
    "detail.note": "Catatan dapur",
    "detail.saved": "Tersimpan",
    "detail.save": "Simpan hidangan",
    "detail.add": "Tambah pesanan",
    "dish.s4.name": "Sup Wortel Panggang Beludru",
    "dish.s4.desc": "Wortel panggang perlahan yang diblender dengan kelapa, diakhiri dengan yoghurt dan almond panggang.",
    "dish.s5.name": "Perahu Sushi Eleven",
    "dish.s5.desc": "Delapan belas potong digulung sesuai pesanan — tuna, salmon, alpukat, dan saus pedas buatan rumah.",
    "dish.s6.name": "Trio Daging Sapi",
    "dish.s6.desc": "Tiga potongan dari hewan yang sama — diawetkan, direbus lambat, dan dibakar di atas kayu ek.",
    "dish.m1.name": "Pita Salmon Panggang",
    "dish.m1.desc": "Salmon dengan kulit renyah di atas bayam dan pita zukini dengan saus lime beurre blanc.",
    "dish.m2.name": "Burger Keju Eleven",
    "dish.m2.desc": "Dua patty dry-aged, cheddar leleh, saus rumah, dan acar dalam roti kentang.",
    "dish.m3.name": "Ayam Buttermilk & Kentang Goreng",
    "dish.m3.desc": "Direndam dua puluh empat jam dalam buttermilk, digoreng garing. Disajikan dengan kentang goreng kulit dan mayo cabai.",
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

# Update DishDetail.jsx
with open('src/components/modals/DishDetail.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

if 'import { t }' not in c:
    c = c.replace('import PhotoGallery from "../PhotoGallery.jsx";', 'import PhotoGallery from "../PhotoGallery.jsx";\nimport { t } from "../../lib/i18n.js";')
    c = c.replace('const app = useApp();', 'const app = useApp();\n  const lang = app.ui.lang;')
    
    # Hero label
    c = c.replace('label={`${d.name} — drag to change the angle`}', 'label={`${t(lang, `dish.${d.id}.name`, d.name)} — ${t(lang, "detail.drag")}`}')
    c = c.replace('name={d.name}', 'name={t(lang, `dish.${d.id}.name`, d.name)}')
    
    # ModalHead
    c = c.replace('title={d.name}', 'title={t(lang, `dish.${d.id}.name`, d.name)}')
    c = c.replace('A· {reviewCount} guest reviews A· {d.mins} min from the pass', '· {reviewCount} {t(lang, "detail.reviews")} · {d.mins} {t(lang, "detail.pass")}')
    # Note: original code has `·` character which might have been garbled to `A·` in PowerShell. Let me just replace both safely.
    c = re.sub(r'(?:A)?· \{reviewCount\} guest reviews (?:A)?· \{d\.mins\} min from the pass', '· {reviewCount} {t(lang, "detail.reviews")} · {d.mins} {t(lang, "detail.pass")}', c)

    # Lead description
    c = c.replace('<p className="dd__lead">{d.desc}</p>', '<p className="dd__lead">{t(lang, `dish.${d.id}.desc`, d.desc)}</p>')
    
    # Headers
    c = c.replace('<h4>What goes in it</h4>', '<h4>{t(lang, "detail.ing")}</h4>')
    c = c.replace('<h4>Allergens</h4>', '<h4>{t(lang, "detail.alg")}</h4>')
    c = c.replace('<h4>Per serving</h4>', '<h4>{t(lang, "detail.nutri")}</h4>')
    c = c.replace('<h4>Kitchen note</h4>', '<h4>{t(lang, "detail.note")}</h4>')
    
    # Nutrition spans
    c = c.replace('<span>protein</span>', '<span>{t(lang, "detail.protein")}</span>')
    c = c.replace('<span>carbs</span>', '<span>{t(lang, "detail.carbs")}</span>')
    c = c.replace('<span>fat</span>', '<span>{t(lang, "detail.fat")}</span>')

    # Ingredients & Allergens translations
    c = c.replace('<i>{emoji || "🍽️"}</i>{label}</li>', '<i>{emoji || "🍽️"}</i>{t(lang, `ing.${label}`, label)}</li>')
    c = c.replace('<span className="allergen" key={a}>⚠️ {a}</span>', '<span className="allergen" key={a}>⚠️ {t(lang, `alg.${a}`, a)}</span>')
    
    # Buttons
    # {saved ? "❤️ Saved" : "🤍 Save this dish"}
    c = re.sub(r'\{saved \? ".*?Saved" : ".*?Save this dish"\}', '{saved ? "❤️ " + t(lang, "detail.saved") : "🤍 " + t(lang, "detail.save")}', c)
    c = c.replace('Add to order', '{t(lang, "detail.add")}')

    with open('src/components/modals/DishDetail.jsx', 'w', encoding='utf-8') as f:
        f.write(c)

