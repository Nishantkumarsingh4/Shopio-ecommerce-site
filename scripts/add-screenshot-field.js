const mysql = require('mysql2/promise');
require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

const dbConfig = {
    host: DB_HOST || 'localhost',
    user: DB_USER || 'root',
    password: DB_PASSWORD || '',
    port: parseInt(DB_PORT || '3306'),
    database: DB_NAME || 'ecommerce_db'
};

(async () => {
    console.log('🔄 Connecting to MySQL for screenshot migration...');
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        console.log('🏗️ Updating Order table...');
        // Add paymentScreenshot column if it doesn't exist
        const [columns] = await connection.query('SHOW COLUMNS FROM `Order` LIKE "paymentScreenshot"');
        if (columns.length === 0) {
            await connection.query('ALTER TABLE `Order` ADD COLUMN paymentScreenshot LONGTEXT AFTER paymentMethod');
            console.log('✅ Added paymentScreenshot to Order table.');
        } else {
            console.log('ℹ️ paymentScreenshot column already exists.');
        }

    } catch (error) {
        console.error('❌ Error during screenshot migration:', error);
    } finally {
        if (connection) await connection.end();
    }
})();
