import { NextResponse } from 'next/server';
import { getAllMovies } from '../../../lib/db.server';

export async function GET() {
  try {
    const movies = getAllMovies();
    return NextResponse.json({ success: true, data: movies });
  } catch (err) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
