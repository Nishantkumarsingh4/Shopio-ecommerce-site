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
        // Join CartItem and Product to mimic Prisma's 'include'
        const [rows] = await pool.query(`
      SELECT 
        c.id, c.quantity, c.userId, c.productId,
        p.id as p_id, p.name as p_name, p.description as p_description, 
        p.price as p_price, p.category as p_category, p.imageUrl as p_imageUrl, p.available as p_available
      FROM CartItem c
      JOIN Product p ON c.productId = p.id
      WHERE c.userId = ?
    `, [userId]);

        // Map to nested structure
        const cartItems = rows.map(row => ({
            id: row.id,
            quantity: row.quantity,
            userId: row.userId,
            productId: row.productId,
            product: {
                id: row.p_id,
                name: row.p_name,
                description: row.p_description,
                price: row.p_price,
                category: row.p_category,
                imageUrl: row.p_imageUrl,
                available: row.p_available === 1 || row.p_available === true
            }
        }));

        return NextResponse.json(cartItems);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error fetching cart' }, { status: 500 });
    }
}

export async function POST(request) {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { productId, quantity = 1 } = await request.json();

        // Check if item already exists
        const [existingItems] = await pool.query(
            'SELECT * FROM CartItem WHERE userId = ? AND productId = ?',
            [userId, productId]
        );

        if (existingItems.length > 0) {
            const existingItem = existingItems[0];
            const newQuantity = existingItem.quantity + quantity;

            await pool.query(
                'UPDATE CartItem SET quantity = ? WHERE id = ?',
                [newQuantity, existingItem.id]
            );

            return NextResponse.json({ ...existingItem, quantity: newQuantity });
        }

        const [result] = await pool.query(
            'INSERT INTO CartItem (userId, productId, quantity) VALUES (?, ?, ?)',
            [userId, productId, quantity]
        );

        return NextResponse.json({ id: result.insertId, userId, productId, quantity }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error adding to cart' }, { status: 500 });
    }
}

export async function PUT(request) {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id, quantity } = await request.json();

        if (!id || quantity === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify item belongs to user
        const [rows] = await pool.query('SELECT * FROM CartItem WHERE id = ? AND userId = ?', [id, userId]);
        if (rows.length === 0) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        if (quantity < 1) {
            return NextResponse.json({ error: 'Quantity must be at least 1' }, { status: 400 });
        }

        await pool.query('UPDATE CartItem SET quantity = ? WHERE id = ?', [quantity, id]);

        return NextResponse.json({ id, quantity });
    } catch (error) {
        console.error("Error updating cart:", error);
        return NextResponse.json({ error: 'Error updating cart' }, { status: 500 });
    }
}

export async function DELETE(request) {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            // Delete specific item
            await pool.query('DELETE FROM CartItem WHERE id = ? AND userId = ?', [parseInt(id), userId]);
        } else {
            // Clear cart
            await pool.query('DELETE FROM CartItem WHERE userId = ?', [userId]);
        }

        return NextResponse.json({ message: 'Cart updated' });
    } catch (error) {
        return NextResponse.json({ error: 'Error removing from cart' }, { status: 500 });
    }
}
