import express from 'express';
import mongoose from 'mongoose';
import { Recipe } from '../models/Recipe.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', requireAuth, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, cuisine, cookingTime } = req.body;
    let { tags, ingredients, steps } = req.body;

    if (!title || !cuisine || !cookingTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Parse array fields if they come as strings (from FormData)
    if (typeof tags === 'string') tags = tags.split(',').map(s => s.trim()).filter(Boolean);
    if (typeof ingredients === 'string') ingredients = ingredients.split('\n').map(s => s.trim()).filter(Boolean);
    if (typeof steps === 'string') steps = steps.split('\n').map(s => s.trim()).filter(Boolean);

    // Get Cloudinary URL from file
    const imageUrl = req.file ? req.file.path : '';

    const lastRecipe = await Recipe.findOne().sort({ id: -1 });
    const newId = (lastRecipe?.id || 0) + 1;

    const recipe = await Recipe.create({
      id: newId,
      title,
      cuisine,
      cookingTime: Number(cookingTime),
      tags: Array.isArray(tags) ? tags : [],
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      steps: Array.isArray(steps) ? steps : [],
      imageUrl,
      popularity: 0,
    });

    return res.status(201).json({ item: recipe });
  } catch (err) {
    return res.status(500).json({ message: err?.message || 'Failed to create recipe' });
  }
});

router.put('/:id', requireAuth, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid ID' });

    const recipe = await Recipe.findOne({ id });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const { title, cuisine, cookingTime } = req.body;
    let { tags, ingredients, steps } = req.body;

    // Parse array fields if string
    if (typeof tags === 'string') tags = tags.split(',').map(s => s.trim()).filter(Boolean);
    if (typeof ingredients === 'string') ingredients = ingredients.split('\n').map(s => s.trim()).filter(Boolean);
    if (typeof steps === 'string') steps = steps.split('\n').map(s => s.trim()).filter(Boolean);

    // Update fields if provided
    if (title) recipe.title = title;
    if (cuisine) recipe.cuisine = cuisine;
    if (cookingTime) recipe.cookingTime = Number(cookingTime);
    if (tags) recipe.tags = tags;
    if (ingredients) recipe.ingredients = ingredients;
    if (steps) recipe.steps = steps;

    // Update image only if new one uploaded
    if (req.file) {
      recipe.imageUrl = req.file.path;
    } else if (req.body.imageUrl && req.body.imageUrl !== recipe.imageUrl) {
      // Allow updating link if sending URL string (legacy support)
      recipe.imageUrl = req.body.imageUrl;
    }

    await recipe.save();

    return res.json({ item: recipe });
  } catch (err) {
    return res.status(500).json({ message: err?.message || 'Failed to update recipe' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid ID' });

    const result = await Recipe.deleteOne({ id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    return res.json({ success: true, id });
  } catch (err) {
    return res.status(500).json({ message: err?.message || 'Failed to delete recipe' });
  }
});

router.get('/', async (req, res) => {
  try {
    const idsParam = (req.query.ids || '').toString().trim();
    const search = (req.query.search || '').toString().trim();
    const tagsParam = (req.query.tags || '').toString().trim();
    const cuisine = (req.query.cuisine || '').toString().trim();

    const limit = Math.min(Number(req.query.limit || 100), 500);
    const page = Math.max(Number(req.query.page || 1), 1);
    const skip = (page - 1) * limit;

    const query = {};

    if (idsParam) {
      const rawIds = idsParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const numericIds = rawIds
        .map((s) => Number(s))
        .filter((n) => Number.isFinite(n));

      const objectIds = rawIds
        .filter((s) => mongoose.isValidObjectId(s))
        .map((s) => new mongoose.Types.ObjectId(s));

      if (numericIds.length === 0 && objectIds.length === 0) {
        return res.json({ items: [], total: 0, page: 1, limit });
      }

      const or = [];
      if (numericIds.length > 0) or.push({ id: { $in: numericIds } });
      if (objectIds.length > 0) or.push({ _id: { $in: objectIds } });

      const items = await Recipe.find(or.length === 1 ? or[0] : { $or: or })
        .sort({ popularity: -1, id: 1 })
        .lean();

      return res.json({ items, total: items.length, page: 1, limit: items.length });
    }

    if (cuisine) {
      query.cuisine = cuisine;
    }

    const tags = tagsParam
      ? tagsParam
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
      : [];

    if (tags.length > 0) {
      query.tags = { $in: tags };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } },
        { tags: { $elemMatch: { $regex: search, $options: 'i' } } },
      ];
    }

    const [items, total] = await Promise.all([
      Recipe.find(query).sort({ popularity: -1, id: 1 }).skip(skip).limit(limit).lean(),
      Recipe.countDocuments(query),
    ]);

    return res.json({ items, total, page, limit });
  } catch (err) {
    return res.status(500).json({ message: err?.message || 'Failed to fetch recipes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const recipeId = Number(req.params.id);
    if (!Number.isFinite(recipeId)) {
      return res.status(400).json({ message: 'Invalid recipe id' });
    }

    const recipe = await Recipe.findOne({ id: recipeId }).lean();
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    return res.json({ item: recipe });
  } catch (err) {
    return res.status(500).json({ message: err?.message || 'Failed to fetch recipe' });
  }
});

export default router;
