import { prisma } from '../src/utils/prisma';

// Clean up database before each test file
beforeAll(async () => {
  // Clean up all tables in the right order (respecting foreign keys)
  await prisma.message.deleteMany();
  await prisma.messageThread.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
});

// Close database connection after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

// Increase timeout for database operations
jest.setTimeout(30000);
