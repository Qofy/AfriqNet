import { NextResponse, type NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getUserByEmail, updateUser } from '@/lib/db.server';

interface ProfileBody {
  profileUrl?: string;
  name?: string;
  email?: string;
}

interface Updates {
  name?: string;
  email?: string;
  profile_image?: string;
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const auth = await verifyAuth();
  if (!auth?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: ProfileBody;
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
    // Check if email is already taken by another user
    if (email) {
      const existingUser = await getUserByEmail(email);
      if (existingUser && existingUser.id !== auth.user.id) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
      }
    }

    // Build updates object
    const updates: Updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (profileUrl !== undefined) updates.profile_image = profileUrl;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Update user
    await updateUser(auth.user.id, updates);

    return NextResponse.json({
      message: 'Profile updated successfully',
      updated: { name, email, profileUrl }
    });
  } catch (err) {
    console.error('Failed to update profile:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
