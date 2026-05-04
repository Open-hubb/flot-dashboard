-- CreateEnum
CREATE TYPE "CustomerOrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- CreateTable
CREATE TABLE "CustomerOrder" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "total" DECIMAL(18,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NLE',
    "flotRequestId" TEXT,
    "status" "CustomerOrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerOrder_flotRequestId_key" ON "CustomerOrder"("flotRequestId");

-- CreateIndex
CREATE INDEX "CustomerOrder_merchantId_createdAt_idx" ON "CustomerOrder"("merchantId", "createdAt");

-- CreateIndex
CREATE INDEX "CustomerOrder_status_idx" ON "CustomerOrder"("status");

-- AddForeignKey
ALTER TABLE "CustomerOrder" ADD CONSTRAINT "CustomerOrder_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
