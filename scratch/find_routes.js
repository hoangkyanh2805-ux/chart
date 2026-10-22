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
  const home = await fetchText('https://www.chartanimator.io/');
  const matches = home.match(/\/_next\/static\/chunks\/[^"'\s>]+/g) || [];
  const unique = [...new Set(matches)];
  console.log('Homepage chunks:', unique);

  for (const chunk of unique) {
    if (chunk.includes('app/page') || chunk.includes('app/layout') || chunk.includes('main')) {
      const content = await fetchText('https://www.chartanimator.io' + chunk);
      const routes = content.match(/href:["']\/[^"']+/g) || [];
      console.log(`Routes in ${chunk}:`, [...new Set(routes)].slice(0, 15));
    }
  }
}

main().catch(console.error);
