import { NextRequest, NextResponse } from 'next/server';
import { isLoopbackRequest } from '../../../../server/video/localAccess';
import { globalJobRegistry } from '../../../../server/video/jobRegistry';
import { FrozenScene } from '../../../../video/contracts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!isLoopbackRequest(req.headers)) {
    return NextResponse.json(
      {
        error:
          'Môi trường Vercel Serverless không hỗ trợ tiến trình nền FFmpeg. Để xuất video MP4 thực tế qua FFmpeg, vui lòng khởi chạy ứng dụng tại Local Studio (http://localhost:3000).',
      },
      { status: 403 }
    );
  }

  if (globalJobRegistry.hasActiveJob()) {
    return NextResponse.json(
      { error: 'Conflict: another render job is currently running' },
      { status: 409 }
    );
  }

  try {
    const body = (await req.json()) as FrozenScene;
    if (!body || body.schema !== 'frozen-scene/1' || !body.sceneSha256) {
      return NextResponse.json({ error: 'Invalid FrozenScene payload' }, { status: 400 });
    }

    const receipt = await globalJobRegistry.submitJob(body);
    return NextResponse.json(receipt, { status: 202 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

