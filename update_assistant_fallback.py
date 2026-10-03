import re

with open('src/lib/assistant.js', 'r', encoding='utf-8') as f:
    c = f.read()

old_fallback = """  return {
    text: `I did not catch that one. I am good on the menu, allergens, prices, delivery, payment and our hours - or leave the question here and ${STAFF.name} will answer it between services.`,
    chips: CHAT_SUGGESTIONS.slice(0, 3),
    dishes: [],
    go: "menu"
  };"""

new_fallback = """  return {
    text: `Maaf, saya kurang mengerti pertanyaan itu. Saya akan mengalihkan obrolan ini kepada ${STAFF.name} (Chef kami) agar beliau bisa menjawab Anda secara langsung!`,
    fallback: true,
    chips: [],
    dishes: []
  };"""

c = c.replace(old_fallback, new_fallback)

with open('src/lib/assistant.js', 'w', encoding='utf-8') as f:
    f.write(c)
