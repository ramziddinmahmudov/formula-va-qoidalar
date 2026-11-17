/**
 * Telegram Bot va Bildirishnomalar Serveri Adapteri (Scaffolding Boundary)
 *
 * MUHIM: Server-side rejalashtirilgan eslatmalar va Telegram Bot xabarlari
 * mustaqil backend (Node.js / Cloudflare Workers / Serverless) talab qiladi.
 * Asosiy ilova esa to'liq client-side va oflayn qolishi kerak.
 *
 * @typedef {Object} TelegramBotAdapterInterface
 * @property {function(number|string, string): Promise<any>} sendDailyReminder
 * @property {function(number|string, string, string): Promise<any>} scheduleNotification
 * @property {function(string): Promise<any>} registerWebhook
 */

class MockTelegramBotAdapter {
  constructor() {
    this.scheduledJobs = [];
  }

  /**
   * Foydalanuvchiga kunlik eslatma yuborish
   */
  async sendDailyReminder(chatId, message = 'Bugungi 5 daqiqalik mashqingiz kutmoqda') {
    console.log(`[Telegram Bot Mock] Xabar yuborildi -> Chat ID: ${chatId}, Matn: "${message}"`);
    return {
      ok: true,
      result: {
        message_id: Math.floor(Math.random() * 100000),
        chat: { id: chatId },
        text: message,
        date: Math.floor(Date.now() / 1000)
      }
    };
  }

  /**
   * Vaqt bo'yicha bildirishnoma rejalashtirish
   */
  async scheduleNotification(chatId, cronOrTime, text) {
    const job = {
      id: `job_${Date.now()}`,
      chatId,
      time: cronOrTime,
      text,
      status: 'scheduled'
    };
    this.scheduledJobs.push(job);
    console.log(`[Telegram Bot Mock] Rejalashtirildi: ${JSON.stringify(job)}`);
    return job;
  }

  /**
   * Webhook ro'yxatdan o'tkazish
   */
  async registerWebhook(webhookUrl) {
    console.log(`[Telegram Bot Mock] Webhook oʻrnatildi: ${webhookUrl}`);
    return { ok: true, description: 'Webhook was set' };
  }
}

export const telegramBotService = new MockTelegramBotAdapter();
