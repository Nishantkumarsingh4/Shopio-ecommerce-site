import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { sendOrderEmails } from '@/lib/mail';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET user orders
export async function GET(request) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        let userId;
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            userId = decoded.userId;
        } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const [orders] = await pool.query(`
            SELECT 
                o.*,
                p.name as product_name,
                p.imageUrl as product_imageUrl,
                p.price as product_price
            FROM \`Order\` o
            LEFT JOIN Product p ON o.productId = p.id
            WHERE o.userId = ?
            ORDER BY o.createdAt DESC
        `, [userId]);

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let userId;
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            userId = decoded.userId;
        } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const { productId, items, name, address, phone, pin, totalPrice: totalP, paymentMethod = "COD", paymentScreenshot = null } = body;

        if (!name || !address || !phone || !pin) {
            return NextResponse.json({ error: 'Missing required delivery details' }, { status: 400 });
        }

        // Fetch user email for confirmation
        const [users] = await pool.query('SELECT email FROM User WHERE id = ?', [userId]);
        const userEmail = users[0]?.email || "";

        let orderItems = [];
        let finalTotalPrice = 0;

        if (productId) {
            // Single product checkout
            const [products] = await pool.query('SELECT name, price FROM Product WHERE id = ?', [productId]);
            if (products.length === 0) {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 });
            }
            const product = products[0];
            finalTotalPrice = product.price;

            const [result] = await pool.query(
                'INSERT INTO `Order` (userId, productId, name, address, phone, pin, totalPrice, paymentMethod, paymentScreenshot) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [userId, productId, name, address, phone, pin, finalTotalPrice, paymentMethod, paymentScreenshot]
            );

            orderItems.push({ name: product.name, price: product.price, quantity: 1 });

            // Trigger Email
            await sendOrderEmails({
                orderId: result.insertId,
                name, address, phone, pin,
                items: orderItems,
                totalPrice: finalTotalPrice,
                userEmail,
                paymentMethod
            });

        } else if (items && items.length > 0) {
            // Cart checkout
            let lastInsertedId;
            for (const item of items) {
                const [products] = await pool.query('SELECT name, price FROM Product WHERE id = ?', [item.productId]);
                if (products.length > 0) {
                    const product = products[0];
                    const itemPrice = product.price * item.quantity;
                    finalTotalPrice += itemPrice;

                    const [result] = await pool.query(
                        'INSERT INTO `Order` (userId, productId, name, address, phone, pin, totalPrice, paymentMethod, paymentScreenshot) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [userId, item.productId, name, address, phone, pin, itemPrice, paymentMethod, paymentScreenshot]
                    );
                    lastInsertedId = result.insertId;
                    orderItems.push({ name: product.name, price: product.price, quantity: item.quantity });
                }
            }

            // Trigger Email (using the last items group)
            await sendOrderEmails({
                orderId: lastInsertedId, // Note: This represents the batch or the last item
                name, address, phone, pin,
                items: orderItems,
                totalPrice: finalTotalPrice,
                userEmail,
                paymentMethod
            });

            // Clear cart
            await pool.query('DELETE FROM CartItem WHERE userId = ?', [userId]);
        } else {
            return NextResponse.json({ error: 'No products to checkout' }, { status: 400 });
        }

        return NextResponse.json({
            message: 'Order confirmed successfully!',
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
