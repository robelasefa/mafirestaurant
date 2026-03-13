export async function sendTelegramNotification(bookingData: any) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.warn("⚠️ Telegram env vars missing");
      return;
    }

    const dateStr = bookingData.bookingAt
      ? new Date(bookingData.bookingAt).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Not specified";

    const message = [
      "🔔 *New Booking Alert!*",
      "---------------------------",
      `👤 *Client:* ${bookingData.name}`,
      `📅 *Date:* ${dateStr}`,
      `📍 *Purpose:* ${bookingData.purpose || "-"}`,
      `📞 *Phone:* ${bookingData.phone || "N/A"}`,
      "---------------------------",
    ].join("\n");

    const keyboard: any[] = [
      [
        {
          text: "✅ View in Dashboard",
          url: "https://mafirestaurant.vercel.app/staff/manage-bookings",
        },
      ],
    ];

    if (bookingData.phone) {
      const phone = bookingData.phone.replace(/\D/g, "");

      keyboard.push([
        {
          text: `📞 Client: ${phone}`,
          url: `https://wa.me/${phone}`,
        },
      ]);
    }

    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "MarkdownV2",
          reply_markup: {
            inline_keyboard: keyboard,
          },
        }),
      }
    );

    const data = await res.json();
    console.log("📩 Telegram response:", data);

    if (!data.ok) {
      console.error("❌ Telegram API error:", data);
      return;
    }

    console.log("✅ Telegram notification sent");
  } catch (error) {
    console.error("❌ Telegram notification failed:", error);
  }
}
