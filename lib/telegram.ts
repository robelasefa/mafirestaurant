export const sendTelegramNotification = async (bookingData: any) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram bot token or chat id is not set. Skipping notification.');
    return;
  }

  const message = `\n🔔 *New Booking Alert!*\n-------------------------\n👤 *Client:* ${bookingData.name}\n📅 *Date:* ${bookingData.bookingAt && new Date(bookingData.bookingAt).toLocaleString()}\n📍 *Purpose:* ${bookingData.purpose || '-'}\n-------------------------\nCheck the dashboard for details.`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
  } catch (error) {
    console.error('Telegram notification failed:', error);
  }
};
