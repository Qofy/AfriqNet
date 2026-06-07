import { NextResponse } from 'next/server';
import { searchContent } from '../../../lib/db.server';

export async function GET(request) {
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
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
