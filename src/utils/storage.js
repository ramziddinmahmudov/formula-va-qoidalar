/**
 * Versioned LocalStorage boshqaruvi (v2)
 * Xavfsiz fallback va ma'lumotlar buzilishidan himoyalangan.
 */

const STORAGE_VERSION = 'v2';

const STORAGE_KEYS = {
  PREMIUM: `fq_${STORAGE_VERSION}_premium_unlocked`,
  DTM_PACK: `fq_${STORAGE_VERSION}_dtm_pack_unlocked`,
  STATS: `fq_${STORAGE_VERSION}_practice_stats`,
  THEME: `fq_${STORAGE_VERSION}_theme_mode`,
  OFFLINE: `fq_${STORAGE_VERSION}_offline_enabled`,
  FAVORITES: `fq_${STORAGE_VERSION}_favorites`,
  REVIEW_LIST: `fq_${STORAGE_VERSION}_review_list`,
  SM2: `fq_${STORAGE_VERSION}_sm2_records`,
  EXAM_HISTORY: `fq_${STORAGE_VERSION}_exam_history`,
  ERROR_LOGS: `fq_${STORAGE_VERSION}_error_logs`
};

// Agar localStorage brauzerda cheklangan bo'lsa xotirada saqlash uchun fallback
const memoryStore = {};

function safeGetItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? item : memoryStore[key] || defaultValue;
  } catch {
    return memoryStore[key] || defaultValue;
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    memoryStore[key] = String(value);
  }
}

function safeGetJson(key, defaultValue = {}) {
  try {
    const raw = safeGetItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function safeSetJson(key, value) {
  try {
    const str = JSON.stringify(value);
    safeSetItem(key, str);
  } catch (e) {
    console.warn('Storage JSON yozishda xatolik:', e);
  }
}

// === PREMIUM VA PACKLAR ===

export function isPremiumUnlocked() {
  return safeGetItem(STORAGE_KEYS.PREMIUM) === 'true';
}

export function setPremiumUnlocked(unlocked) {
  safeSetItem(STORAGE_KEYS.PREMIUM, unlocked ? 'true' : 'false');
}

export function isDTMPackUnlocked() {
  return isPremiumUnlocked() || safeGetItem(STORAGE_KEYS.DTM_PACK) === 'true';
}

export function setDTMPackUnlocked(unlocked) {
  safeSetItem(STORAGE_KEYS.DTM_PACK, unlocked ? 'true' : 'false');
}

// === OFFLAYN VA TEMA ===

export function getOfflineMode() {
  return safeGetItem(STORAGE_KEYS.OFFLINE) === 'true';
}

export function setOfflineMode(enabled) {
  safeSetItem(STORAGE_KEYS.OFFLINE, enabled ? 'true' : 'false');
}

export function getThemePreference() {
  return safeGetItem(STORAGE_KEYS.THEME, 'system');
}

export function setThemePreference(theme) {
  safeSetItem(STORAGE_KEYS.THEME, theme);
}

// === SEVIMLILAR (FAVORITES) ===

export function getFavorites() {
  return safeGetJson(STORAGE_KEYS.FAVORITES, []);
}

export function isFavorite(formulaId) {
  const favs = getFavorites();
  return favs.includes(formulaId);
}

export function toggleFavorite(formulaId) {
  const favs = getFavorites();
  const index = favs.indexOf(formulaId);
  let updated;
  if (index >= 0) {
    updated = favs.filter((id) => id !== formulaId);
  } else {
    updated = [...favs, formulaId];
  }
  safeSetJson(STORAGE_KEYS.FAVORITES, updated);
  return updated;
}

// === TAKRORLASH RO'YXATI (REVIEW LIST) ===

export function getReviewList() {
  return safeGetJson(STORAGE_KEYS.REVIEW_LIST, []);
}

export function isInReviewList(formulaId) {
  const list = getReviewList();
  return list.some((item) => (typeof item === 'string' ? item === formulaId : item.id === formulaId));
}

export function addToReviewList(formulaId, reason = 'manual') {
  const list = getReviewList();
  const exists = list.some((item) => (typeof item === 'string' ? item === formulaId : item.id === formulaId));
  if (!exists) {
    const updated = [...list, { id: formulaId, reason, addedAt: new Date().toISOString() }];
    safeSetJson(STORAGE_KEYS.REVIEW_LIST, updated);
    return updated;
  }
  return list;
}

export function removeFromReviewList(formulaId) {
  const list = getReviewList();
  const updated = list.filter((item) => (typeof item === 'string' ? item !== formulaId : item.id !== formulaId));
  safeSetJson(STORAGE_KEYS.REVIEW_LIST, updated);
  return updated;
}

// === SM-2 SPACED REPETITION ===

export function getSM2Data() {
  return safeGetJson(STORAGE_KEYS.SM2, {});
}

export function getFormulaSM2(formulaId) {
  const all = getSM2Data();
  return all[formulaId] || null;
}

export function saveFormulaSM2(formulaId, sm2Record) {
  const all = getSM2Data();
  all[formulaId] = {
    ...sm2Record,
    updatedAt: new Date().toISOString()
  };
  safeSetJson(STORAGE_KEYS.SM2, all);
  return all;
}

// === STATISTIKA VA NATIJALAR ===

export function getStats() {
  return safeGetJson(STORAGE_KEYS.STATS, {});
}

export function saveFormulaScore(formulaId, correct, total) {
  const stats = getStats();
  const prev = stats[formulaId] || { correct: 0, total: 0, attempts: 0 };
  stats[formulaId] = {
    correct: prev.correct + correct,
    total: prev.total + total,
    lastScore: `${correct}/${total}`,
    lastDate: new Date().toISOString(),
    attempts: prev.attempts + 1
  };
  safeSetJson(STORAGE_KEYS.STATS, stats);

  // Agar noto'g'ri ishlangan bo'lsa avtomatik ravishda Takrorlash ro'yxatiga qo'shamiz
  if (correct < total) {
    addToReviewList(formulaId, 'trainer_mistake');
  }

  return stats;
}

// === TEST (EXAM) TARIXI ===

export function getExamHistory() {
  return safeGetJson(STORAGE_KEYS.EXAM_HISTORY, []);
}

export function saveExamResult(result) {
  const history = getExamHistory();
  const updated = [result, ...history].slice(0, 50); // So'nggi 50 ta natija
  safeSetJson(STORAGE_KEYS.EXAM_HISTORY, updated);
  return updated;
}

// === XATOLAR TARIXI VA MONITORINGI (ERROR DRILL) ===

export function getErrorLogs() {
  return safeGetJson(STORAGE_KEYS.ERROR_LOGS, []);
}

export function logError({ formulaId, mistakeType = 'calculation', problemText = '', studentAnswer = '', correctAnswer = '' }) {
  const logs = getErrorLogs();
  const newEntry = {
    id: `err_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    formulaId,
    mistakeType,
    problemText,
    studentAnswer,
    correctAnswer,
    date: new Date().toISOString()
  };
  const updated = [newEntry, ...logs].slice(0, 100);
  safeSetJson(STORAGE_KEYS.ERROR_LOGS, updated);

  // Shuningdek, avtomatik takrorlash ro'yxatiga ham kiritish
  addToReviewList(formulaId, 'error_logged');
  return updated;
}

export function clearFormulaErrors(formulaId) {
  const logs = getErrorLogs();
  const updated = logs.filter((item) => item.formulaId !== formulaId);
  safeSetJson(STORAGE_KEYS.ERROR_LOGS, updated);
  return updated;
}

/**
 * Kuchsiz va ko'p xato qilingan formulalar ro'yxatini hisoblaydi
 * @param {Array} allFormulas 
 */
export function getWeakFormulas(allFormulas = []) {
  const reviewList = getReviewList();
  const reviewIds = new Set(reviewList.map((item) => (typeof item === 'string' ? item : item.id)));
  const stats = getStats();
  const errorLogs = getErrorLogs();

  const errorCountsByFormula = {};
  errorLogs.forEach((err) => {
    errorCountsByFormula[err.formulaId] = (errorCountsByFormula[err.formulaId] || 0) + 1;
  });

  return allFormulas.filter((f) => {
    if (reviewIds.has(f.id)) return true;
    if (errorCountsByFormula[f.id] && errorCountsByFormula[f.id] > 0) return true;
    const stat = stats[f.id];
    if (stat && stat.total > 0 && stat.correct / stat.total < 0.75) return true;
    return false;
  }).map((f) => ({
    ...f,
    errorCount: errorCountsByFormula[f.id] || (stats[f.id] ? stats[f.id].total - stats[f.id].correct : 1),
    isWeak: true
  }));
}
