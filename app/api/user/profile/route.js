import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/db.server';

export async function PATCH(req) {
  const auth = await verifyAuth();
  if (!auth?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { profileUrl, name, email } = body;
  
  // Validate input
  if (name && typeof name !== 'string') {
    return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
  }
  
  if (email && (!email.includes('@') || typeof email !== 'string')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  try {
    const db = getDatabase();
    
    // Check if email is already taken by another user
    if (email) {
      const existingUser = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, auth.user.id);
      if (existingUser) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
      }
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    
    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    
    if (profileUrl !== undefined) {
      updates.push('profile_image = ?');
      values.push(profileUrl);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Add user ID to the end of values
    values.push(auth.user.id);
    
    const updateQuery = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    const updateStmt = db.prepare(updateQuery);
    
    updateStmt.run(...values);

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      updated: { name, email, profileUrl }
    });

  } catch (err) {
    console.error('Failed to update profile:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
