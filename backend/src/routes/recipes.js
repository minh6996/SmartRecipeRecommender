import express from 'express';
import mongoose from 'mongoose';
import { Recipe } from '../models/Recipe.js';

const router = express.Router();

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
