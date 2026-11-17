/**
 * Streak (Ketma-ket kunlar) boshqaruvi
 * Vaqt mintaqasiga (timezone-safe) chidamli sof funksiyalar.
 */

/**
 * Berilgan sanani mahalliy kalendar kuni sifatida YYYY-MM-DD ko'rinishida olish
 */
export function getLocalCalendarDate(date = new Date()) {
  const d = typeof date === 'number' || typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Ikki YYYY-MM-DD sana orasidagi kunlar farqini hisoblash
 */
export function getCalendarDaysDiff(dateStr1, dateStr2) {
  const [y1, m1, d1] = dateStr1.split('-').map(Number);
  const [y2, m2, d2] = dateStr2.split('-').map(Number);

  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);

  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((utc2 - utc1) / msPerDay);
}

/**
 * Streak holatini yangilash (Pure function)
 * @param {Object} currentStreakState { currentStreak, maxStreak, lastActiveDate }
 * @param {Date|string|number} now
 * @returns {Object} Yangilangan { currentStreak, maxStreak, lastActiveDate, isNewDay }
 */
export function calculateStreakUpdate(
  currentStreakState = { currentStreak: 0, maxStreak: 0, lastActiveDate: null },
  now = new Date()
) {
  const todayStr = getLocalCalendarDate(now);
  const prevDate = currentStreakState.lastActiveDate;

  if (!prevDate) {
    // Eng birinchi faollik
    return {
      currentStreak: 1,
      maxStreak: Math.max(1, currentStreakState.maxStreak || 0),
      lastActiveDate: todayStr,
      isNewDay: true
    };
  }

  const diff = getCalendarDaysDiff(prevDate, todayStr);

  if (diff === 0) {
    // Bugun allaqachon faollik qayd etilgan
    return {
      ...currentStreakState,
      isNewDay: false
    };
  }

  if (diff === 1) {
    // Kecha faol bo'lgan, bugun ham faol -> streak + 1
    const nextCurrent = (currentStreakState.currentStreak || 0) + 1;
    return {
      currentStreak: nextCurrent,
      maxStreak: Math.max(nextCurrent, currentStreakState.maxStreak || 0),
      lastActiveDate: todayStr,
      isNewDay: true
    };
  }

  // diff > 1: Kun o'tkazib yuborilgan -> Streak 1 ga tushadi
  return {
    currentStreak: 1,
    maxStreak: currentStreakState.maxStreak || 1,
    lastActiveDate: todayStr,
    isNewDay: true
  };
}

const STORAGE_KEY_STREAK = 'fq_v2_streak_data';

export function getStreak() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY_STREAK);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.lastActiveDate) {
          const diff = getCalendarDaysDiff(parsed.lastActiveDate, getLocalCalendarDate());
          if (diff > 1) {
            return {
              currentStreak: 0,
              maxStreak: parsed.maxStreak || 0,
              lastActiveDate: parsed.lastActiveDate
            };
          }
        }
        return parsed;
      }
    }
  } catch {}
  return { currentStreak: 0, maxStreak: 0, lastActiveDate: null };
}

export function recordDailyPractice() {
  const current = getStreak();
  const updated = calculateStreakUpdate(current, new Date());
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_STREAK, JSON.stringify(updated));
    }
  } catch {}
  return updated;
}

