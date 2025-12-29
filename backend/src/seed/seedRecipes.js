import 'dotenv/config';
import { connectDb } from '../db.js';
import { Recipe } from '../models/Recipe.js';

const slugify = (value) => {
  return (value || '')
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
};

const getDefaultImageUrl = (recipe) => {
  const base = process.env.RECIPE_IMAGE_BASE_URL || 'https://res.cloudinary.com/dvblbylda/image/upload/v173xxxx/recipes';
  return `${base}/${slugify(recipe?.title)}.jpg`;
};

const run = async () => {
  await connectDb();

  const { mockRecipes } = await import('../../../frontend/src/data/recipes.js');

  const ops = mockRecipes.map((r) => ({
    updateOne: {
      filter: { id: r.id },
      update: [
        {
          $set: {
            ...r,
            imageUrl: {
              $cond: {
                if: {
                  $and: [
                    { $ne: [r.imageUrl || '', ''] },
                    { $ne: [r.imageUrl || null, null] },
                  ],
                },
                then: r.imageUrl,
                else: {
                  $cond: {
                    if: {
                      $or: [
                        { $eq: ['$imageUrl', null] },
                        { $eq: ['$imageUrl', ''] },
                      ],
                    },
                    then: getDefaultImageUrl(r),
                    else: '$imageUrl',
                  },
                },
              },
            },
          },
        },
      ],
      upsert: true,
    },
  }));

  if (ops.length === 0) {
    console.log('No recipes to seed');
    process.exit(0);
  }

  const result = await Recipe.bulkWrite(ops);
  console.log('Seed completed:', {
    insertedCount: result.insertedCount,
    upsertedCount: result.upsertedCount,
    modifiedCount: result.modifiedCount,
    matchedCount: result.matchedCount,
  });

  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
