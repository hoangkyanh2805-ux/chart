import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { isLoopbackRequest } from '../../../../../../server/video/localAccess';
import { globalJobRegistry } from '../../../../../../server/video/jobRegistry';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isLoopbackRequest(req.headers)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const job = globalJobRegistry.getJob(params.id);
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  if (job.status !== 'MEDIA_VERIFIED') {
    return NextResponse.json(
      { error: `Artifact not ready. Job status: ${job.status}` },
      { status: 409 }
    );
  }

  const mp4Path = path.resolve(process.cwd(), `livrables/s2v_runs/${params.id}/output.mp4`);
  if (!fs.existsSync(mp4Path)) {
    return NextResponse.json({ error: 'Artifact file missing on disk' }, { status: 404 });
  }

  const fileBytes = fs.readFileSync(mp4Path);
  return new NextResponse(fileBytes, {
    status: 200,
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Disposition': `attachment; filename="${params.id}.mp4"`,
      'Content-Length': fileBytes.length.toString(),
    },
  });
}

