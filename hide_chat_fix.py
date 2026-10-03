import re

with open('src/components/ChatWidget.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    '  const unread = app.chatThread?.unread?.guest || 0;',
    '  const unread = app.chatThread?.unread?.guest || 0;\n  if (!app.data.session) return null;'
)

with open('src/components/ChatWidget.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
