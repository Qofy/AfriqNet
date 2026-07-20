import { NextResponse, type NextRequest } from 'next/server';
import { getAllMovies } from '../../../lib/db.server';

export async function GET(): Promise<NextResponse> {
  try {
    const movies = getAllMovies();
    return NextResponse.json({ success: true, data: movies });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
