import re

with open('src/data/biz.js', 'r', encoding='utf-8') as f:
    c = f.read()

riders_code = """export const RIDERS = [
  { name: "Bagas W.", bike: "Honda Beat", plate: "B 4120 KLO" },
  { name: "Silvi D.", bike: "Yamaha Fino", plate: "B 6387 TGR" },
  { name: "Yusuf A.", bike: "Honda Vario", plate: "B 9012 RPN" },
  { name: "Dara P.", bike: "Vespa Sprint", plate: "B 2456 MSH" }
];

const idHash = s => [...String(s)].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 9973, 7);
export const riderFor = id => RIDERS[idHash(id) % RIDERS.length];
export const routeKm = id => 1.6 + (idHash(id) % 37) / 10;
"""

if 'export const riderFor =' not in c:
    c = c.replace('export const BIZ = {', riders_code + '\nexport const BIZ = {')

with open('src/data/biz.js', 'w', encoding='utf-8') as f:
    f.write(c)
