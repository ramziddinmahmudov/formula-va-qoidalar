import { describe, it, expect } from 'vitest';
import {
  calculateNextReview,
  isDueToday,
  RECALL_RATINGS,
  INITIAL_SM2_ITEM
} from '../src/utils/spacedRepetition';

describe('Spaced Repetition (SM-2) Pure Scheduler Tests', () => {
  const fixedNow = new Date('2026-11-16T12:00:00Z').getTime();

  it('Dastlabki takrorlash: "Esladim" tanlanganda 1 kunlik interval va EF oshishi', () => {
    const res = calculateNextReview(INITIAL_SM2_ITEM, RECALL_RATINGS.REMEMBERED, fixedNow);
    expect(res.repetition).toBe(1);
    expect(res.interval).toBe(1);
    expect(res.easeFactor).toBe(2.6); // 2.5 + 0.1
    expect(new Date(res.nextReviewDate).getTime()).toBe(fixedNow + 1 * 24 * 60 * 60 * 1000);
  });

  it('Ikkinchi muvaffaqiyatli takrorlashda interval 6 kunga choʻzilishi', () => {
    const step1 = calculateNextReview(INITIAL_SM2_ITEM, RECALL_RATINGS.REMEMBERED, fixedNow);
    const step2 = calculateNextReview(step1, RECALL_RATINGS.REMEMBERED, fixedNow);
    expect(step2.repetition).toBe(2);
    expect(step2.interval).toBe(6);
    expect(step2.easeFactor).toBe(2.7);
  });

  it('Uchinchi muvaffaqiyatli takrorlashda interval EF (ease factor) ga koʻpayishi', () => {
    const step2 = { repetition: 2, interval: 6, easeFactor: 2.5 };
    const step3 = calculateNextReview(step2, RECALL_RATINGS.REMEMBERED, fixedNow);
    expect(step3.repetition).toBe(3);
    expect(step3.interval).toBe(Math.round(6 * 2.5)); // 15 kun
    expect(step3.easeFactor).toBe(2.6);
  });

  it('"Qiyin edi" tanlanganda takrorlashlar soni oshadi lekin interval sekin oʻsadi', () => {
    const step1 = calculateNextReview(INITIAL_SM2_ITEM, RECALL_RATINGS.HARD, fixedNow);
    expect(step1.repetition).toBe(1);
    expect(step1.interval).toBe(1);
    expect(step1.easeFactor).toBe(2.35); // 2.5 - 0.15

    const step2 = calculateNextReview(step1, RECALL_RATINGS.HARD, fixedNow);
    expect(step2.repetition).toBe(2);
    expect(step2.interval).toBe(3);
  });

  it('"Esimda yoʻq" tanlanganda repetition 0 ga qaytadi va interval 1 kun boʻladi', () => {
    const advancedItem = { repetition: 4, interval: 30, easeFactor: 2.4 };
    const res = calculateNextReview(advancedItem, RECALL_RATINGS.FORGOT, fixedNow);
    expect(res.repetition).toBe(0);
    expect(res.interval).toBe(1);
    expect(res.easeFactor).toBe(2.2); // 2.4 - 0.2
    expect(new Date(res.nextReviewDate).getTime()).toBe(fixedNow + 1 * 24 * 60 * 60 * 1000);
  });

  it('Ease factor 1.3 dan pastga tushmasligi kerak', () => {
    const lowItem = { repetition: 1, interval: 1, easeFactor: 1.35 };
    const res = calculateNextReview(lowItem, RECALL_RATINGS.FORGOT, fixedNow);
    expect(res.easeFactor).toBe(1.3);
  });

  it('isDueToday funksiyasi muddatni toʻgʻri aniqlashi', () => {
    expect(isDueToday(null, fixedNow)).toBe(true);
    expect(isDueToday({}, fixedNow)).toBe(true);

    const pastItem = { nextReviewDate: new Date(fixedNow - 3600000).toISOString() };
    expect(isDueToday(pastItem, fixedNow)).toBe(true);

    const futureItem = { nextReviewDate: new Date(fixedNow + 86400000).toISOString() };
    expect(isDueToday(futureItem, fixedNow)).toBe(false);
  });

  it('currentItem parametriga null yoki undefined berilganda ham xatoliksiz ishlashi', () => {
    expect(() => calculateNextReview(null, RECALL_RATINGS.REMEMBERED, fixedNow)).not.toThrow();
    const resNull = calculateNextReview(null, RECALL_RATINGS.REMEMBERED, fixedNow);
    expect(resNull.interval).toBe(1);
    expect(resNull.repetition).toBe(1);

    expect(() => calculateNextReview(undefined, RECALL_RATINGS.FORGOT, fixedNow)).not.toThrow();
    const resUndefined = calculateNextReview(undefined, RECALL_RATINGS.FORGOT, fixedNow);
    expect(resUndefined.interval).toBe(1);
    expect(resUndefined.repetition).toBe(0);
  });
});
