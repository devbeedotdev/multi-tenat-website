-- CreateEnum
CREATE TYPE "TenantVariant" AS ENUM ('A', 'B', 'C');

-- CreateTable
CREATE TABLE "Tenant" (
    "tenantId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "businessPhoneNumber" TEXT NOT NULL,
    "businessEmail" TEXT NOT NULL,
    "adminPassword" TEXT NOT NULL,
    "variant" "TenantVariant" NOT NULL,
    "primaryColor" TEXT NOT NULL,
    "businessDescription" TEXT NOT NULL,
    "websiteDisplayName" TEXT NOT NULL,
    "bankAccountNumber" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "favIcon" TEXT NOT NULL,
    "logoUrl" TEXT,
    "isLogoHorizontal" BOOLEAN NOT NULL,
    "currency" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "domain" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("tenantId")
);

-- CreateTable
CREATE TABLE "SuperAdmin" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "domain" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "landingSeoTitle" TEXT,
    "landingSeoDescription" TEXT,
    "landingSeoKeywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuperAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_domain_key" ON "Tenant"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "SuperAdmin_domain_key" ON "SuperAdmin"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "SuperAdmin_email_key" ON "SuperAdmin"("email");
