/**
 * Recommendation algorithm
 * In production: would call GET /api/recommendations
 */
const normalizeTextToTokens = (text) => {
  const raw = (text || '')
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ');
  return raw.split(/\s+/).filter(Boolean);
};

const getRecipeKey = (recipe) => {
  if (recipe && recipe._id != null) return String(recipe._id);
  if (recipe && recipe.id != null) return String(recipe.id);
  return '';
};

const buildRecipeDocTokens = (recipe) => {
  const title = recipe?.title || '';
  const cuisine = recipe?.cuisine || '';
  const tags = Array.isArray(recipe?.tags) ? recipe.tags.join(' ') : '';
  const ingredients = Array.isArray(recipe?.ingredients) ? recipe.ingredients.join(' ') : '';
  return normalizeTextToTokens(`${title} ${cuisine} ${tags} ${ingredients}`);
};

let cachedIndexKey = '';
let cachedIndex = null;

const buildTfidfIndex = (recipes) => {
  const allRecipes = Array.isArray(recipes) ? recipes : [];
  const keys = allRecipes.map(getRecipeKey).filter(Boolean);
  const indexKey = `${allRecipes.length}|${keys.join(',')}`;

  if (cachedIndex && cachedIndexKey === indexKey) {
    return cachedIndex;
  }

  const N = allRecipes.length;
  const vocab = new Map();
  const df = [];
  const docTermCounts = new Map();
  const docLengths = new Map();

  for (const recipe of allRecipes) {
    const rid = getRecipeKey(recipe);
    if (!rid) continue;

    const tokens = buildRecipeDocTokens(recipe);
    docLengths.set(rid, tokens.length || 1);

    const counts = new Map();
    for (const tok of tokens) {
      counts.set(tok, (counts.get(tok) || 0) + 1);
    }
    docTermCounts.set(rid, counts);

    const uniqueTerms = new Set(counts.keys());
    for (const term of uniqueTerms) {
      let idx = vocab.get(term);
      if (idx == null) {
        idx = vocab.size;
        vocab.set(term, idx);
        df[idx] = 0;
      }
      df[idx] += 1;
    }
  }

  const idf = df.map((d) => Math.log(N / d));

  const vectors = new Map();
  const norms = new Map();

  for (const recipe of allRecipes) {
    const rid = getRecipeKey(recipe);
    if (!rid) continue;
    const counts = docTermCounts.get(rid) || new Map();
    const totalTerms = docLengths.get(rid) || 1;

    const vec = new Map();
    let sumSq = 0;

    for (const [term, count] of counts.entries()) {
      const idx = vocab.get(term);
      if (idx == null) continue;
      const tf = count / totalTerms;
      const tfidf = tf * idf[idx];
      if (tfidf === 0) continue;
      vec.set(idx, tfidf);
      sumSq += tfidf * tfidf;
    }

    vectors.set(rid, vec);
    norms.set(rid, Math.sqrt(sumSq));
  }

  cachedIndexKey = indexKey;
  cachedIndex = { indexKey, vectors, norms };
  return cachedIndex;
};

const sparseDot = (a, b) => {
  if (!a || !b) return 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  let sum = 0;
  for (const [k, v] of small.entries()) {
    const bv = large.get(k);
    if (bv != null) sum += v * bv;
  }
  return sum;
};

export const getPersonalizedRecommendations = ({ recipes, userSavedRecipeIds, topK }) => {
  const allRecipes = Array.isArray(recipes) ? recipes : [];
  const k = typeof topK === 'number' && topK > 0 ? Math.floor(topK) : 10;

  const savedSet = new Set((Array.isArray(userSavedRecipeIds) ? userSavedRecipeIds : []).map(String));
  if (savedSet.size === 0) {
    return [...allRecipes]
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, k);
  }

  const { vectors, norms } = buildTfidfIndex(allRecipes);

  const weight = 3;
  const denom = weight * savedSet.size;
  const userVec = new Map();

  for (const rid of savedSet) {
    const v = vectors.get(String(rid));
    if (!v) continue;
    for (const [idx, val] of v.entries()) {
      userVec.set(idx, (userVec.get(idx) || 0) + weight * val);
    }
  }

  if (userVec.size === 0) {
    return [...allRecipes]
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, k);
  }

  for (const [idx, val] of userVec.entries()) {
    userVec.set(idx, val / denom);
  }

  const userNorm = Math.sqrt(sparseDot(userVec, userVec));
  if (!Number.isFinite(userNorm) || userNorm === 0) {
    return [...allRecipes]
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, k);
  }

  let popMin = Infinity;
  let popMax = -Infinity;
  for (const r of allRecipes) {
    const p = typeof r?.popularity === 'number' ? r.popularity : 0;
    if (p < popMin) popMin = p;
    if (p > popMax) popMax = p;
  }
  const eps = 1e-9;

  const scored = [];
  for (const recipe of allRecipes) {
    const rid = getRecipeKey(recipe);
    if (!rid || savedSet.has(String(rid))) continue;

    const vj = vectors.get(rid);
    const normVj = norms.get(rid) || 0;
    const sim = normVj > 0 ? sparseDot(userVec, vj) / (userNorm * normVj) : 0;

    const p = typeof recipe?.popularity === 'number' ? recipe.popularity : 0;
    const popNorm = (p - popMin) / (popMax - popMin + eps);

    let ctx = 0;
    if (typeof recipe?.cookingTime === 'number' && recipe.cookingTime <= 30) {
      ctx += 0.05;
    }

    const score = 0.7 * sim + 0.2 * popNorm + 0.1 * ctx;
    scored.push({ recipe, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).map((x) => x.recipe);
};

export const getRecommendations = (recipes, savedRecipeIds, limit = 10) => {
  const allRecipes = Array.isArray(recipes) ? recipes : [];
  const saved = Array.isArray(savedRecipeIds) ? savedRecipeIds : [];

  const userSavedRecipeIds = saved
    .map((sid) => {
      const match = allRecipes.find((r) => String(r?.id) === String(sid));
      return match ? getRecipeKey(match) : String(sid);
    })
    .filter(Boolean);

  return getPersonalizedRecommendations({
    recipes: allRecipes,
    userSavedRecipeIds,
    topK: limit,
  });
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
export const getAllTags = (recipes) => {
  const tagSet = new Set();
  (Array.isArray(recipes) ? recipes : []).forEach(recipe => {
    recipe.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};

/**
 * Get all unique cuisines from recipes
 */
export const getAllCuisines = (recipes) => {
  const cuisineSet = new Set();
  (Array.isArray(recipes) ? recipes : []).forEach(recipe => {
    cuisineSet.add(recipe.cuisine);
  });
  return Array.from(cuisineSet).sort();
};
