import mongoose from 'mongoose';
import type { IndexSpecification, CreateIndexesOptions } from 'mongodb';

const collections: {
  name: string;
  indexes: { spec: IndexSpecification; options?: CreateIndexesOptions }[];
}[] = [
  {
    name: 'profiles',
    indexes: [{ spec: { _id: 1 } }],
  },
  {
    name: 'users',
    indexes: [
      { spec: { email: 1 }, options: { unique: true } },
    ],
  },
  {
    name: 'skills',
    indexes: [
      { spec: { slug: 1 }, options: { unique: true } },
      { spec: { category: 1 } },
      { spec: { order_index: 1 } },
    ],
  },
  {
    name: 'experiences',
    indexes: [
      { spec: { order_index: 1 } },
      { spec: { is_current: 1 } },
    ],
  },
  {
    name: 'education',
    indexes: [
      { spec: { order_index: 1 } },
    ],
  },
  {
    name: 'projects',
    indexes: [
      // slug index was removed from the schema — no longer created here
      { spec: { category: 1 } },
      { spec: { featured: 1 } },
      { spec: { order_index: 1 } },
    ],
  },
  {
    name: 'services',
    indexes: [{ spec: { slug: 1 }, options: { unique: true } }],
  },
  {
    name: 'testimonials',
    indexes: [{ spec: { is_approved: 1 } }],
  },
  {
    name: 'resumes',
    indexes: [{ spec: { profile_id: 1 } }],
  },
  {
    name: 'social_links',
    indexes: [{ spec: { platform: 1 }, options: { unique: true } }],
  },
  {
    name: 'contactmessages',
    indexes: [{ spec: { created_at: -1 } }],
  },
  {
    name: 'project_technologies',
    indexes: [
      { spec: { project_id: 1 } },
      { spec: { technology_id: 1 } },
    ],
  },
  {
    name: 'project_images',
    indexes: [{ spec: { project_id: 1 } }],
  },
];

let ensured = false;

function specMatches(a: IndexSpecification, b: Record<string, unknown>): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => k in b && (a as Record<string, unknown>)[k] === b[k]);
}

export default async function ensureCollections() {
  if (ensured) return;
  if (!mongoose.connection.db) {
    console.warn('[DB] No connection available for collection sync');
    return;
  }

  const db = mongoose.connection.db;
  const existing = await db.listCollections().toArray();
  const existingNames = new Set(existing.map((c) => c.name));

  for (const col of collections) {
    if (!existingNames.has(col.name)) {
      await db.createCollection(col.name);
      console.log(`[DB] Created collection: ${col.name}`);
    }

    for (const idx of col.indexes) {
      try {
        await db.collection(col.name).createIndex(idx.spec, {
          background: true,
          ...idx.options,
        });
        console.log(`[DB] Ensured index on ${col.name}: ${JSON.stringify(idx.spec)}`);
      } catch (err) {
        console.error(`[DB] Failed to create index on ${col.name}:`, err);
      }
    }
  }

  // Remove stale indexes that exist in the database but are no longer declared
  for (const col of collections) {
    const collection = db.collection(col.name);
    const existingIndexes = await collection.indexes();
    const validSpecs = col.indexes.map((idx) => idx.spec);

    for (const index of existingIndexes) {
      if (index.name === '_id_') continue;

      const isDeclared = validSpecs.some((spec) =>
        specMatches(spec, index.key as Record<string, unknown>),
      );

      if (!isDeclared) {
        console.log(
          `[DB] Dropping stale index "${index.name}" on "${col.name}" (key: ${JSON.stringify(index.key)})`,
        );
        try {
          await collection.dropIndex(index.name);
          console.log(`[DB] Successfully dropped stale index "${index.name}"`);
        } catch (err) {
          console.error(
            `[DB] Failed to drop stale index "${index.name}" on "${col.name}":`,
            err,
          );
          throw err;
        }
      }
    }
  }

  ensured = true;
  console.log('[DB] All collections synced');
}
