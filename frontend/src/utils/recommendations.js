import { mockRecipes } from '../data/recipes.js';

/**
 * Recommendation algorithm
 * In production: would call GET /api/recommendations
 */
export const getRecommendations = (savedRecipeIds, limit = 10) => {
  if (!savedRecipeIds || savedRecipeIds.length === 0) {
    // No saved recipes - return by popularity
    return mockRecipes
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);
  }

  // Get saved recipes to analyze
  const savedRecipes = mockRecipes.filter(recipe => 
    savedRecipeIds.includes(recipe.id)
  );

  // Build preference profile from saved recipes
  const preferences = {
    cuisines: {},
    tags: {},
    ingredients: {}
  };

  savedRecipes.forEach(recipe => {
    // Count cuisine preferences
    preferences.cuisines[recipe.cuisine] = 
      (preferences.cuisines[recipe.cuisine] || 0) + 1;
    
    // Count tag preferences
    recipe.tags.forEach(tag => {
      preferences.tags[tag] = (preferences.tags[tag] || 0) + 1;
    });
    
    // Count ingredient preferences (simplified - just first word of each ingredient)
    recipe.ingredients.forEach(ingredient => {
      const mainIngredient = ingredient.split(' ')[0].toLowerCase();
      preferences.ingredients[mainIngredient] = 
        (preferences.ingredients[mainIngredient] || 0) + 1;
    });
  });

  // Score unsaved recipes based on preferences
  const scoredRecipes = mockRecipes
    .filter(recipe => !savedRecipeIds.includes(recipe.id))
    .map(recipe => {
      let score = 0;

      // Score by cuisine match
      if (preferences.cuisines[recipe.cuisine]) {
        score += preferences.cuisines[recipe.cuisine] * 3;
      }

      // Score by tag matches
      recipe.tags.forEach(tag => {
        if (preferences.tags[tag]) {
          score += preferences.tags[tag] * 2;
        }
      });

      // Score by ingredient matches
      recipe.ingredients.forEach(ingredient => {
        const mainIngredient = ingredient.split(' ')[0].toLowerCase();
        if (preferences.ingredients[mainIngredient]) {
          score += preferences.ingredients[mainIngredient];
        }
      });

      // Add some popularity boost
      score += recipe.popularity * 0.1;

      return { ...recipe, score };
    });

  // Sort by score and return top recommendations
  return scoredRecipes
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

/**
 * Filter recipes by search query and tags
 */
export const filterRecipes = (recipes, searchQuery, selectedTags) => {
  return recipes.filter(recipe => {
    // Filter by search query (title or tags)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = recipe.title.toLowerCase().includes(query) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(query)) ||
        recipe.cuisine.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      const hasSelectedTag = selectedTags.some(tag => 
        recipe.tags.includes(tag)
      );
      if (!hasSelectedTag) return false;
    }

    return true;
  });
};

/**
 * Get all unique tags from recipes
 */
export const getAllTags = () => {
  const tagSet = new Set();
  mockRecipes.forEach(recipe => {
    recipe.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};

/**
 * Get all unique cuisines from recipes
 */
export const getAllCuisines = () => {
  const cuisineSet = new Set();
  mockRecipes.forEach(recipe => {
    cuisineSet.add(recipe.cuisine);
  });
  return Array.from(cuisineSet).sort();
};
