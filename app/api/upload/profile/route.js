import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/claudinary';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // uploadImage expects a File-like object (we send the Web File from formData)
    const url = await uploadImage(file);

    return NextResponse.json({ url });
  } catch (err) {
    console.error('Upload error', err);
    return NextResponse.json({ error: (err && err.message) || String(err) }, { status: 500 });
  }
}
