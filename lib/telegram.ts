export const sendTelegramNotification = async (bookingData: any) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram env vars missing: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
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

  const message = `
<b>🔔 New Booking Alert!</b>
---------------------------
<b>👤 Client:</b> ${bookingData.name}
<b>📅 Date:</b> ${dateStr}
<b>📍 Purpose:</b> ${bookingData.purpose || "-"}
<b>📞 Phone:</b> ${bookingData.phone || "N/A"}
---------------------------
  `.trim();

  // Build inline keyboard — only add "Call Client" if phone exists,
  // and use https URLs only (tel: is not supported by Telegram)
  const inlineKeyboard = [
    [
      {
        text: "✅ View in Dashboard",
        url: "https://mafirestaurant.vercel.app/staff/manage-bookings",
      },
    ],
  ];

  if (bookingData.phone) {
    inlineKeyboard.push([
      {
        text: `📞 Client: ${bookingData.phone}`,
        // Show the number in the button text instead of a tel: link
        url: "https://mafirestaurant.vercel.app/staff/manage-bookings",
      },
    ]);
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: inlineKeyboard,
          },
        }),
      }
    );

    // ✅ Now we actually check if Telegram accepted the request
    if (!res.ok) {
      const errorBody = await res.json();
      console.error("Telegram API error:", errorBody);
      throw new Error(`Telegram API error: ${errorBody.description}`);
    }
  } catch (error) {
    console.error("Telegram notification failed:", error);
    throw error; // Re-throw so the caller in route.ts can log it properly
  }
};
