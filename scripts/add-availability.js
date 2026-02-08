const mysql = require('mysql2/promise');
require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

const dbConfig = {
    host: DB_HOST || 'localhost',
    user: DB_USER || 'root',
    password: DB_PASSWORD || '',
    port: parseInt(DB_PORT || '3306'),
    database: DB_NAME || 'ecommerce_db',
};

(async () => {
    console.log('🔄 Adding availability column to Product table...');
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        // Check if column already exists
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME = 'Product' 
            AND COLUMN_NAME = 'available'
        `, [dbConfig.database]);

        if (columns.length > 0) {
            console.log('✅ Column "available" already exists in Product table.');
        } else {
            // Add the availability column
            await connection.query(`
                ALTER TABLE Product 
                ADD COLUMN available BOOLEAN DEFAULT TRUE AFTER imageUrl
            `);
            console.log('✅ Column "available" added to Product table.');
        }

        // Update all existing products to be available by default
        await connection.query(`
            UPDATE Product 
            SET available = TRUE 
            WHERE available IS NULL
        `);
        console.log('✅ All existing products set to available.');

    } catch (error) {
        console.error('❌ Error during migration:', error);
    } finally {
        if (connection) await connection.end();
    }
})();
