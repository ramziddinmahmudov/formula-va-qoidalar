import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { isTelegramWebApp, getTelegramUser, shouldHideInstallPWA } from '../src/modules/telegram/telegramWebApp';

describe('Telegram WebApp (TMA) muhitini aniqlash testi', () => {
  const originalWindowTelegram = global.window ? global.window.Telegram : undefined;

  afterEach(() => {
    if (global.window) {
      global.window.Telegram = originalWindowTelegram;
    }
  });

  it('Oddiy brauzerda isTelegramWebApp false qaytarishi kerak', () => {
    if (global.window) {
      delete global.window.Telegram;
    }
    expect(isTelegramWebApp()).toBe(false);
    expect(shouldHideInstallPWA()).toBe(false);
    expect(getTelegramUser()).toBeNull();
  });

  it('Telegram WebApp muhitida (mock Telegram obyekti bilan) toʻgʻri aniqlanishi', () => {
    global.window = global.window || {};
    global.window.Telegram = {
      WebApp: {
        initData: 'query_id=AAH...',
        initDataUnsafe: {
          user: { id: 123456, first_name: 'Anvar' }
        },
        themeParams: { bg_color: '#17212b', text_color: '#ffffff' }
      }
    };

    expect(isTelegramWebApp()).toBe(true);
    expect(shouldHideInstallPWA()).toBe(true);
    expect(getTelegramUser()).toEqual({ id: 123456, first_name: 'Anvar' });
  });
});
