const https = require('https');

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const page = await fetchText('https://www.chartanimator.io/templates');
  console.log('Templates page length:', page.length);
  const chunks = [...new Set(page.match(/\/_next\/static\/chunks\/[^"'\s>]+/g) || [])];
  console.log('Templates page chunks:', chunks);

  for (const chunk of chunks) {
    if (chunk.includes('template') || chunk.includes('app/')) {
      const text = await fetchText('https://www.chartanimator.io' + chunk);
      console.log(`Chunk ${chunk} length:`, text.length);
      if (text.includes('Entry Checklist') || text.includes('SMT') || text.includes('Trap Model')) {
        console.log(`*** FOUND TEMPLATES IN ${chunk} ***`);
        const idx = text.indexOf('Entry Checklist');
        console.log('Snippet:', text.substring(idx - 50, idx + 300));
      }
    }
  }
}

main().catch(console.error);
