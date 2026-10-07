import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for VisayasBucketList...');

  // 1. Create Default Categories
  const categoriesData = [
    { name: 'Beach', description: 'Pristine white sand beaches and tropical shorelines' },
    { name: 'Mountain', description: 'Scenic peaks, trekking routes, and hill summits' },
    { name: 'Waterfall', description: 'Crystal-clear cascades and canyon adventures' },
    { name: 'Nature', description: 'Eco-parks, rivers, caves, and scenic reserves' },
    { name: 'Adventure', description: 'Thrilling water activities, diving, and ziplines' },
    { name: 'Historical', description: 'Colonial landmarks, monuments, and century-old sites' },
    { name: 'Cultural', description: 'Heritage structures, museums, and local traditions' },
    { name: 'Island', description: 'Island-hopping spots and secluded islets' },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    categoryMap[cat.name] = record.id;
  }
  console.log('✅ Categories seeded successfully.');

  // 2. Create Admin and Test User (Admin credentials securely loaded from .env)
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'System Admin';

  if (adminEmail && adminPassword) {
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        role: 'ADMIN',
      },
      create: {
        name: adminName,
        email: adminEmail,
        password_hash: adminPasswordHash,
        role: 'ADMIN',
      },
    });
    console.log(`✅ Admin user (${adminEmail}) seeded successfully from environment variables.`);
  } else {
    console.log('ℹ️ Admin user not seeded. Provide ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env to automatically seed an administrator.');
  }

  const demoUserPasswordHash = await bcrypt.hash('User@123456', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'traveler@visayasbucketlist.ph' },
    update: {},
    create: {
      name: 'Juan Dela Cruz',
      email: 'traveler@visayasbucketlist.ph',
      password_hash: demoUserPasswordHash,
      role: 'USER',
    },
  });
  console.log('✅ Users seeded successfully (Admin & Demo User).');

  // 3. Create Sample Visayas Destinations
  const destinationsData = [
    {
      name: 'Kawasan Falls',
      slug: 'kawasan-falls',
      description: 'A world-renowned multi-tiered waterfall famous for its turquoise blue natural pools and thrilling canyoneering excursions in Badian.',
      province: 'Cebu',
      region: 'Central Visayas',
      location: 'Badian, Cebu',
      latitude: 9.8042,
      longitude: 123.3746,
      estimated_budget: 2500,
      recommended_days: 1,
      image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      category_id: categoryMap['Waterfall'],
    },
    {
      name: 'Chocolate Hills',
      slug: 'chocolate-hills',
      description: 'Over 1,200 conical geological formations that turn cocoa-brown in the dry season, creating a breathtaking surreal landscape.',
      province: 'Bohol',
      region: 'Central Visayas',
      location: 'Carmen, Bohol',
      latitude: 9.9192,
      longitude: 124.1672,
      estimated_budget: 1500,
      recommended_days: 1,
      image_url: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
      category_id: categoryMap['Nature'],
    },
    {
      name: 'White Beach Boracay',
      slug: 'white-beach-boracay',
      description: 'A 4-kilometer stretch of world-famous powdery white sand with vibrant sunset bars, water sports, and crystal blue ocean.',
      province: 'Aklan',
      region: 'Western Visayas',
      location: 'Boracay Island, Malay, Aklan',
      latitude: 11.9674,
      longitude: 121.9248,
      estimated_budget: 8000,
      recommended_days: 3,
      image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      category_id: categoryMap['Beach'],
    },
    {
      name: 'Kalanggaman Island',
      slug: 'kalanggaman-island',
      description: 'A pristine paradise sandbar island surrounded by turquoise waters, ideal for beach camping, swimming, and stargazing.',
      province: 'Leyte',
      region: 'Eastern Visayas',
      location: 'Palompon, Leyte',
      latitude: 11.1166,
      longitude: 124.2505,
      estimated_budget: 3000,
      recommended_days: 2,
      image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      category_id: categoryMap['Island'],
    },
    {
      name: 'Cambugahay Falls',
      slug: 'cambugahay-falls',
      description: 'A serene three-tiered waterfall in mystical Siquijor famous for rope swings and peaceful freshwater lagoons.',
      province: 'Siquijor',
      region: 'Central Visayas',
      location: 'Lazi, Siquijor',
      latitude: 9.1415,
      longitude: 123.6267,
      estimated_budget: 1200,
      recommended_days: 1,
      image_url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
      category_id: categoryMap['Waterfall'],
    },
    {
      name: 'Osmeña Peak',
      slug: 'osmena-peak',
      description: 'The highest point in Cebu Island offering dramatic jagged green hill clusters resembling jagged mini-chocolate hills and cool mountain breeze.',
      province: 'Cebu',
      region: 'Central Visayas',
      location: 'Dalaguete, Cebu',
      latitude: 9.8188,
      longitude: 123.4475,
      estimated_budget: 1800,
      recommended_days: 1,
      image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      category_id: categoryMap['Mountain'],
    },
    {
      name: 'Islas de Gigantes',
      slug: 'islas-de-gigantes',
      description: 'An island chain known for rugged rock cliffs, hidden lagoons, secluded beaches, and the freshest, most affordable scallops in the Philippines.',
      province: 'Iloilo',
      region: 'Western Visayas',
      location: 'Carles, Iloilo',
      latitude: 11.5973,
      longitude: 123.3429,
      estimated_budget: 4500,
      recommended_days: 2,
      image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      category_id: categoryMap['Island'],
    },
    {
      name: 'Bantayan Island',
      slug: 'bantayan-island',
      description: 'A laid-back tropical getaway at the northern tip of Cebu with quiet powdery beaches, fresh seafood, and bike-friendly fishing villages.',
      province: 'Cebu',
      region: 'Central Visayas',
      location: 'Santa Fe, Bantayan, Cebu',
      latitude: 11.1685,
      longitude: 123.7744,
      estimated_budget: 4000,
      recommended_days: 3,
      image_url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80',
      category_id: categoryMap['Beach'],
    },
  ];

  for (const dest of destinationsData) {
    await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: dest,
      create: dest,
    });
  }
  console.log('✅ Visayas Destinations seeded successfully.');

  // 4. Create Achievements
  const achievementsData = [
    {
      name: 'Island Explorer',
      description: 'Visit 5 destinations across the Visayas',
      icon: 'compass',
      requirement: 5,
    },
    {
      name: 'Beach Hopper',
      description: 'Visit 3 white-sand beaches',
      icon: 'sun',
      requirement: 3,
    },
    {
      name: 'Peak Seeker',
      description: 'Conquer 2 mountain or hill viewpoints',
      icon: 'mountain',
      requirement: 2,
    },
    {
      name: 'Visayas Master',
      description: 'Add at least 10 spots to your bucket list',
      icon: 'award',
      requirement: 10,
    },
  ];

  for (const ach of achievementsData) {
    const existing = await prisma.achievement.findFirst({ where: { name: ach.name } });
    if (!existing) {
      await prisma.achievement.create({ data: ach });
    }
  }
  console.log('✅ Achievements seeded successfully.');

  console.log('🎉 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
