/*
  Warnings:

  - A unique constraint covering the columns `[cpfCnpj]` on the table `Record` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Record` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpfCnpj` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "cpfCnpj" TEXT NOT NULL,
ADD COLUMN     "number" TEXT NOT NULL,
ADD COLUMN     "pixCode" TEXT,
ADD COLUMN     "qrCodePath" TEXT,
ADD COLUMN     "used" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "TwilioConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "accountSid" TEXT NOT NULL,
    "authToken" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TwilioConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Record_cpfCnpj_key" ON "Record"("cpfCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Record_code_key" ON "Record"("code");
