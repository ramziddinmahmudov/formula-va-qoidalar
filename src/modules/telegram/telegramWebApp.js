/**
 * Telegram Mini App (TMA) muhitini aniqlash va moslashtirish moduli
 */

export function isTelegramWebApp() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.Telegram?.WebApp && window.Telegram.WebApp.initData !== undefined);
}

export function getTelegramThemeParams() {
  if (typeof window === 'undefined') return {};
  return window.Telegram?.WebApp?.themeParams || {};
}

export function getTelegramUser() {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp?.initDataUnsafe?.user || null;
}

/**
 * Telegram rang mavzusini (ThemeParams) ilovaga sinxronlash
 */
export function applyTelegramTheme() {
  if (!isTelegramWebApp()) return;

  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();

  const theme = tg.themeParams;
  if (theme.bg_color) {
    document.documentElement.style.setProperty('--tg-bg-color', theme.bg_color);
  }
  if (theme.text_color) {
    document.documentElement.style.setProperty('--tg-text-color', theme.text_color);
  }

  // Agar Telegram dark rejimda bo'lsa
  if (tg.colorScheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (tg.colorScheme === 'light') {
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Telegram ichida PWA install promptini yashirish kerakmi?
 */
export function shouldHideInstallPWA() {
  return isTelegramWebApp();
}

/**
 * Telegram WebApp'ni to'liq ishga tushirish va sinxronlash
 */
export function initTelegramWebApp() {
  if (isTelegramWebApp()) {
    applyTelegramTheme();
  }
}
