import { describe, it, expect } from 'vitest';
import { formulasData } from '../src/data/formulas';
import { formulaGenerators } from '../src/data/generators';

describe('Barcha generatorlar turli qiyinlik darajalarida ishlashi testi', () => {
  const levels = ['oson', 'orta', 'qiyin'];

  it('Barcha formulalar oson, oʻrta va qiyin darajalarda toʻgʻri misol qaytaradi', () => {
    formulasData.forEach((f) => {
      f.generators.forEach((gen) => {
        levels.forEach((lvl) => {
          const ex = gen(lvl);
          expect(ex).toHaveProperty('question_uz');
          expect(ex).toHaveProperty('answer');
          expect(typeof ex.answer === 'number' || typeof ex.answer === 'string').toBe(true);
          expect(Array.isArray(ex.steps_uz)).toBe(true);
        });
      });
    });
  });
});

describe('Xatoliklarni aniqlash (Mistake Detection) - Kamida 5 ta formula', () => {
  it('1. alg_kvadrat_yigindi: 2ab tushib qolganda aniqlash', () => {
    const gen = formulaGenerators.alg_kvadrat_yigindi[0];
    const ex = gen('orta');
    expect(ex.mistakePatterns).toBeDefined();

    const pattern = ex.mistakePatterns.find((p) => p.id === 'forgot_2ab');
    expect(pattern).toBeDefined();

    // Misoldagi a va b bo'yicha a^2 + b^2 qiymati pattern.check orqali aniqlanishi kerak
    const match = ex.steps_uz[1].match(/a = (\d+), b = (\d+)/);
    if (match) {
      const a = parseInt(match[1], 10);
      const b = parseInt(match[2], 10);
      const wrongAnswer = a * a + b * b;
      expect(pattern.check(wrongAnswer)).toBe(true);
      expect(pattern.hint_uz).toContain('2ab');
    }
  });

  it('2. alg_kvadrat_ayirma: ishora xatosini aniqlash', () => {
    const gen = formulaGenerators.alg_kvadrat_ayirma[0];
    const ex = gen('orta');
    const pattern = ex.mistakePatterns.find((p) => p.id === 'sign_error');
    expect(pattern).toBeDefined();

    const match = ex.steps_uz[1].match(/a = (\d+), b = (\d+)/);
    if (match) {
      const a = parseInt(match[1], 10);
      const b = parseInt(match[2], 10);
      const wrongAnswer = (a + b) * (a + b);
      expect(pattern.check(wrongAnswer)).toBe(true);
      expect(pattern.hint_uz).toContain('minus');
    }
  });

  it('3. alg_diskriminant: 4ac ishorasidagi xatoni aniqlash', () => {
    const gen = formulaGenerators.alg_diskriminant[0];
    const ex = gen('orta');
    const pattern = ex.mistakePatterns?.find((p) => p.id === 'sign_error_4ac');
    expect(pattern).toBeDefined();
    expect(pattern.hint_uz).toContain('ishorasi');
  });

  it('4. geom_pifagor: katetlarni kvadratlarsiz qoʻshganda aniqlash', () => {
    const gen = formulaGenerators.geom_pifagor[0];
    const ex = gen('orta');
    const pattern = ex.mistakePatterns.find((p) => p.id === 'added_directly');
    expect(pattern).toBeDefined();

    const match = ex.question_uz.match(/katetlari (\d+) sm va (\d+) sm/);
    if (match) {
      const a = parseInt(match[1], 10);
      const b = parseInt(match[2], 10);
      expect(pattern.check(a + b)).toBe(true);
      expect(pattern.hint_uz).toContain('kvadratlarini qoʻshib');
    }
  });

  it('5. geom_uchburchak_asos_balandlik: 1/2 koeffitsiyenti esdan chiqqanda aniqlash', () => {
    const gen = formulaGenerators.geom_uchburchak_asos_balandlik[0];
    const ex = gen('orta');
    const pattern = ex.mistakePatterns.find((p) => p.id === 'forgot_half');
    expect(pattern).toBeDefined();

    const match = ex.question_uz.match(/asosi (\d+) sm va balandligi (\d+) sm/);
    if (match) {
      const a = parseInt(match[1], 10);
      const h = parseInt(match[2], 10);
      expect(pattern.check(a * h)).toBe(true);
      expect(pattern.hint_uz).toContain('1/2');
    }
  });

  it('6. alg_viyet: ildizlar yigʻindisida minus ishora unutilganda aniqlash', () => {
    const gen = formulaGenerators.alg_viyet[0];
    const ex = gen('orta');
    const pattern = ex.mistakePatterns?.find((p) => p.id === 'forgot_minus_sign');
    expect(pattern).toBeDefined();
    expect(pattern.hint_uz).toContain('qarama-qarshi ishora');
  });
});
