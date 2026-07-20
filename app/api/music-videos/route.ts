import { NextResponse, type NextRequest } from 'next/server';
import { getAllMusicVideos } from '../../../lib/db.server';

export async function GET(): Promise<NextResponse> {
  try {
    const videos = getAllMusicVideos();
    return NextResponse.json({ success: true, data: videos });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
