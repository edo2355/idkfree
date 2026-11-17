const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function sendTelegramMessage(chatId: string, text: string) {
  if (!TELEGRAM_TOKEN || !chatId) {
    console.warn('⚠️ Telegram: Faltan token o chatId');
    return;
  }
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      })
    });
    
    if (response.ok) {
      console.log(`✅ Mensaje de Telegram enviado a ${chatId}`);
    } else {
      const errorData = await response.json();
      console.error('❌ Error de Telegram:', errorData);
    }
  } catch (error) {
    console.error('❌ Error enviando mensaje de Telegram:', error);
  }
}
