import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { RoleCode, species_code } from '../generated/prisma/enums';
import { prisma } from '../src/lib/prisma';

// Roles
const ROLES: { code: RoleCode; name: string; description: string }[] = [
  { code: RoleCode.ADMIN, name: 'Administrator', description: 'Full system access' },
  { code: RoleCode.STAFF, name: 'Staff', description: 'Clinic staff member' },
  { code: RoleCode.VET, name: 'Veterinarian', description: 'Licensed veterinarian' },
  { code: RoleCode.OWN, name: 'Owner', description: 'Pet owner / client' },
];

// Species
const SPECIES: { code: species_code; name: string; defaultVaccinePlan: boolean }[] = [
  { code: species_code.CAT, name: 'Cat', defaultVaccinePlan: true },
  { code: species_code.DOG, name: 'Dog', defaultVaccinePlan: true },
];

// Admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@petclinic.vn';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Admin@123';
const ADMIN_FULL_NAME = process.env.ADMIN_FULL_NAME ?? 'System Administrator';
const BCRYPT_ROUNDS = 12;

// Seed
async function main() {
  console.log('[...] Starting seed...\n');

  // 1. Upsert all roles
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: { name: role.name, description: role.description },
      create: { code: role.code, name: role.name, description: role.description },
    });
    console.log(` [✔]  Role [${role.code}] "${role.name}" ready`);
  }

  // 2. Upsert all species
  for (const specie of SPECIES) {
    await prisma.species.upsert({
      where: { code: specie.code },
      update: { name: specie.name, defaultVaccinePlan: specie.defaultVaccinePlan },
      create: { code: specie.code, name: specie.name, defaultVaccinePlan: specie.defaultVaccinePlan },
    });
    console.log(` [✔]  Species [${specie.code}] "${specie.name}" ready`);
  }

  // 3. Find the ADMIN role
  const adminRole = await prisma.role.findUniqueOrThrow({
    where: { code: RoleCode.ADMIN },
  });

  // 4. Upsert the initial admin user
  const existingAdmin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existingAdmin) {
    console.log(`\n   [ℹ] Admin account already exists (${ADMIN_EMAIL}), skipping creation.`);
  } else {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_ROUNDS);

    await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        password: passwordHash,
        fullName: ADMIN_FULL_NAME,
        roleId: adminRole.id,
        isActive: true,
      },
    });
    console.log(`\n   [✔] Admin account created`);
    console.log(`     Email    : ${ADMIN_EMAIL}`);
    console.log(`     Password : ${ADMIN_PASSWORD}  ← change this in production!`);
  }

  console.log('\n[Success]  Seed completed successfully.\n');
}

main()
  .catch(err => {
    console.error('[Error] Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
