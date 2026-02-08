const pool = require('../src/lib/db');
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

async function checkChildImages() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SELECT id, name, category, imageUrl FROM Product WHERE category = "CHILD"');

        console.log('--- Child Products ---');
        rows.forEach(p => console.log(`- [${p.id}] ${p.name}: ${p.imageUrl}`));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) await connection.end();
    }
}

checkChildImages();
