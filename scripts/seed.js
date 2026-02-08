const pool = require('../src/lib/db'); // We can't use ES6 modules easily in scripts without babel, so we'll just use the mysql2 driver directly here for seeding.
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

async function main() {
    console.log('🌱 Seeding database...');

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('🧹 Clearing existing products...');
        await connection.query('DELETE FROM Product');


        const products = [
            // --- MEN ---
            {
                name: "Classic Leather Jacket",
                description: "Premium genuine leather jacket with a modern fit. Perfect for casual or semi-formal occasions.",
                price: 199.99,
                category: "MEN",
                imageUrl: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80",
            },
            {
                name: "Slim Fit Chinos",
                description: "Tailored slim fit chinos made from breathable cotton blend fabric. Available in beige.",
                price: 49.99,
                category: "MEN",
                imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
            },
            {
                name: "Casual Denim Shirt",
                description: "Rugged yet stylish denim shirt, stone-washed for a vintage look.",
                price: 59.99,
                category: "MEN",
                imageUrl: "https://images.unsplash.com/photo-1589642380614-4a8c2147b857?w=800&q=80",
            },
            {
                name: "Running Sneakers",
                description: "High-performance running shoes with cushioned soles for maximum comfort.",
                price: 89.99,
                category: "MEN",
                imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
            },
            {
                name: "Minimalist Wrist Watch",
                description: "Elegant analog watch with a leather strap. A perfect accessory for any outfit.",
                price: 129.99,
                category: "MEN",
                imageUrl: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80",
            },

            // --- WOMEN ---
            {
                name: "Floral Summer Dress",
                description: "Light and breezy floral print dress, ideal for summer outings and beach parties.",
                price: 79.99,
                category: "WOMEN",
                imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
            },
            {
                name: "Designer Leather Handbag",
                description: "Luxury leather handbag with gold-tone hardware. Spacious and stylish.",
                price: 299.99,
                category: "WOMEN",
                imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
            },
            {
                name: "Elegant Heels",
                description: "Classic black stilettos that add a touch of sophistication to your evening wear.",
                price: 89.99,
                category: "WOMEN",
                imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
            },
            {
                name: "Cozy Knit Sweater",
                description: "Soft and warm oversized knit sweater, perfect for chilly days.",
                price: 64.99,
                category: "WOMEN",
                imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
            },
            {
                name: "Gold Plated Necklace",
                description: "Delicate gold-plated necklace with a minimalist pendant.",
                price: 45.99,
                category: "WOMEN",
                imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
            },

            // --- CHILD ---
            {
                name: "Superhero Graphic T-Shirt",
                description: "Vibrant cotton t-shirt with their favorite superhero print.",
                price: 19.99,
                category: "CHILD",
                imageUrl: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&q=80",
            },
            {
                name: "Comfortable Kids Sneakers",
                description: "Durable and colorful sneakers designed for active kids.",
                price: 39.99,
                category: "CHILD",
                imageUrl: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&q=80",
            },
            {
                name: "School Backpack",
                description: "Spacious backpack with multiple compartments, perfect for school books and snacks.",
                price: 29.99,
                category: "CHILD",
                imageUrl: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=80",
            },
            {
                name: "Cute Denim Overalls",
                description: "Classic denim overalls with adjustable straps for growing kids.",
                price: 34.99,
                category: "CHILD",
                imageUrl: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80",
            },

            // --- GROCERY ---
            {
                name: "Fresh Organic Apples (1kg)",
                description: "Crisp and juicy organic red apples, hand-picked from local orchards.",
                price: 4.99,
                category: "GROCERY",
                imageUrl: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=800&q=80",
            },
            {
                name: "Whole Wheat Bread",
                description: "Freshly baked artisan whole wheat bread, rich in fiber.",
                price: 2.49,
                category: "GROCERY",
                imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
            },
            {
                name: "Organic Avocados (Pack of 3)",
                description: "Creamy and ripe organic avocados, perfect for toast or guacamole.",
                price: 5.99,
                category: "GROCERY",
                imageUrl: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&q=80",
            },
            {
                name: "Farm Fresh Milk (1L)",
                description: "Pasteurized whole milk from grass-fed cows.",
                price: 1.99,
                category: "GROCERY",
                imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80",
            },
            {
                name: "Assorted Berries Pack",
                description: "A mix of fresh strawberries, blueberries, and raspberries.",
                price: 7.99,
                category: "GROCERY",
                imageUrl: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=800&q=80",
            }
        ];

        for (const product of products) {
            await connection.query(
                'INSERT INTO Product (name, description, price, category, imageUrl) VALUES (?, ?, ?, ?, ?)',
                [product.name, product.description, product.price, product.category, product.imageUrl]
            );
        }

        // Create an Admin User
        const adminEmail = 'admin@shopio.com';
        const [existingAdmin] = await connection.query('SELECT * FROM User WHERE email = ?', [adminEmail]);

        if (existingAdmin.length === 0) {
            // Password: admin123 (hashed with bcrypt)
            const hashedPassword = '$2b$10$RW2XVC8wrCzfGGXX4gaMpuux.J8nrTV7CLRGk9r.BzIOva3mVblsm';
            await connection.query(
                'INSERT INTO User (name, email, password, role) VALUES (?, ?, ?, ?)',
                ['Admin User', adminEmail, hashedPassword, 'ADMIN']
            );
            console.log('✅ Admin user created.');
        } else {
            console.log('ℹ️ Admin user already exists.');
        }

        console.log('✅ Seeding finished.');
    } catch (error) {
        console.error('❌ Error in seeding:', error);
    } finally {
        if (connection) await connection.end();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
