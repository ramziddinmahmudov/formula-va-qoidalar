/**
 * Natijani rasm (PNG) qilib generatsiya qilish va do'stlarga ulashish moduli
 * Butunlay client-side (oflayn) ishlaydi.
 */

/**
 * Ulashish matnini generatsiya qilish
 */
export function generateShareText(formulaTitle, timeTakenSeconds) {
  const safeTime = Math.max(1, Math.round(timeTakenSeconds || 15));
  return `Men "${formulaTitle}" formulasini ${safeTime} soniyada 100% to'g'ri yechdim. Sen-chi? 🚀 #FormulaVaQoidalar`;
}

/**
 * Canvas yordamida natija sertifikati rasmini (Blob) chizish
 * @param {Object} options
 * @param {string} options.formulaTitle
 * @param {number} options.timeTakenSeconds
 * @param {string} [options.formulaKatex]
 * @returns {Promise<Blob>}
 */
export async function generateShareCardBlob({ formulaTitle, timeTakenSeconds, formulaKatex = '' }) {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(null);
        return;
      }

      // 1. Chiroyli gradient fon
      const gradient = ctx.createLinearGradient(0, 0, 640, 400);
      gradient.addColorStop(0, '#4338ca'); // Indigo
      gradient.addColorStop(0.5, '#4f46e5');
      gradient.addColorStop(1, '#6b21a8'); // Purple
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 640, 400);

      // Fon bezaklari
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.beginPath();
      ctx.arc(580, 50, 120, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(60, 360, 90, 0, Math.PI * 2);
      ctx.fill();

      // 2. Ilova nomi (Logo)
      ctx.fillStyle = '#fde047'; // Sariq oltin
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillText('⚡ Formula va Qoidalar', 40, 55);

      // Kichik shior
      ctx.fillStyle = '#c7d2fe';
      ctx.font = '14px system-ui, -apple-system, sans-serif';
      ctx.fillText('Mikro-trenajyor natijasi', 40, 80);

      // Oq kartochka foni
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(40, 110, 560, 210, 16) : ctx.rect(40, 110, 560, 210);
      ctx.fill();

      // Formula nomi
      ctx.fillStyle = '#1e1b4b';
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
      const cleanTitle = formulaTitle.length > 32 ? formulaTitle.slice(0, 30) + '...' : formulaTitle;
      ctx.fillText(cleanTitle, 70, 160);

      // "100% to'g'ri" belgisi
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
      ctx.fillText('100% toʻgʻri! ⭐', 70, 220);

      // Sarflangan vaqt
      const safeTime = Math.max(1, Math.round(timeTakenSeconds || 15));
      ctx.fillStyle = '#475569';
      ctx.font = '500 16px system-ui, -apple-system, sans-serif';
      ctx.fillText(`Sarflangan vaqt: ${safeTime} soniya • 3/3 natija`, 70, 260);

      // Pastki havola
      ctx.fillStyle = '#a5b4fc';
      ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
      ctx.fillText('📱 Telegram orqali sinab koʻring: @formulalar_app', 40, 365);

      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    } catch (e) {
      console.warn('Canvas share card xatosi:', e);
      resolve(null);
    }
  });
}

/**
 * Natijani ulashish (Web Share API yoki Telegram share link)
 */
export async function shareResult({ formulaTitle, timeTakenSeconds, blob }) {
  const shareText = generateShareText(formulaTitle, timeTakenSeconds);
  const shareUrl = 'https://t.me/formulalar_bot/app';

  // 1. Agar brauzer rasm faylini ulashishni qo'llasa
  if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'natija.png', { type: 'image/png' })] })) {
    try {
      const file = new File([blob], 'natija.png', { type: 'image/png' });
      await navigator.share({
        title: 'Formula va Qoidalar',
        text: shareText,
        files: [file]
      });
      return { success: true, method: 'web_share_file' };
    } catch (err) {
      if (err.name === 'AbortError') return { success: false, method: 'cancelled' };
    }
  }

  // 2. Oddiy Web Share API (matnli)
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Formula va Qoidalar',
        text: shareText,
        url: shareUrl
      });
      return { success: true, method: 'web_share_text' };
    } catch (err) {
      if (err.name === 'AbortError') return { success: false, method: 'cancelled' };
    }
  }

  // 3. Fallback: Telegram share URL orqali ochish
  const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  window.open(tgUrl, '_blank');
  return { success: true, method: 'telegram_web' };
}
