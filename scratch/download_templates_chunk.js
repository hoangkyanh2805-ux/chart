const https = require('https');
const fs = require('fs');

https.get('https://www.chartanimator.io/_next/static/chunks/app/templates/page-3c41623c05bc622d.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('sources/templates_page_chunk.js', data);
    console.log('Saved sources/templates_page_chunk.js, length:', data.length);
    // Find strings
    const titles = data.match(/title:["'][^"']+["']/g) || [];
    console.log('Titles count:', titles.length);
    console.log('Sample titles:', titles.slice(0, 20));
  });
});
