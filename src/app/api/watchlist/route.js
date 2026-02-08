import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const getUserId = (request) => {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.userId;
    } catch {
        return null;
    }
};

export async function GET(request) {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const [rows] = await pool.query(`
      SELECT 
        w.id, w.userId, w.productId,
        p.id as p_id, p.name as p_name, p.description as p_description, 
        p.price as p_price, p.category as p_category, p.imageUrl as p_imageUrl
      FROM WatchlistItem w
      JOIN Product p ON w.productId = p.id
      WHERE w.userId = ?
    `, [userId]);

        const watchlistItems = rows.map(row => ({
            id: row.id,
            userId: row.userId,
            productId: row.productId,
            product: {
                id: row.p_id,
                name: row.p_name,
                description: row.p_description,
                price: row.p_price,
                category: row.p_category,
                imageUrl: row.p_imageUrl,
            }
        }));

        return NextResponse.json(watchlistItems);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching watchlist' }, { status: 500 });
    }
}

export async function POST(request) {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { productId } = await request.json();

        const [existingItems] = await pool.query(
            'SELECT * FROM WatchlistItem WHERE userId = ? AND productId = ?',
            [userId, productId]
        );

        if (existingItems.length > 0) {
            return NextResponse.json({ message: 'Already in watchlist' });
        }

        const [result] = await pool.query(
            'INSERT INTO WatchlistItem (userId, productId) VALUES (?, ?)',
            [userId, productId]
        );

        return NextResponse.json({ id: result.insertId, userId, productId }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error adding to watchlist' }, { status: 500 });
    }
}

export async function DELETE(request) {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await pool.query('DELETE FROM WatchlistItem WHERE id = ? AND userId = ?', [parseInt(id), userId]);

        return NextResponse.json({ message: 'Removed from watchlist' });
    } catch (error) {
        return NextResponse.json({ error: 'Error removing from watchlist' }, { status: 500 });
    }
}
