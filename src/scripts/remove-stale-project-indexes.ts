import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI as string;
const COLLECTION_NAME = 'projects';
const STALE_INDEX_NAME = 'slug_1';

async function removeStaleProjectIndexes() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db!;
    const collections = await db.listCollections({ name: COLLECTION_NAME }).toArray();

    if (collections.length === 0) {
      console.log(`Collection "${COLLECTION_NAME}" does not exist — nothing to do.`);
      process.exit(0);
    }

    const indexes = await db.collection(COLLECTION_NAME).indexes();
    const staleIndex = indexes.find((idx) => idx.name === STALE_INDEX_NAME);

    if (!staleIndex) {
      console.log(`Stale index "${STALE_INDEX_NAME}" not found — already clean.`);
      process.exit(0);
    }

    console.log(`Found stale index "${STALE_INDEX_NAME}" (key: ${JSON.stringify(staleIndex.key)})`);
    await db.collection(COLLECTION_NAME).dropIndex(STALE_INDEX_NAME);
    console.log(`Successfully dropped stale index "${STALE_INDEX_NAME}"`);

    const remaining = await db.collection(COLLECTION_NAME).indexes();
    console.log(`Remaining indexes on "${COLLECTION_NAME}":`);
    for (const idx of remaining) {
      console.log(`  - ${idx.name} (key: ${JSON.stringify(idx.key)})`);
    }
  } catch (error) {
    console.error('Error removing stale project indexes:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

removeStaleProjectIndexes();
