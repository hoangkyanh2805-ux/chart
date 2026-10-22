const fs = require('fs');
const path = require('path');

const API_TOKEN = process.env.LEARNHOUSE_API_TOKEN || 'lh_l9WXO9aTJ3P4LqMRzCFbkx6hZZ7KK7Lr-2Gidtx2154';
const BASE_URL = process.env.LEARNHOUSE_BASE_URL || 'https://learn.azzamedu.com';
const ORG_SLUG = process.env.LEARNHOUSE_ORG_SLUG || 'alpha-elite';

const OUTPUT_DIR = path.join(__dirname, '..', 'knowledge', 'azzam_courses');

function parseDynamicDoc(content) {
  if (!content) return '';
  if (typeof content === 'string') return content;
  
  let text = '';
  function walk(node) {
    if (!node) return;
    if (node.type === 'text' && node.text) {
      text += node.text;
    } else if (node.type === 'paragraph') {
      if (node.content) node.content.forEach(walk);
      text += '\n';
    } else if (node.type === 'heading') {
      const level = '#'.repeat(node.attrs?.level || 2);
      text += `\n${level} `;
      if (node.content) node.content.forEach(walk);
      text += '\n';
    } else if (node.type === 'listItem') {
      text += '- ';
      if (node.content) node.content.forEach(walk);
      text += '\n';
    } else if (node.content && Array.isArray(node.content)) {
      node.content.forEach(walk);
    }
  }
  walk(content);
  return text.trim();
}

async function run() {
  console.log(`Connecting to ${BASE_URL} for org "${ORG_SLUG}"...`);
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 1. Authenticate / Mint JWT
  const authRes = await fetch(`${BASE_URL}/api/v1/admin/${ORG_SLUG}/auth/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user_id: 1 })
  });

  if (!authRes.ok) {
    throw new Error(`Auth failed with status ${authRes.status}: ${await authRes.text()}`);
  }
  const { access_token: jwt } = await authRes.json();
  console.log('✓ Successfully authenticated and minted user session JWT.');

  // 2. Fetch list of all courses
  const coursesRes = await fetch(`${BASE_URL}/api/v1/courses/org_slug/${ORG_SLUG}/page/1/limit/100`, {
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Accept': 'application/json'
    }
  });

  if (!coursesRes.ok) {
    throw new Error(`Failed to fetch courses: ${await coursesRes.text()}`);
  }

  const courses = await coursesRes.json();
  console.log(`✓ Fetched ${courses.length} courses from Azzam Academy.`);

  const catalog = [];

  for (let i = 0; i < courses.length; i++) {
    const c = courses[i];
    console.log(`\n[${i + 1}/${courses.length}] Processing "${c.name}" (${c.course_uuid})...`);

    // Fetch full course meta with chapters and lessons
    let meta = c;
    try {
      const metaRes = await fetch(`${BASE_URL}/api/v1/courses/${c.course_uuid}/meta`, {
        headers: { 'Authorization': `Bearer ${jwt}` }
      });
      if (metaRes.ok) {
        meta = await metaRes.json();
      }
    } catch (e) {
      console.warn(`Could not fetch meta for ${c.course_uuid}: ${e.message}`);
    }

    let parsedLearnings = [];
    try {
      if (typeof meta.learnings === 'string' && meta.learnings.startsWith('[')) {
        parsedLearnings = JSON.parse(meta.learnings);
      }
    } catch (e) {}

    const safeName = c.name.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').toLowerCase();
    const fileName = `${String(i + 1).padStart(2, '0')}_${safeName.slice(0, 40)}.md`;
    const filePath = path.join(OUTPUT_DIR, fileName);

    let doc = `# ${c.name}\n\n`;
    doc += `> **Course UUID:** \`${c.course_uuid}\`  \n`;
    doc += `> **Tags:** \`${c.tags || 'General Trading'}\`  \n`;
    doc += `> **Status:** ${c.published ? 'Published' : 'Draft / Internal'} | **Public:** ${c.public}\n\n`;
    
    if (c.description) {
      doc += `## Overview\n${c.description}\n\n`;
    }

    if (c.about) {
      doc += `## About & Master Curriculum\n${c.about}\n\n`;
    }

    if (parsedLearnings.length > 0) {
      doc += `## Core Key Takeaways & Competencies\n`;
      parsedLearnings.forEach(l => {
        doc += `- ${l.emoji || '📌'} ${l.text}\n`;
      });
      doc += `\n`;
    }

    if (meta.chapters && meta.chapters.length > 0) {
      doc += `## Syllabus & Chapter Breakdown (${meta.chapters.length} Chapters)\n\n`;
      meta.chapters.forEach((ch, chIdx) => {
        doc += `### Chapter ${chIdx + 1}: ${ch.name}\n`;
        if (ch.description && ch.description !== ch.name) {
          doc += `${ch.description}\n\n`;
        }
        if (ch.activities && ch.activities.length > 0) {
          ch.activities.forEach((act, actIdx) => {
            doc += `#### Lesson ${chIdx + 1}.${actIdx + 1}: ${act.name}\n`;
            if (act.content) {
              const parsedText = parseDynamicDoc(act.content);
              if (parsedText) {
                doc += `${parsedText}\n\n`;
              }
            }
          });
        }
        doc += `\n`;
      });
    }

    fs.writeFileSync(filePath, doc, 'utf-8');
    console.log(`  -> Saved to ${fileName}`);

    catalog.push({
      index: i + 1,
      title: c.name,
      uuid: c.course_uuid,
      tags: c.tags,
      fileName,
      chaptersCount: meta.chapters ? meta.chapters.length : 0
    });
  }

  // Create Master Index
  let indexDoc = `# Azzam Master Academy — Knowledge Catalog (9+ Live Trading Courses)\n\n`;
  indexDoc += `Nguồn tri thức trực tiếp từ API: \`${BASE_URL}\` (Org: \`${ORG_SLUG}\`)\n\n`;
  indexDoc += `Tài liệu này được đồng bộ tự động để làm Master Knowledge Base cho Hermes Copilot, hệ sinh thái kịch bản và phân tích thị trường XAUUSD Risk-First.\n\n`;
  indexDoc += `| STT | Khóa học (Course Title) | Chương (Chapters) | File Chi Tiết |\n`;
  indexDoc += `|---|---|---|---|\n`;

  catalog.forEach(item => {
    indexDoc += `| ${item.index} | **${item.title}** | ${item.chaptersCount} chapters | [${item.fileName}](./${item.fileName}) |\n`;
  });

  indexDoc += `\n## Ứng dụng vào Hermes Copilot & Kịch bản Video:\n`;
  indexDoc += `1. **Khóa SMC (Smart Money Concepts) & XAUUSD:** Cung cấp định nghĩa chuẩn mực về FVG (Fair Value Gap), Consequent Encroachment 50%, BOS (Break of Structure), Liquidity Sweep và Manipulation POI.\n`;
  indexDoc += `2. **Khóa Risk & Portfolio Management:** Khẳng định kỷ luật cắt lỗ (SL 20 pips, Risk Budget $30 / 1% tài khoản) giải quyết triệt để nỗi đau gồng lỗ PP-0023 và bẫy PDF PP-0039.\n`;
  indexDoc += `3. **Khóa MQL4 & Algorithmic Trading:** Nền tảng tư duy toán học và tự động hóa quy tắc vào lệnh.\n`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'INDEX.md'), indexDoc, 'utf-8');
  console.log(`\n✓ Successfully generated Master Catalog INDEX.md with ${catalog.length} courses!`);
}

run().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
