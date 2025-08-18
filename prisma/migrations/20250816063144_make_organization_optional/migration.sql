/*
  Warnings:

  - A unique constraint covering the columns `[email,date,time]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "confirmToken" TEXT,
ADD COLUMN     "tokenExpires" TIMESTAMP(3),
ALTER COLUMN "organization" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_email_date_time_key" ON "public"."Booking"("email", "date", "time");
