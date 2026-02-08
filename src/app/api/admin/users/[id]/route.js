import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Delete admin user
export async function DELETE(request, { params }) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const { id } = await params;

        // Don't allow deleting yourself
        if (parseInt(id) === decoded.userId) {
            return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
        }

        // Check if admin exists
        const [admins] = await pool.query("SELECT id FROM User WHERE id = ? AND role = 'ADMIN'", [id]);
        if (admins.length === 0) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        await pool.query('DELETE FROM User WHERE id = ?', [id]);

        return NextResponse.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error('Error deleting admin:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
