/*
  Warnings:

  - The primary key for the `SuperAdmin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `domain` on the `SuperAdmin` table. All the data in the column will be lost.
  - You are about to drop the column `domain` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Tenant` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "SuperAdmin_domain_key";

-- DropIndex
DROP INDEX "Tenant_domain_key";

-- AlterTable
ALTER TABLE "SuperAdmin" DROP CONSTRAINT "SuperAdmin_pkey",
DROP COLUMN "domain",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SuperAdmin_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "domain",
DROP COLUMN "updatedAt";
