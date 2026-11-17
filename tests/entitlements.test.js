import { describe, it, expect, beforeEach } from 'vitest';
import {
  getUserPlan,
  setUserPlan,
  PLANS,
  canAccessFormula,
  canAccessExamMode,
  canAccessFlashcards,
  canAccessErrorDrill,
  canAccessOfflineMode,
  isAutoRenewEnabled,
  resetEntitlementsStore
} from '../src/modules/monetization/entitlements';

describe('Entitlements (Huquqlar va Taʼriflar) moduli testi', () => {
  beforeEach(() => {
    resetEntitlementsStore();
  });

  it('Dastlabki holatda reja "free" (bepul) boʻlishi kerak', () => {
    expect(getUserPlan()).toBe(PLANS.FREE);
  });

  it('Bepul foydalanuvchi bepul formulalarni ocha oladi lekin premium shakllarni emas', () => {
    const freeFormula = { id: 'alg_1', free: true };
    const paidFormula = { id: 'geom_trapetsiya', free: false };

    expect(canAccessFormula(freeFormula)).toBe(true);
    expect(canAccessFormula(paidFormula)).toBe(false);
    expect(canAccessExamMode()).toBe(false);
    expect(canAccessOfflineMode()).toBe(false);
  });

  it('Premium faollashtirilganda barcha formulalar, imtihon va oflayn rejim ochiladi', () => {
    setUserPlan(PLANS.PREMIUM);
    expect(getUserPlan()).toBe(PLANS.PREMIUM);

    const paidFormula = { id: 'geom_silindr', free: false };
    expect(canAccessFormula(paidFormula)).toBe(true);
    expect(canAccessExamMode()).toBe(true);
    expect(canAccessOfflineMode()).toBe(true);
  });

  it('Obuna (subscription) faollashtirilganda avto-uzaytirish bayrogʻi va Flashcards ochiladi', () => {
    setUserPlan(PLANS.SUBSCRIPTION, true, 30);
    expect(getUserPlan()).toBe(PLANS.SUBSCRIPTION);
    expect(isAutoRenewEnabled()).toBe(true);
    expect(canAccessFlashcards()).toBe(true);
    expect(canAccessErrorDrill()).toBe(true);
  });

  it('Imtihon oldi paketi (exam_pack) faollashtirilganda test va xatolar mashqi ochiq boʻladi', () => {
    setUserPlan(PLANS.EXAM_PACK, false, 60);
    expect(getUserPlan()).toBe(PLANS.EXAM_PACK);
    expect(canAccessExamMode()).toBe(true);
    expect(canAccessErrorDrill()).toBe(true);
  });
});
