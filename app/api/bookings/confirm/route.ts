import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.redirect("/?bookingStatus=error&msg=Token missing");
    }

    // Find booking by token
    const booking = await prisma.booking.findFirst({ where: { confirmToken: token } });

    if (!booking) {
      return NextResponse.redirect("/?bookingStatus=error&msg=Invalid token");
    }

    // Check if token expired
    if (!booking.tokenExpires || new Date() > booking.tokenExpires) {
      return NextResponse.redirect("/?bookingStatus=error&msg=Token expired");
    }

    // Only update if still pending
    if (booking.status === "pending") {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "confirmed", confirmToken: null, tokenExpires: null },
      });
    }

    // Redirect to homepage with success alert
    return NextResponse.redirect("/?bookingStatus=success&msg=Booking confirmed successfully");
  } catch (error) {
    console.error("Error confirming booking:", error);
    return NextResponse.redirect("/?bookingStatus=error&msg=Server error");
  }
}
