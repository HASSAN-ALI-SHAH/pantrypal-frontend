import { getDaysLeft } from './expiryUtils';

export const RECIPE_DATABASE = [
  {
    id: 1,
    name: 'Omelette',
    ingredients: ['Eggs', 'Milk', 'Butter', 'Salt'],
    instructions: [
      'Crack 2–3 eggs into a bowl and beat well with a splash of milk.',
      'Season with salt and pepper to taste.',
      'Heat butter in a non-stick pan over medium heat until foamy.',
      'Pour in the egg mixture and let it set for 30 seconds.',
      'Gently fold the omelette in half and slide onto a plate.',
      'Serve immediately while hot.',
    ],
    time: '10 mins',
    difficulty: 'Easy',
    emoji: '🍳',
  },
  {
    id: 2,
    name: 'Pancakes',
    ingredients: ['Eggs', 'Milk', 'Flour', 'Butter', 'Sugar'],
    instructions: [
      'Mix flour, sugar, and a pinch of salt in a large bowl.',
      'In another bowl, whisk eggs with milk and melted butter.',
      'Combine wet and dry ingredients until just mixed — lumps are okay.',
      'Heat a pan over medium heat and lightly grease with butter.',
      'Pour ¼ cup of batter per pancake. Cook until bubbles form on top.',
      'Flip and cook for another 1–2 minutes. Serve with syrup or jam.',
    ],
    time: '20 mins',
    difficulty: 'Easy',
    emoji: '🥞',
  },
  {
    id: 3,
    name: 'Cake',
    ingredients: ['Eggs', 'Milk', 'Flour', 'Sugar', 'Butter'],
    instructions: [
      'Preheat oven to 180°C (350°F). Grease a cake tin.',
      'Cream butter and sugar together until light and fluffy.',
      'Add eggs one at a time, beating well after each addition.',
      'Fold in flour alternately with milk until smooth batter forms.',
      'Pour into tin and bake for 35–40 minutes until a skewer comes out clean.',
      'Let cool completely before slicing and serving.',
    ],
    time: '45 mins',
    difficulty: 'Medium',
    emoji: '🎂',
  },
  {
    id: 4,
    name: 'Banana Smoothie',
    ingredients: ['Milk', 'Banana', 'Honey'],
    instructions: [
      'Peel the banana and break into chunks.',
      'Add banana, milk, and honey to a blender.',
      'Blend on high for 30–60 seconds until smooth and creamy.',
      'Taste and add more honey if desired.',
      'Pour into a glass and serve immediately.',
    ],
    time: '5 mins',
    difficulty: 'Easy',
    emoji: '🍌',
  },
  {
    id: 5,
    name: 'French Toast',
    ingredients: ['Eggs', 'Milk', 'Bread', 'Butter'],
    instructions: [
      'Whisk together eggs and milk in a shallow bowl.',
      'Dip bread slices into the egg mixture, coating both sides well.',
      'Heat butter in a pan over medium heat until melted.',
      'Cook the soaked bread for 2–3 minutes per side until golden brown.',
      'Serve with powdered sugar, maple syrup, or fresh fruit.',
    ],
    time: '15 mins',
    difficulty: 'Easy',
    emoji: '🍞',
  },
  {
    id: 6,
    name: 'Vegetable Stir Fry',
    ingredients: ['Carrot', 'Onion', 'Tomato', 'Garlic', 'Oil'],
    instructions: [
      'Chop all vegetables into bite-sized pieces.',
      'Heat oil in a wok or large pan over high heat.',
      'Add garlic and onions, stir-fry for 1 minute until fragrant.',
      'Add carrots and cook for 2 minutes, then add tomatoes.',
      'Season with salt, soy sauce, and pepper to taste.',
      'Stir-fry for another 2 minutes until vegetables are tender-crisp.',
      'Serve hot over rice or noodles.',
    ],
    time: '20 mins',
    difficulty: 'Medium',
    emoji: '🥕',
  },
  {
    id: 7,
    name: 'Khichdi',
    ingredients: ['Rice', 'Lentils', 'Onion', 'Tomato', 'Garlic'],
    instructions: [
      'Rinse rice and lentils thoroughly. Soak for 15 minutes.',
      'Heat oil in a pressure cooker. Add cumin seeds and bay leaf.',
      'Add diced onions and fry until golden. Add garlic and cook 1 minute.',
      'Add chopped tomatoes, turmeric, and salt. Cook until mushy.',
      'Drain rice and lentils, add to pot with 3 cups water.',
      'Pressure cook for 3 whistles or cook covered for 20–25 minutes.',
      'Top with ghee and serve with yogurt or pickle.',
    ],
    time: '30 mins',
    difficulty: 'Easy',
    emoji: '🍲',
  },
  {
    id: 8,
    name: 'Dahi Rice',
    ingredients: ['Rice', 'Yogurt', 'Salt'],
    instructions: [
      'Cook rice until soft and let it cool to room temperature.',
      'Mix cooled rice with yogurt until well combined.',
      'Season with salt to taste.',
      'Optionally, temper with mustard seeds and curry leaves in oil.',
      'Serve as a cooling meal, great for hot days.',
    ],
    time: '10 mins',
    difficulty: 'Easy',
    emoji: '🍚',
  },
  {
    id: 9,
    name: 'Egg Fried Rice',
    ingredients: ['Rice', 'Eggs', 'Onion', 'Garlic', 'Oil'],
    instructions: [
      'Cook and cool rice beforehand (day-old rice works best).',
      'Heat oil in a wok over high heat. Scramble the eggs and set aside.',
      'In the same wok, fry garlic and onion for 1 minute.',
      'Add cold rice and spread evenly, stirring frequently for 3 minutes.',
      'Add scrambled eggs back, season with soy sauce and salt.',
      'Toss everything together and serve hot.',
    ],
    time: '15 mins',
    difficulty: 'Easy',
    emoji: '🍳',
  },
  {
    id: 10,
    name: 'Tomato Soup',
    ingredients: ['Tomato', 'Onion', 'Garlic', 'Butter'],
    instructions: [
      'Roughly chop tomatoes, onion, and garlic.',
      'Melt butter in a pot. Sauté onion and garlic until soft.',
      'Add tomatoes and cook for 10 minutes until broken down.',
      'Add 2 cups water or broth and bring to a boil.',
      'Simmer for 10 minutes, then blend until smooth.',
      'Season with salt, pepper, and a pinch of sugar. Serve with bread.',
    ],
    time: '25 mins',
    difficulty: 'Easy',
    emoji: '🍅',
  },
  {
    id: 11,
    name: 'Bread Butter Toast',
    ingredients: ['Bread', 'Butter'],
    instructions: [
      'Toast the bread slices in a toaster or pan until golden and crisp.',
      'Spread butter generously while the toast is still hot.',
      'Optionally add jam, honey, or cream cheese on top.',
      'Serve immediately with tea or coffee.',
    ],
    time: '5 mins',
    difficulty: 'Easy',
    emoji: '🍞',
  },
  {
    id: 12,
    name: 'Yogurt Lassi',
    ingredients: ['Yogurt', 'Milk', 'Sugar'],
    instructions: [
      'Add yogurt, milk, and sugar to a blender.',
      'Blend for 30 seconds until frothy.',
      'Add a pinch of cardamom or rose water for flavor if desired.',
      'Pour into glasses with ice and serve cold.',
    ],
    time: '5 mins',
    difficulty: 'Easy',
    emoji: '🥛',
  },
  {
    id: 13,
    name: 'Onion Pakora',
    ingredients: ['Onion', 'Flour', 'Oil', 'Salt'],
    instructions: [
      'Thinly slice onions and place in a bowl.',
      'Add flour (chickpea flour preferred), salt, chili, and spices.',
      'Mix well — the onion moisture usually binds the batter (add tiny drops of water if needed).',
      'Heat oil in a deep pan over medium-high heat.',
      'Drop small portions of the mixture into hot oil and fry until golden and crisp.',
      'Drain on paper towels and serve with chutney.',
    ],
    time: '20 mins',
    difficulty: 'Medium',
    emoji: '🧅',
  },
  {
    id: 14,
    name: 'Garlic Butter Pasta',
    ingredients: ['Butter', 'Garlic', 'Salt', 'Oil'],
    instructions: [
      'Boil pasta in salted water until al dente. Reserve ½ cup pasta water.',
      'Melt butter with oil in a pan over medium heat.',
      'Add minced garlic and sauté until golden and fragrant (1–2 min).',
      'Toss drained pasta in the garlic butter. Splash pasta water to loosen.',
      'Season with salt and pepper. Top with parsley if available.',
      'Serve immediately.',
    ],
    time: '20 mins',
    difficulty: 'Easy',
    emoji: '🍝',
  },
  {
    id: 15,
    name: 'Rice Pudding (Kheer)',
    ingredients: ['Rice', 'Milk', 'Sugar'],
    instructions: [
      'Bring milk to a boil in a heavy-bottomed pot.',
      'Add washed rice and simmer on low heat, stirring frequently.',
      'Cook for 30–40 minutes until rice is fully cooked and pudding thickens.',
      'Add sugar and stir until dissolved.',
      'Flavor with cardamom, saffron, or rose water as desired.',
      'Serve warm or chilled, garnished with nuts.',
    ],
    time: '45 mins',
    difficulty: 'Medium',
    emoji: '🍚',
  },
  {
    id: 16,
    name: 'Scrambled Eggs',
    ingredients: ['Eggs', 'Butter', 'Salt', 'Milk'],
    instructions: [
      'Crack eggs into a bowl, add a splash of milk, salt, and pepper.',
      'Whisk vigorously until fully combined and slightly frothy.',
      'Melt butter in a non-stick pan over low-medium heat.',
      'Pour in egg mixture. Stir gently with a spatula as it cooks.',
      'Remove from heat while still slightly underdone — it will finish cooking.',
      'Serve immediately on toast or with vegetables.',
    ],
    time: '8 mins',
    difficulty: 'Easy',
    emoji: '🥚',
  },
  {
    id: 17,
    name: 'Lentil Soup (Dal)',
    ingredients: ['Lentils', 'Tomato', 'Onion', 'Garlic', 'Oil'],
    instructions: [
      'Rinse lentils and boil with 3 cups water until fully cooked (15–20 min).',
      'In a separate pan, heat oil. Fry onion and garlic until golden.',
      'Add chopped tomatoes, cumin, and turmeric. Cook until mushy.',
      'Combine the cooked lentils with the tomato mixture.',
      'Simmer together for 5 minutes. Adjust consistency with water if needed.',
      'Season with salt and serve with rice or bread.',
    ],
    time: '30 mins',
    difficulty: 'Easy',
    emoji: '🫘',
  },
  {
    id: 18,
    name: 'Carrot Halwa',
    ingredients: ['Carrot', 'Milk', 'Sugar', 'Butter'],
    instructions: [
      'Grate 4 large carrots finely.',
      'Cook grated carrots in milk over medium heat, stirring frequently.',
      'Simmer until all the milk is absorbed (20–25 min).',
      'Add sugar and butter. Stir continuously for 5–7 minutes.',
      'Cook until mixture pulls away from the sides of the pan.',
      'Garnish with nuts and cardamom. Serve warm.',
    ],
    time: '40 mins',
    difficulty: 'Medium',
    emoji: '🥕',
  },
  {
    id: 19,
    name: 'Honey Milk',
    ingredients: ['Milk', 'Honey'],
    instructions: [
      'Warm the milk in a saucepan over low heat — do not boil.',
      'Pour warm milk into a mug.',
      'Stir in a tablespoon of honey until fully dissolved.',
      'Optionally add a pinch of turmeric or cinnamon.',
      'Serve warm as a soothing bedtime drink.',
    ],
    time: '5 mins',
    difficulty: 'Easy',
    emoji: '🍯',
  },
  {
    id: 20,
    name: 'Vegetable Soup',
    ingredients: ['Carrot', 'Onion', 'Tomato', 'Garlic', 'Oil', 'Salt'],
    instructions: [
      'Dice all vegetables into small cubes.',
      'Heat oil in a pot. Sauté garlic and onion until softened.',
      'Add carrots and cook for 3 minutes.',
      'Add tomatoes, 4 cups of water or broth, and seasoning.',
      'Bring to a boil, then simmer for 20 minutes until vegetables are tender.',
      'Adjust seasoning and serve hot with crusty bread.',
    ],
    time: '30 mins',
    difficulty: 'Easy',
    emoji: '🥣',
  },
];

// Urdu ingredient name map for smart message banner
const URDU_INGREDIENT_MAP = {
  milk: 'doodh',
  eggs: 'anday',
  bread: 'double roti',
  butter: 'makhan',
  flour: 'atta',
  sugar: 'cheeni',
  rice: 'chawal',
  lentils: 'dal',
  yogurt: 'dahi',
  tomato: 'tamatar',
  onion: 'pyaz',
  garlic: 'lehsun',
  carrot: 'gajar',
  banana: 'kela',
  honey: 'shehad',
  oil: 'tel',
  salt: 'namak',
};

export const getRecipeSuggestions = (pantryItems) => {
  const nearExpiry = pantryItems
    .filter((item) => item.status === 'active' && getDaysLeft(item.expiryDate) <= 3)
    .map((item) => item.name.toLowerCase());

  return RECIPE_DATABASE.map((recipe) => {
    const matched = recipe.ingredients.filter((ing) =>
      nearExpiry.some((item) => item.includes(ing.toLowerCase()) || ing.toLowerCase().includes(item))
    );
    return { ...recipe, matchCount: matched.length, matchedIngredients: matched };
  })
    .filter((recipe) => recipe.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount);
};

export const getAllRecipes = () => RECIPE_DATABASE.map((r) => ({ ...r, matchCount: 0, matchedIngredients: [] }));

export const generateUrduMessage = (nearExpiryItems, matchedRecipes) => {
  if (nearExpiryItems.length === 0) return null;

  const urduNames = nearExpiryItems.slice(0, 3).map((item) => {
    const key = item.name.toLowerCase();
    return URDU_INGREDIENT_MAP[key] || item.name;
  });

  const recipeNames = matchedRecipes.slice(0, 3).map((r) => r.name);

  const itemsStr = urduNames.length === 1
    ? urduNames[0]
    : urduNames.slice(0, -1).join(', ') + ' aur ' + urduNames[urduNames.length - 1];

  const recipesStr = recipeNames.length === 1
    ? recipeNames[0]
    : recipeNames.slice(0, -1).join(', ') + ' ya ' + recipeNames[recipeNames.length - 1];

  if (recipeNames.length === 0) {
    return `Aap ke paas ${itemsStr} hain jo expiry ke qareeb hain — inhe jaldi use karein!`;
  }

  return `Aap ke paas ${itemsStr} hain jo expiry ke qareeb hain — aap ${recipesStr} bana sakte hain.`;
};
