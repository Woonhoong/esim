const fs = require('fs');
const path = require('path');
const db = require('./config/db');

const initDb = async () => {
  try {
    const sqlPath = path.join(__dirname, '../database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('[DB INIT] Running database migrations...');
    await db.query(sql);
    console.log('[DB INIT] Migrations completed successfully.');
  } catch (error) {
    console.error('[DB INIT] Error running migrations:', error.message);
    // Continue even if it fails, maybe tables already exist
  } finally {
    process.exit(0);
  }
};

initDb();
