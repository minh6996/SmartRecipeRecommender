import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const getGoogleClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error('Missing GOOGLE_CLIENT_ID');
  return new OAuth2Client(clientId);
};

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Missing credential' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Missing JWT_SECRET' });
    }

    const client = getGoogleClient();
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.sub) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    const googleSub = payload.sub;
    const email = payload.email || undefined;
    const name = payload.name || undefined;
    const picture = payload.picture || undefined;

    const user = await User.findOneAndUpdate(
      { googleSub },
      {
        $set: {
          googleSub,
          email,
          name,
          picture,
          provider: 'google',
          lastLoginAt: new Date(),
        },
      },
      { new: true, upsert: true }
    );

    const token = jwt.sign(
      { uid: user._id.toString(), email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: err?.message || 'Auth failed' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.uid).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      picture: user.picture,
    },
  });
});

export default router;
