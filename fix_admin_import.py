import re

with open('src/pages/AdminPage.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

if 'import { useState } from "react";' not in c:
    c = 'import { useState } from "react";\n' + c

with open('src/pages/AdminPage.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
