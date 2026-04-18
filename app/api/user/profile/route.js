import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { updateUserProfileImage } from '@/lib/db.server';

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

  const { profileUrl } = body;
  if (!profileUrl) {
    return NextResponse.json({ error: 'Missing profileUrl' }, { status: 400 });
  }

  try {
    const updated = updateUserProfileImage(auth.user.id, profileUrl);
    if (!updated) {
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
    return NextResponse.json({ ok: true, user: updated });
  } catch (err) {
    console.error('Failed to update profile image:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
