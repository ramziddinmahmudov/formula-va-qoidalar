/**
 * SM-2 algoritmi asosidagi soddalashtirilgan interval takrorlash (Spaced Repetition) moduli.
 * Sof (pure) funksiyalar yordamida har bir formula uchun keyingi takrorlash vaqtini hisoblaydi.
 */

export const RECALL_RATINGS = {
  FORGOT: 'forgot',         // "Esimda yoʻq" (qayta o'rganish)
  HARD: 'hard',             // "Qiyin edi" (qisqa interval)
  REMEMBERED: 'remembered'  // "Esladim" (normal o'sish)
};

export const INITIAL_SM2_ITEM = {
  interval: 0,
  repetition: 0,
  easeFactor: 2.5,
  nextReviewDate: null
};

/**
 * Keyingi takrorlash parametrlarini hisoblash (Pure function)
 * @param {Object} currentItem - Joriy holat { interval, repetition, easeFactor, nextReviewDate }
 * @param {string} rating - 'remembered' | 'hard' | 'forgot'
 * @param {number|Date} [now=Date.now()] - Testlar uchun vaqtni belgilash imkoni
 * @returns {Object} Yangilangan { interval, repetition, easeFactor, nextReviewDate }
 */
export function calculateNextReview(currentItem = INITIAL_SM2_ITEM, rating, now = Date.now()) {
  const item = currentItem || INITIAL_SM2_ITEM;
  const prevInterval = item.interval || 0;
  const prevRepetition = item.repetition || 0;
  const prevEF = item.easeFactor || 2.5;

  let nextInterval = 1;
  let nextRepetition = 0;
  let nextEF = prevEF;

  if (rating === RECALL_RATINGS.FORGOT) {
    nextRepetition = 0;
    nextInterval = 1; // 1 kun
    nextEF = Math.max(1.3, prevEF - 0.2);
  } else if (rating === RECALL_RATINGS.HARD) {
    nextRepetition = prevRepetition + 1;
    if (nextRepetition === 1) {
      nextInterval = 1;
    } else if (nextRepetition === 2) {
      nextInterval = 3;
    } else {
      nextInterval = Math.max(1, Math.round(prevInterval * 1.2));
    }
    nextEF = Math.max(1.3, prevEF - 0.15);
  } else if (rating === RECALL_RATINGS.REMEMBERED) {
    nextRepetition = prevRepetition + 1;
    if (nextRepetition === 1) {
      nextInterval = 1;
    } else if (nextRepetition === 2) {
      nextInterval = 6;
    } else {
      nextInterval = Math.max(1, Math.round(prevInterval * prevEF));
    }
    nextEF = Math.min(3.0, prevEF + 0.1);
  } else {
    // Noma'lum baho berilsa joriy holat saqlanadi
    return { ...item };
  }

  const baseTimestamp = typeof now === 'number' ? now : new Date(now).getTime();
  const nextTimestamp = baseTimestamp + nextInterval * 24 * 60 * 60 * 1000;

  return {
    interval: nextInterval,
    repetition: nextRepetition,
    easeFactor: Number(nextEF.toFixed(2)),
    nextReviewDate: new Date(nextTimestamp).toISOString()
  };
}

/**
 * Formula bugun takrorlanishi kerakmi?
 */
export function isDueToday(sm2Item, now = Date.now()) {
  if (!sm2Item || !sm2Item.nextReviewDate) return true; // Hali hech qachon takrorlanmagan bo'lsa
  const reviewTime = new Date(sm2Item.nextReviewDate).getTime();
  const current = typeof now === 'number' ? now : new Date(now).getTime();
  return reviewTime <= current;
}
