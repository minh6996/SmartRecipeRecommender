import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, index: true, sparse: true },
    name: { type: String },
    picture: { type: String },

    googleSub: { type: String, index: true, unique: true, sparse: true },
    provider: { type: String, default: 'google' },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },

    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
