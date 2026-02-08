const mysql = require('mysql2/promise');
require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

const dbConfig = {
    host: DB_HOST || 'localhost',
    user: DB_USER || 'root',
    password: DB_PASSWORD || '',
    port: parseInt(DB_PORT || '3306'),
};

const dbName = DB_NAME || 'ecommerce_db';

(async () => {
    console.log('🔄 Connecting to MySQL server...');
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        console.log(`🔨 Creating database '${dbName}' if not exists...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`✅ Database '${dbName}' ready.`);

        // Switch to the database
        await connection.changeUser({ database: dbName });

        console.log('🏗️ Creating tables...');

        // Users Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS User (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'USER',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Products Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS Product (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        imageUrl VARCHAR(500) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // CartItem Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS CartItem (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        productId INT NOT NULL,
        quantity INT DEFAULT 1,
        FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE
      )
    `);

        // WatchlistItem Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS WatchlistItem (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        productId INT NOT NULL,
        FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE
      )
    `);

        console.log('✅ All tables created successfully (User, Product, CartItem, WatchlistItem).');

    } catch (error) {
        console.error('❌ Error during database setup:', error);
    } finally {
        if (connection) await connection.end();
    }
})();
