import { NextRequest, NextResponse } from 'next/server';
import { createReadStream, statSync, existsSync } from 'fs';
import { join, resolve } from 'path';
// @ts-ignore
import mime from 'mime';
async function* nodeStreamToIterator(stream: any) {
  for await (const chunk of stream) {
    yield chunk;
  }
}
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(new Uint8Array(value));
      }
    },
  });
}
export const GET = (
  request: NextRequest,
  context: {
    params: {
      path: string[];
    };
  }
) => {
  try {
    // Hardcode absolute path to match backend UPLOAD_DIRECTORY
    // Next.js API routes don't reliably have access to non-NEXT_PUBLIC_ env vars
    const basePath = '/Users/mamini10/Desktop/app/postiz-app/uploads';
    
    const filePath = join(basePath, ...context.params.path);
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('Serving file:', filePath);
      console.log('File exists:', existsSync(filePath));
    }
    
    // Check if file exists
    if (!existsSync(filePath)) {
      console.error('File not found:', filePath);
      console.error('Expected at:', filePath);
      return new NextResponse(`File not found: ${filePath}`, { status: 404 });
    }
    
    const fileStats = statSync(filePath);
    const contentType = mime.getType(filePath) || 'application/octet-stream';
    const response = createReadStream(filePath);
    const iterator = nodeStreamToIterator(response);
    const webStream = iteratorToStream(iterator);
    
    return new Response(webStream, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileStats.size.toString(),
        'Last-Modified': fileStats.mtime.toUTCString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
