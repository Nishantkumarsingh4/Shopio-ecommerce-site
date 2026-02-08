import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { sendOrderStatusUpdateEmail } from '@/lib/mail';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Admin can update status of any order
export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const token = request.cookies.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (decoded.role !== 'ADMIN') {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { status } = await request.json();

        if (!['PENDING', 'DELIVERED', 'CANCELLED'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // Fetch user and product details for email
        const [orders] = await pool.query(`
            SELECT o.name, o.userId, u.email as userEmail, p.name as productName 
            FROM \`Order\` o 
            JOIN User u ON o.userId = u.id 
            JOIN Product p ON o.productId = p.id 
            WHERE o.id = ?
        `, [id]);

        if (orders.length > 0) {
            const orderDetail = orders[0];
            await pool.query('UPDATE `Order` SET status = ? WHERE id = ?', [status, id]);

            // Trigger Email
            await sendOrderStatusUpdateEmail({
                orderId: id,
                name: orderDetail.name,
                userEmail: orderDetail.userEmail,
                status,
                productName: orderDetail.productName
            });
        }

        return NextResponse.json({ message: `Order status updated to ${status}` });
    } catch (error) {
        console.error('Error updating order status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
