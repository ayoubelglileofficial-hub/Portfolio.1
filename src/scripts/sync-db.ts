import connectDB from '../lib/mongodb';
// ensureCollections is called automatically inside connectDB

async function syncDB() {
  console.log('[Sync] Connecting to MongoDB...');
  await connectDB();
  console.log('[Sync] Done');
  process.exit(0);
}

syncDB().catch((err) => {
  console.error('[Sync] Failed:', err);
  process.exit(1);
});
