import express from 'express';
import mongoose from 'mongoose';
import { requireAuth } from '../middleware/auth.js';
import { Interaction } from '../models/Interaction.js';
import { Recipe } from '../models/Recipe.js';

const router = express.Router();

const parseRecipeObjectId = async (recipeIdOrNumber) => {
  if (recipeIdOrNumber == null) return null;

  // Accept ObjectId string
  if (typeof recipeIdOrNumber === 'string' && mongoose.isValidObjectId(recipeIdOrNumber)) {
    return new mongoose.Types.ObjectId(recipeIdOrNumber);
  }

  // Accept number or numeric string: lookup Recipe by its numeric id field
  const asNumber = Number(recipeIdOrNumber);
  if (Number.isFinite(asNumber)) {
    const recipe = await Recipe.findOne({ id: asNumber }).select('_id').lean();
    return recipe?._id ? new mongoose.Types.ObjectId(recipe._id) : null;
  }

  return null;
};

// Create an interaction (e.g. save)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { recipeId, recipeNumericId, type, weight } = req.body || {};

    if (!type) {
      return res.status(400).json({ message: 'Missing type' });
    }

    const resolvedRecipeId = await parseRecipeObjectId(recipeId ?? recipeNumericId);
    if (!resolvedRecipeId) {
      return res.status(400).json({ message: 'Invalid recipeId' });
    }

    const userId = req.user?.uid;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({ message: 'Invalid user in token' });
    }

    const doc = await Interaction.create({
      userId: new mongoose.Types.ObjectId(userId),
      recipeId: resolvedRecipeId,
      type,
      weight: typeof weight === 'number' ? weight : 1,
      createdAt: new Date(),
    });

    return res.status(201).json({
      item: {
        id: doc._id.toString(),
        userId: doc.userId.toString(),
        recipeId: doc.recipeId.toString(),
        type: doc.type,
        weight: doc.weight,
        createdAt: doc.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err?.message || 'Failed to create interaction' });
  }
});

// Delete exactly one matching interaction (e.g. unsave)
router.delete('/', requireAuth, async (req, res) => {
  try {
    const { recipeId, recipeNumericId, type } = req.body || {};

    const resolvedRecipeId = await parseRecipeObjectId(recipeId ?? recipeNumericId);
    if (!resolvedRecipeId) {
      return res.status(400).json({ message: 'Invalid recipeId' });
    }

    const userId = req.user?.uid;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({ message: 'Invalid user in token' });
    }

    const deleted = await Interaction.findOneAndDelete(
      {
        userId: new mongoose.Types.ObjectId(userId),
        recipeId: resolvedRecipeId,
        type: (type || 'save').toString(),
      },
      { sort: { createdAt: -1, _id: -1 } }
    ).lean();

    if (!deleted) {
      return res.json({ deleted: null });
    }

    return res.json({
      deleted: {
        id: deleted._id.toString(),
        userId: deleted.userId.toString(),
        recipeId: deleted.recipeId.toString(),
        type: deleted.type,
        weight: deleted.weight,
        createdAt: deleted.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err?.message || 'Failed to delete interaction' });
  }
});

// Get current user's interactions (optional helper)
router.get('/me', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({ message: 'Invalid user in token' });
    }

    const type = (req.query.type || '').toString().trim();
    const query = { userId: new mongoose.Types.ObjectId(userId) };
    if (type) query.type = type;

    const items = await Interaction.find(query).sort({ createdAt: -1 }).limit(500).lean();
    return res.json({ items });
  } catch (err) {
    return res.status(500).json({ message: err?.message || 'Failed to fetch interactions' });
  }
});

export default router;
