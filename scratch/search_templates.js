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
  const matches = [...new Set(home.match(/\/_next\/static\/chunks\/[^"'\s>]+/g) || [])];
  
  const keywords = ['Entry Checklist', 'RSI Reversal', 'SMT Imbalance', 'Break & Retest', 'YOU STOP WATCHING', 'Trap Model', 'Triple Tap', 'ODZ'];

  for (const chunk of matches) {
    const text = await fetchText('https://www.chartanimator.io' + chunk);
    for (const kw of keywords) {
      if (text.includes(kw)) {
        console.log(`Found "${kw}" in ${chunk}`);
        const idx = text.indexOf(kw);
        console.log('Snippet:', text.substring(Math.max(0, idx - 100), Math.min(text.length, idx + 200)));
      }
    }
  }
}

main().catch(console.error);
