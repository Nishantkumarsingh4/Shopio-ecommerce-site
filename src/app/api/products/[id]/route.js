import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET single product
export async function GET(request, { params }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        const [products] = await pool.query('SELECT * FROM Product WHERE id = ?', [parseInt(id)]);
        const product = products[0];

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT update product (Admin only)
export async function PUT(request, { params }) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (decoded.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { name, description, price, category, imageUrl, available, isTrending } = body;

        await pool.query(
            'UPDATE Product SET name = ?, description = ?, price = ?, category = ?, imageUrl = ?, available = ?, isTrending = ? WHERE id = ?',
            [name, description, parseFloat(price), category, imageUrl, available, isTrending, parseInt(id)]
        );

        const updatedProduct = {
            id: parseInt(id),
            name,
            description,
            price: parseFloat(price),
            category,
            imageUrl,
            available,
            isTrending,
        };

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE product (Admin only)
export async function DELETE(request, { params }) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (decoded.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { id } = await params;

        await pool.query('DELETE FROM Product WHERE id = ?', [parseInt(id)]);

        return NextResponse.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
