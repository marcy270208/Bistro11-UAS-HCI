import re
import os

i18n_path = 'src/lib/i18n.js'
with open(i18n_path, 'r', encoding='utf-8') as f:
    i18n_content = f.read()

id_updates = """    "note.drinks": "Dibuat sesuai pesanan di bar. Beri tahu kami tingkat es di catatan Anda dan kami akan menyediakannya.",
    "note.bakery": "Dipanggang pukul 06:00. Apa pun yang tersisa setelah pukul 19:00 akan disumbangkan ke panti asuhan di Lantern Lane, tidak pernah dikembalikan ke etalase.",
    "note.desserts": "Disimpan dingin dan diselesaikan di dapur. Dapat dibuat untuk meja Anda dalam sekitar sepuluh menit.",
    "note.alg": "Mengandung alergen tertentu. Tukar elemen apa pun — dapur dengan senang hati menyesuaikan, cukup beri tahu di catatan Anda.",
    "note.default": "Dimasak ketat sesuai pesanan. Tidak ada di piring ini yang pernah diletakkan di bawah lampu pemanas.",
    "ing.Charentais carrot": "Wortel Charentais",
    "ing.Coconut milk": "Santan",
    "ing.Sheep yoghurt": "Yoghurt domba",
    "ing.Toasted almond": "Almond panggang",
    "ing.Chervil": "Daun chervil",
    "ing.Fresh ginger": "Jahe segar",
    "ing.Sea salt": "Garam laut",
    "ing.White pepper": "Lada putih",
    "alg.Tree nuts": "Kacang pohon",
    "alg.Dairy": "Susu",
"""

i18n_content = i18n_content.replace(
    '    "dish.m3.desc": "Direndam dua puluh empat jam dalam buttermilk, digoreng garing. Disajikan dengan kentang goreng kulit dan mayo cabai.",\n',
    '    "dish.m3.desc": "Direndam dua puluh empat jam dalam buttermilk, digoreng garing. Disajikan dengan kentang goreng kulit dan mayo cabai.",\n' + id_updates
)

with open(i18n_path, 'w', encoding='utf-8') as f:
    f.write(i18n_content)
