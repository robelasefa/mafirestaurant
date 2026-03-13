import { NextRequest, NextResponse } from "next/server";
import { sendSystemAlert } from "./telegram";

export function withErrorMonitoring(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async function (req: NextRequest) {
    try {
      return await handler(req);
    } catch (error: any) {
      console.error("❌ Global API Error:", error);

      // Send error to Telegram
      await sendSystemAlert(
        `API Route Error: ${req.url}`,
        String(error.stack || error.message || error)
      );

      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
