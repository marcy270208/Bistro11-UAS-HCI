import re

# Update Checkout.jsx
with open('src/components/modals/Checkout.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

if 'import { t }' not in c:
    c = c.replace('import ModalHead from "../ModalHead.jsx";', 'import ModalHead from "../ModalHead.jsx";\nimport { t } from "../../lib/i18n.js";')
    c = c.replace('const app = useApp();', 'const app = useApp();\n  const lang = app.ui.lang;')
    c = c.replace('title="Checkout"', 'title={t(lang, "checkout.title")}')
    c = c.replace('<h3>Order type</h3>', '<h3>{t(lang, "checkout.type")}</h3>')
    
    # We have TYPES array: ["delivery", "dY>", "Delivery", "22-35 min"]
    # We should translate the 3rd element.
    # It's rendered as `<b>{lbl}</b>`. Let's just wrap it: `<b>{t(lang, `checkout.${id}`)}</b>`
    c = c.replace('<b>{lbl}</b>', '<b>{t(lang, `checkout.${id}`)}</b>')
    
    c = c.replace('<h3>Details</h3>', '<h3>{t(lang, "checkout.details")}</h3>')
    c = c.replace('<label htmlFor="co-name">Name</label>', '<label htmlFor="co-name">{t(lang, "checkout.name")}</label>')
    c = c.replace('<label htmlFor="co-phone">Phone</label>', '<label htmlFor="co-phone">{t(lang, "checkout.phone")}</label>')
    c = c.replace('<label htmlFor="co-addr">Address</label>', '<label htmlFor="co-addr">{t(lang, "checkout.address")}</label>')
    c = c.replace('<label htmlFor="co-email">Email receipt to <em>optional</em></label>', '<label htmlFor="co-email">{t(lang, "checkout.email")}</label>')
    c = c.replace('<span>Time slot</span>', '<span>{t(lang, "checkout.slot")}</span>')
    c = c.replace('<label htmlFor="co-table">Table number</label>', '<label htmlFor="co-table">{t(lang, "checkout.table_no")}</label>')
    c = c.replace('<label htmlFor="co-notes">Kitchen notes <em>optional</em></label>', '<label htmlFor="co-notes">{t(lang, "checkout.kitchen")}</label>')
    c = c.replace('<span>Contactless delivery</span>', '<span>{t(lang, "checkout.contactless")}</span>')
    c = c.replace('<span>Spice level</span>', '<span>{t(lang, "checkout.spice")}</span>')
    
    c = c.replace('<h3>Payment</h3>', '<h3>{t(lang, "checkout.payment")}</h3>')
    c = c.replace('<label htmlFor="co-promo">Promo code</label>', '<label htmlFor="co-promo">{t(lang, "checkout.promo")}</label>')
    c = c.replace('<button type="button" onClick={applyPromo}>Apply</button>', '<button type="button" onClick={applyPromo}>{t(lang, "checkout.apply")}</button>')
    
    c = c.replace('<h3>Summary</h3>', '<h3>{t(lang, "checkout.summary")}</h3>')
    c = c.replace('<span>{feeName}</span>', '<span>{t(lang, "checkout.fee")}</span>')
    c = c.replace('<span>Tax</span>', '<span>{t(lang, "checkout.tax")}</span>')
    c = c.replace('<span>Service</span>', '<span>{t(lang, "checkout.service")}</span>')
    c = c.replace('<span>Total to pay</span>', '<span>{t(lang, "checkout.total")}</span>')
    
    c = c.replace('<button className="btn btn--primary" onClick={send}>Send to kitchen</button>', '<button className="btn btn--primary" onClick={send}>{t(lang, "checkout.place")}</button>')
    c = c.replace('<button className="btn btn--ghost" onClick={app.closeModal}>Cancel</button>', '<button className="btn btn--ghost" onClick={app.closeModal}>{t(lang, "checkout.cancel")}</button>')
    
    with open('src/components/modals/Checkout.jsx', 'w', encoding='utf-8') as f:
        f.write(c)


