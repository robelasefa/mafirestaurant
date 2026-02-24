import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getToken } from "next-auth/jwt";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { newPassword } = await req.json();

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: token.id as string },
            data: {
                password: hashedPassword,
                needsPasswordChange: false, // Flag successfully flipped!
            },
        });

        return NextResponse.json({ success: true, message: "Password updated successfully." }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
