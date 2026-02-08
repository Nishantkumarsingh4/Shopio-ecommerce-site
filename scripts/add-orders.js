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
    console.log('🔄 Connecting to MySQL for migration...');
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        console.log('🏗️ Creating Order table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS \`Order\` (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                productId INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                address TEXT NOT NULL,
                phone VARCHAR(20) NOT NULL,
                pin VARCHAR(10) NOT NULL,
                totalPrice DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'PENDING',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
                FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE
            )
        `);

        console.log('✅ Order table created successfully.');

    } catch (error) {
        console.error('❌ Error during migration:', error);
    } finally {
        if (connection) await connection.end();
    }
})();
