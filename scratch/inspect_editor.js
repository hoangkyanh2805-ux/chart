const https = require('https');

https.get('https://www.chartanimator.io/editor', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Length:', data.length);
    const matches = data.match(/\/_next\/static\/chunks\/[^"'\s>]+/g) || [];
    const unique = [...new Set(matches)];
    console.log('Found chunks count:', unique.length);
    console.log('Sample chunks:', unique.slice(0, 15));
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
