import t from '../../i18n';

const STORAGE_KEY_NOTIF = 'fq_v2_notif_enabled';
const STORAGE_KEY_LAST_NOTIFIED = 'fq_v2_last_notified_date';

export function isNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function isNotificationEnabled() {
  if (!isNotificationSupported()) return false;
  try {
    return Notification.permission === 'granted' && localStorage.getItem(STORAGE_KEY_NOTIF) === 'true';
  } catch {
    return false;
  }
}

export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return false;
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      localStorage.setItem(STORAGE_KEY_NOTIF, 'true');
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function scheduleDailyReminder() {
  if (!isNotificationEnabled()) return;
  try {
    const today = new Date().toISOString().split('T')[0];
    const lastNotified = localStorage.getItem(STORAGE_KEY_LAST_NOTIFIED);
    if (lastNotified !== today) {
      new Notification('Formula va Qoidalar', {
        body: t('feedback.notification_daily_text') || 'Bugungi 5 daqiqalik mashqingiz kutmoqda',
        icon: '/favicon.ico'
      });
      localStorage.setItem(STORAGE_KEY_LAST_NOTIFIED, today);
    }
  } catch (e) {
    console.warn('Xabarnoma yuborishda xatolik:', e);
  }
}
