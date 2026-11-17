import { describe, it, expect } from 'vitest';
import { formulasData, generateExamplesForFormula } from '../src/data/formulas';
import { formulaGenerators } from '../src/data/generators';
import { checkAnswer, parseNumberOrFraction, formatUzbekNumber } from '../src/utils/mathCheck';

describe('Formula va Qoidalar - Maʼlumotlar bazasi va generatorlar testi', () => {
  it('Kamida 60 ta formula mavjudligi (kamida 35 algebra, 25 geometriya)', () => {
    expect(formulasData.length).toBeGreaterThanOrEqual(60);

    const algebraFormulas = formulasData.filter((f) => f.category === 'Algebra');
    const geometryFormulas = formulasData.filter((f) => f.category === 'Geometriya');

    expect(algebraFormulas.length).toBeGreaterThanOrEqual(35);
    expect(geometryFormulas.length).toBeGreaterThanOrEqual(25);
  });

  it('Barcha formulalarning ID lari takrorlanmasligi', () => {
    const ids = formulasData.map((f) => f.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('Barcha formulalarda talab qilingan maydonlar mavjudligi', () => {
    formulasData.forEach((f) => {
      expect(f.id).toBeTruthy();
      expect(f.category).toMatch(/^(Algebra|Geometriya)$/);
      expect(f.title).toBeTruthy();
      expect(f.formula).toBeTruthy();
      expect(f.usageHint_uz).toBeTruthy();
      expect(Array.isArray(f.variables)).toBe(true);
      expect(f.variables.length).toBeGreaterThan(0);
      expect(Array.isArray(f.keywords)).toBe(true);
      expect(typeof f.free).toBe('boolean');
      expect(Array.isArray(f.generators)).toBe(true);
      expect(f.generators.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('Barcha 69 ta formulaning barcha generatorlari toʻgʻri savol, javob va yechim qaytarishi', () => {
    formulasData.forEach((f) => {
      f.generators.forEach((gen, gIdx) => {
        const result = gen();
        expect(result).toHaveProperty('question_uz');
        expect(result).toHaveProperty('answer');
        expect(result).toHaveProperty('steps_uz');

        expect(typeof result.question_uz).toBe('string');
        expect(result.question_uz.length).toBeGreaterThan(5);

        expect(typeof result.answer === 'number' || typeof result.answer === 'string').toBe(true);
        if (typeof result.answer === 'number') {
          expect(isNaN(result.answer)).toBe(false);
          expect(isFinite(result.answer)).toBe(true);
        }

        expect(Array.isArray(result.steps_uz)).toBe(true);
        expect(result.steps_uz.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  it('generateExamplesForFormula har safar aynan 3 ta misol qaytarishi', () => {
    formulasData.forEach((f) => {
      const exs = generateExamplesForFormula(f.id, 3);
      expect(exs.length).toBe(3);
      exs.forEach((ex) => {
        expect(ex.question_uz).toBeTruthy();
        expect(ex.steps_uz.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('Javobni tekshirish (mathCheck) testi - Kamida 5 ta formula', () => {
  it('1. Pifagor teoremasi: butun sonli javobni tekshirish', () => {
    const resCorrect = checkAnswer('5', 5);
    expect(resCorrect.isCorrect).toBe(true);

    const resWrong = checkAnswer('6', 5);
    expect(resWrong.isCorrect).toBe(false);
  });

  it('2. Yigʻindining kvadrati: boʻsh joylar va manfiy sonlar bilan tekshirish', () => {
    const res = checkAnswer('  400  ', 400);
    expect(res.isCorrect).toBe(true);

    const resNegative = checkAnswer('-15', -15);
    expect(resNegative.isCorrect).toBe(true);
  });

  it('3. Uchburchak yuzi: vergul va nuqtani birdek qabul qilish (3,5 va 3.5)', () => {
    const resComma = checkAnswer('12,5', 12.5);
    expect(resComma.isCorrect).toBe(true);

    const resDot = checkAnswer('12.5', 12.5);
    expect(resDot.isCorrect).toBe(true);
  });

  it('4. Geometrik progressiya: oddiy kasrlarni qabul qilish (1/2 = 0.5)', () => {
    const resFraction = checkAnswer('1/2', 0.5);
    expect(resFraction.isCorrect).toBe(true);

    const resFraction2 = checkAnswer('3/4', 0.75);
    expect(resFraction2.isCorrect).toBe(true);
  });

  it('5. Doira yuzi / Aylana uzunligi: kichik xatolik (tolerance ±0.01) ga ruxsat berish', () => {
    const resTolerance = checkAnswer('3.141', 3.14, 0.02);
    expect(resTolerance.isCorrect).toBe(true);

    const resOutsideTolerance = checkAnswer('3.20', 3.14, 0.02);
    expect(resOutsideTolerance.isCorrect).toBe(false);
  });
});
