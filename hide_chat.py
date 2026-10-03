import re

with open('src/components/ChatWidget.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Make ChatWidget return null if not logged in
if 'if (!app.data.session) return null;' not in c:
    c = c.replace('  const unread = thread?.unread?.guest || 0;', '  if (!app.data.session) return null;\n\n  const unread = thread?.unread?.guest || 0;')

with open('src/components/ChatWidget.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
