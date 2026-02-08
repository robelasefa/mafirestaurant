import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["pending", "approved", "rejected"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { params } = context ?? { params: { id: "" } }; // id will be "" if undefined, handle this as needed
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
      return NextResponse.json(
        { error: "Invalid status. Must be pending, approved, or rejected." },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { params } = context ?? { params: { id: "" } };
  try {
    const { id } = params;

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    await prisma.booking.delete({ where: { id } });

    return NextResponse.json(
      { message: "Booking deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
