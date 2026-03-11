export const sendTelegramNotification = async (bookingData: any) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  // Formatting the date nicely for the staff
  const dateStr = bookingData.bookingAt 
    ? new Date(bookingData.bookingAt).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Not specified';

  // Use HTML mode for better reliability with special characters
  const message = `
<b>🔔 New Booking Alert!</b>
---------------------------
<b>👤 Client:</b> ${bookingData.name}
<b>📅 Date:</b> ${dateStr}
<b>📍 Purpose:</b> ${bookingData.purpose || '-'}
<b>📞 Phone:</b> ${bookingData.phone || 'N/A'}
---------------------------
<a href="https://mafirestaurant.vercel.app/staff/manage-bookings">Open Staff Dashboard</a>
  `;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
          [
            {
              text: "✅ View in Dashboard",
              url: "https://mafirestaurant.vercel.app/staff/manage-bookings",
              style: "success" // This makes the button Green
            }
          ],
          [
            {
              text: "📞 Call Client",
              url: `tel:${bookingData.phone}`,
              style: "primary" // This makes the button Blue
            }
          ]
        ]
        }
      }),
    });
  } catch (error) {
    console.error('Telegram notification failed:', error);
  }
};
