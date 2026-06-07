import { NextResponse } from 'next/server';
import { getAllMusicVideos } from '../../../lib/db.server';

export async function GET() {
  try {
    const videos = getAllMusicVideos();
    return NextResponse.json({ success: true, data: videos });
  } catch (err) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
