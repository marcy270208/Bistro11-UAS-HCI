with open('src/components/modals/Checkout.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('const t = app.totals(type, promo);', 'const calculatedTotals = app.totals(type, promo);')
c = c.replace('t.sub', 'calculatedTotals.sub')
c = c.replace('t.tax', 'calculatedTotals.tax')
c = c.replace('t.service', 'calculatedTotals.service')
c = c.replace('t.delivery', 'calculatedTotals.delivery')
c = c.replace('t.discount', 'calculatedTotals.discount')
c = c.replace('t.promo', 'calculatedTotals.promo')
c = c.replace('t.total', 'calculatedTotals.total')
c = c.replace('totals: t,', 'totals: calculatedTotals,')

with open('src/components/modals/Checkout.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

