import re

with open('src/lib/sheets.js', 'r', encoding='utf-8') as f:
    sheetsJs = f.read()

sheetsJs = re.sub(
    r'export const getHook = \(\) => \{ try \{ return localStorage\.getItem\(HOOK_KEY\) \|\| ""; \} catch \{ return ""; \} \};',
    'export const getHook = () => { try { return localStorage.getItem(HOOK_KEY) || "https://script.google.com/macros/s/AKfycbxUGAViaisAmmwHqZV4JKeW0wqCE4_BUhqUoGA6CNGdr47wEMQKD46HrJjR8mzktyqjdw/exec"; } catch { return "https://script.google.com/macros/s/AKfycbxUGAViaisAmmwHqZV4JKeW0wqCE4_BUhqUoGA6CNGdr47wEMQKD46HrJjR8mzktyqjdw/exec"; } };',
    sheetsJs
)

with open('src/lib/sheets.js', 'w', encoding='utf-8') as f:
    f.write(sheetsJs)
