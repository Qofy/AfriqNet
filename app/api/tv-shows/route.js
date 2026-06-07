import { NextResponse } from 'next/server';
import { getAllTVShows } from '../../../lib/db.server';

export async function GET() {
  try {
    const shows = getAllTVShows();
    return NextResponse.json({ success: true, data: shows });
  } catch (err) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
