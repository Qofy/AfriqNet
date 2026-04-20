import { NextResponse } from 'next/server';
import { verifyAuth, lucia } from '@/lib/auth';
import { getDatabase } from '@/lib/db.server';
import { cookies } from 'next/headers';

export async function DELETE() {
  try {
    const { session } = await verifyAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDatabase();

    // Delete all user sessions
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(session.userId);

    // Delete watch progress
    db.prepare('DELETE FROM watch_progress WHERE user_id = ?').run(session.userId);

    // Delete user account
    db.prepare('DELETE FROM users WHERE id = ?').run(session.userId);

    // Invalidate current session
    await lucia.invalidateSession(session.id);
    
    const cookieStore = await cookies();
    const sessionCookie = lucia.createBlankSessionCookie();
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return NextResponse.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
