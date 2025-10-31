import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function resetAndCreateAdmin() {
  try {
    console.log("🗑️  Deleting all existing data...");

    // Delete in correct order to respect foreign key constraints
    await prisma.message.deleteMany({});
    console.log("   ✓ Deleted all messages");

    await prisma.messageThread.deleteMany({});
    console.log("   ✓ Deleted all message threads");

    await prisma.wishlistItem.deleteMany({});
    console.log("   ✓ Deleted all wishlist items");

    await prisma.collectionItem.deleteMany({});
    console.log("   ✓ Deleted all collection items");

    await prisma.savedFilter.deleteMany({});
    console.log("   ✓ Deleted all saved filters");

    await prisma.listing.deleteMany({});
    console.log("   ✓ Deleted all listings");

    await prisma.refreshToken.deleteMany({});
    console.log("   ✓ Deleted all refresh tokens");

    await prisma.user.deleteMany({});
    console.log("   ✓ Deleted all users");

    console.log("\n👤 Creating new admin user...");

    // Hash the password
    const passwordHash = await bcrypt.hash("12345678", 10);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: "neerajsa@umich.edu",
        displayName: "Neeraj Saini",
        passwordHash: passwordHash,
        role: "ADMIN",
      },
    });

    console.log("\n✅ Success! Admin user created:");
    console.log("   Email: neerajsa@umich.edu");
    console.log("   Display Name: Neeraj Saini");
    console.log("   Password: 12345678");
    console.log("   Role: ADMIN");
    console.log(`   User ID: ${adminUser.id}`);
    console.log("\n🎉 You can now login with these credentials!");
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

resetAndCreateAdmin();
