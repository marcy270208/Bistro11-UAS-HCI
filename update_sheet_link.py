import re

with open('src/pages/AdminPage.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    'window.open("https://docs.google.com/spreadsheets/u/0/", "_blank");',
    'window.open("https://docs.google.com/spreadsheets/d/1-BYsxMJ3F_oXB9OaUxPxyyoQ4uL-26v2OIoLTCEdb6M/edit?gid=0#gid=0", "_blank");'
)

with open('src/pages/AdminPage.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
