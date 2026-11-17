import uzTranslations from './uz.json';

const translations = {
  uz: uzTranslations
};

let currentLocale = 'uz';

export function setLocale(locale) {
  if (translations[locale]) {
    currentLocale = locale;
  }
}

export function getLocale() {
  return currentLocale;
}

/**
 * Kalit bo'yicha tarjima matnini olish: t('buttons.try_out')
 */
export function t(keyPath, fallback = '') {
  const parts = keyPath.split('.');
  let current = translations[currentLocale] || translations.uz;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return fallback || keyPath;
    }
  }

  return typeof current === 'string' ? current : fallback || keyPath;
}

export default t;
