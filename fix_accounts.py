import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('session: prev.session, cart: prev.cart, wish: prev.wish };', 'session: prev.session, cart: prev.cart, wish: prev.wish, accounts: prev.accounts };')

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
