import { NextResponse } from 'next/server';
import { verifyAuth } from '../../../lib/auth';
import { upsertWatchProgress, getWatchProgress } from '../../../lib/db.server';

export async function POST(request) {
  const { user } = await verifyAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { contentId, position, duration } = body || {};
    if (!contentId || typeof position !== 'number') {
      return NextResponse.json({ error: 'Missing contentId or position' }, { status: 400 });
    }
    const res = upsertWatchProgress({ userId: user.id, contentId, position, duration });
    return NextResponse.json({ success: true, data: res });
  } catch (err) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function GET(request) {
  const { user } = await verifyAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(request.url);
  const contentId = url.searchParams.get('contentId');
  if (!contentId) return NextResponse.json({ error: 'Missing contentId' }, { status: 400 });

  const row = getWatchProgress(user.id, contentId);
  return NextResponse.json({ success: true, data: row });
}
