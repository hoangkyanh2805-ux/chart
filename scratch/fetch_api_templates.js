const https = require('https');
const fs = require('fs');

https.get('https://www.chartanimator.io/api/templates', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Length:', data.length);
    try {
      const json = JSON.parse(data);
      console.log('Is array:', Array.isArray(json));
      if (Array.isArray(json)) {
        console.log('Templates count:', json.length);
        console.log('Sample item:', json[0]);
      } else {
        console.log('Keys:', Object.keys(json));
        console.log('Templates in obj:', json.templates?.length || json.data?.length);
      }
      fs.writeFileSync('sources/api_templates.json', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Raw start:', data.substring(0, 300));
    }
  });
});
