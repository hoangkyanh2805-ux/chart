import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface HermesScriptSummary {
  id: string;
  filename: string;
  title: string;
  hook: string;
  date: string;
  painpoint?: string;
  size: number;
  content: string;
}

const DEFAULT_SCRIPTS_DIR = 'C:\\Users\\Admin\\youtube\\video_scripts';

function extractMetadata(content: string, filename: string): { title: string; hook: string; painpoint?: string } {
  let title = filename.replace(/\.md$/, '').replace(/^(?:script|prompt_package)_\d{4}-\d{2}-\d{2}_/, '');
  let hook = '';
  let painpoint = '';

  // 1. Extract Painpoint
  const painMatch = content.match(/Painpoint:\s*([^\r\n]+)/i);
  if (painMatch && painMatch[1]) {
    painpoint = painMatch[1].trim();
  }

  // 2. Extract Title
  // Check for bold title under Title section: e.g. **1 Predefined Loss Limit Keeps New XAUUSD Traders Alive**
  const boldTitleMatch = content.match(/###?\s*1\.\s*TITLE[^\r\n]*\r?\n+.*?^\*\*([^*]+)\*\*/im);
  if (boldTitleMatch && boldTitleMatch[1]) {
    title = boldTitleMatch[1].trim();
  } else {
    const titleBlockMatch = content.match(/(?:1\.\s*TITLE\s*CUỐI|###?\s*1\.\s*TITLE)[^\r\n]*\r?\n+([^\r\n]+)/i);
    if (titleBlockMatch && titleBlockMatch[1]) {
      const clean = titleBlockMatch[1].replace(/^\*\*|\*\*$/g, '').trim();
      if (clean && !clean.startsWith('───') && !clean.startsWith('===') && !clean.startsWith('#')) {
        title = clean;
      }
    }
  }

  // 3. Extract Hook
  const cutoffMatch = content.match(/Short hook cutoff:\s*["“]?([^"”\r\n]+)["”]?/i);
  if (cutoffMatch && cutoffMatch[1]) {
    hook = cutoffMatch[1].trim();
  } else {
    const hookShortMatch = content.match(/Hook(?:\s*Short)?(?:\s*\([^)]*\))?:\s*["“]?([^"”\r\n]+)["”]?/i);
    if (hookShortMatch && hookShortMatch[1]) {
      hook = hookShortMatch[1].trim();
    }
  }

  // Clean title
  title = title.replace(/\s*\(\d+\s*ký tự.*$/, '').replace(/\s*\(\d+\s*chars.*$/, '').trim();

  return { title, hook, painpoint };
}

export async function GET(req: NextRequest) {
  try {
    const dir = DEFAULT_SCRIPTS_DIR;

    if (!fs.existsSync(dir)) {
      return NextResponse.json({
        scripts: [],
        message: `Thư mục ${dir} không khả dụng trên môi trường này`,
      });
    }

    const files = fs.readdirSync(dir);
    const mdFiles = files.filter(
      (f) => f.endsWith('.md') && (f.startsWith('script_') || f.startsWith('prompt_package_'))
    );

    const summaries: HermesScriptSummary[] = [];

    for (const file of mdFiles) {
      try {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        const content = fs.readFileSync(fullPath, 'utf-8');
        const meta = extractMetadata(content, file);

        summaries.push({
          id: file,
          filename: file,
          title: meta.title,
          hook: meta.hook,
          painpoint: meta.painpoint,
          size: stat.size,
          date: stat.mtime.toISOString(),
          content,
        });
      } catch (e) {
        console.warn(`Lỗi đọc file kịch bản ${file}:`, e);
      }
    }

    // Sort newest first
    summaries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      success: true,
      count: summaries.length,
      scripts: summaries.slice(0, 15), // Return top 15 newest scripts
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Lỗi đọc danh sách kịch bản Hermes' },
      { status: 500 }
    );
  }
}
