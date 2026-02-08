import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET all products or search
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category'); // Filter by category
        const queryParam = searchParams.get('q'); // Search query
        const trending = searchParams.get('trending'); // Filter by trending

        let sql = 'SELECT * FROM Product';
        let params = [];
        let conditions = [];

        if (category) {
            conditions.push('category = ?');
            params.push(category);
        }

        if (queryParam) {
            conditions.push('(name LIKE ? OR description LIKE ?)');
            params.push(`%${queryParam}%`, `%${queryParam}%`);
        }

        if (trending === 'true') {
            conditions.push('isTrending = TRUE');
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' ORDER BY createdAt DESC';

        const [products] = await pool.query(sql, params);

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST new product (Admin only)
export async function POST(request) {
    try {
        // Verify admin token
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (decoded.role !== 'ADMIN') {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, price, category, imageUrl, available = true, isTrending = false } = body;

        if (!name || !description || !price || !category || !imageUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const [result] = await pool.query(
            'INSERT INTO Product (name, description, price, category, imageUrl, available, isTrending) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, description, parseFloat(price), category, imageUrl, available, isTrending]
        );

        const newProduct = {
            id: result.insertId,
            name,
            description,
            price: parseFloat(price),
            category,
            imageUrl,
            available,
            isTrending,
        };

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
