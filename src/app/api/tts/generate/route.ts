import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_TTS_MODEL = process.env.GEMINI_TTS_MODEL || 'gemini-3.8-flash-tts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, subtitles, voice = 'Charon', language = 'vi' } = body;

    let fullScript = '';

    if (text && typeof text === 'string' && text.trim()) {
      fullScript = text.trim();
    } else if (Array.isArray(subtitles) && subtitles.length > 0) {
      // Build natural narration from 4 stages (Hook -> Trap -> Setup -> Execution)
      fullScript = subtitles
        .map((s: any) => {
          const content = typeof s === 'string' ? s : s.text || '';
          return content.replace(/^HOOK:\s*/i, '').trim();
        })
        .filter(Boolean)
        .join('. ');
    } else {
      return NextResponse.json(
        { error: 'Text or subtitles array is required for speech generation' },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_TTS_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const payload = {
      contents: [
        {
          parts: [{ text: fullScript }],
        },
      ],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voice,
            },
          },
        },
      },
    };

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn('Gemini TTS API returned status:', res.status);
      if (res.status === 429) {
        return NextResponse.json(
          {
            error: 'Gemini 3.8 Flash TTS Free Tier (10 requests/day) limit reached. System activating Web Speech Engine.',
            rateLimited: true,
            status: 429,
          },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: `Gemini TTS failed with status ${res.status}`, details: errText },
        { status: res.status }
      );
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find(
      (p: any) => p.inlineData && p.inlineData.mimeType?.includes('audio')
    ) || candidate?.content?.parts?.[0];

    if (!audioPart?.inlineData?.data) {
      return NextResponse.json(
        { error: 'No audio data returned from Gemini TTS', raw: data },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      audioBase64: audioPart.inlineData.data,
      mimeType: audioPart.inlineData.mimeType || 'audio/wav',
      voice,
      model: GEMINI_TTS_MODEL,
      scriptLength: fullScript.length,
      narratedText: fullScript,
    });
  } catch (error: any) {
    console.error('Error generating speech with Gemini 3.8 Flash TTS:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

