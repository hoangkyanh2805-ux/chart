const https = require('https');
const fs = require('fs');

https.get('https://www.chartanimator.io/api/templates/cmsh8syom0006le043p01hriq', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Template detail status:', res.statusCode);
    console.log('Length:', data.length);
    try {
      const json = JSON.parse(data);
      console.log('Keys:', Object.keys(json));
      fs.writeFileSync('sources/sample_template_detail.json', JSON.stringify(json, null, 2));
    } catch(e) {
      console.log('Error parsing:', e.message);
    }
  });
});
