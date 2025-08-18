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

  console.log('Staff user created:', staffUser);
  
  // Add some sample bookings
  const sampleBookings = [
    {
      name: 'Alemu Bekele',
      email: 'alemu@example.com',
      organization: 'Adama Tech',
      date: '2024-07-10',
      time: '14:00',
      purpose: 'Board Meeting',
      status: 'pending',
    },
    {
      name: 'Sara Tadesse',
      email: 'sara@example.com',
      organization: 'Ethiopia Bank',
      date: '2024-07-12',
      time: '10:00',
      purpose: 'Training Session',
      status: 'approved',
    },
    {
      name: 'Mulugeta Kebede',
      email: 'mulu@example.com',
      organization: 'NGO Connect',
      date: '2024-07-15',
      time: '16:00',
      purpose: 'Charity Event Planning',
      status: 'rejected',
    },
  ];

  for (const booking of sampleBookings) {
    await prisma.booking.upsert({
      where: { 
        email_date_time: {
          email: booking.email,
          date: booking.date,
          time: booking.time,
        }
      },
      update: {},
      create: booking,
    });
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
