import { describe, it, expect, beforeEach } from 'vitest';
import {
  logError,
  getErrorLogs,
  clearFormulaErrors,
  getWeakFormulas,
  addToReviewList,
  removeFromReviewList
} from '../src/utils/storage';
import {
  getUserPlan,
  setUserPlan,
  PLANS,
  canAccessErrorDrill,
  resetEntitlementsStore
} from '../src/modules/monetization/entitlements';
import { initiatePaymentAdapter } from '../src/modules/monetization/SubscriptionModal';

describe('Xatolar ustida ishlash (Error Drill) va Obuna integratsiyasi testi', () => {
  const dummyFormulas = [
    { id: 'alg_kvadrat_tenglama', title: 'Kvadrat tenglama ildizlari', category: 'Algebra' },
    { id: 'geom_pifagor', title: 'Pifagor teoremasi', category: 'Geometriya' },
    { id: 'geom_uchburchak_yuzi', title: 'Uchburchak yuzi', category: 'Geometriya' }
  ];

  beforeEach(() => {
    resetEntitlementsStore();
    clearFormulaErrors('alg_kvadrat_tenglama');
    clearFormulaErrors('geom_pifagor');
    clearFormulaErrors('geom_uchburchak_yuzi');
    removeFromReviewList('alg_kvadrat_tenglama');
    removeFromReviewList('geom_pifagor');
    removeFromReviewList('geom_uchburchak_yuzi');
  });

  it('Xatolik sodir boʻlganda logError uni toʻgʻri qayd qilishi kerak', () => {
    logError({
      formulaId: 'geom_pifagor',
      mistakeType: 'calculation',
      problemText: 'Gipotenuza c = ?',
      studentAnswer: '12',
      correctAnswer: '10'
    });

    const logs = getErrorLogs();
    const pifagorError = logs.find((l) => l.formulaId === 'geom_pifagor');
    expect(pifagorError).toBeDefined();
    expect(pifagorError.studentAnswer).toBe('12');
    expect(pifagorError.correctAnswer).toBe('10');
  });

  it('getWeakFormulas faqat xato qilingan yoki takrorlashga belgilangan formulalarni aniqlashi kerak', () => {
    logError({
      formulaId: 'alg_kvadrat_tenglama',
      mistakeType: 'sign_error'
    });

    const weak = getWeakFormulas(dummyFormulas);
    const weakIds = weak.map((w) => w.id);

    expect(weakIds).toContain('alg_kvadrat_tenglama');
    expect(weakIds).not.toContain('geom_uchburchak_yuzi');
  });

  it('clearFormulaErrors va removeFromReviewList chaqirilgandan soʻng formula zaiflar safidan chiqishi kerak', () => {
    logError({ formulaId: 'geom_pifagor' });
    addToReviewList('geom_pifagor');

    let weak = getWeakFormulas(dummyFormulas);
    expect(weak.some((w) => w.id === 'geom_pifagor')).toBe(true);

    clearFormulaErrors('geom_pifagor');
    removeFromReviewList('geom_pifagor');

    weak = getWeakFormulas(dummyFormulas);
    expect(weak.some((w) => w.id === 'geom_pifagor')).toBe(false);
  });

  it('initiatePaymentAdapter orqali tarif tanlanganda reja va avto-uzaytirish toʻgʻri saqlanishi kerak', async () => {
    const res = await initiatePaymentAdapter({
      plan: PLANS.SUBSCRIPTION,
      autoRenew: true
    });

    expect(res.success).toBe(true);
    expect(getUserPlan()).toBe(PLANS.SUBSCRIPTION);
    expect(canAccessErrorDrill()).toBe(true);
  });
});
