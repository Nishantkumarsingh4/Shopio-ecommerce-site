const mysql = require('mysql2/promise');
require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

const dbConfig = {
    host: DB_HOST || 'localhost',
    user: DB_USER || 'root',
    password: DB_PASSWORD || '',
    database: DB_NAME || 'ecommerce_db',
    port: parseInt(DB_PORT || '3306'),
};

async function updateSchema() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('🔧 Updating database schema...');

        // Create CartItem table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS CartItem (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                productId INT NOT NULL,
                quantity INT DEFAULT 1,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
                FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ CartItem table created/verified.');

        // Create WatchlistItem table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS WatchlistItem (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                productId INT NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
                FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_product (userId, productId)
            )
        `);
        console.log('✅ WatchlistItem table created/verified.');

    } catch (error) {
        console.error('❌ Error updating schema:', error);
    } finally {
        if (connection) await connection.end();
    }
}

updateSchema();
