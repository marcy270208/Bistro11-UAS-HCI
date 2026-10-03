import re

i18n_path = 'src/lib/i18n.js'
with open(i18n_path, 'r', encoding='utf-8') as f:
    i18n_content = f.read()

id_updates = """    "dish.s1.name": "Papan Keju Haloumi Panggang",
    "dish.s1.desc": "Keju haloumi panggang dengan sayuran, taburan cabai, dan roti sourdough hangat.",
    "dish.s2.name": "Mangkuk Bistro Pelangi",
    "dish.s2.desc": "Alpukat, ubi panggang, buncis, dan lobak acar di atas daun herbal.",
    "dish.s3.name": "Salad Kale, Jeruk & Almond",
    "dish.s3.desc": "Kale yang dipijat dengan jeruk, irisan keju feta, dan jus perasan dingin di sampingnya.",
"""

i18n_content = i18n_content.replace(
    '    "badge.veg": "Vegetarian",',
    '    "badge.veg": "Vegetarian",\n' + id_updates
)

with open(i18n_path, 'w', encoding='utf-8') as f:
    f.write(i18n_content)


