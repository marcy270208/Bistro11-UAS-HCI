import re

with open('src/components/MenuSection.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

pattern = r'\s*<p className="sec-head__note reveal" data-reveal>\s*\{t\(lang, "menu\.note"\)\}\s*</p>'

c = re.sub(pattern, '', c)

with open('src/components/MenuSection.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
