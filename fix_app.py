import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    appJsx = f.read()

appJsx = appJsx.replace('const { ui } = useApp();', 'const { ui, signedIn } = useApp();')
appJsx = appJsx.replace('{app.signedIn && <ChatWidget />}', '{signedIn && <ChatWidget />}')

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(appJsx)
