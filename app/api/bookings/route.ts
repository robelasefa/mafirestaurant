import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramNotification } from "@/lib/telegram";
import { reportError } from "@/lib/telegram";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { bookingSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = bookingSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: result.error.issues.map(err => err.message).join(" "),
          errors: z.treeifyError(result.error)
        },
        { status: 400 }
      );
    }

    const { 
      name, 
      email, 
      phone, 
      organization, 
      bookingAt, 
      purpose, 
      letterUrl 
    } = result.data;

    const bookingDate = new Date(bookingAt);


    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        phone: phone || null,
        organization: organization || null,
        bookingAt: bookingDate,
        purpose,
        status: "pending",
        letterUrl: letterUrl || null, // string URL from UploadThing
      },
    });

    try {
      await sendTelegramNotification(booking);
    } catch (err) {
      console.error("Telegram notification failed but booking was saved:", err);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully.",
        data: booking,
      },
      { status: 201 }
    );
  } catch (error) {
    await reportError("Booking creation failed", error);
    
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
    await reportError("Fetching bookings failed", error);
    
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
