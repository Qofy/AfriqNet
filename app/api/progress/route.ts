import { NextResponse, type NextRequest } from 'next/server';
import { verifyAuth } from '../../../lib/auth';
import { upsertWatchProgress, getWatchProgress } from '../../../lib/db.server';

interface ProgressBody {
  contentId?: string;
  position?: number;
  duration?: number;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { user } = await verifyAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body: ProgressBody = await request.json();
    const { contentId, position, duration } = body || {};
    if (!contentId || typeof position !== 'number') {
      return NextResponse.json({ error: 'Missing contentId or position' }, { status: 400 });
    }
    const res = upsertWatchProgress({ userId: user.id, contentId, position, duration });
    return NextResponse.json({ success: true, data: res });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { user } = await verifyAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(request.url);
  const contentId = url.searchParams.get('contentId');
  if (!contentId) return NextResponse.json({ error: 'Missing contentId' }, { status: 400 });

  const row = getWatchProgress(user.id, contentId);
  return NextResponse.json({ success: true, data: row });
}
