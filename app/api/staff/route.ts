import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reportError } from "@/lib/telegram";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { staffSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const result = staffSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues.map(e => e.message).join(" ") },
        { status: 400 }
      );
    }

    const { name, email, password, role } = result.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User with this email already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json({ message: "Staff member created.", user }, { status: 201 });
  } catch (err) {
    await reportError("Staff creation failed", err);
    
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
