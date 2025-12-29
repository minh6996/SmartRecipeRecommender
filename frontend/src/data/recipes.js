// Mock recipe data for the Smart Recipe Recommender
// In production, this would come from: GET /api/recipes
export const mockRecipes = [
  {
    id: 1,
    title: "Vietnamese Pho Bo",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021411/Vietnamese_Pho_Bo_wnz0tj.jpg",
    cuisine: "Vietnamese",
    cookingTime: 180,
    tags: ["Traditional", "Soup", "Beef", "Vietnamese"],
    ingredients: [
      "500g beef brisket",
      "200g rice noodles",
      "2L beef broth",
      "Star anise",
      "Cinnamon sticks",
      "Fresh herbs",
      "Bean sprouts"
    ],
    steps: [
      "Prepare beef broth with spices",
      "Cook rice noodles separately",
      "Slice beef thinly",
      "Assemble bowl with noodles and beef",
      "Pour hot broth over",
      "Garnish with herbs and serve"
    ],
    popularity: 95
  },
  {
    id: 2,
    title: "Korean Bibimbap",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021401/Korean_Bibimbap_vt1qtr.jpg",
    cuisine: "Korean",
    cookingTime: 45,
    tags: ["Quick", "Healthy", "Vegetarian", "Korean"],
    ingredients: [
      "2 cups cooked rice",
      "Mixed vegetables",
      "Gochujang",
      "Sesame oil",
      "Egg",
      "Soy sauce"
    ],
    steps: [
      "Prepare vegetables",
      "Cook rice",
      "Fry egg sunny-side up",
      "Arrange ingredients in bowl",
      "Add gochujang",
      "Mix well before eating"
    ],
    popularity: 88
  },
  {
    id: 3,
    title: "Thai Green Curry",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021409/Thai_Green_Curry_ua3vhy.jpg",
    cuisine: "Thai",
    cookingTime: 35,
    tags: ["Quick", "Spicy", "Thai"],
    ingredients: [
      "Green curry paste",
      "Coconut milk",
      "Chicken or tofu",
      "Thai basil",
      "Fish sauce",
      "Vegetables"
    ],
    steps: [
      "Heat oil and fry curry paste",
      "Add coconut milk",
      "Add protein and vegetables",
      "Season with fish sauce",
      "Add basil leaves",
      "Serve with jasmine rice"
    ],
    popularity: 82
  },
  {
    id: 4,
    title: "Japanese Sushi Rolls",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021401/Japanese_Sushi_Rolls_tj7leh.jpg",
    cuisine: "Japanese",
    cookingTime: 60,
    tags: ["Healthy", "Seafood", "Japanese"],
    ingredients: [
      "Sushi rice",
      "Nori sheets",
      "Fresh fish",
      "Cucumber",
      "Avocado",
      "Soy sauce"
    ],
    steps: [
      "Prepare sushi rice",
      "Cut ingredients into strips",
      "Place rice on nori",
      "Add fillings",
      "Roll tightly",
      "Cut into pieces"
    ],
    popularity: 90
  },
  {
    id: 5,
    title: "Italian Margherita Pizza",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021400/Italian_Margherita_Pizza_ziqilr.jpg",
    cuisine: "Italian",
    cookingTime: 90,
    tags: ["Vegetarian", "Italian"],
    ingredients: [
      "Pizza dough",
      "Tomato sauce",
      "Fresh mozzarella",
      "Fresh basil",
      "Olive oil",
      "Salt"
    ],
    steps: [
      "Prepare pizza dough",
      "Roll out dough",
      "Add tomato sauce",
      "Add mozzarella",
      "Bake at high heat",
      "Add fresh basil"
    ],
    popularity: 85
  },
  {
    id: 6,
    title: "Mexican Tacos al Pastor",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021406/Mexican_Tacos_al_Pastor_yrufce.jpg",
    cuisine: "Mexican",
    cookingTime: 120,
    tags: ["Spicy", "Mexican"],
    ingredients: [
      "Pork shoulder",
      "Pineapple",
      "Corn tortillas",
      "Cilantro",
      "Onions",
      "Lime"
    ],
    steps: [
      "Marinate pork overnight",
      "Grill pork with pineapple",
      "Slice meat thinly",
      "Warm tortillas",
      "Assemble tacos",
      "Serve with lime"
    ],
    popularity: 87
  },
  {
    id: 7,
    title: "Indian Butter Chicken",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021403/Indian_Butter_Chicken_gmsvsn.jpg",
    cuisine: "Indian",
    cookingTime: 45,
    tags: ["Spicy", "Indian"],
    ingredients: [
      "Chicken thighs",
      "Tomato puree",
      "Heavy cream",
      "Garam masala",
      "Butter",
      "Ginger-garlic paste"
    ],
    steps: [
      "Marinate and cook chicken",
      "Prepare tomato gravy",
      "Add cream and butter",
      "Combine with chicken",
      "Simmer for flavors",
      "Serve with naan"
    ],
    popularity: 91
  },
  {
    id: 8,
    title: "Greek Moussaka",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021399/Greek_Moussaka_jqz4qy.jpg",
    cuisine: "Greek",
    cookingTime: 150,
    tags: ["Traditional", "Greek"],
    ingredients: [
      "Eggplant",
      "Ground lamb",
      "Tomato sauce",
      "Béchamel sauce",
      "Cheese",
      "Onions"
    ],
    steps: [
      "Slice and salt eggplant",
      "Prepare meat sauce",
      "Make béchamel",
      "Layer ingredients",
      "Bake until golden",
      "Rest before serving"
    ],
    popularity: 78
  },
  {
    id: 9,
    title: "Chinese Fried Rice",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021401/Chinese_Fried_Rice_slu39d.jpg",
    cuisine: "Chinese",
    cookingTime: 20,
    tags: ["Quick", "Vegetarian", "Chinese"],
    ingredients: [
      "Day-old rice",
      "Eggs",
      "Mixed vegetables",
      "Soy sauce",
      "Sesame oil",
      "Green onions"
    ],
    steps: [
      "Heat wok with oil",
      "Scramble eggs",
      "Add vegetables",
      "Add rice and break up",
      "Season with sauces",
      "Garnish and serve"
    ],
    popularity: 83
  },
  {
    id: 10,
    title: "French Ratatouille",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021405/French_Ratatouille_uoyebt.jpg",
    cuisine: "French",
    cookingTime: 60,
    tags: ["Healthy", "Vegetarian", "French"],
    ingredients: [
      "Eggplant",
      "Zucchini",
      "Bell peppers",
      "Tomatoes",
      "Herbs de Provence",
      "Olive oil"
    ],
    steps: [
      "Slice all vegetables",
      "Sauté eggplant separately",
      "Cook other vegetables",
      "Combine all ingredients",
      "Simmer with herbs",
      "Serve hot or cold"
    ],
    popularity: 76
  },
  {
    id: 11,
    title: "Spanish Paella",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021405/Spanish_Paella_ayvdrm.jpg",
    cuisine: "Spanish",
    cookingTime: 90,
    tags: ["Seafood", "Spanish"],
    ingredients: [
      "Bomba rice",
      "Saffron",
      "Mixed seafood",
      "Chicken",
      "Vegetables",
      "Broth"
    ],
    steps: [
      "Heat paella pan",
      "Cook chicken and seafood",
      "Add vegetables",
      "Add rice and broth",
      "Simmer without stirring",
      "Rest before serving"
    ],
    popularity: 89
  },
  {
    id: 12,
    title: "Turkish Kebabs",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021409/Turkish_Kebabs_n5qmoy.jpg",
    cuisine: "Turkish",
    cookingTime: 40,
    tags: ["Quick", "Grilled", "Turkish"],
    ingredients: [
      "Ground lamb",
      "Onions",
      "Spices",
      "Pita bread",
      "Yogurt sauce",
      "Salad"
    ],
    steps: [
      "Mix meat with spices",
      "Form onto skewers",
      "Grill until cooked",
      "Prepare yogurt sauce",
      "Warm pita bread",
      "Assemble and serve"
    ],
    popularity: 84
  },
  {
    id: 13,
    title: "Moroccan Tagine",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021404/Moroccan_Tagine_c92jn1.jpg",
    cuisine: "Moroccan",
    cookingTime: 180,
    tags: ["Traditional", "Moroccan"],
    ingredients: [
      "Lamb or chicken",
      "Dried fruits",
      "Spices",
      "Onions",
      "Preserved lemons",
      "Broth"
    ],
    steps: [
      "Brown meat",
      "Add spices and onions",
      "Add dried fruits",
      "Simmer slowly",
      "Add preserved lemon",
      "Serve with couscous"
    ],
    popularity: 79
  },
  {
    id: 14,
    title: "Vietnamese Banh Mi",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021406/Vietnamese_Banh_Mi_qeakb1.jpg",
    cuisine: "Vietnamese",
    cookingTime: 25,
    tags: ["Quick", "Vietnamese"],
    ingredients: [
      "Baguette",
      "Grilled pork",
      "Pickled vegetables",
      "Fresh herbs",
      "Mayo",
      "Soy sauce"
    ],
    steps: [
      "Prepare pickled vegetables",
      "Grill pork",
      "Slice baguette",
      "Add mayo and pate",
      "Add fillings",
      "Garnish with herbs"
    ],
    popularity: 86
  },
  {
    id: 15,
    title: "Korean Kimchi Jjigae",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021406/Korean_Kimchi_Jjigae_nucx9s.jpg",
    cuisine: "Korean",
    cookingTime: 30,
    tags: ["Spicy", "Korean"],
    ingredients: [
      "Kimchi",
      "Pork belly",
      "Tofu",
      "Gojuchang",
      "Green onions",
      "Broth"
    ],
    steps: [
      "Sauté pork belly",
      "Add kimchi",
      "Add broth and gochujang",
      "Simmer",
      "Add tofu",
      "Garnish and serve"
    ],
    popularity: 81
  },
  {
    id: 16,
    title: "Thai Pad Thai",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021408/Thai_Pad_Thai_kdmzna.jpg",
    cuisine: "Thai",
    cookingTime: 25,
    tags: ["Quick", "Thai"],
    ingredients: [
      "Rice noodles",
      "Shrimp",
      "Eggs",
      "Bean sprouts",
      "Peanuts",
      "Tamarind sauce"
    ],
    steps: [
      "Soak noodles",
      "Stir-fry shrimp",
      "Add eggs",
      "Add noodles and sauce",
      "Add bean sprouts",
      "Garnish with peanuts"
    ],
    popularity: 92
  },
  {
    id: 17,
    title: "Japanese Ramen",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021405/Japanese_Ramen_tyyoym.jpg",
    cuisine: "Japanese",
    cookingTime: 120,
    tags: ["Traditional", "Japanese"],
    ingredients: [
      "Ramen noodles",
      "Pork bones",
      "Eggs",
      "Green onions",
      "Nori",
      "Chashu pork"
    ],
    steps: [
      "Prepare broth",
      "Cook chashu pork",
      "Prepare ramen eggs",
      "Cook noodles",
      "Assemble bowl",
      "Add toppings"
    ],
    popularity: 94
  },
  {
    id: 18,
    title: "Italian Carbonara",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021400/Italian_Carbonara_upxeh9.jpg",
    cuisine: "Italian",
    cookingTime: 20,
    tags: ["Quick", "Italian"],
    ingredients: [
      "Spaghetti",
      "Pancetta",
      "Eggs",
      "Parmesan",
      "Black pepper",
      "Salt"
    ],
    steps: [
      "Cook spaghetti",
      "Crisp pancetta",
      "Mix eggs and cheese",
      "Toss hot pasta",
      "Add egg mixture",
      "Serve immediately"
    ],
    popularity: 87
  },
  {
    id: 19,
    title: "Mexican Guacamole",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021403/Mexican_Guacamole_o9lhla.jpg",
    cuisine: "Mexican",
    cookingTime: 15,
    tags: ["Quick", "Healthy", "Vegetarian", "Mexican"],
    ingredients: [
      "Avocados",
      "Lime",
      "Onions",
      "Cilantro",
      "Jalapeños",
      "Salt"
    ],
    steps: [
      "Mash avocados",
      "Add lime juice",
      "Mix in onions",
      "Add cilantro",
      "Add jalapeños",
      "Season and serve"
    ],
    popularity: 85
  },
  {
    id: 20,
    title: "Indian Samosas",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021404/Indian_Samosas_pkksyg.jpg",
    cuisine: "Indian",
    cookingTime: 60,
    tags: ["Vegetarian", "Indian"],
    ingredients: [
      "Potatoes",
      "Peas",
      "Spices",
      "Flour",
      "Oil",
      "Mint chutney"
    ],
    steps: [
      "Make dough",
      "Prepare filling",
      "Fill samosas",
      "Seal edges",
      "Deep fry",
      "Serve with chutney"
    ],
    popularity: 88
  },
  {
    id: 21,
    title: "Greek Tzatziki",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021401/Greek_Tzatziki_qqm3ud.jpg",
    cuisine: "Greek",
    cookingTime: 20,
    tags: ["Quick", "Healthy", "Vegetarian", "Greek"],
    ingredients: [
      "Greek yogurt",
      "Cucumber",
      "Garlic",
      "Dill",
      "Lemon",
      "Olive oil"
    ],
    steps: [
      "Grate cucumber",
      "Squeeze out water",
      "Mix with yogurt",
      "Add garlic and dill",
      "Add lemon and oil",
      "Chill before serving"
    ],
    popularity: 80
  },
  {
    id: 22,
    title: "Chinese Dumplings",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021398/Chinese_Dumplings_cotnmw.jpg",
    cuisine: "Chinese",
    cookingTime: 45,
    tags: ["Traditional", "Chinese"],
    ingredients: [
      "Dumpling wrappers",
      "Ground pork",
      "Cabbage",
      "Ginger",
      "Soy sauce", 
      "Vinegar"
    ],
    steps: [
      "Prepare filling",
      "Wrap dumplings",
      "Boil or steam",
      "Make dipping sauce",
      "Serve hot",
      "Garnish with ginger"
    ],
    popularity: 91
  },
  {
    id: 23,
    title: "French Croissants",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021399/French_Croissants_sjucug.jpg",
    cuisine: "French",
    cookingTime: 480,
    tags: ["Traditional", "Bakery", "French"],
    ingredients: [
      "Flour",
      "Butter",
      "Yeast",
      "Milk",
      "Sugar",
      "Salt"
    ],
    steps: [
      "Make dough",
      "Laminate with butter",
      "Fold multiple times",
      "Shape croissants",
      "Proof overnight",
      "Bake until golden"
    ],
    popularity: 93
  },
  {
    id: 24,
    title: "Vietnamese Spring Rolls",
    imageUrl: "https://res.cloudinary.com/dvbibylda/image/upload/v1767021408/Vietnamese_Spring_Rolls_xgmvtq.jpg",
    cuisine: "Vietnamese",
    cookingTime: 30,
    tags: ["Healthy", "Vegetarian", "Vietnamese"],
    ingredients: [
      "Rice paper",
      "Shrimp",
      "Vegetables",
      "Rice noodles",
      "Peanut sauce",
      "Herbs"
    ],
    steps: [
      "Prepare vegetables",
      "Cook shrimp and noodles",
      "Soak rice paper",
      "Roll ingredients",
      "Make peanut sauce",
      "Serve fresh"
    ],
    popularity: 84
  }
];

// Helper function to get recipe by ID
export const getRecipeById = (id) => {
  return mockRecipes.find(recipe => recipe.id === parseInt(id));
};

// Helper function to get recipes by cuisine
export const getRecipesByCuisine = (cuisine) => {
  return mockRecipes.filter(recipe => recipe.cuisine === cuisine);
};

// Helper function to get recipes by tag
export const getRecipesByTag = (tag) => {
  return mockRecipes.filter(recipe => recipe.tags.includes(tag));
};
