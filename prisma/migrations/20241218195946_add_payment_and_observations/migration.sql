-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "lastStatusUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "observations" TEXT,
ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'pix';
