import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

if 'import { supabase }' not in c:
    c = c.replace('import { CAT_ID, LANGS, LOCALE, TAG_ID, makeT } from "./i18n.js";', 'import { CAT_ID, LANGS, LOCALE, TAG_ID, makeT } from "./i18n.js";\nimport { supabase } from "./supabase.js";')

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
