const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        const [columns] = await connection.query('DESCRIBE Settings');
        console.log(JSON.stringify(columns, null, 2));
    } catch (error) {
        console.error('Check failed:', error);
    } finally {
        await connection.end();
    }
}

check();
