import React from 'react';
import {
  Sparkles,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  Crown,
  Trophy,
  GraduationCap,
  FileDown,
  Clock,
  Flame,
  Focus
} from 'lucide-react';
import t from '../i18n';

export default function Header({
  isDark,
  onToggleTheme,
  isPremium,
  onOpenPaywall,
  offlineEnabled,
  onToggleOffline,
  dueTodayCount,
  streakCount = 0,
  distractionFreeMode = false,
  onToggleDistractionFree,
  onOpenSubscription,
  onOpenExam,
  onOpenTeacher,
  onDownloadPDF
}) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:px-6 flex items-center justify-between gap-3">
        {/* App Title & Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white truncate">
                Formula va Qoidalar
              </h1>
              {isPremium && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                  <Crown className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                  PRO
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden xl:block truncate">
              Maktab va abituriyentlar uchun formulalar va trenajyor
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Ketma-ket kunlar (Streak 🔥) */}
          {streakCount > 0 && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-300/40 dark:border-amber-700/40"
              title={`${t('labels.streak')}: ${streakCount} kun`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{streakCount}</span>
            </div>
          )}

          {/* Bugun takrorlash (SM-2) */}
          {dueTodayCount > 0 && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-bold"
              title={`${dueTodayCount} ta formula bugun takrorlanishi kerak`}
            >
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              <span>{dueTodayCount}</span>
            </div>
          )}

          {/* DTM Test tugmasi (Asosiy CTA) */}
          <button
            onClick={onOpenExam}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-sm shadow-indigo-600/20 transition-all"
            title="DTM Standart Test Sinovi (30 ta savol)"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="font-extrabold">DTM Test</span>
          </button>

          {/* Asboblar guruhi (Tools Group) */}
          <div className="flex items-center gap-0.5 bg-slate-100/80 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
            {/* Diqqat rejimi */}
            <button
              onClick={onToggleDistractionFree}
              aria-label={t('labels.distraction_free')}
              className={`p-1.5 rounded-lg transition-all ${
                distractionFreeMode
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700'
              }`}
              title={distractionFreeMode ? 'Diqqat rejimini oʻchirish' : 'Diqqat rejimi (Faqat formulalar)'}
            >
              <Focus className="w-4 h-4" />
            </button>

            {/* Oflayn rejim toggle */}
            <button
              onClick={onToggleOffline}
              className={`relative p-1.5 rounded-lg transition-all ${
                offlineEnabled
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700'
              }`}
              title={offlineEnabled ? 'Oflayn rejim faol (keshlangan)' : 'Oflayn rejimni yoqish'}
            >
              {offlineEnabled ? (
                <WifiOff className="w-4 h-4 text-emerald-600" />
              ) : (
                <Wifi className="w-4 h-4 opacity-75" />
              )}
              {offlineEnabled && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              )}
            </button>

            {/* PDF yuklab olish */}
            <button
              onClick={onDownloadPDF}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-colors hidden sm:flex items-center"
              title="Formulalarni chop etish / PDF"
            >
              <FileDown className="w-4 h-4" />
            </button>

            {/* Oʻqituvchi xonasi */}
            <button
              onClick={onOpenTeacher}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-colors hidden sm:flex items-center"
              title="Oʻqituvchi xonasi va sinflar"
            >
              <GraduationCap className="w-4 h-4" />
            </button>
          </div>

          {/* Vertikal ajratkich */}
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Premium / Obuna tugmasi */}
          <button
            onClick={onOpenSubscription || onOpenPaywall}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all active:scale-95 ${
              isPremium
                ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm shadow-amber-500/25'
            }`}
            title={isPremium ? t('buttons.manage_subscription') : 'Premiumga oʻtish'}
          >
            <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="hidden sm:inline">
              {isPremium ? 'Obuna' : 'Premium'}
            </span>
          </button>

          {/* Dark / Light tema almashtirish */}
          <button
            onClick={onToggleTheme}
            aria-label="Rang rejimini oʻzgartirish"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
}
