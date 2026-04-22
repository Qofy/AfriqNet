import fs from 'fs';
import path from 'path';
import { getMovieById, getMusicVideoById } from '@/lib/db.server';

export async function GET(req, { params }) {
  try {
    // In Next App Router dynamic API handlers `params` is a Promise — unwrap it first
    const resolved = await params;
    const id = resolved?.id;
    if (!id) return new Response('Missing id', { status: 400 });

    // Get type from query params
    const url = new URL(req.url);
    const type = url.searchParams.get('type');

    // Try to get content - check type parameter first, then try both
    let content = null;
    let videoPath = null;

    if (type === 'music_video') {
      content = getMusicVideoById(id);
      videoPath = content?.stream;
    } else if (type === 'movie') {
      content = getMovieById(id);
      videoPath = content?.video_stram;
    } else {
      // Try movie first, then music video
      content = getMovieById(id);
      if (content && content.video_stram) {
        videoPath = content.video_stram;
      } else {
        content = getMusicVideoById(id);
        videoPath = content?.stream;
      }
    }

    if (!content || !videoPath) {
      return new Response('Content or video not found', { status: 404 });
    }

    // Resolve file path - add 'public' prefix for files served from public directory
    const rel = videoPath.replace(/^\//, '');
    const filePath = path.resolve(process.cwd(), 'public', rel);

    if (!fs.existsSync(filePath)) {
      return new Response('File not found', { status: 404 });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.get('range');

    if (range) {
      // Parse Range header: bytes=start-end
      const bytesPrefix = 'bytes=';
      if (!range.startsWith(bytesPrefix)) {
        return new Response('Malformed Range header', { status: 400 });
      }
      const ranges = range.substring(bytesPrefix.length).split('-');
      const start = parseInt(ranges[0], 10) || 0;
      const end = ranges[1] ? parseInt(ranges[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;

      const stream = fs.createReadStream(filePath, { start, end });

      const headers = new Headers();
      headers.set('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      headers.set('Accept-Ranges', 'bytes');
      headers.set('Content-Length', String(chunkSize));
      headers.set('Content-Type', 'video/mp4');

      return new Response(stream, { status: 206, headers });
    }

    // No range requested, return whole file
    const stream = fs.createReadStream(filePath);
    const headers = new Headers();
    headers.set('Content-Length', String(fileSize));
    headers.set('Content-Type', 'video/mp4');
    headers.set('Accept-Ranges', 'bytes');

    return new Response(stream, { status: 200, headers });
  } catch (error) {
      console.error('Streaming error:', error);
      return new Response('Internal server error', { status: 500 });
    //   throw new Error('Stream error', error);
  }
}
