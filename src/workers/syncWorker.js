const { Worker } = require('bullmq');
const redisConnection = require('../config/redis');
const db = require('../config/db');
const esimService = require('../services/esimService');

const syncWorker = new Worker('sync-queue', async (job) => {
  console.log(`[SYNC WORKER] Processing job: ${job.name}`);
  const multiplier = parseFloat(process.env.MARKUP_MULTIPLIER) || 1.5;

  if (job.name === 'sync-regions') {
    const locationsResponse = await esimService.getLocations();
    if (locationsResponse && locationsResponse.success) {
      const locations = locationsResponse.obj.locationList;
      console.log(`[SYNC WORKER] Synced ${locations.length} regions.`);
      // Depending on actual API response structure, store supported countries here
      // For now, logging the successful sync
    }
  }

  if (job.name === 'sync-packages') {
    // 1. Fetch location list first
    const locationsResponse = await esimService.getLocations();
    if (!locationsResponse || !locationsResponse.success) return;
    
    const locations = locationsResponse.obj.locationList || [];
    let syncedCount = 0;

    for (const loc of locations) {
      const locationCode = loc.locationCode;
      const packagesResponse = await esimService.getPackages(locationCode);
      
      if (packagesResponse && packagesResponse.success) {
        const packages = packagesResponse.obj.packageList || [];
        
        for (const pkg of packages) {
          const providerPrice = parseFloat(pkg.price);
          const sellingPrice = providerPrice * multiplier;

          // Check if package exists to track pricing history
          const { rows } = await db.query('SELECT selling_price FROM esim_packages WHERE package_code = $1', [pkg.packageCode]);
          const existingPrice = rows.length > 0 ? parseFloat(rows[0].selling_price) : null;

          await db.query(`
            INSERT INTO esim_packages (package_code, location_code, name, provider_price, selling_price, data_limit, validity_days, status, last_synced)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'ACTIVE', CURRENT_TIMESTAMP)
            ON CONFLICT (package_code) DO UPDATE
            SET provider_price = EXCLUDED.provider_price,
                selling_price = EXCLUDED.selling_price,
                last_synced = CURRENT_TIMESTAMP
          `, [
            pkg.packageCode,
            locationCode,
            pkg.name || `${pkg.volume} for ${pkg.duration} Days`,
            providerPrice,
            sellingPrice,
            pkg.volume, // assuming volume is data limit
            pkg.duration
          ]);

          if (existingPrice && existingPrice !== sellingPrice) {
            await db.query('INSERT INTO pricing_history (package_code, old_price, new_price) VALUES ($1, $2, $3)', [
              pkg.packageCode, existingPrice, sellingPrice
            ]);
          }
          syncedCount++;
        }
      }
    }
    console.log(`[SYNC WORKER] Synced ${syncedCount} packages across ${locations.length} locations with markup ${multiplier}x.`);
  }
}, { connection: redisConnection });

syncWorker.on('failed', (job, err) => {
  console.error(`[SYNC WORKER] Job ${job.id} failed:`, err.message);
});

module.exports = syncWorker;
