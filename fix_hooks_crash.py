import re

with open('src/components/ChatWidget.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Remove the early return
c = c.replace('  const unread = app.chatThread?.unread?.guest || 0;\n  if (!app.data.session) return null;', '  const unread = app.chatThread?.unread?.guest || 0;')

# Add it back after all hooks, right before the other return null
c = c.replace('  if (ui.view !== "guest") return null;', '  if (ui.view !== "guest") return null;\n  if (!app.data.session) return null;')

with open('src/components/ChatWidget.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
