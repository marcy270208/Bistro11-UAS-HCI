import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('const printOrder = useCallback(id => {', 'const emailOrder = useCallback(id => {')
c = c.replace('o.printed = true;', 'o.emailed = true;')
c = c.replace('toast("Sent to the printer at the pass", "🖨️");', 'toast("Receipt sent to your email", "📧");')
c = c.replace('printOrder,', 'emailOrder,')

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

with open('src/components/modals/Bill.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

if 'import { t }' not in c:
    c = c.replace('import { clockTime, money } from "../../lib/format.js";', 'import { clockTime, money } from "../../lib/format.js";\nimport { t } from "../../lib/i18n.js";')

c = c.replace('const app = useApp();', 'const app = useApp();\n  const lang = app.ui.lang;')

c = c.replace('<button className="btn btn--ghost" onClick={() => app.printOrder(order.id)}>Print copy</button>', '<button className="btn btn--ghost" onClick={() => app.emailOrder(order.id)}>{t(lang, "bill.email", "Email receipt")}</button>')
c = c.replace('Back to the menu', '{t(lang, "bill.back", "Back to the menu")}')
c = c.replace('<h3>Order confirmed</h3>', '<h3>{t(lang, "bill.title", "Order confirmed")}</h3>')

with open('src/components/modals/Bill.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

with open('src/lib/i18n.js', 'r', encoding='utf-8') as f:
    i18n = f.read()

en_add = """    "bill.email": "Email receipt",
    "bill.back": "Back to the menu",
    "bill.title": "Order confirmed",
"""
id_add = """    "bill.email": "Kirim struk ke email",
    "bill.back": "Kembali ke menu",
    "bill.title": "Pesanan dikonfirmasi",
"""

i18n = i18n.replace(
    '    "dish.s4.name": "Velvet Roasted Carrot Soup",',
    en_add + '\n    "dish.s4.name": "Velvet Roasted Carrot Soup",'
)
i18n = i18n.replace(
    '    "dish.s4.name": "Sup Wortel Panggang Beludru",',
    id_add + '\n    "dish.s4.name": "Sup Wortel Panggang Beludru",'
)

with open('src/lib/i18n.js', 'w', encoding='utf-8') as f:
    f.write(i18n)


