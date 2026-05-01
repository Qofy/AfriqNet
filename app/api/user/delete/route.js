import { NextResponse } from 'next/server';
import { verifyAuth, lucia } from '@/lib/auth';
import { deleteUser, deleteWatchProgressForUser } from '@/lib/db.server';
import { cookies } from 'next/headers';

export async function DELETE() {
  try {
    const { session } = await verifyAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete all user sessions via Lucia adapter
    await lucia.invalidateAllUserSessions(session.userId);

    // Delete watch progress
    await deleteWatchProgressForUser(session.userId);

    // Delete user account
    await deleteUser(session.userId);

    // Clear the session cookie
    const cookieStore = await cookies();
    const sessionCookie = lucia.createBlankSessionCookie();
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return NextResponse.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
