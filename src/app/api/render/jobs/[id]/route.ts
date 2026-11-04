import { NextRequest, NextResponse } from 'next/server';
import { isLoopbackRequest } from '../../../../../server/video/localAccess';
import { globalJobRegistry } from '../../../../../server/video/jobRegistry';

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

  return NextResponse.json(job);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isLoopbackRequest(req.headers)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const cancelled = globalJobRegistry.cancelJob(params.id);
  if (!cancelled) {
    return NextResponse.json({ error: 'Job could not be cancelled' }, { status: 400 });
  }

  return NextResponse.json({ ok: true, status: 'CANCELLED' });
}

