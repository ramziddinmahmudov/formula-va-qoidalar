/**
 * Markazlashtirilgan ruxsatlar va taʼriflar moduli (Entitlements Module)
 *
 * TODO: Haqiqiy serverda (backend API orqali) foydalanuvchining tokenini tekshirib,
 * Click/Payme webhook va obuna tugash muddatini (expiry_date) tasdiqlash kerak.
 * Ayni paytda lokal ravishda xavfsiz localStorage orqali boshqariladi.
 */

export const PLANS = {
  FREE: 'free',                 // "Bepul"
  PREMIUM: 'premium',           // "Premium" (Bir martalik to'lov)
  SUBSCRIPTION: 'subscription', // "Obuna" (Oylik to'lov, avto-uzaytirish)
  EXAM_PACK: 'exam_pack'        // "Imtihon oldi paketi" (30-60 kunlik)
};

const STORAGE_KEY_PLAN = 'fq_v2_user_plan';
const STORAGE_KEY_AUTORENEW = 'fq_v2_plan_autorenew';
const STORAGE_KEY_EXPIRES = 'fq_v2_plan_expiry';

// Node/Vitest yoki localStorage mavjud bo'lmaganda xotirada saqlash
const memoryStore = {};

function safeGet(key) {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return memoryStore[key] || null;
  } catch {
    return memoryStore[key] || null;
  }
}

function safeSet(key, value) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, String(value));
    }
    memoryStore[key] = String(value);
  } catch {
    memoryStore[key] = String(value);
  }
}

export function resetEntitlementsStore() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_PLAN);
      localStorage.removeItem(STORAGE_KEY_AUTORENEW);
      localStorage.removeItem(STORAGE_KEY_EXPIRES);
    }
  } catch {}
  delete memoryStore[STORAGE_KEY_PLAN];
  delete memoryStore[STORAGE_KEY_AUTORENEW];
  delete memoryStore[STORAGE_KEY_EXPIRES];
}

/**
 * Foydalanuvchining joriy rejasini olish
 * @returns {'free' | 'premium' | 'subscription' | 'exam_pack'}
 */
export function getUserPlan() {
  try {
    const plan = safeGet(STORAGE_KEY_PLAN);
    if (plan && Object.values(PLANS).includes(plan)) {
      return plan;
    }
    // Agar eski v1 premium flagi bo'lsa
    if (safeGet('fq_premium_unlocked') === 'true' || safeGet('fq_v2_premium_unlocked') === 'true') {
      return PLANS.PREMIUM;
    }
    return PLANS.FREE;
  } catch {
    return PLANS.FREE;
  }
}

/**
 * Foydalanuvchi rejasini o'zgartirish
 */
export function setUserPlan(plan, autoRenew = false, durationDays = null) {
  safeSet(STORAGE_KEY_PLAN, plan);
  safeSet(STORAGE_KEY_AUTORENEW, autoRenew ? 'true' : 'false');
  if (durationDays) {
    const expiry = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
    safeSet(STORAGE_KEY_EXPIRES, expiry);
  }
}

export function isAutoRenewEnabled() {
  return safeGet(STORAGE_KEY_AUTORENEW) === 'true';
}

// === HUQUQLARNI TEKSHIRISH (ENTITLEMENTS) ===

export function isPaidUser() {
  const plan = getUserPlan();
  return plan !== PLANS.FREE;
}

export function canAccessFormula(formula) {
  if (!formula) return true;
  // Bepul formulalar (Algebra va dastlabki 5 ta geometriya)
  if (formula.free) return true;
  return isPaidUser();
}

export function canAccessVisualTools() {
  return isPaidUser();
}

export function canAccessExamMode() {
  return isPaidUser();
}

export function canAccessFlashcards() {
  const plan = getUserPlan();
  // Flashcards va Xatolar ustida ishlash Obuna, Imtihon paketi yoki Premiumda ochiladi
  return plan === PLANS.SUBSCRIPTION || plan === PLANS.EXAM_PACK || plan === PLANS.PREMIUM;
}

export function canAccessErrorDrill() {
  const plan = getUserPlan();
  return plan === PLANS.SUBSCRIPTION || plan === PLANS.EXAM_PACK || plan === PLANS.PREMIUM;
}

export function canAccessOfflineMode() {
  return isPaidUser();
}

export function canAccessPDFExport() {
  return isPaidUser();
}
