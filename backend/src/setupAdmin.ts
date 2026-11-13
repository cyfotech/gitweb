import * as dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function setupAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@preferredtax.com';
  const password = process.env.ADMIN_PASSWORD || 'root'; // set to root as requested by user
  const name = 'Super Admin';

  const passwordHash = await bcrypt.hash(password, 10);

  let superRole = await prisma.adminrole.findUnique({
    where: { name: 'SUPER_ADMIN' },
  });
  if (!superRole) {
    superRole = await prisma.adminrole.create({
      data: {
        id: uuidv4(),
        name: 'SUPER_ADMIN',
        description: 'Super Administrator role for Preferred Tax Consultancy',
      },
    });
  }

  const existing = await prisma.adminuser.findUnique({ where: { email } });
  if (existing) {
    await prisma.adminuser.update({
      where: { email },
      data: {
        password: passwordHash,
        name,
        roleId: superRole.id,
      },
    });
    console.log(`✅ Super admin updated: ${email} with password: ${password}`);
  } else {
    await prisma.adminuser.create({
      data: {
        id: uuidv4(),
        email,
        name,
        password: passwordHash,
        roleId: superRole.id,
      },
    });
    console.log(`✅ Super admin created: ${email} with password: ${password}`);
  }

  await prisma.$disconnect();
}

setupAdmin().catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
});
