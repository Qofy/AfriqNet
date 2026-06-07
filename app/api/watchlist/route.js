import { NextResponse } from 'next/server';
import { verifyAuth } from '../../../lib/auth';
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from '../../../lib/db.server';

// GET /api/watchlist  →  returns all watchlist items for the current user
export async function GET() {
  const { user } = await verifyAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const items = await getWatchlist(user.id);
    return NextResponse.json({ success: true, data: items });
  } catch (err) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

// POST /api/watchlist  →  body: { contentId }  →  add to watchlist
export async function POST(request) {
  const { user } = await verifyAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { contentId } = body || {};
    if (!contentId) {
      return NextResponse.json({ error: 'Missing contentId' }, { status: 400 });
    }

    const item = await addToWatchlist(user.id, contentId);
    return NextResponse.json({ success: true, data: item });
  } catch (err) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

// DELETE /api/watchlist  →  body: { contentId }  →  remove from watchlist
export async function DELETE(request) {
  const { user } = await verifyAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { contentId } = body || {};
    if (!contentId) {
      return NextResponse.json({ error: 'Missing contentId' }, { status: 400 });
    }

    await removeFromWatchlist(user.id, contentId);
    return NextResponse.json({ success: true, data: { contentId } });
  } catch (err) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
