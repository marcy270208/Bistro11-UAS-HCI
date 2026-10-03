with open('src/lib/i18n.js', 'r', encoding='utf-8') as f:
    i18n = f.read()

en_add = """    "visit.address": "Address",
    "visit.hours": "Hours",
    "visit.phone": "Phone",
    "visit.email": "Email",
"""
id_add = """    "visit.address": "Alamat",
    "visit.hours": "Jam Buka",
    "visit.phone": "Telepon",
    "visit.email": "Email",
"""

i18n = i18n.replace(
    '    "visit.dir": "Get directions",',
    en_add + '    "visit.dir": "Get directions",'
)
i18n = i18n.replace(
    '    "visit.dir": "Dapatkan petunjuk arah",',
    id_add + '    "visit.dir": "Dapatkan petunjuk arah",'
)

with open('src/lib/i18n.js', 'w', encoding='utf-8') as f:
    f.write(i18n)
