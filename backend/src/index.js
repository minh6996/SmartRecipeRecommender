import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import recipesRoutes from './routes/recipes.js';
import interactionsRoutes from './routes/interactions.js';
import { connectDb } from './db.js';

const app = express();

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const allowedOrigins = frontendOrigin
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      if (origin.startsWith('http://localhost:')) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/interactions', interactionsRoutes);

await connectDb();

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
