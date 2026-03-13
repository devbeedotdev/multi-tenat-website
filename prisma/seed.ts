import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  // Use your main domain as the SuperAdmin.id
  const id = process.env.MAIN_DOMAIN;

  const email = "superadmin@getcheapecommerce.com";
  const rawPassword = process.env.SUPER_ADMIN_PASSWORD;
  const phoneNumber = "23409025570361";

  const landingSeoTitle =
    "GetCheapEcommerce – Launch a Professional Online Store in 30 Minutes for ₦50,000";
  const landingSeoDescription =
    "Get a beautiful, conversion-focused ecommerce website for just ₦50,000 and start selling online in under 30 minutes. Done-for-you setup, mobile-ready storefronts, WhatsApp checkout, inventory management and a friendly admin dashboard included.";
  const landingSeoKeywords =
    "ecommerce website, online store, nigeria ecommerce, cheap ecommerce, affordable online shop, launch store fast, getcheapecommerce, whatsapp checkout, small business ecommerce, sell online in nigeria, 50000 naira website";

  if (rawPassword && id) {
    // Hash password with the same settings as DAL
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    await prisma.superAdmin.upsert({
      where: { id },
      update: {
        email,
        password: hashedPassword,
        phoneNumber,
        landingSeoTitle,
        landingSeoDescription,
        landingSeoKeywords,
      },
      create: {
        id,
        email,
        password: hashedPassword,
        phoneNumber,
        landingSeoTitle,
        landingSeoDescription,
        landingSeoKeywords,
      },
    });

    console.log(`Seeded SuperAdmin with id=${id}, email=${email}`);
  } else {
    console.error("SUPER_ADMIN_PASSWORD or MAIN_DOMAIN is not set");
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
