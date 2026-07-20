import { NextResponse, type NextRequest } from 'next/server';
import { searchContent } from '../../../lib/db.server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('query') || '';
    const contentType = url.searchParams.get('contentType') || null;

    if (!query.trim()) {
      return NextResponse.json({ success: true, data: [] });
    }

    const results = searchContent(query, contentType === 'all' ? null : contentType);
    return NextResponse.json({ success: true, data: results });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
