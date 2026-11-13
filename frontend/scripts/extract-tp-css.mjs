import fs from 'fs';

const src = fs.readFileSync('src/pages/services/TaxPlanningPage.jsx', 'utf8');
const lines = src.split('\n');
const cssLine = lines[385];

// strip the wrapper: <style>{"\n...\n"}</style>
const start = cssLine.indexOf('>') + 1;
const end = cssLine.lastIndexOf('}');
let css = cssLine.slice(start, end);
// unescape
css = css.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');

fs.writeFileSync('C:/temp/tp_css.txt', css);
console.log('len', css.length);
// print rules mentioning hc / d3 / media
const mentions = css.split('}').filter((r) => /\.hc|\.in\.d3|@media|\.stp/.test(r));
console.log('rule blocks found:', mentions.length);
mentions.slice(0, 60).forEach((r) => console.log('---', r.trim().slice(0, 200)));
