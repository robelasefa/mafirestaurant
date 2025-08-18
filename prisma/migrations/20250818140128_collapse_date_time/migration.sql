/*
  Warnings:

  - You are about to drop the column `date` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,bookingAt]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingAt` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Booking_email_date_time_key";

-- AlterTable
ALTER TABLE "public"."Booking" DROP COLUMN "date",
DROP COLUMN "time",
ADD COLUMN     "bookingAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_email_bookingAt_key" ON "public"."Booking"("email", "bookingAt");
