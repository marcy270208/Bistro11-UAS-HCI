import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add import for t if not present
if 'import { t }' not in c:
    c = c.replace('import { money, r0, uid } from "./format.js";', 'import { money, r0, uid } from "./format.js";\nimport { t as i18n_t } from "./i18n.js";')

# Define t in AppProvider
t_code = """  const patchUi = useCallback(p => setUi(u => ({ ...u, ...p })), []);
  
  const t = useCallback((key, fallback) => i18n_t(ui.lang, key, fallback), [ui.lang]);"""

c = c.replace('  const patchUi = useCallback(p => setUi(u => ({ ...u, ...p })), []);', t_code)

# Add t to value
if 'setLang: (l) => patchUi({ lang: l }),' in c and ' t,' not in c:
    c = c.replace('setLang: (l) => patchUi({ lang: l }),', 'setLang: (l) => patchUi({ lang: l }), t,')

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
