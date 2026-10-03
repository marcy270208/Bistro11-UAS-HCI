import re

with open('src/data/menu.js', 'r', encoding='utf-8') as f:
    text = f.read()

ing_matches = re.findall(r'\["[^"]*", "([^"]+)"\]', text)
alg_matches = re.findall(r'alg:\s*\[([^\]]+)\]', text)

ings = sorted(list(set(ing_matches)))
algs = []
for m in alg_matches:
    cleaned = [x.strip(' "') for x in m.split(',')]
    for c in cleaned:
        if c: algs.append(c)
algs = sorted(list(set(algs)))

print("Ingredients:")
for i in ings: print(i)
print("Allergens:")
for a in algs: print(a)

