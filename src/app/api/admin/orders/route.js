import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request) {
    try {
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

        // Fetch orders with user and product details
        const [orders] = await pool.query(`
            SELECT 
                o.*, 
                p.name as productName, 
                p.imageUrl as productImage,
                u.name as userName,
                u.email as userEmail
            FROM \`Order\` o
            LEFT JOIN Product p ON o.productId = p.id
            LEFT JOIN User u ON o.userId = u.id
            ORDER BY o.createdAt DESC
        `);

        return NextResponse.json(orders);

    } catch (error) {
        console.error('Error fetching admin orders:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request) {
    // Ability to update order status (e.g., Pending -> Confirmed) if needed later
    return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}
