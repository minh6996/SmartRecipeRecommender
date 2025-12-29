import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true, index: true },
    type: { type: String, required: true, index: true },
    weight: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

interactionSchema.index({ userId: 1, recipeId: 1, type: 1 });

export const Interaction =
  mongoose.models.Interaction || mongoose.model('Interaction', interactionSchema);
