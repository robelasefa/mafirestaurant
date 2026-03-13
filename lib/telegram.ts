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
      "🔔 <b>New Booking Alert!</b>",
      "---------------------------",
      `👤 <b>Client:</b> ${bookingData.name}`,
      `📅 <b>Date:</b> ${dateStr}`,
      `📍 <b>Purpose:</b> ${bookingData.purpose || "-"}`,
      `📞 <b>Phone:</b> ${bookingData.phone || "N/A"}`,
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
          parse_mode: "HTML",
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


export async function sendSystemAlert(title: string, details: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ERROR_CHAT_ID;

  if (!token || !chatId) return;

  const message = `
<b>🚨 System Alert</b>

<b>${title}</b>

${details}

<b>Time:</b> ${new Date().toLocaleString()}
`.trim();

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch (err) {
    console.error("❌ Failed to send system alert:", err);
  }
}


const TELEGRAM_LIMIT = 4096;

function chunkMessage(text: string, size: number = TELEGRAM_LIMIT - 50) {
  const chunks: string[] = [];

  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }

  return chunks;
}

export async function reportError(title: string, error: unknown) {
  const errorText = String((error as Error)?.stack || error);

  const chunks = chunkMessage(errorText);

  try {
    for (let i = 0; i < chunks.length; i++) {
      const details =
        chunks.length > 1
          ? `(part ${i + 1}/${chunks.length})\n\n<pre>${chunks[i]}</pre>`
          : `<pre>${chunks[i]}</pre>`;

      await sendSystemAlert(title, details);
    }
  } catch (err) {
    console.error("Failed to send Telegram error alert:", err);
  }

  console.error(title, error);
}
