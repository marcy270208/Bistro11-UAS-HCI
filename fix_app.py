import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('const { ui } = useApp();', 'const { ui, signedIn } = useApp();')
c = c.replace('{app.signedIn && <ChatWidget />}', '{signedIn && <ChatWidget />}')

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
