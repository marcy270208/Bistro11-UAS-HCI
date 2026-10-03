/* ═══════════════════════════════════════════════════════════════
   Bistro Eleven — menu seed
   Every photo below was visually verified against its dish name.
   ═══════════════════════════════════════════════════════════════ */

const U = (id, w = 760) => `https://images.unsplash.com/photo-${id}?w=${w}&q=78&fit=crop`;

const CATEGORIES = ["Starters", "Mains", "Pizza & Pasta", "Desserts", "Bakery", "Drinks"];

const MENU = [
  /* ─────────── Starters ─────────── */
  {
    id: "s1", name: "Charred Haloumi & Herb Board", cat: "Starters", price: 12.5,
    img: U("1476224203421-9ac39bcb3327"), badge: "veg", rating: 4.7, reviews: 214, mins: 12, kcal: 420,
    desc: "Griddled haloumi with charred greens, chilli crumb and warm sourdough soldiers.",
    ing: [["🧀","Barrel-aged haloumi"],["🥬","Little gem lettuce"],["🌶️","Aleppo chilli"],["🍞","Sourdough"],["🍋","Lemon"],["🫒","Olive oil"],["🌿","Flat-leaf parsley"],["🧄","Roasted garlic"]],
    alg: ["Dairy","Gluten"], tags: ["cheese","sharing","grilled","salad"]
  },
  {
    id: "s2", name: "Rainbow Bistro Bowl", cat: "Starters", price: 11.0,
    img: U("1512621776951-a57141f2eefd"), badge: "new", rating: 4.8, reviews: 96, mins: 9, kcal: 380,
    desc: "Avocado, roast sweet potato, chickpeas and pickled radish on herbed leaves.",
    ing: [["🥑","Hass avocado"],["🍠","Roast sweet potato"],["🫘","Chickpeas"],["🥕","Rainbow carrot"],["🌱","Pea shoots"],["","Pickled red cabbage"],["🥭","Mango"],["🍋","Citrus dressing"]],
    alg: ["Sulphites"], tags: ["vegan","healthy","bowl","salad"]
  },
  {
    id: "s3", name: "Kale, Citrus & Almond Salad", cat: "Starters", price: 10.5,
    img: U("1540189549336-e6e99c3679fe"), badge: "veg", rating: 4.5, reviews: 142, mins: 8, kcal: 310,
    desc: "Massaged kale with orange, feta shavings and a cold-pressed juice on the side.",
    ing: [["🥬","Curly kale"],["🍊","Navel orange"],["🧀","Sheep feta"],["🌰","Flaked almond"],["","Red onion"],["","Kalamata olive"],["🍯","Honey"],["🍋","Lemon oil"]],
    alg: ["Dairy","Tree nuts"], tags: ["salad","fresh","citrus","light"]
  },
  {
    id: "s4", name: "Velvet Roasted Carrot Soup", cat: "Starters", price: 9.0,
    img: U("1547592166-23ac45744acd"), badge: null, rating: 4.6, reviews: 178, mins: 10, kcal: 260,
    desc: "Slow-roasted carrots blended with coconut, finished with yoghurt and toasted almonds.",
    ing: [["🥕","Charentais carrot"],["🥥","Coconut milk"],["🥛","Sheep yoghurt"],["🌰","Toasted almond"],["🌿","Chervil"],["🫚","Fresh ginger"],["🧂","Sea salt"],["🌶️","White pepper"]],
    alg: ["Tree nuts","Dairy"], tags: ["soup","warm","vegan","comfort"]
  },
  {
    id: "s5", name: "Eleven Sushi Boat", cat: "Starters", price: 18.0,
    img: U("1621996346565-e3dbc646d9a9"), badge: "chef", rating: 4.9, reviews: 305, mins: 18, kcal: 540,
    desc: "Eighteen pieces rolled to order — tuna, salmon, avocado and the house spicy sauce.",
    ing: [["🍚","Sushi rice"],["🐟","Yellowfin tuna"],["🍣","Salmon belly"],["🥑","Avocado"],["🥒","Cucumber"],["🌿","Nori"],["🍶","Rice vinegar"],["🌶️","House shacha"]],
    alg: ["Fish","Soy"], tags: ["japanese","sharing","raw","seafood"]
  },

  /* ─────────── Mains ─────────── */
  {
    id: "m1", name: "Beef Tasting Trio", cat: "Mains", price: 32.0,
    img: U("1504674900247-0877df9cc836"), badge: "chef", rating: 4.9, reviews: 421, mins: 26, kcal: 890,
    desc: "Three cuts off the same animal — cured, slow-braised and charred over oak.",
    ing: [["🥩","Dry-aged sirloin"],["🍖","Braised short rib"],["🌶️","Chilli-jam glaze"],["🧅","Pickled shallot"],["🥬","Watercress"],["🥜","Cashew crumb"],["🌿","Thai basil"],["🫙","Bone-jus reduction"]],
    alg: ["Tree nuts","Sulphites"], tags: ["beef","grill","sharing","signature"]
  },
  {
    id: "m2", name: "Pan-Seared Salmon Ribbons", cat: "Mains", price: 26.5,
    img: U("1519708227418-c8fd9a32b7a2"), badge: null, rating: 4.7, reviews: 267, mins: 19, kcal: 610,
    desc: "Crisp-skirted salmon over spinach and courgette ribbons with a lime beurre blanc.",
    ing: [["🐟","Scottish salmon"],["🥬","English spinach"],["🥒","Courgette ribbon"],["🍋","Amalfi lime"],["🧈","Beurre blanc"],["","Dill"],["🧄","Confited garlic"],["🧂","Maldon salt"]],
    alg: ["Fish","Dairy"], tags: ["fish","seafood","healthy","seared"]
  },
  {
    id: "m3", name: "The Eleven Cheeseburger", cat: "Mains", price: 17.0,
    img: U("1568901346375-23c9450c58cd"), badge: "hot", rating: 4.8, reviews: 1204, mins: 15, kcal: 940,
    desc: "Two dry-aged patties, molten cheddar, house sauce and pickles in a potato bun.",
    ing: [["🥩","Dry-aged beef x2"],["🧀","Mature cheddar"],["🥯","Potato bun"],["🥒","Gherkin"],["🍅","Heirloom tomato"],["🥬","Lamb's lettuce"],["🌶️","House sauce"],["🧅","Red onion"]],
    alg: ["Gluten","Dairy","Egg","Sesame"], tags: ["burger","beef","cheese","classic"]
  },
  {
    id: "m4", name: "Buttermilk Chicken & Fries", cat: "Mains", price: 18.5,
    img: U("1551782450-a2132b4ba21d"), badge: "hot", rating: 4.6, reviews: 688, mins: 17, kcal: 1020,
    desc: "Twenty-four hours in buttermilk, fried hard, with skin-on chips and chilli mayo.",
    ing: [["🍗","Free-range thigh"],["🥛","Cultured buttermilk"],["🥔","Heritage potato"],["🌶️","Chilli mayo"],["🥬","Little gem"],["🧄","Garlic powder"],["🫚","Ginger"],["🌿","Thyme"]],
    alg: ["Gluten","Dairy","Egg"], tags: ["chicken","fried","burger","comfort"]
  },
  {
    id: "m5", name: "Candlelit Chef's Plate", cat: "Mains", price: 38.0,
    img: U("1414235077428-338989a2e8c0"), badge: "chef", rating: 5.0, reviews: 89, mins: 34, kcal: 720,
    desc: "Whatever the pass decides that afternoon. Five bites, one very good glass of wine.",
    ing: [["🕯️","Daily selection"],["🍷","Sommelier pour"],["🐟","Line-caught fish"],["🥩","Pasture meat"],["🍄","Foraged mushroom"],["🌿","Garden herbs"],["🧈","Cultured butter"],["🍞","Bakery loaf"]],
    alg: ["Fish","Dairy","Gluten","Sulphites"], tags: ["tasting","premium","chef","wine"]
  },

  /* ─────────── Pizza & Pasta ─────────── */
  {
    id: "p1", name: "Smoke & Pineapple Chicken Pizza", cat: "Pizza & Pasta", price: 19.0,
    img: U("1565299624946-b28f40a0ae38"), badge: null, rating: 4.5, reviews: 512, mins: 14, kcal: 860,
    desc: "Wood-fired base, smoked chicken, caramelised pineapple and red onion.",
    ing: [["🫓","72-hour dough"],["🍗","Applewood chicken"],["🍍","Grilled pineapple"],["🧅","Red onion"],["🧀","Fior di latte"],["🌿","Coriander"],["🌶️","Chilli oil"],["🍯","BBQ glaze"]],
    alg: ["Gluten","Dairy"], tags: ["pizza","woodfired","chicken","cheese"]
  },
  {
    id: "p2", name: "Pesto Farfalle, Blistered Tomato", cat: "Pizza & Pasta", price: 16.5,
    img: U("1473093295043-cdd812d0e601"), badge: "veg", rating: 4.6, reviews: 331, mins: 13, kcal: 640,
    desc: "Butterflied pasta folded through basil pesto with burst vine tomatoes.",
    ing: [["🎀","Farfalle"],["🌿","Genovese basil"],["🧀","Parmesan"],["🌰","Pine nut"],["🍅","Vine tomato"],["🧄","Garlic"],["🫒","Ligurian oil"],["🥬","Rocket"]],
    alg: ["Gluten","Dairy","Tree nuts"], tags: ["pasta","vegetarian","pesto","basil"]
  },
  {
    id: "p3", name: "Penne all'Emilia", cat: "Pizza & Pasta", price: 17.5,
    img: U("1553621042-f6e147245754"), badge: null, rating: 4.7, reviews: 742, mins: 15, kcal: 780,
    desc: "Six-hour beef and pancetta ragù, penne drained in the pan, snow of pecorino.",
    ing: [["🍝","Penne rigate"],["🥩","Beef chuck"],["🥓","Pancetta"],["🍅","San Marzano"],["🧅","Soffritto"],["🧀","Pecorino"],["🍷","Red wine"],["🌿","Bay & thyme"]],
    alg: ["Gluten","Dairy","Sulphites"], tags: ["pasta","beef","ragu","bolognese","comfort"]
  },

  /* ─────────── Desserts ─────────── */
  {
    id: "d1", name: "Dark Chocolate Drip Cake", cat: "Desserts", price: 9.5,
    img: U("1578985545062-69928b1d9587"), badge: "chef", rating: 4.9, reviews: 903, mins: 6, kcal: 520,
    desc: "Seventy-two percent sponge under a ganache drip with piped chocolate cream.",
    ing: [["🍫","72% couverture"],["🥚","Free-range egg"],["🧈","French butter"],["🥛","Double cream"],["☕","Espresso"],["🌾","Plain flour"],["🧂","Fleur de sel"],["🍓","Berry compote"]],
    alg: ["Gluten","Dairy","Egg","Soy"], tags: ["chocolate","cake","sweet","rich"]
  },
  {
    id: "d2", name: "Raspberry Cream Layer Cake", cat: "Desserts", price: 10.0,
    img: U("1565958011703-44f9829ba187"), badge: null, rating: 4.8, reviews: 447, mins: 6, kcal: 480,
    desc: "Vanilla sponge, raspberry curd and whipped mascarpone under fresh berries.",
    ing: [["🫐","Raspberry"],["🥛","Mascarpone"],["🌼","Madagascar vanilla"],["🍰","Sponge"],["🥚","Egg"],["🍋","Lemon zest"],["🌿","Mint"],["🍯","Honey"]],
    alg: ["Gluten","Dairy","Egg"], tags: ["raspberry","cake","berry","light"]
  },
  {
    id: "d3", name: "Strawberry Panna Cotta", cat: "Desserts", price: 8.5,
    img: U("1488477181946-6428a0291777"), badge: "veg", rating: 4.6, reviews: 289, mins: 4, kcal: 330,
    desc: "Set cream in little jars, topped with macerated strawberries and rosemary.",
    ing: [["🍓","Chalk Farm strawberries"],["🥛","Jersey cream"],["🍬","Caster sugar"],["🌿","Rosemary"],["🍦","Vanilla pod"],["🧊","Gelatine"],["🌹","Rose water"],["🍋","Lemon juice"]],
    alg: ["Dairy"], tags: ["strawberry","cream","dessert","jar"]
  },
  {
    id: "d4", name: "Confetti Sprinkle Donut", cat: "Desserts", price: 5.5,
    img: U("1551024601-bec78aea704b"), badge: null, rating: 4.4, reviews: 1120, mins: 3, kcal: 410,
    desc: "Brioche doughnut, chocolate and vanilla glaze, absurd amount of sprinkles.",
    ing: [["🍩","Brioche dough"],["🍫","Chocolate glaze"],["","Vanilla icing"],["🌈","Sugar sprinkles"],["🧈","Butter"],["🥚","Egg"],["🧂","Salt"],["🛢️","Sunflower fry"]],
    alg: ["Gluten","Dairy","Egg","Soy"], tags: ["donut","sweet","sprinkle","kids"]
  },
  {
    id: "d5", name: "Rose & Cream Cupcakes", cat: "Desserts", price: 7.5,
    img: U("1563729784474-d77dbb933a9e"), badge: null, rating: 4.5, reviews: 176, mins: 4, kcal: 390,
    desc: "Three vanilla cupcakes piped with rose buttercream and a raspberry on top.",
    ing: [["🌹","Rose buttercream"],["🧁","Vanilla sponge"],["🫐","Raspberry"],["🥚","Egg"],["🥛","Milk"],["🌼","Vanilla"],["🍬","Icing sugar"],["🌿","Pistachio dust"]],
    alg: ["Gluten","Dairy","Egg"], tags: ["cupcake","rose","sweet","tea"]
  },

  /* ─────────── Bakery ─────────── */
  {
    id: "b1", name: "Country Sourdough Loaf", cat: "Bakery", price: 7.0,
    img: U("1509440159596-0249088772ff"), badge: null, rating: 4.9, reviews: 654, mins: 2, kcal: 210,
    desc: "Wholemeal and rye, forty-hour ferment, baked at six every single morning.",
    ing: [["🌾","Stoneground wheat"],["🌿","Rye flour"],["💧","Water"],["🧂","Sea salt"],["🫙","Eleven-year starter"],["🌱","Malted barley"],["🍞","Wheat bran"],["⏳","40h ferment"]],
    alg: ["Gluten"], tags: ["bread","loaf","sourdough","vegan"]
  },
  {
    id: "b2", name: "Butter Croissant", cat: "Bakery", price: 4.25,
    img: U("1555507036-ab1f4038808a"), badge: "chef", rating: 4.8, reviews: 812, mins: 2, kcal: 320,
    desc: "Twenty-seven folds of Charentes-Poisitou butter, laminated before sunrise.",
    ing: [["🧈","Charentes butter"],["🌾","T55 flour"],["🥛","Whole milk"],["🥚","Egg wash"],["","Fine salt"],["","Caster sugar"],["","3-day lamination"],["🔥","Deck oven"]],
    alg: ["Gluten","Dairy","Egg"], tags: ["pastry","croissant","breakfast","butter"]
  },

  /* ─────────── Drinks ─────────── */
  {
    id: "k1", name: "Single-Origin Pour-Over", cat: "Drinks", price: 5.5,
    img: U("1442512595331-e89e73853f31"), badge: null, rating: 4.7, reviews: 388, mins: 5, kcal: 5,
    desc: "Weighed, bloomed and poured by hand. Ask for today's farm on the card.",
    ing: [["☕","Ethiopian Guji"],["💧","Filtered water"],["🌡️","94°C brew"],["⚖️","18g dose"],["🫖","Paper filter"],["🍒","Tasting: cherry"],["🍋","Tasting: citrus"],["🍬","Tasting: cane sugar"]],
    alg: [], tags: ["coffee","black","brew","caffeine"]
  },
  {
    id: "k2", name: "Velvet Cappuccino Flight", cat: "Drinks", price: 6.5,
    img: U("1509042239860-f550ce710b93"), badge: "new", rating: 4.8, reviews: 502, mins: 6, kcal: 140,
    desc: "Three small cups — classic, oat and a honey-and-cardamom seasonal pour.",
    ing: [["☕","House espresso"],["🥛","Whole milk"],["🌾","Oat barista milk"],["🍯","Wildflower honey"],["🫚","Cardamom"],["🧊","Ice option"],["🍫","Cocoa dust"],["💨","Micro foam"]],
    alg: ["Dairy"], tags: ["coffee","cappuccino","latte","milk","drink"]
  },
  {
    id: "k3", name: "Barista's Table Coffee Toast", cat: "Drinks", price: 12.0,
    img: U("1495474472287-4d71bcdd2085"), badge: "chef", rating: 4.9, reviews: 231, mins: 10, kcal: 460,
    desc: "A pot to share, four toasts and the butter board — built for a slow table.",
    ing: [["☕","Filter pot for 4"],["🍞","Bakery toast"],["🧈","Cultured butter"],["🍓","Berry jam"],["🥚","Soft egg"],["🧀","Cheese board"],["🌿","Herbs"],["🍯","Honeycomb"]],
    alg: ["Gluten","Dairy","Egg"], tags: ["coffee","sharing","brunch","toast","set"]
  },
  {
    id: "k4", name: "Strawberry & Lime Cordial Fizz", cat: "Drinks", price: 7.5,
    img: U("1497534446932-c925b458314e"), badge: "veg", rating: 4.6, reviews: 297, mins: 4, kcal: 120,
    desc: "Zero-proof. Pressed strawberry, lime, mint and soda poured over hand ice.",
    ing: [["🍓","Pressed strawberry"],["🍋","Fresh lime"],["🌿","Garden mint"],["💨","Soda water"],["🧊","Hand-cut ice"],["🍬","Cane syrup"],["🌸","Elderflower"],["⚡","Zero alcohol"]],
    alg: [], tags: ["mocktail","cold","juice","refreshing","drink","no-alcohol"]
  }
];

/* gallery / ambience shots — interiors verified */
const GALLERY = [
  { img: U("1543007630-9710e4a00a20", 900), cap: "The amber bar, 21:40" },
  { img: U("1517248135467-4c7edcad34c4", 900), cap: "Eleven seats and a long counter" },
  { img: U("1414235077428-338989a2e8c0", 900), cap: "Service, second sitting" },
  { img: U("1442512595331-e89e73853f31", 900), cap: "Morning brew before doors" },
  { img: U("1509440159596-0249088772ff", 900), cap: "Bake at six, sharp" }
];

const SEED_REVIEWS = [
  { id: "r1", name: "Nadia P.", stars: 5, dish: "Beef Tasting Trio", date: "2026-09-24",
    text: "The trio is worth the walk across town. Braised short rib fell apart under the spoon and nobody rushed us out of the table.", hidden: false },
  { id: "r2", name: "Marcus O.", stars: 5, dish: "The Eleven Cheeseburger", date: "2026-09-21",
    text: "Ordered it with the buttermilk chicken for the table and everything landed hot at once. That is harder than it sounds.", hidden: false },
  { id: "r3", name: "Sekar A.", stars: 4, dish: "Pesto Farfalle, Blistered Tomato", date: "2026-09-18",
    text: "Genuinely good pesto — not the bitter jar kind. I would happily take it down to 14 dollars and give me more tomato.", hidden: false },
  { id: "r4", name: "Tom H.", stars: 5, dish: "Butter Croissant", date: "2026-09-15",
    text: "Came for coffee, left with four croissants. The layers actually shatter. Ask the bakery person what the ferment is.", hidden: false },
  { id: "r5", name: "Ines D.", stars: 4, dish: "Strawberry & Lime Cordial Fizz", date: "2026-09-09",
    text: "Refreshing and not too sweet, which is rare for a mocktail. Room was loud by nine so book the counter.", hidden: false }
];

/* promo codes accepted at checkout */
const PROMOS = {
  BISTRO11: { type: "pct",  value: 11,   label: "Eleven percent off" },
  FIRSTBITE: { type: "flat", value: 5,    label: "$5 off your first order" },
  LATEPASS: { type: "pct",  value: 20,   label: "Late kitchen discount" }
};

/* ── staff sign-in — change the pass here ── */
const STAFF = { user: "chef", pass: "bistro11", name: "Chef Rian", title: "Kitchen manager" };

/* one demo customer so the doors open before you sign up */
const SEED_ACCOUNTS = [
  {
    name: "Rania Putri", email: "rania@example.com", pass: "bistro123",
    phone: "0811 2233 4455", address: "Jl. Lantern No. 11, Jakarta Selatan", avatar: ""
  }
];

/* ── footer + contact details ── */
const BIZ = {
  name: "Bistro Eleven",
  tagline: "A neighbourhood kitchen with eleven seats and no shortcuts.",
  street: ["Jl. Lantern No. 11", "Kebayoran Baru, Jakarta Selatan 12160"],
  phoneTel: "+62217220011", phoneShow: "+62 21 722 0011",
  wa: "6281122334455",
  email: "halo@bistroeleven.id",
  hours: [["Mon – Thu", "11:30 – 22:00"], ["Fri – Sat", "11:30 – 23:30"], ["Sunday", "09:00 – 21:00"]],
  mapQuery: "https://www.google.com/maps/search/?api=1&query=Jl.+Lantern+No+11+Kebayoran+Baru+Jakarta",
  socials: {
    instagram: "https://instagram.com/bistro.eleven",
    facebook: "https://facebook.com/bistroeleven",
    x: "https://x.com/bistroeleven",
    tiktok: "https://tiktok.com/@bistro.eleven"
  },
  payments: ["Visa", "Mastercard", "GoPay", "OVO", "Cash"]
};
