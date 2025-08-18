import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@/generated/client";
import crypto from "crypto";
import { supabase } from "../../../lib/supabse";

const prisma = new PrismaClient();

// Generate secure confirmation token
const generateToken = () => crypto.randomBytes(32).toString("hex");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, organization, bookingAt, purpose } = body;

    if (!name || !email || !bookingAt || !purpose) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const confirmToken = generateToken();
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        organization: organization || "General",
        bookingAt: new Date(bookingAt),
        purpose,
        status: "pending",
        confirmToken,
        tokenExpires,
      },
    });

    const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/?bookingStatus=success&token=${confirmToken}`;

    try {
      await supabase.functions.invoke("send_email", {
        body: {
          to: email,
          subject: "Confirm your Mafi Restaurant booking",
          html: `
            <p>Hello ${name},</p>
            <p>Please confirm your booking by clicking the link below:</p>
            <a href="${confirmUrl}">Confirm Booking</a>
            <p>This link will expire in 24 hours.</p>
          `,
        },
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Still return success, booking is saved
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully. Please check your email to confirm.",
        data: booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
