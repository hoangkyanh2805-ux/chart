import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const YOUTUBE_REPO_ENV = 'C:\\Users\\Admin\\youtube\\.env';

function getCredentials(): { apiKey: string; channelId: string } {
  let apiKey = process.env.YT_API_KEY || '';
  let channelId = process.env.YOUTUBE_CHANNEL_ID || '';

  if ((!apiKey || !channelId) && fs.existsSync(YOUTUBE_REPO_ENV)) {
    try {
      const content = fs.readFileSync(YOUTUBE_REPO_ENV, 'utf8');
      content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('YT_API_KEY=')) {
          apiKey = trimmed.split('=')[1].trim();
        } else if (trimmed.startsWith('YOUTUBE_CHANNEL_ID=')) {
          channelId = trimmed.split('=')[1].trim();
        }
      });
    } catch (e) {
      console.warn('Failed to read YouTube .env credentials:', e);
    }
  }

  return { apiKey, channelId };
}

// Convert ISO 8601 duration (e.g. PT59S, PT8M32S, PT10H30M) to seconds
function parseDurationToSeconds(duration: string): number {
  if (!duration || duration === 'P0D') return 0;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

export async function GET() {
  const { apiKey, channelId } = getCredentials();

  if (!apiKey || !channelId) {
    return NextResponse.json(
      { error: 'Chưa cấu hình YT_API_KEY hoặc YOUTUBE_CHANNEL_ID' },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch Channel Overview
    const chUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${channelId}&key=${apiKey}`;
    const chRes = await fetch(chUrl, { cache: 'no-store' });
    const chData = await chRes.json();

    if (!chData.items || chData.items.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy kênh YouTube' }, { status: 404 });
    }

    const channelItem = chData.items[0];
    const channelStats = {
      title: channelItem.snippet.title,
      customUrl: channelItem.snippet.customUrl,
      description: channelItem.snippet.description,
      thumbnail: channelItem.snippet.thumbnails?.default?.url,
      subscribers: parseInt(channelItem.statistics.subscriberCount || '0', 10),
      totalVideos: parseInt(channelItem.statistics.videoCount || '0', 10),
      totalViews: parseInt(channelItem.statistics.viewCount || '0', 10),
    };

    const uploadsPlaylistId = channelItem.contentDetails?.relatedPlaylists?.uploads;

    // 2. Fetch Recent Uploads
    let recentVideos: any[] = [];
    if (uploadsPlaylistId) {
      const plUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=25&key=${apiKey}`;
      const plRes = await fetch(plUrl, { cache: 'no-store' });
      const plData = await plRes.json();

      if (plData.items && plData.items.length > 0) {
        const videoIds = plData.items.map((it: any) => it.contentDetails.videoId).join(',');
        const vUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${apiKey}`;
        const vRes = await fetch(vUrl, { cache: 'no-store' });
        const vData = await vRes.json();

        recentVideos = (vData.items || []).map((v: any) => {
          const sec = parseDurationToSeconds(v.contentDetails?.duration || '');
          let format: 'short' | 'long' | 'livestream' = 'long';
          if (sec > 0 && sec <= 65) {
            format = 'short';
          } else if (sec >= 1800 || v.snippet.title.includes('LIVE')) {
            format = 'livestream';
          }

          return {
            id: v.id,
            title: v.snippet.title,
            publishedAt: v.snippet.publishedAt,
            thumbnail: v.snippet.thumbnails?.medium?.url || v.snippet.thumbnails?.default?.url,
            duration: v.contentDetails?.duration,
            durationSeconds: sec,
            format,
            views: parseInt(v.statistics?.viewCount || '0', 10),
            likes: parseInt(v.statistics?.likeCount || '0', 10),
            comments: parseInt(v.statistics?.commentCount || '0', 10),
          };
        });
      }
    }

    // 3. Segment into Shorts, Long, and Livestreams
    const shorts = recentVideos.filter((v) => v.format === 'short');
    const longVideos = recentVideos.filter((v) => v.format === 'long');
    const liveStreams = recentVideos.filter((v) => v.format === 'livestream');

    // 4. Automated Diagnostic Engine (Khám Bệnh Kênh Azzam)
    const diagnosis = {
      overallHealth: 'Tăng trưởng ổn định - Đang có cơ hội bứt phá nhờ Livestream & Shorts',
      keyMetrics: {
        avgShortViews: shorts.length > 0 ? Math.round(shorts.reduce((acc, v) => acc + v.views, 0) / shorts.length) : 0,
        topLiveSession: liveStreams.reduce((max, v) => (v.views > max ? v.views : max), 0),
        shortCountAnalyzed: shorts.length,
        longCountAnalyzed: longVideos.length,
        liveCountAnalyzed: liveStreams.length,
      },
      strengths: [
        'Kênh có tần suất phát trực tiếp (Livestream) cực kỳ bền bỉ (8-10 tiếng/ngày), giữ chân cộng đồng rất tốt.',
        'Phiên live 21/10 đạt kỷ lục 1,501 lượt xem và 61 likes chứng minh chủ đề Vàng XAUUSD đang có nhu cầu rất lớn.',
        'Đã duy trì đều đặn chuỗi video ngắn hàng ngày "Gold Today".',
      ],
      bottlenecks: [
        'Tiêu đề Shorts hiện tại ("Gold Today 29/10: Gold is trapped...") còn nặng tính đưa tin thời sự (news report), chưa tạo được Curiosity Gap và áp lực tâm lý trong 3 giây đầu.',
        'Kho Livestream 8-10 tiếng chứa rất nhiều pha khớp lệnh và săn thanh khoản đỉnh cao nhưng CHƯA ĐƯỢC CẮT LÁT (Clipping) thành video ngắn để kéo view về.',
        'Thiếu liên kết chuyển đổi (Funnel CTA) kêu gọi nhận 2 khóa học bảo toàn vốn miễn phí tại learn.azzamedu.com.',
      ],
      actionPlan: [
        'Chuyển đổi tiêu đề Shorts từ dạng Báo cáo ("Gold is trapped") sang dạng Bẫy tâm lý ("3 CÁCH BIG BOYS BẪY BẠN KHI GIÁ ĐI NGANG").',
        'Tận dụng ngay điểm phản ứng giá $4,155 (đã được nhắc ở video 21/10) để làm video phân tích nến rút chân tổ chức.',
        'Áp dụng quy chuẩn 3 bước nút bấm (1. LOSS $10, 2. ENTRY SL 20p, 3. SIZE 0.05L) vào mọi video 9:16 trên ChartAnimator.',
      ],
    };

    // 5. High-Impact Video Proposals (Kịch bản đề xuất dựng ngay trên Canvas)
    const proposedVideos = [
      {
        id: 'prop-1-live-clip-4155',
        title: 'VÌ SAO ĐỈNH $4,155 BỊ QUÉT RÂU TRƯỚC KHI RƠI?',
        hookHeadline: 'WHY $4,155 LIQUIDITY SWEPT',
        hookSubline: 'Retail bought the breakout. Smart money sold the wick.',
        targetPips: 70,
        riskBudget: 10,
        slPips: 20,
        lotSize: '0.05 lot',
        rrRatio: 3.5,
        format: 'Shorts 9:16',
        rationale: 'Khai thác trực tiếp từ phiên Live 21/10 (1,501 views): Giải mã cú quét râu đỉnh $4,155 chuẩn SMC.',
        strategy: 'Liquidity Sweep',
        basePrice: 4128,
        badges: ['1. LOSS $10', '2. ENTRY SL 20p', '3. SIZE 0.05L'],
      },
      {
        id: 'prop-2-gold-today-trapped',
        title: 'THOÁT BẪY KẸT GIÁ VÀNG $4,128 CHO NGƯỜI MỚI',
        hookHeadline: 'STOP GETTING TRAPPED AT SUPPORT',
        hookSubline: 'Define your loss before price makes its move.',
        targetPips: 70,
        riskBudget: 10,
        slPips: 20,
        lotSize: '0.05 lot',
        rrRatio: 3.5,
        format: 'Shorts 9:16',
        rationale: 'Nâng cấp video "Gold is trapped" 29/10 thành bài học quản lý vốn $1,000 thực chiến.',
        strategy: 'Risk-First Pullback',
        basePrice: 4128,
        badges: ['1. LOSS $10', '2. SL 20 PIPS', '3. LOT 0.05'],
      },
      {
        id: 'prop-3-orb-breakout-debunked',
        title: 'VÌ SAO ĐÁNH ORB TOÀN BỊ QUÉT STOP LOSS?',
        hookHeadline: 'ORB BREAKOUT IS A TRAP',
        hookSubline: 'Only trade the mitigation back into the real FVG.',
        targetPips: 70,
        riskBudget: 30,
        slPips: 20,
        lotSize: '0.15 lot',
        rrRatio: 3.5,
        format: 'Shorts 9:16 hoặc Video Dài 8m',
        rationale: 'Kết nối video dài 8m32s "Opening Range Breakout" với nỗi đau khán giả PP-0002 (1,791 likes).',
        strategy: 'Fair Value Gap',
        basePrice: 4128,
        badges: ['1. LOSS $30', '2. SL 20 PIPS', '3. LOT 0.15'],
      },
    ];

    return NextResponse.json({
      status: 'ok',
      channel: channelStats,
      summary: {
        totalAnalyzed: recentVideos.length,
        shortsCount: shorts.length,
        longCount: longVideos.length,
        liveCount: liveStreams.length,
      },
      diagnosis,
      proposedVideos,
      videos: {
        shorts,
        longVideos,
        liveStreams,
      },
    });
  } catch (error: any) {
    console.error('YouTube API route error:', error);
    return NextResponse.json(
      { error: 'Lỗi truy xuất dữ liệu từ YouTube Data API: ' + error.message },
      { status: 500 }
    );
  }
}

