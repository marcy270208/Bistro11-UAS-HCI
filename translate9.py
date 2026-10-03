import re

with open('src/lib/i18n.js', 'r', encoding='utf-8') as f:
    i18n = f.read()

ing_dict_id = {
    "18g dose": "Dosis 18g",
    "3-day lamination": "Laminasi 3 hari",
    "40h ferment": "Fermentasi 40 jam",
    "72% couverture": "Cokelat couverture 72%",
    "72-hour dough": "Adonan 72 jam",
    "94°C brew": "Seduhan 94°C",
    "Aleppo chilli": "Cabai Aleppo",
    "Amalfi lime": "Jeruk nipis Amalfi",
    "Applewood chicken": "Ayam panggang Applewood",
    "Avocado": "Alpukat",
    "BBQ glaze": "Glasir BBQ",
    "Bakery loaf": "Roti panggang",
    "Bakery toast": "Roti panggang",
    "Barrel-aged haloumi": "Keju haloumi matang",
    "Bay & thyme": "Daun salam & thyme",
    "Beef chuck": "Daging sapi chuck",
    "Berry compote": "Kompote beri",
    "Berry jam": "Selai beri",
    "Beurre blanc": "Saus beurre blanc",
    "Bone-jus reduction": "Reduksi kaldu tulang",
    "Braised short rib": "Iga sapi rebus",
    "Brioche dough": "Adonan brioche",
    "Butter": "Mentega",
    "Cane syrup": "Sirup tebu",
    "Cardamom": "Kapulaga",
    "Cashew crumb": "Remahan mete",
    "Caster sugar": "Gula kastor",
    "Chalk Farm strawberries": "Stroberi Chalk Farm",
    "Charentais carrot": "Wortel Charentais",
    "Charentes butter": "Mentega Charentes",
    "Cheese board": "Papan keju",
    "Chervil": "Daun chervil",
    "Chickpeas": "Kacang arab",
    "Chilli mayo": "Mayo cabai",
    "Chilli oil": "Minyak cabai",
    "Chilli-jam glaze": "Glasir selai cabai",
    "Chocolate glaze": "Glasir cokelat",
    "Citrus dressing": "Dressing jeruk",
    "Cocoa dust": "Taburan kakao",
    "Coconut milk": "Santan kelapa",
    "Confited garlic": "Bawang putih confit",
    "Coriander": "Ketumbar",
    "Courgette ribbon": "Pita zukini",
    "Cucumber": "Mentimun",
    "Cultured butter": "Mentega kultur",
    "Cultured buttermilk": "Susu mentega kultur",
    "Curly kale": "Kale keriting",
    "Daily selection": "Pilihan harian",
    "Dairy": "Produk susu",
    "Deck oven": "Oven dek",
    "Dill": "Adas sowa",
    "Double cream": "Krim kental",
    "Dry-aged beef x2": "Daging sapi dry-aged x2",
    "Dry-aged sirloin": "Sirloin dry-aged",
    "Egg": "Telur",
    "Egg wash": "Olesan telur",
    "Elderflower": "Bunga elder",
    "Eleven-year starter": "Ragi sebelas tahun",
    "English spinach": "Bayam Inggris",
    "Espresso": "Espresso",
    "Ethiopian Guji": "Kopi Guji Ethiopia",
    "Farfalle": "Pasta farfalle",
    "Filter pot for 4": "Teko penyaring untuk 4 orang",
    "Filtered water": "Air saring",
    "Fine salt": "Garam halus",
    "Fior di latte": "Keju fior di latte",
    "Flaked almond": "Almond iris",
    "Flat-leaf parsley": "Peterseli",
    "Fleur de sel": "Garam laut fleur de sel",
    "Foraged mushroom": "Jamur liar",
    "Free-range egg": "Telur ayam kampung",
    "Free-range thigh": "Paha ayam kampung",
    "French butter": "Mentega Prancis",
    "Fresh ginger": "Jahe segar",
    "Fresh lime": "Jeruk nipis segar",
    "Garden herbs": "Rempah kebun",
    "Garden mint": "Daun mint",
    "Garlic": "Bawang putih",
    "Garlic powder": "Bubuk bawang putih",
    "Gelatine": "Gelatin",
    "Genovese basil": "Kemangi Genovese",
    "Gherkin": "Acar mentimun kecil",
    "Ginger": "Jahe",
    "Gluten": "Gluten",
    "Grilled pineapple": "Nanas panggang",
    "Hand-cut ice": "Es potong tangan",
    "Hass avocado": "Alpukat Hass",
    "Heirloom tomato": "Tomat pusaka",
    "Herbs": "Rempah-rempah",
    "Heritage potato": "Kentang warisan",
    "Honey": "Madu",
    "Honeycomb": "Sarang madu",
    "House espresso": "Espresso rumah",
    "House sauce": "Saus rumah",
    "House shacha": "Saus shacha rumah",
    "Ice option": "Pilihan es",
    "Icing sugar": "Gula halus",
    "Jersey cream": "Krim Jersey",
    "Kalamata olive": "Zaitun Kalamata",
    "Lamb's lettuce": "Selada domba",
    "Lemon": "Lemon",
    "Lemon juice": "Jus lemon",
    "Lemon oil": "Minyak lemon",
    "Lemon zest": "Parutan kulit lemon",
    "Ligurian oil": "Minyak Liguria",
    "Line-caught fish": "Ikan tangkapan pancing",
    "Little gem": "Selada gem kecil",
    "Little gem lettuce": "Selada gem kecil",
    "Madagascar vanilla": "Vanila Madagaskar",
    "Maldon salt": "Garam Maldon",
    "Malted barley": "Barley malt",
    "Mango": "Mangga",
    "Mascarpone": "Keju mascarpone",
    "Mature cheddar": "Keju cheddar matang",
    "Micro foam": "Busa mikro",
    "Milk": "Susu",
    "Mint": "Daun mint",
    "Navel orange": "Jeruk pusar",
    "Nori": "Rumput laut nori",
    "Oat barista milk": "Susu oat barista",
    "Olive oil": "Minyak zaitun",
    "Pancetta": "Daging pancetta",
    "Paper filter": "Filter kertas",
    "Parmesan": "Keju parmesan",
    "Pasture meat": "Daging sapi gembala",
    "Pea shoots": "Pucuk kacang polong",
    "Pecorino": "Keju pecorino",
    "Penne rigate": "Pasta penne rigate",
    "Pickled red cabbage": "Acar kubis merah",
    "Pickled shallot": "Acar bawang merah",
    "Pine nut": "Kacang pinus",
    "Pistachio dust": "Bubuk pistachio",
    "Plain flour": "Tepung terigu",
    "Potato bun": "Roti kentang",
    "Pressed strawberry": "Perasan stroberi",
    "Rainbow carrot": "Wortel pelangi",
    "Raspberry": "Raspberry",
    "Red onion": "Bawang merah",
    "Red wine": "Anggur merah",
    "Rice vinegar": "Cuka beras",
    "Roast sweet potato": "Ubi jalar panggang",
    "Roasted garlic": "Bawang putih panggang",
    "Rocket": "Daun roket (Arugula)",
    "Rose buttercream": "Krim mentega mawar",
    "Rose water": "Air mawar",
    "Rosemary": "Rosemary",
    "Rye flour": "Tepung gandum hitam",
    "Salmon belly": "Perut salmon",
    "Salt": "Garam",
    "San Marzano": "Tomat San Marzano",
    "Scottish salmon": "Salmon Skotlandia",
    "Sea salt": "Garam laut",
    "Sheep feta": "Keju feta domba",
    "Sheep yoghurt": "Yoghurt domba",
    "Soda water": "Air soda",
    "Soffritto": "Tumisan soffritto",
    "Soft egg": "Telur setengah matang",
    "Sommelier pour": "Tuangan sommelier",
    "Sourdough": "Roti sourdough",
    "Soy": "Kedelai",
    "Sponge": "Kue spons",
    "Stoneground wheat": "Gandum giling batu",
    "Sugar sprinkles": "Taburan gula",
    "Sulphites": "Sulfit",
    "Sunflower fry": "Minyak bunga matahari",
    "Sushi rice": "Nasi sushi",
    "T55 flour": "Tepung T55",
    "Tasting: cane sugar": "Rasa: gula tebu",
    "Tasting: cherry": "Rasa: ceri",
    "Tasting: citrus": "Rasa: jeruk",
    "Thai basil": "Kemangi Thailand",
    "Thyme": "Thyme",
    "Toasted almond": "Almond panggang",
    "Tree nuts": "Kacang pohon",
    "Vanilla": "Vanila",
    "Vanilla icing": "Lapisan gula vanila",
    "Vanilla pod": "Biji vanila",
    "Vanilla sponge": "Kue spons vanila",
    "Vine tomato": "Tomat anggur",
    "Water": "Air",
    "Watercress": "Selada air",
    "Wheat bran": "Dedak gandum",
    "White pepper": "Lada putih",
    "Whole milk": "Susu murni",
    "Wildflower honey": "Madu bunga liar",
    "Yellowfin tuna": "Tuna sirip kuning",
    "Zero alcohol": "Tanpa alkohol",
    "tag": "label",
    "tag tag--hot": "label--pedas",
    "tag tag--new": "label--baru",
    "tag tag--veg": "label--vegetarian"
}

alg_dict_id = {
    "Dairy": "Susu",
    "Egg": "Telur",
    "Fish": "Ikan",
    "Gluten": "Gluten",
    "Sesame": "Wijen",
    "Soy": "Kedelai",
    "Sulphites": "Sulfit",
    "Tree nuts": "Kacang pohon"
}

en_lines = []
id_lines = []

for k in ing_dict_id.keys():
    en_lines.append(f'    "ing.{k}": "{k}",')
    id_lines.append(f'    "ing.{k}": "{ing_dict_id[k]}",')
    
for k in alg_dict_id.keys():
    en_lines.append(f'    "alg.{k}": "{k}",')
    id_lines.append(f'    "alg.{k}": "{alg_dict_id[k]}",')

en_str = "\n".join(en_lines)
id_str = "\n".join(id_lines)

i18n = i18n.replace(
    '    "dish.p3.name": "Penne all\'Emilia",',
    en_str + '\n    "dish.p3.name": "Penne all\'Emilia",'
)
i18n = i18n.replace(
    '    "dish.p3.name": "Penne all\'Emilia",',
    id_str + '\n    "dish.p3.name": "Penne all\'Emilia",'
)

with open('src/lib/i18n.js', 'w', encoding='utf-8') as f:
    f.write(i18n)

# Lastly, wait, why did it render "VEGGIE" all caps and "STARTERS"?
# Let's fix the badge and cat tags in DishCard and PhotoGallery.
# Since the dictionary was updated at 10:37 but the screenshot was 10:45, maybe the problem was `t(lang, \`badge.${d.badge}\`)`.
# If `d.badge` is "veg", then the key is "badge.veg".
# If I passed `d.badge` to `t()`, wait...
# In `DishCard.jsx`:
# `t(lang, \`badge.${d.badge}\`)` => `t(lang, "badge.veg")`.
# If it couldn't find "badge.veg" for ID (which was there!) why would it fall back to EN?
# Oh! Because the ID dictionary has `"badge.veg": "Vegetarian"`. So it SHOULD return "Vegetarian".
# Why did it return "Veggie"?
# Wait... What if the `t` function is somehow case sensitive or the key was different?
# `d.badge` is `"veg"`. The key is `"badge.veg"`.
# In `src/data/menu.js`, BADGES = { veg: ["Veggie", "tag tag--veg"] }.
# When I replaced it in DishCard.jsx:
# `{badge && <span className={badge[1]}>{t(lang, \`badge.${d.badge}\`)}</span>}`
# Wait... did I write `{t(lang, \`badge.${d.badge}\`)}`?
# Let's check `translate2.py`:
# `c = c.replace('{badge && <span className={badge[1]}>{badge[0]}</span>}', '{badge && <span className={badge[1]}>{t(lang, \`badge.${d.badge}\`)}</span>}')`
# Yes.
# Why did it show "VEGGIE" then?
# Ah! Look closely at the screenshot. The image `media_1790826352077.png` shows:
# The `s1` dish has NO badge in my screenshot? Wait, no, `s1` (Charred Haloumi) HAS the "VEGGIE" badge in the first screenshot. BUT wait, look at the screenshot VERY closely.
# It says "VEGGIE" on `s1` in `media_1790826352077.png`. And next to it, "STARTERS".
# Wait, "STARTERS" is `d.cat`.
# In `DishCard.jsx`:
# `c = c.replace('<span className="tag">{d.cat}</span>', '<span className="tag">{t(lang, \`cat.${d.cat}\`)}</span>')`
# This was ALSO in `translate2.py`.
# Why did it render "STARTERS" instead of "Pembuka"?
# Oh... in `translate2.py` I used `d.cat`, but I didn't add a fallback. And in `i18n.js` I added:
# `"cat.Starters": "Pembuka"`.
# Wait, if it didn't find "cat.Starters", it returns the key `"cat.Starters"`!
# BUT IN THE SCREENSHOT IT SAYS "STARTERS"! Not "cat.Starters"!
# How is that possible?
# If `t(lang, "cat.Starters")` failed, it would return the key "cat.Starters"!
# Wait... I changed `t` function to:
# `return DICT[lang]?.[key] || DICT.en?.[key] || fallback || key;`
# If `DICT.en` HAS `"cat.Starters": "Starters"`, then it returns "Starters"!
# Why did it fall back to `DICT.en` if `DICT.id` HAD `"cat.Starters": "Pembuka"`?
# Ah!!! Because `DICT.id` DID NOT HAVE `"cat.Starters"` AT THAT TIME?
# I ran `translate2.py` at 10:37. It added `"cat.Starters": "Pembuka"` to ID.
# But wait! I replaced `'    "chat.ask": "Tanya tentang menu",'` with `'    "chat.ask": "Tanya tentang menu",\n' + id_updates`.
# Maybe that replacement failed?
# If the replacement failed, then `"cat.Starters"` was NEVER added to `DICT.id`!
# Let's check if the replacement failed!
