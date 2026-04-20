import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/db.server';

export async function PATCH(request) {
  try {
    const { session } = await verifyAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const db = getDatabase();

    // Check if email is already taken by another user
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, session.userId);
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    // Update user information
    const stmt = db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?');
    stmt.run(name, email, session.userId);

    return NextResponse.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
