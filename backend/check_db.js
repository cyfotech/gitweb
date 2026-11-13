const {PrismaClient} = require('./dist/generated/prisma');
const p = new PrismaClient();
p.websitepage.findMany({
  where:{slug:{in:['home','about']}},
  include:{sections:{orderBy:{displayOrder:'asc'}}}
}).then(r => {
  const summary = r.map(pg => ({
    slug: pg.slug,
    sections: pg.sections.map(s => ({
      id: s.id,
      sectionKey: s.sectionKey,
      title: s.title,
      contentPreview: s.content ? s.content.substring(0, 200) : 'null'
    }))
  }));
  console.log(JSON.stringify(summary, null, 2));
}).catch(console.error).finally(() => p.$disconnect());
