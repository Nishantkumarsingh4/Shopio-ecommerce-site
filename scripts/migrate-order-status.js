const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'ecommerce_db',
        port: parseInt(process.env.DB_PORT || '3306'),
    });

    try {
        console.log('Starting order status migration...');

        // Check if column exists first to avoid ENUM issues in some MySQL versions
        const [columns] = await pool.query('SHOW COLUMNS FROM `Order` LIKE "status"');

        if (columns.length === 0) {
            await pool.query(`
                ALTER TABLE \`Order\` 
                ADD COLUMN status ENUM('PENDING', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING'
                AFTER paymentScreenshot
            `);
            console.log('Added status column.');
        } else {
            console.log('Status column already exists.');
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
