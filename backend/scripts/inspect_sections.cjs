const mysql = require('mysql2/promise');

(async () => {
  const c = await mysql.createConnection({
    host: 'localhost', user: 'root', password: 'root', database: 'preferred_tax_consultancy',
  });
  const [rows] = await c.query(
    'SELECT id, sectionKey, sectionType, LEFT(content, 500) AS c FROM pagesection ORDER BY displayOrder'
  );
  for (const r of rows) {
    console.log('---', r.id, '|', r.sectionKey, '|', r.sectionType);
    console.log(r.c);
    console.log();
  }
  await c.end();
})().catch((e) => { console.error(e); process.exit(1); });
