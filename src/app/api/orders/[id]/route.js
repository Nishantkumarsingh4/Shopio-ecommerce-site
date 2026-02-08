import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { sendOrderStatusUpdateEmail } from '@/lib/mail';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// User can cancel their own order if it's still PENDING
export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const token = request.cookies.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        let userId;
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            userId = decoded.userId;
        } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { status } = await request.json();

        if (status !== 'CANCELLED') {
            return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
        }

        // Fetch details including user email and product name for notification
        const [orders] = await pool.query(`
            SELECT o.status, o.name, u.email as userEmail, p.name as productName 
            FROM \`Order\` o
            JOIN User u ON o.userId = u.id
            JOIN Product p ON o.productId = p.id
            WHERE o.id = ? AND o.userId = ?
        `, [id, userId]);

        if (orders.length === 0) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (orders[0].status !== 'PENDING') {
            return NextResponse.json({ error: `Cannot cancel order with status: ${orders[0].status}` }, { status: 400 });
        }

        const orderDetail = orders[0];
        await pool.query('UPDATE `Order` SET status = ? WHERE id = ?', ['CANCELLED', id]);

        // Trigger Email
        await sendOrderStatusUpdateEmail({
            orderId: id,
            name: orderDetail.name,
            userEmail: orderDetail.userEmail,
            status: 'CANCELLED',
            productName: orderDetail.productName
        });

        return NextResponse.json({ message: 'Order cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling order:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
