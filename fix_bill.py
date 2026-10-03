with open('src/components/modals/Bill.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('const t = order.totals;', 'const totals = order.totals;')
c = c.replace('t.sub', 'totals.sub')
c = c.replace('t.tax', 'totals.tax')
c = c.replace('t.service', 'totals.service')
c = c.replace('t.delivery', 'totals.delivery')
c = c.replace('t.discount', 'totals.discount')
c = c.replace('t.promo', 'totals.promo')
c = c.replace('t.total', 'totals.total')

with open('src/components/modals/Bill.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
