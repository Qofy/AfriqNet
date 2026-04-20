import fs from 'fs';
import path from 'path';
import { getMovieById } from '@/lib/db.server';

export async function GET(req, { params }) {
  try {
    // In Next App Router dynamic API handlers `params` is a Promise — unwrap it first
    const resolved = await params;
    const id = resolved?.id;
    if (!id) return new Response('Missing id', { status: 400 });

    const movie = getMovieById(id);
    if (!movie || !movie.video_stram) {
      return new Response('Movie or video not found', { status: 404 });
    }

    // Resolve file path (support absolute-ish stored like '/movies/THE_CHEF_AND_I.mp4')
    const rel = movie.video_stram.replace(/^\//, '');
    const filePath = path.resolve(process.cwd(), rel);

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
  } catch (err) {
      return new Response('Internal server error', { status: 500 });
    //   throw new Error('Stream error', err);
  }
}
