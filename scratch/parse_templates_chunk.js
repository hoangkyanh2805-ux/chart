const fs = require('fs');
const content = fs.readFileSync('sources/templates_page_chunk.js', 'utf8');

// Look for API endpoints or fetches
const apiCalls = content.match(/\/api\/[^"'\s`]+/g) || [];
console.log('API calls in chunk:', [...new Set(apiCalls)]);

// Look for patterns like "Entry Checklist", "SMT", "Reversal"
const matches = content.match(/[A-Z][a-zA-Z\s&/]{3,30}(Pattern|Entry|Model|Setup|Liquidity|Gap)/g) || [];
console.log('Matches count:', matches.length);
console.log('Sample matches:', [...new Set(matches)].slice(0, 30));
