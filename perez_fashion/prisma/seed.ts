import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const passwordHash = await bcrypt.hash('perezfashion2024', 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: 'contact@perezfashion.com' },
    update: {}, // Don't update if exists
    create: {
      email: 'contact@perezfashion.com',
      passwordHash,
      name: 'Mary Perez',
      role: 'admin',
    },
  });

  console.log('✅ Admin user created:');
  console.log('   Email:', admin.email);
  console.log('   Password: perezfashion2024');
  console.log('   ⚠️  CHANGE THIS PASSWORD after first login!');

  // Optional: Create sample gallery item for testing
  const sampleGallery = await prisma.galleryItem.create({
    data: {
      title: 'Sample Gallery Item',
      description: 'This is a sample item to test the gallery. Replace with real images.',
      beforeImagePath: 'https://placehold.co/600x800/e2e8f0/64748b?text=Before',
      afterImagePath: 'https://placehold.co/600x800/dcfce7/16a34a?text=After',
      category: 'sample',
      isVisible: true,
      displayOrder: 1,
    },
  });

  console.log('✅ Sample gallery item created');

  console.log('\n📊 Database seeding completed!');
  console.log('\n🚀 Next steps:');
  console.log('   1. Run: npm run dev');
  console.log('   2. Visit: http://localhost:3000/admin/login');
  console.log('   3. Login with: contact@perezfashion.com / perezfashion2024');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
