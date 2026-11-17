import { describe, it, expect } from 'vitest';
import { calculateStreakUpdate, getLocalCalendarDate, getCalendarDaysDiff } from '../src/modules/retention/streak';

describe('Streak (Ketma-ket kunlar) hisoblash testi', () => {
  it('Birinchi marta foydalanganda streak = 1 boʻlishi kerak', () => {
    const res = calculateStreakUpdate(undefined, new Date('2026-11-16T10:00:00'));
    expect(res.currentStreak).toBe(1);
    expect(res.maxStreak).toBe(1);
    expect(res.lastActiveDate).toBe('2026-11-16');
    expect(res.isNewDay).toBe(true);
  });

  it('Shu kunning oʻzida qayta ishlaganda streak oʻzgarmasligi kerak', () => {
    const initial = { currentStreak: 1, maxStreak: 1, lastActiveDate: '2026-11-16' };
    const res = calculateStreakUpdate(initial, new Date('2026-11-16T18:30:00'));
    expect(res.currentStreak).toBe(1);
    expect(res.isNewDay).toBe(false);
  });

  it('Ertasi kuni ishlaganda streak 1 taga oshishi kerak', () => {
    const initial = { currentStreak: 3, maxStreak: 5, lastActiveDate: '2026-11-16' };
    const res = calculateStreakUpdate(initial, new Date('2026-11-17T09:15:00'));
    expect(res.currentStreak).toBe(4);
    expect(res.maxStreak).toBe(5);
    expect(res.lastActiveDate).toBe('2026-11-17');
    expect(res.isNewDay).toBe(true);
  });

  it('Bir kun oʻtkazib yuborilganda (2 kun farq) streak 1 ga reset boʻlishi kerak', () => {
    const initial = { currentStreak: 7, maxStreak: 10, lastActiveDate: '2026-11-15' };
    const res = calculateStreakUpdate(initial, new Date('2026-11-17T11:00:00'));
    expect(res.currentStreak).toBe(1);
    expect(res.maxStreak).toBe(10); // Maksimal streak saqlanib qoladi
    expect(res.lastActiveDate).toBe('2026-11-17');
    expect(res.isNewDay).toBe(true);
  });

  it('Vaqt mintaqasi oʻzgarishlarida (oy oxiri va yangi oy) toʻgʻri ishlashi', () => {
    const endOfMonth = { currentStreak: 4, maxStreak: 4, lastActiveDate: '2026-10-31' };
    const firstOfNov = calculateStreakUpdate(endOfMonth, new Date('2026-11-01T01:30:00'));
    expect(firstOfNov.currentStreak).toBe(5);
    expect(firstOfNov.lastActiveDate).toBe('2026-11-01');
  });

  it('getCalendarDaysDiff sanalar orasidagi kunlar sonini aniq qaytarishi', () => {
    expect(getCalendarDaysDiff('2026-11-16', '2026-11-16')).toBe(0);
    expect(getCalendarDaysDiff('2026-11-16', '2026-11-17')).toBe(1);
    expect(getCalendarDaysDiff('2026-11-16', '2026-11-20')).toBe(4);
  });
});
