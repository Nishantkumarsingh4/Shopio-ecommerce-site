const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    console.log('Migrating Settings table to use LONGTEXT for settingValue...');

    try {
        // Change settingValue column to LONGTEXT to support large base64 images
        await connection.query('ALTER TABLE Settings MODIFY COLUMN settingValue LONGTEXT');
        console.log('Table Settings successfully updated.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await connection.end();
    }
}

migrate();
