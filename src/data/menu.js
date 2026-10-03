/* ═══════════════════════════════════════════════════════════
   Menu seed - dishes, categories, allergens.
   Photography lives in ./photos.js and is keyed by dish id.
   ═══════════════════════════════════════════════════════════ */
import { ANGLES } from "./photos.js";

export const CATEGORIES = ["Starters", "Mains", "Pizza & Pasta", "Desserts", "Bakery", "Drinks"];

const RAW = [
  /* ─────────── Starters ─────────── */
  {
    id: "s1", name: "Charred Haloumi & Herb Board", cat: "Starters", price: 100000,
    badge: "veg", rating: 4.7, reviews: 214, mins: 12, kcal: 420,
    desc: "Griddled haloumi with charred greens, chilli crumb and warm sourdough soldiers.",
    ing: [["🧀", "Barrel-aged haloumi"], ["🥬", "Little gem lettuce"], ["🌶️", "Aleppo chilli"], ["🍞", "Sourdough"], ["🍋", "Lemon"], ["🫒", "Olive oil"], ["🌿", "Flat-leaf parsley"], ["🧄", "Roasted garlic"]],
    alg: ["Dairy", "Gluten"], tags: ["cheese", "sharing", "grilled", "salad"]
  },
  {
    id: "s2", name: "Rainbow Bistro Bowl", cat: "Starters", price: 88000,
    badge: "new", rating: 4.8, reviews: 96, mins: 9, kcal: 380,
    desc: "Avocado, roast sweet potato, chickpeas and pickled radish on herbed leaves.",
    ing: [["🥑", "Hass avocado"], ["🍠", "Roast sweet potato"], ["🫘", "Chickpeas"], ["🥕", "Rainbow carrot"], ["🌱", "Pea shoots"], ["", "Pickled red cabbage"], ["🥭", "Mango"], ["🍋", "Citrus dressing"]],
    alg: ["Sulphites"], tags: ["vegan", "healthy", "bowl", "salad"]
  },
  {
    id: "s3", name: "Kale, Citrus & Almond Salad", cat: "Starters", price: 84000,
    badge: "veg", rating: 4.5, reviews: 142, mins: 8, kcal: 310,
    desc: "Massaged kale with orange, feta shavings and a cold-pressed juice on the side.",
    ing: [["🥬", "Curly kale"], ["🍊", "Navel orange"], ["🧀", "Sheep feta"], ["🌰", "Flaked almond"], ["", "Red onion"], ["", "Kalamata olive"], ["🍯", "Honey"], ["🍋", "Lemon oil"]],
    alg: ["Dairy", "Tree nuts"], tags: ["salad", "fresh", "citrus", "light"]
  },
  {
    id: "s4", name: "Velvet Roasted Carrot Soup", cat: "Starters", price: 72000,
    badge: null, rating: 4.6, reviews: 178, mins: 10, kcal: 260,
    desc: "Slow-roasted carrots blended with coconut, finished with yoghurt and toasted almonds.",
    ing: [["🥕", "Charentais carrot"], ["🥥", "Coconut milk"], ["🥛", "Sheep yoghurt"], ["🌰", "Toasted almond"], ["🌿", "Chervil"], ["🫚", "Fresh ginger"], ["🧂", "Sea salt"], ["🌶️", "White pepper"]],
    alg: ["Tree nuts", "Dairy"], tags: ["soup", "warm", "vegetarian", "comfort"]
  },
  {
    id: "s5", name: "Eleven Sushi Boat", cat: "Starters", price: 144000,
    badge: "chef", rating: 4.9, reviews: 305, mins: 18, kcal: 540,
    desc: "Eighteen pieces rolled to order - tuna, salmon, avocado and the house spicy sauce.",
    ing: [["🍚", "Sushi rice"], ["🐟", "Yellowfin tuna"], ["🍣", "Salmon belly"], ["🥑", "Avocado"], ["🥒", "Cucumber"], ["🌿", "Nori"], ["🍶", "Rice vinegar"], ["🌶️", "House shacha"]],
    alg: ["Fish", "Soy"], tags: ["japanese", "sharing", "raw", "seafood"]
  },

  /* ─────────── Mains ─────────── */
  {
    id: "m1", name: "Beef Tasting Trio", cat: "Mains", price: 256000,
    badge: "chef", rating: 4.9, reviews: 421, mins: 26, kcal: 890,
    desc: "Three cuts off the same animal - cured, slow-braised and charred over oak.",
    ing: [["🥩", "Dry-aged sirloin"], ["🍖", "Braised short rib"], ["🌶️", "Chilli-jam glaze"], ["🧅", "Pickled shallot"], ["🥬", "Watercress"], ["🥜", "Cashew crumb"], ["🌿", "Thai basil"], ["🫙", "Bone-jus reduction"]],
    alg: ["Tree nuts", "Sulphites"], tags: ["beef", "grill", "sharing", "signature"]
  },
  {
    id: "m2", name: "Pan-Seared Salmon Ribbons", cat: "Mains", price: 212000,
    badge: null, rating: 4.7, reviews: 267, mins: 19, kcal: 610,
    desc: "Crisp-skirted salmon over spinach and courgette ribbons with a lime beurre blanc.",
    ing: [["🐟", "Scottish salmon"], ["🥬", "English spinach"], ["🥒", "Courgette ribbon"], ["🍋", "Amalfi lime"], ["🧈", "Beurre blanc"], ["", "Dill"], ["🧄", "Confited garlic"], ["🧂", "Maldon salt"]],
    alg: ["Fish", "Dairy"], tags: ["fish", "seafood", "healthy", "seared"]
  },
  {
    id: "m3", name: "The Eleven Cheeseburger", cat: "Mains", price: 136000,
    badge: "hot", rating: 4.8, reviews: 1204, mins: 15, kcal: 940,
    desc: "Two dry-aged patties, molten cheddar, house sauce and pickles in a potato bun.",
    ing: [["🥩", "Dry-aged beef x2"], ["🧀", "Mature cheddar"], ["🥯", "Potato bun"], ["🥒", "Gherkin"], ["🍅", "Heirloom tomato"], ["🥬", "Lamb's lettuce"], ["🌶️", "House sauce"], ["🧅", "Red onion"]],
    alg: ["Gluten", "Dairy", "Egg", "Sesame"], tags: ["burger", "beef", "cheese", "classic"]
  },
  {
    id: "m4", name: "Buttermilk Chicken & Fries", cat: "Mains", price: 148000,
    badge: "hot", rating: 4.6, reviews: 688, mins: 17, kcal: 1020,
    desc: "Twenty-four hours in buttermilk, fried hard, with skin-on chips and chilli mayo.",
    ing: [["🍗", "Free-range thigh"], ["🥛", "Cultured buttermilk"], ["🥔", "Heritage potato"], ["🌶️", "Chilli mayo"], ["🥬", "Little gem"], ["🧄", "Garlic powder"], ["🫚", "Ginger"], ["🌿", "Thyme"]],
    alg: ["Gluten", "Dairy", "Egg"], tags: ["chicken", "fried", "burger", "comfort"]
  },
  {
    id: "m5", name: "Candlelit Chef's Plate", cat: "Mains", price: 304000,
    badge: "chef", rating: 5.0, reviews: 89, mins: 34, kcal: 720,
    desc: "Whatever the pass decides that afternoon. Five bites, one very good glass of wine.",
    ing: [["🕯️", "Daily selection"], ["🍷", "Sommelier pour"], ["🐟", "Line-caught fish"], ["🥩", "Pasture meat"], ["🍄", "Foraged mushroom"], ["🌿", "Garden herbs"], ["🧈", "Cultured butter"], ["🍞", "Bakery loaf"]],
    alg: ["Fish", "Dairy", "Gluten", "Sulphites"], tags: ["tasting", "premium", "chef", "wine"]
  },

  /* ─────────── Pizza & Pasta ─────────── */
  {
    id: "p1", name: "Smoke & Pineapple Chicken Pizza", cat: "Pizza & Pasta", price: 152000,
    badge: null, rating: 4.5, reviews: 512, mins: 14, kcal: 860,
    desc: "Wood-fired base, smoked chicken, caramelised pineapple and red onion.",
    ing: [["🫓", "72-hour dough"], ["🍗", "Applewood chicken"], ["🍍", "Grilled pineapple"], ["🧅", "Red onion"], ["🧀", "Fior di latte"], ["🌿", "Coriander"], ["🌶️", "Chilli oil"], ["🍯", "BBQ glaze"]],
    alg: ["Gluten", "Dairy"], tags: ["pizza", "woodfired", "chicken", "cheese"]
  },
  {
    id: "p2", name: "Pesto Farfalle, Blistered Tomato", cat: "Pizza & Pasta", price: 132000,
    badge: "veg", rating: 4.6, reviews: 331, mins: 13, kcal: 640,
    desc: "Butterflied pasta folded through basil pesto with burst vine tomatoes.",
    ing: [["🎀", "Farfalle"], ["🌿", "Genovese basil"], ["🧀", "Parmesan"], ["🌰", "Pine nut"], ["🍅", "Vine tomato"], ["🧄", "Garlic"], ["🫒", "Ligurian oil"], ["🥬", "Rocket"]],
    alg: ["Gluten", "Dairy", "Tree nuts"], tags: ["pasta", "vegetarian", "pesto", "basil"]
  },
  {
    id: "p3", name: "Penne all'Emilia", cat: "Pizza & Pasta", price: 140000,
    badge: null, rating: 4.7, reviews: 742, mins: 15, kcal: 780,
    desc: "Six-hour beef and pancetta ragù, penne drained in the pan, snow of pecorino.",
    ing: [["🍝", "Penne rigate"], ["🥩", "Beef chuck"], ["🥓", "Pancetta"], ["🍅", "San Marzano"], ["🧅", "Soffritto"], ["🧀", "Pecorino"], ["🍷", "Red wine"], ["🌿", "Bay & thyme"]],
    alg: ["Gluten", "Dairy", "Sulphites"], tags: ["pasta", "beef", "ragu", "bolognese", "comfort"]
  },

  /* ─────────── Desserts ─────────── */
  {
    id: "d1", name: "Dark Chocolate Drip Cake", cat: "Desserts", price: 76000,
    badge: "chef", rating: 4.9, reviews: 903, mins: 6, kcal: 520,
    desc: "Seventy-two percent sponge under a ganache drip with piped chocolate cream.",
    ing: [["🍫", "72% couverture"], ["🥚", "Free-range egg"], ["🧈", "French butter"], ["🥛", "Double cream"], ["☕", "Espresso"], ["🌾", "Plain flour"], ["🧂", "Fleur de sel"], ["🍓", "Berry compote"]],
    alg: ["Gluten", "Dairy", "Egg", "Soy"], tags: ["chocolate", "cake", "sweet", "rich"]
  },
  {
    id: "d2", name: "Raspberry Cream Layer Cake", cat: "Desserts", price: 80000,
    badge: null, rating: 4.8, reviews: 447, mins: 6, kcal: 480,
    desc: "Vanilla sponge, raspberry curd and whipped mascarpone under fresh berries.",
    ing: [["🫐", "Raspberry"], ["🥛", "Mascarpone"], ["🌼", "Madagascar vanilla"], ["🍰", "Sponge"], ["🥚", "Egg"], ["🍋", "Lemon zest"], ["🌿", "Mint"], ["🍯", "Honey"]],
    alg: ["Gluten", "Dairy", "Egg"], tags: ["raspberry", "cake", "berry", "light"]
  },
  {
    id: "d3", name: "Strawberry Panna Cotta", cat: "Desserts", price: 68000,
    badge: "veg", rating: 4.6, reviews: 289, mins: 4, kcal: 330,
    desc: "Set cream in little jars, topped with macerated strawberries and rosemary.",
    ing: [["🍓", "Chalk Farm strawberries"], ["🥛", "Jersey cream"], ["🍬", "Caster sugar"], ["🌿", "Rosemary"], ["🍦", "Vanilla pod"], ["🧊", "Gelatine"], ["🌹", "Rose water"], ["🍋", "Lemon juice"]],
    alg: ["Dairy"], tags: ["strawberry", "cream", "dessert", "jar"]
  },
  {
    id: "d4", name: "Confetti Sprinkle Donut", cat: "Desserts", price: 44000,
    badge: null, rating: 4.4, reviews: 1120, mins: 3, kcal: 410,
    desc: "Brioche doughnut, chocolate and vanilla glaze, absurd amount of sprinkles.",
    ing: [["🍩", "Brioche dough"], ["🍫", "Chocolate glaze"], ["", "Vanilla icing"], ["🌈", "Sugar sprinkles"], ["🧈", "Butter"], ["🥚", "Egg"], ["🧂", "Salt"], ["🛢️", "Sunflower fry"]],
    alg: ["Gluten", "Dairy", "Egg", "Soy"], tags: ["donut", "sweet", "sprinkle", "kids"]
  },
  {
    id: "d5", name: "Rose & Cream Cupcakes", cat: "Desserts", price: 60000,
    badge: null, rating: 4.5, reviews: 176, mins: 4, kcal: 390,
    desc: "Three vanilla cupcakes piped with rose buttercream and a raspberry on top.",
    ing: [["🌹", "Rose buttercream"], ["🧁", "Vanilla sponge"], ["🫐", "Raspberry"], ["🥚", "Egg"], ["🥛", "Milk"], ["🌼", "Vanilla"], ["🍬", "Icing sugar"], ["🌿", "Pistachio dust"]],
    alg: ["Gluten", "Dairy", "Egg"], tags: ["cupcake", "rose", "sweet", "tea"]
  },

  /* ─────────── Bakery ─────────── */
  {
    id: "b1", name: "Country Sourdough Loaf", cat: "Bakery", price: 56000,
    badge: null, rating: 4.9, reviews: 654, mins: 2, kcal: 210,
    desc: "Wholemeal and rye, forty-hour ferment, baked at six every single morning.",
    ing: [["🌾", "Stoneground wheat"], ["🌿", "Rye flour"], ["💧", "Water"], ["🧂", "Sea salt"], ["🫙", "Eleven-year starter"], ["🌱", "Malted barley"], ["🍞", "Wheat bran"], ["⏳", "40h ferment"]],
    alg: ["Gluten"], tags: ["bread", "loaf", "sourdough", "vegan"]
  },
  {
    id: "b2", name: "Butter Croissant", cat: "Bakery", price: 34000,
    badge: "chef", rating: 4.8, reviews: 812, mins: 2, kcal: 320,
    desc: "Twenty-seven folds of Charentes-Poisitou butter, laminated before sunrise.",
    ing: [["🧈", "Charentes butter"], ["🌾", "T55 flour"], ["🥛", "Whole milk"], ["🥚", "Egg wash"], ["", "Fine salt"], ["", "Caster sugar"], ["", "3-day lamination"], ["🔥", "Deck oven"]],
    alg: ["Gluten", "Dairy", "Egg"], tags: ["pastry", "croissant", "breakfast", "butter"]
  },

  /* ─────────── Drinks ─────────── */
  {
    id: "k1", name: "Single-Origin Pour-Over", cat: "Drinks", price: 44000,
    badge: null, rating: 4.7, reviews: 388, mins: 5, kcal: 5,
    desc: "Weighed, bloomed and poured by hand. Ask for today's farm on the card.",
    ing: [["☕", "Ethiopian Guji"], ["💧", "Filtered water"], ["🌡️", "94°C brew"], ["⚖️", "18g dose"], ["🫖", "Paper filter"], ["🍒", "Tasting: cherry"], ["🍋", "Tasting: citrus"], ["🍬", "Tasting: cane sugar"]],
    alg: [], tags: ["coffee", "black", "brew", "caffeine"]
  },
  {
    id: "k2", name: "Velvet Cappuccino Flight", cat: "Drinks", price: 52000,
    badge: "new", rating: 4.8, reviews: 502, mins: 6, kcal: 140,
    desc: "Three small cups - classic, oat and a honey-and-cardamom seasonal pour.",
    ing: [["☕", "House espresso"], ["🥛", "Whole milk"], ["🌾", "Oat barista milk"], ["🍯", "Wildflower honey"], ["🫚", "Cardamom"], ["🧊", "Ice option"], ["🍫", "Cocoa dust"], ["💨", "Micro foam"]],
    alg: ["Dairy"], tags: ["coffee", "cappuccino", "latte", "milk", "drink"]
  },
  {
    id: "k3", name: "Barista's Table Coffee Toast", cat: "Drinks", price: 96000,
    badge: "chef", rating: 4.9, reviews: 231, mins: 10, kcal: 460,
    desc: "A pot to share, four toasts and the butter board - built for a slow table.",
    ing: [["☕", "Filter pot for 4"], ["🍞", "Bakery toast"], ["🧈", "Cultured butter"], ["🍓", "Berry jam"], ["🥚", "Soft egg"], ["🧀", "Cheese board"], ["🌿", "Herbs"], ["🍯", "Honeycomb"]],
    alg: ["Gluten", "Dairy", "Egg"], tags: ["coffee", "sharing", "brunch", "toast", "set"]
  },
  {
    id: "k4", name: "Strawberry & Lime Cordial Fizz", cat: "Drinks", price: 60000,
    badge: "veg", rating: 4.6, reviews: 297, mins: 4, kcal: 120,
    desc: "Zero-proof. Pressed strawberry, lime, mint and soda poured over hand ice.",
    ing: [["🍓", "Pressed strawberry"], ["🍋", "Fresh lime"], ["🌿", "Garden mint"], ["💨", "Soda water"], ["🧊", "Hand-cut ice"], ["🍬", "Cane syrup"], ["🌸", "Elderflower"], ["⚡", "Zero alcohol"]],
    alg: [], tags: ["mocktail", "cold", "juice", "refreshing", "drink", "no-alcohol"]
  }
];

export const MENU = RAW.map(d => ({ ...d, imgs: ANGLES[d.id] || [] }));

export const STATUS_FLOW = ["new", "cooking", "ready", "delivering", "done"];
export const STATUS_LABEL = { new: "New", cooking: "Cooking", ready: "Ready", delivering: "Out", done: "Served" };

export const BADGES = {
  chef: ["Chef's pick", "tag"],
  hot: ["Spicy", "tag tag--hot"],
  new: ["New", "tag tag--new"],
  veg: ["Veggie", "tag tag--veg"]
};
