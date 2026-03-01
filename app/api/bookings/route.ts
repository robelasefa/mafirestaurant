import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // 1. Parse JSON instead of FormData
    const body = await request.json();

    const { 
      name, 
      email, 
      phone, 
      organization, 
      bookingAt, 
      purpose, 
      letterUrl 
    } = body;

    // 2. Required fields validation
    if (!name || !email || !bookingAt || !purpose) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // 3. Validate booking date
    const bookingDate = new Date(bookingAt);
    if (isNaN(bookingDate.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid booking date." },
        { status: 400 }
      );
    }

    // 4. Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format." },
        { status: 400 }
      );
    }

    // 5. Create booking in Prisma
    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        phone: phone || null,
        organization: organization || null,
        bookingAt: bookingDate,
        purpose,
        status: "pending",
        letterUrl: letterUrl || null, // This is just the string URL from UploadThing
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully.",
        data: booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    if (!session || (role !== "admin" && role !== "staff")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
