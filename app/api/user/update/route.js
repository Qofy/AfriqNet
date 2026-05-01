import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getUserByEmail, updateUser } from '@/lib/db.server';

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

    // Check if email is already taken by another user
    const existingUser = await getUserByEmail(email);
    if (existingUser && existingUser.id !== session.userId) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    // Update user information
    await updateUser(session.userId, { name, email });

    return NextResponse.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
