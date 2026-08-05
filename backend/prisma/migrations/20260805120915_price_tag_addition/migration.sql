/*
  Warnings:

  - The `type` column on the `Seat` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `ticketPrice` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SeatType" AS ENUM ('SILVER', 'GOLD', 'VIP');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "convenienceFee" DECIMAL(10,2) NOT NULL DEFAULT 1.50,
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "ticketPrice" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "totalAmount" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "type",
ADD COLUMN     "type" "SeatType" NOT NULL DEFAULT 'SILVER';

-- AlterTable
ALTER TABLE "Showtime" ADD COLUMN     "basePrice" DECIMAL(10,2) NOT NULL DEFAULT 10.00;
