import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('? 12000 : 3500;', '? 12000 : 1200;')

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
