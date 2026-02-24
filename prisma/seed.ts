import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create a default staff user
  const hashedPassword = await bcrypt.hash('staff123', 10);

  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@mafirestaurant.com' },
    update: {},
    create: {
      email: 'staff@mafirestaurant.com',
      name: 'Staff User',
      password: hashedPassword,
      role: 'staff',
    },
  });

  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@mafirestaurant.com' },
    update: {},
    create: {
      email: 'admin@mafirestaurant.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin',
    },
  });

  console.log('Staff user created:', staffUser);
  console.log('Admin user created:', adminUser);

  // Add some sample bookings
  const sampleBookings = [
    {
      name: 'Alemu Bekele',
      email: 'alemu@example.com',
      organization: 'Adama Tech',
      bookingAt: new Date('2024-07-10T14:00:00Z'),
      purpose: 'Board Meeting',
      status: 'pending',
      phone: '1234567890',
    },
    {
      name: 'Sara Tadesse',
      email: 'sara@example.com',
      organization: 'Ethiopia Bank',
      bookingAt: new Date('2024-07-12T10:00:00Z'),
      purpose: 'Training Session',
      status: 'approved',
      phone: '0987654321',
    },
    {
      name: 'Mulugeta Kebede',
      email: 'mulu@example.com',
      organization: 'NGO Connect',
      bookingAt: new Date('2024-07-15T16:00:00Z'),
      purpose: 'Charity Event Planning',
      status: 'rejected',
      phone: '1112223333',
    },
  ];

  for (const booking of sampleBookings) {
    const existing = await prisma.booking.findFirst({
      where: { email: booking.email, bookingAt: booking.bookingAt }
    });
    if (!existing) {
      await prisma.booking.create({ data: booking });
    }
  }

  console.log('Sample bookings created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
