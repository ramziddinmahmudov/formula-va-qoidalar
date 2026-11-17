import { describe, it, expect } from 'vitest';
import { generateShareText, generateShareCardBlob } from '../src/modules/share/shareCard';

describe('Ulashish (Share Card) moduli testi', () => {
  it('Oʻzbekcha maxsus harflar (oʻ, gʻ, sh, ch) va formula nomlari bilan matnni toʻgʻri shakllantirishi', () => {
    const text1 = generateShareText('Pifagor teoremasi', 14);
    expect(text1).toContain('Pifagor teoremasi');
    expect(text1).toContain('14 soniyada 100% to\'g\'ri');

    const text2 = generateShareText('Koʻphadlar yigʻindisining kvadrati', 25);
    expect(text2).toContain('Koʻphadlar yigʻindisining kvadrati');
    expect(text2).toContain('25 soniyada');
  });

  it('Canvas muhiti yoʻq boʻlganda yoki xato yuz berganda xatolik otmasdan null qaytarishi (safe fallback)', async () => {
    // Node.js test muhitida canvas yoki document.createElement('canvas') mavjud bo'lmasa xato otmasligi kerak
    const blob = await generateShareCardBlob({
      formulaTitle: 'Uchburchak yuzi',
      timeTakenSeconds: 18
    });
    // Node muhitida document mock bo'lmasa null yoki blob qaytadi, lekin crash bo'lmaydi
    expect(blob === null || typeof blob === 'object').toBe(true);
  });
});
