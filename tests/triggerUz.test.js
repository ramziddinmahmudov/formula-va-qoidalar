import { describe, it, expect } from 'vitest';
import { formulasData } from '../src/data/formulas';

describe('trigger_uz maydonining toʻliqligi va sifati testi', () => {
  it('Barcha 69 ta formulada trigger_uz mavjud va boʻsh emas', () => {
    expect(formulasData.length).toBeGreaterThanOrEqual(60);

    formulasData.forEach((f) => {
      expect(f.trigger_uz).toBeDefined();
      expect(typeof f.trigger_uz).toBe('string');
      expect(f.trigger_uz.trim().length).toBeGreaterThan(10);
      expect(f.trigger_uz).toMatch(/qoʻllang|ishlating|hisoblang/i);
    });
  });

  it('Barcha formulalarda examSource ("maktab" yoki "dtm") mavjud', () => {
    formulasData.forEach((f) => {
      expect(['maktab', 'dtm']).toContain(f.examSource);
    });
  });

  it('Barcha formulalarda plansRequired massivi mavjud', () => {
    formulasData.forEach((f) => {
      expect(Array.isArray(f.plansRequired)).toBe(true);
      expect(f.plansRequired.length).toBeGreaterThan(0);
    });
  });
});
