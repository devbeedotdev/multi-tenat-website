-- AlterTable
ALTER TABLE "SuperAdmin" ADD COLUMN     "cloudinaryKey" TEXT,
ADD COLUMN     "cloudinaryName" TEXT,
ADD COLUMN     "cloudinarySecret" TEXT;

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "cloudinaryKey" TEXT,
ADD COLUMN     "cloudinaryName" TEXT,
ADD COLUMN     "cloudinarySecret" TEXT,
ADD COLUMN     "currentPlan" TEXT NOT NULL DEFAULT 'Starter',
ADD COLUMN     "imageSizeLimit" INTEGER NOT NULL DEFAULT 3145728,
ADD COLUMN     "videoSizeLimit" INTEGER NOT NULL DEFAULT 5242880;
