import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_cond = """if (prev.lastUpdated && sbData.data.lastUpdated && prev.lastUpdated >= sbData.data.lastUpdated) {"""
new_cond = """if (prev.lastUpdated && (!sbData.data.lastUpdated || prev.lastUpdated >= sbData.data.lastUpdated)) {"""
c = c.replace(old_cond, new_cond)

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
