const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecommerce_db',
    port: parseInt(process.env.DB_PORT) || 3306,
});

async function migrate() {
    try {
        console.log('Checking for isTrending column in Product table...');

        const [columns] = await pool.query('SHOW COLUMNS FROM Product LIKE "isTrending"');

        if (columns.length === 0) {
            console.log('Adding isTrending column...');
            await pool.query('ALTER TABLE Product ADD COLUMN isTrending BOOLEAN DEFAULT FALSE AFTER available');
            console.log('Migration successful: isTrending column added.');
        } else {
            console.log('isTrending column already exists.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
