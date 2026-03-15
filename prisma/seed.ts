import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { encrypt } from "../lib/crypto";

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

  const cloudinaryName = process.env.CLOUDINARY_CLOUD_NAME;
  const cloudinaryKey = process.env.CLOUDINARY_API_KEY;
  const cloudinarySecret = process.env.CLOUDINARY_API_SECRET;

  if (rawPassword && id && cloudinaryName && cloudinaryKey && cloudinarySecret) {
    // Hash password with the same settings as DAL
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const updateData = {
      email,
      password: hashedPassword,
      phoneNumber,
      landingSeoTitle,
      landingSeoDescription,
      landingSeoKeywords,
      cloudinaryName,
      cloudinaryKey: encrypt(cloudinaryKey),
      cloudinarySecret: encrypt(cloudinarySecret),
    } as Prisma.SuperAdminUpdateInput;

    const createData = {
      id,
      email,
      password: hashedPassword,
      phoneNumber,
      landingSeoTitle,
      landingSeoDescription,
      landingSeoKeywords,
      cloudinaryName,
      cloudinaryKey: encrypt(cloudinaryKey),
      cloudinarySecret: encrypt(cloudinarySecret),
    } as Prisma.SuperAdminUncheckedCreateInput;

    await prisma.superAdmin.upsert({
      where: { id },
      update: updateData,
      create: createData,
    });

    console.log(`Seeded SuperAdmin with id=${id}, email=${email}`);
  } else {
    console.error(
      "SUPER_ADMIN_PASSWORD, MAIN_DOMAIN or Cloudinary env vars are not set",
    );
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
