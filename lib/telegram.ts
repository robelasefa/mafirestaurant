export const sendTelegramNotification = async (bookingData: any) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  console.log("🔔 Telegram: function called");
  console.log("🔔 Telegram: token exists?", !!token);
  console.log("🔔 Telegram: chatId exists?", !!chatId);

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
        // If you want a clickable link to call the client, consider using a different URL format
        // You might want to replace the link with a `tel:` link or simply show the number without a URL.
        url: `https://wa.me/${bookingData.phone}`, // WhatsApp clickable link example
      },
    ]);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

  try {
    console.log("🔔 Telegram: sending fetch...");
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal, // timeout
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
    clearTimeout(timeout);
    console.log("🔔 Telegram: status:", res.status);  // This was missing a closing parenthesis
    
    if (!res.ok) {
      const errorBody = await res.json();
      console.error("❌ Telegram API error:", errorBody);
      throw new Error(errorBody.description);
    }

    console.log("✅ Telegram: sent!");
  } catch (error) {
    clearTimeout(timeout);
    console.error("❌ Telegram fetch threw:", error);
    throw error;
  }
};
