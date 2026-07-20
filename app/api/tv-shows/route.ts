import { NextResponse, type NextRequest } from 'next/server';
import { getAllTVShows } from '../../../lib/db.server';

export async function GET(): Promise<NextResponse> {
  try {
    const shows = getAllTVShows();
    return NextResponse.json({ success: true, data: shows });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
