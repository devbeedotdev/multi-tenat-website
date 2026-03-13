-- CreateTable
CREATE TABLE "Product" (
    "productId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productCategory" TEXT NOT NULL,
    "productAmount" INTEGER NOT NULL,
    "discountPrice" INTEGER,
    "isDetailsTabular" BOOLEAN NOT NULL,
    "quantityAvailable" INTEGER NOT NULL,
    "isNegotiable" BOOLEAN NOT NULL,
    "isPromo" BOOLEAN NOT NULL,
    "isBestSelling" BOOLEAN NOT NULL,
    "productDetails" JSONB NOT NULL,
    "mediaUrls" TEXT[],
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "currency" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
