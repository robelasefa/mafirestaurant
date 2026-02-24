import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const organization = formData.get("organization") as string;
    const bookingAt = formData.get("bookingAt") as string;
    const purpose = formData.get("purpose") as string;
    const letter = formData.get("letter") as File | null;

    // Required fields
    if (!name || !email || !bookingAt || !purpose) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: name, email, bookingAt, purpose." },
        { status: 400 }
      );
    }

    // Validate booking date
    const bookingDate = new Date(bookingAt);
    if (isNaN(bookingDate.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid booking date." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format." },
        { status: 400 }
      );
    }

    let letterUrl = null;

    if (letter && letter.size > 0) {
      const bytes = await letter.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), "public", "uploads", "letters");
      await mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${letter.name.replace(/\s+/g, "_")}`;
      const filePath = join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      letterUrl = `/uploads/letters/${fileName}`;
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        phone: phone || null,
        organization: organization || null,
        bookingAt: bookingDate,
        purpose,
        status: "pending",
        letterUrl,
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
