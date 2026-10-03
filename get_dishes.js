import fs from 'fs';
const text = fs.readFileSync('src/data/menu.js', 'utf8');

const idRegex = /id:\s*"([^"]+)"/g;
const nameRegex = /name:\s*"([^"]+)"/g;
const descRegex = /desc:\s*"([^"]+)"/g;

let match;
let ids = [];
let names = [];
let descs = [];

while ((match = idRegex.exec(text)) !== null) ids.push(match[1]);
while ((match = nameRegex.exec(text)) !== null) names.push(match[1]);
while ((match = descRegex.exec(text)) !== null) descs.push(match[1]);

for (let i = 0; i < ids.length; i++) {
    console.log(`    "dish.${ids[i]}.name": "${names[i]}",`);
    console.log(`    "dish.${ids[i]}.desc": "${descs[i]}",`);
}
