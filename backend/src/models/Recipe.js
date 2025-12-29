import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true },
    cuisine: { type: String, required: true, index: true },
    cookingTime: { type: Number, required: true },
    tags: { type: [String], default: [], index: true },
    ingredients: { type: [String], default: [] },
    steps: { type: [String], default: [] },
    popularity: { type: Number, default: 0 },
    imageUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);
