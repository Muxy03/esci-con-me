export async function notifyTelegram(message: string) {
  const BOT_TOKEN = "8552312772:AAHp7cOqN4M8SUhZ3F0b5xpyBoypxpbxtZY";
  const CHAT_ID = "225630384";

  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: `${message}`,
        parse_mode: "HTML",
      }),
    },
  );

  if (!response.ok) {
    console.error("Telegram API error:", await response.text());
    throw new Error(`Telegram API error: ${response.statusText}`);
  }
}
