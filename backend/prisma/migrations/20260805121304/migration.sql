/*
  Warnings:

  - The values [VIP] on the enum `SeatType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SeatType_new" AS ENUM ('SILVER', 'GOLD', 'PLATINUM');
ALTER TABLE "public"."Seat" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Seat" ALTER COLUMN "type" TYPE "SeatType_new" USING ("type"::text::"SeatType_new");
ALTER TYPE "SeatType" RENAME TO "SeatType_old";
ALTER TYPE "SeatType_new" RENAME TO "SeatType";
DROP TYPE "public"."SeatType_old";
ALTER TABLE "Seat" ALTER COLUMN "type" SET DEFAULT 'SILVER';
COMMIT;
