import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const [existingUsers] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);

        if (existingUsers.length > 0) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            'INSERT INTO User (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, 'USER']
        );

        const newUser = {
            id: result.insertId,
            name,
            email,
            role: 'USER',
        };

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
