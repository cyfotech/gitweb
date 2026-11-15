const fs = require('fs');
const c = fs.readFileSync('frontend/src/pages/ContactPage.jsx', 'utf8');
const idx = c.indexOf('submit');
let cur = 0;
while ((cur = c.indexOf('submit', cur)) !== -1) {
  console.log('submit at', cur, ':', c.substring(cur - 40, cur + 100));
  cur += 6;
}
