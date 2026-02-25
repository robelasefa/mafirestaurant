import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
      // Validate file size (2MB max)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (letter.size > maxSize) {
        return NextResponse.json(
          { success: false, message: "File size must be less than 2MB." },
          { status: 400 }
        );
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png'
      ];
      
      if (!allowedTypes.includes(letter.type)) {
        return NextResponse.json(
          { success: false, message: "Invalid file type. Allowed types: PDF, DOC, DOCX, JPG, PNG." },
          { status: 400 }
        );
      }

      try {
        const bytes = await letter.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = join(process.cwd(), "public", "uploads", "letters");
        await mkdir(uploadDir, { recursive: true });

        // Sanitize filename
        const sanitizedName = letter.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${Date.now()}-${sanitizedName}`;
        const filePath = join(uploadDir, fileName);
        
        await writeFile(filePath, buffer);
        letterUrl = `/uploads/letters/${fileName}`;
      } catch (fileError) {
        console.error("❌ Error uploading file:", fileError);
        return NextResponse.json(
          { success: false, message: "Failed to upload file. Please try again." },
          { status: 500 }
        );
      }
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
