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
    console.log('🔄 Connecting to MySQL for payment migration...');
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        console.log('🏗️ Updating Order table...');
        // Add paymentMethod column if it doesn't exist
        const [orderColumns] = await connection.query('SHOW COLUMNS FROM `Order` LIKE "paymentMethod"');
        if (orderColumns.length === 0) {
            await connection.query('ALTER TABLE `Order` ADD COLUMN paymentMethod VARCHAR(50) DEFAULT "COD" AFTER totalPrice');
            console.log('✅ Added paymentMethod to Order table.');
        }

        console.log('🏗️ Creating Settings table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                settingKey VARCHAR(100) UNIQUE NOT NULL,
                settingValue TEXT,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Settings table ready.');

        // Initialize QR setting if not present
        await connection.query('INSERT IGNORE INTO Settings (settingKey, settingValue) VALUES ("payment_qr", "")');
        console.log('✅ Initialized payment_qr setting.');

    } catch (error) {
        console.error('❌ Error during payment migration:', error);
    } finally {
        if (connection) await connection.end();
    }
})();
