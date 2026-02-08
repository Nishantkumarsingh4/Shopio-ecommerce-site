const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetAdmin() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        console.log('🔄 Resetting admin user...');

        // Delete existing admin users
        await connection.query("DELETE FROM User WHERE role = 'ADMIN'");
        console.log('✅ Deleted existing admin users');

        // Create new admin user
        // Email: admin@shopio.com
        // Password: admin123
        const hashedPassword = '$2b$10$RW2XVC8wrCzfGGXX4gaMpuux.J8nrTV7CLRGk9r.BzIOva3mVblsm';
        await connection.query(
            'INSERT INTO User (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Admin User', 'admin@shopio.com', hashedPassword, 'ADMIN']
        );

        console.log('✅ Admin user created successfully!');
        console.log('');
        console.log('📧 Email: admin@shopio.com');
        console.log('🔑 Password: admin123');
        console.log('🔗 Login at: http://localhost:3000/admin/login');

    } catch (error) {
        console.error('❌ Error resetting admin:', error);
    } finally {
        await connection.end();
    }
}

resetAdmin();
