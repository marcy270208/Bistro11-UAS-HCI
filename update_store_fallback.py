import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_askChat_timer = """    timers.current.chat = setTimeout(() => {
      const a = answer(t, data.menu);
      setUi(u => ({ ...u, chatTyping: false }));
      pushChat(VISITOR_THREAD, { from: "bot", text: a.text, chips: a.chips || [], dishes: a.dishes || [], go: a.go || "" });
    }, 700 + Math.min(900, t.length * 14));"""

new_askChat_timer = """    timers.current.chat = setTimeout(() => {
      const a = answer(t, data.menu);
      setUi(u => ({ ...u, chatTyping: false, ...(a.fallback ? { chatMode: "chef" } : {}) }));
      pushChat(VISITOR_THREAD, { from: "bot", text: a.text, chips: a.chips || [], dishes: a.dishes || [], go: a.go || "" });
    }, 700 + Math.min(900, t.length * 14));"""

c = c.replace(old_askChat_timer, new_askChat_timer)

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
