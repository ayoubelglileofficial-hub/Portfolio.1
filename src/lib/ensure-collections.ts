import mongoose from 'mongoose';

const collections: {
  name: string;
  indexes: { spec: Record<string, unknown>; options?: Record<string, unknown> }[];
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
      { spec: { slug: 1 }, options: { unique: true } },
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
      } catch {
        // index may already exist
      }
    }
  }

  ensured = true;
  console.log('[DB] All collections synced');
}
