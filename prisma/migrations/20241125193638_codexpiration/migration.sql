/*
  Warnings:

  - Added the required column `codigoExpiresAt` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "codigoExpiresAt" TIMESTAMP(3) NOT NULL;
