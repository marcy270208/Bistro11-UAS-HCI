import re
import json

with open('src/lib/i18n.js', 'r', encoding='utf-8') as f:
    i18n = f.read()

translations = {
    "s4": ["Velvet Roasted Carrot Soup", "Sup Wortel Panggang Beludru", "Slow-roasted carrots blended with coconut, finished with yoghurt and toasted almonds.", "Wortel panggang perlahan yang diblender dengan kelapa, diakhiri dengan yoghurt dan almond panggang."],
    "s5": ["Eleven Sushi Boat", "Perahu Sushi Eleven", "Eighteen pieces rolled to order — tuna, salmon, avocado and the house spicy sauce.", "Delapan belas potong digulung sesuai pesanan — tuna, salmon, alpukat, dan saus pedas buatan rumah."],
    "s6": ["Beef Tasting Trio", "Trio Daging Sapi", "Three cuts off the same animal — cured, slow-braised and charred over oak.", "Tiga potongan dari hewan yang sama — diawetkan, direbus lambat, dan dibakar di atas kayu ek."],
    "m1": ["Pan-Seared Salmon Ribbons", "Pita Salmon Panggang", "Crisp-skirted salmon over spinach and courgette ribbons with a lime beurre blanc.", "Salmon dengan kulit renyah di atas bayam dan pita zukini dengan saus lime beurre blanc."],
    "m2": ["The Eleven Cheeseburger", "Burger Keju Eleven", "Two dry-aged patties, molten cheddar, house sauce and pickles in a potato bun.", "Dua patty dry-aged, cheddar leleh, saus rumah, dan acar dalam roti kentang."],
    "m3": ["Buttermilk Chicken & Fries", "Ayam Buttermilk & Kentang Goreng", "Twenty-four hours in buttermilk, fried hard. Served with skin-on chips and chilli mayo.", "Direndam dua puluh empat jam dalam buttermilk, digoreng garing. Disajikan dengan kentang goreng kulit dan mayo cabai."],
    "m4": ["Wagyu & Bone Marrow Pie", "Pai Wagyu & Sumsum Tulang", "Rich beef gravy under puff pastry, served with buttered mash and peas.", "Saus daging sapi kaya di bawah puff pastry, disajikan dengan kentang tumbuk mentega dan kacang polong."],
    "m5": ["Half Chicken, Lemon & Thyme", "Setengah Ayam, Jeruk Nipis & Thyme", "Roasted chicken with crispy skin, lemon pan jus and potatoes.", "Ayam panggang dengan kulit renyah, saus perasan jeruk nipis dan kentang."],
    "p1": ["Spicy Chicken & Nduja Pizza", "Pizza Ayam Pedas & Nduja", "Wood-fired crust, San Marzano, mozzarella, roasted chicken and fiery nduja.", "Kulit panggang kayu, San Marzano, mozzarella, ayam panggang, dan nduja pedas."],
    "p2": ["Pesto Farfalle, Blistered Tomato", "Pesto Farfalle, Tomat Panggang", "Butterflied pasta folded through basil pesto with burst vine tomatoes.", "Pasta kupu-kupu yang dilipat melalui pesto kemangi dengan tomat anggur yang mekar."],
    "p3": ["Penne all'Emilia", "Penne all'Emilia", "Six-hour beef and pancetta ragù, penne drained in the pan, snow of pecorino.", "Ragout daging sapi dan pancetta enam jam, penne yang ditiriskan di wajan, taburan pecorino."],
    "d1": ["Dark Chocolate Drip Cake", "Kue Tetes Cokelat Hitam", "Seventy-two percent sponge under a ganache drip with piped chocolate cream.", "Spons tujuh puluh dua persen di bawah tetesan ganache dengan krim cokelat yang disemprotkan."],
    "d2": ["Raspberry Cream Layer Cake", "Kue Lapis Krim Raspberry", "Vanilla sponge, raspberry curd and whipped mascarpone under fresh berries.", "Spons vanila, selai raspberry, dan mascarpone kocok di bawah beri segar."],
    "d3": ["Strawberry Panna Cotta", "Panna Cotta Stroberi", "Set cream in little jars, topped with macerated strawberries and rosemary.", "Krim yang diatur di dalam stoples kecil, ditutupi dengan stroberi yang direndam dan rosemary."],
    "d4": ["Confetti Sprinkle Donut", "Donat Taburan Confetti", "Brioche doughnut, chocolate and vanilla glaze, absurd amount of sprinkles.", "Donat brioche, glasir cokelat dan vanila, jumlah taburan yang sangat banyak."],
    "d5": ["Rose & Cream Cupcakes", "Kue Mangkok Mawar & Krim", "Three vanilla cupcakes piped with rose buttercream and a raspberry on top.", "Tiga kue mangkok vanila disemprotkan dengan buttercream mawar dan sebuah raspberry di atasnya."],
    "b1": ["Country Sourdough Loaf", "Roti Sourdough Desa", "Wholemeal and rye, forty-hour ferment, baked at six every single morning.", "Gandum utuh dan gandum hitam, fermentasi empat puluh jam, dipanggang pada pukul enam setiap pagi."],
    "b2": ["Butter Croissant", "Kroisan Mentega", "Twenty-seven folds of Charentes-Poitou butter, laminated before sunrise.", "Dua puluh tujuh lipatan mentega Charentes-Poitou, dilaminasi sebelum matahari terbit."],
    "k1": ["Single-Origin Pour-Over", "Kopi Seduh Manual Origin Tunggal", "Weighed, bloomed and poured by hand. Ask for today's farm on the card.", "Ditimbang, dikembangkan, dan diseduh dengan tangan. Tanyakan tentang perkebunan hari ini pada kartu."],
    "k2": ["Velvet Cappuccino Flight", "Paket Cappuccino Beludru", "Three small cups — classic, oat and a honey-and-cardamom seasonal pour.", "Tiga cangkir kecil — klasik, gandum, dan tuangan musiman madu-dan-kapulaga."],
    "k3": ["Barista's Table Coffee Toast", "Roti Bakar Kopi Meja Barista", "A pot to share, four toasts and the butter board — built for a slow table.", "Teko untuk berbagi, empat potong roti bakar, dan papan mentega — dibuat untuk meja yang santai."],
    "k4": ["Strawberry & Lime Cordial Fizz", "Fizz Sirup Stroberi & Jeruk Nipis", "Zero-proof. Pressed strawberry, lime, mint and soda poured over hand ice.", "Tanpa alkohol. Stroberi peras, jeruk nipis, mint, dan soda yang dituangkan ke atas es balok buatan tangan."]
}

en_lines = []
id_lines = []
for k, v in translations.items():
    en_lines.append(f'    "dish.{k}.name": "{v[0]}",')
    en_lines.append(f'    "dish.{k}.desc": "{v[2]}",')
    id_lines.append(f'    "dish.{k}.name": "{v[1]}",')
    id_lines.append(f'    "dish.{k}.desc": "{v[3]}",')

en_str = "\n".join(en_lines)
id_str = "\n".join(id_lines)

i18n = i18n.replace(
    '    "dish.s4.name": "Velvet Roasted Carrot Soup",',
    en_str + '\n    "dish.s4.name": "Velvet Roasted Carrot Soup",'
)
i18n = i18n.replace(
    '    "dish.s4.name": "Sup Wortel Panggang Beludru",',
    id_str + '\n    "dish.s4.name": "Sup Wortel Panggang Beludru",'
)

with open('src/lib/i18n.js', 'w', encoding='utf-8') as f:
    f.write(i18n)

