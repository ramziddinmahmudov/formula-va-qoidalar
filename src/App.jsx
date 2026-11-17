import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import Header from './components/Header';
import SearchAndFilter from './components/SearchAndFilter';
import FormulaCard from './components/FormulaCard';
import MikroTrainerModal from './components/MikroTrainerModal';
import PaywallModal from './components/PaywallModal';
import DailyPracticeModal from './modules/retention/DailyPracticeModal';
import FlashcardsModal from './modules/monetization/FlashcardsModal';
import ErrorDrillModal from './modules/monetization/ErrorDrillModal';
import SubscriptionModal from './modules/monetization/SubscriptionModal';
import ShareModal from './modules/share/ShareModal';
import { formulasData } from './data/formulas';
import {
  isPremiumUnlocked,
  setPremiumUnlocked,
  getStats,
  getOfflineMode,
  setOfflineMode,
  getFavorites,
  toggleFavorite,
  isFavorite,
  getReviewList,
  addToReviewList,
  removeFromReviewList,
  isInReviewList,
  getFormulaSM2
} from './utils/storage';
import { isDueToday } from './utils/spacedRepetition';
import { getStreak, recordDailyPractice } from './modules/retention/streak';
import { initTelegramWebApp } from './modules/telegram/telegramWebApp';
import { isPaidUser, getUserPlan } from './modules/monetization/entitlements';
import {
  isNotificationSupported,
  isNotificationEnabled,
  requestNotificationPermission,
  scheduleDailyReminder
} from './modules/retention/notifications';
import {
  Sparkles,
  Flame,
  Zap,
  RotateCw,
  AlertTriangle,
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Brain
} from 'lucide-react';
import t from './i18n';

import VisualToolsModal from './modules/visual/VisualToolsModal';
import DTMExamModal from './modules/exam/DTMExamModal';
import TeacherModal from './modules/teacher/TeacherModal';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Ilova xatoligi:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-white text-center">
          <div className="max-w-md p-6 rounded-2xl bg-slate-800 border border-slate-700 space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold">Kutilmagan xatolik yuz berdi</h2>
            <p className="text-xs text-slate-400">
              Ilovani qayta yuklash orqali davom ettirishingiz mumkin.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all"
            >
              Sahifani qayta yuklash
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('fq_theme') === 'dark' ||
        (!('fq_theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  const [isPremium, setIsPremium] = useState(() => isPaidUser() || isPremiumUnlocked());
  const [offlineEnabled, setOfflineEnabledState] = useState(() => getOfflineMode());
  const [stats, setStats] = useState(() => getStats());
  const [favorites, setFavorites] = useState(() => getFavorites());
  const [reviewList, setReviewList] = useState(() => getReviewList());
  const [streak, setStreak] = useState(() => getStreak());
  const [distractionFreeMode, setDistractionFreeMode] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'Algebra' | 'Geometriya' | 'favorites' | 'review' | 'frequent'

  // Modallar holati
  const [trainerFormula, setTrainerFormula] = useState(null);
  const [visualFormula, setVisualFormula] = useState(null);
  const [isExamOpen, setIsExamOpen] = useState(false);
  const [isTeacherOpen, setIsTeacherOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isDailyPracticeOpen, setIsDailyPracticeOpen] = useState(false);
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [isErrorDrillOpen, setIsErrorDrillOpen] = useState(false);
  const [sharePayload, setSharePayload] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Telegram WebApp va Eslatmalar inicializatsiyasi
  useEffect(() => {
    initTelegramWebApp();
    scheduleDailyReminder();
  }, []);

  // Dark rejim sinxronizatsiyasi
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fq_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fq_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null), 3000;
    }, 3000);
  };

  // Sevimlilar va Takrorlash boshqaruvi
  const handleToggleFav = (formulaId) => {
    const updated = toggleFavorite(formulaId);
    setFavorites(updated);
    showToast(isFavorite(formulaId) ? t('feedback.added_to_favorites') : t('feedback.removed_from_favorites'));
  };

  const handleToggleReview = (formulaId) => {
    if (isInReviewList(formulaId)) {
      const updated = removeFromReviewList(formulaId);
      setReviewList(updated);
      showToast(t('feedback.removed_from_review'));
    } else {
      const updated = addToReviewList(formulaId, 'manual_star');
      setReviewList(updated);
      showToast(t('feedback.added_to_review'));
    }
  };

  // Oflayn rejimni yoqish/o'chirish
  const handleToggleOffline = () => {
    if (!isPremium) {
      setIsSubscriptionOpen(true);
      return;
    }

    const nextState = !offlineEnabled;
    setOfflineEnabledState(nextState);
    setOfflineMode(nextState);

    showToast(nextState ? t('feedback.offline_enabled') : t('feedback.offline_disabled'));
  };

  // Premium / Obuna yangilanishi
  const handlePlanUpdated = () => {
    setIsPremium(isPaidUser() || isPremiumUnlocked());
    showToast('Rejangiz muvaffaqiyatli yangilandi!');
  };

  const handleScoreUpdated = () => {
    setStats(getStats());
    setReviewList(getReviewList());
  };

  // Kunlik mashq yakunlanganda streak yangilash
  const handleDailyPracticeCompleted = () => {
    const updatedStreak = recordDailyPractice();
    setStreak(updatedStreak);
    handleScoreUpdated();
    showToast(`Bugungi kunlik mashq bajarildi! Ketma-ket: ${updatedStreak.currentStreak} kun 🔥`);
  };

  // Eslatmalar uchun ruxsat so'rash
  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      showToast('Eslatmalar yoqildi! Har kuni eslatib turamiz.');
      scheduleDailyReminder();
    } else {
      showToast('Eslatmalarga ruxsat berilmadi.');
    }
  };

  // Bog'langan formulaga o'tish
  const handleSelectFormulaById = (formulaId) => {
    const target = formulasData.find((f) => f.id === formulaId);
    if (target) {
      setSearchQuery('');
      setActiveCategory('all');
      setTimeout(() => {
        const el = document.getElementById(`formula-${formulaId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-4', 'ring-indigo-500');
          setTimeout(() => el.classList.remove('ring-4', 'ring-indigo-500'), 1800);
        }
      }, 100);
    }
  };

  // PDF yuklab olish / Print
  const handleDownloadPDF = () => {
    window.print();
  };

  // Bugun takrorlanishi kerak bo'lgan formulalar soni (SM-2)
  const dueTodayCount = useMemo(() => {
    return formulasData.filter((f) => {
      const sm2 = getFormulaSM2(f.id);
      return sm2 && isDueToday(sm2);
    }).length;
  }, [stats]);

  // Filtr va qidiruv
  const filteredFormulas = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    let list = formulasData.filter((item) => {
      // Kategoriya filtri
      if (activeCategory === 'Algebra') return item.category === 'Algebra';
      if (activeCategory === 'Geometriya') return item.category === 'Geometriya';
      if (activeCategory === 'favorites') return favorites.includes(item.id);
      if (activeCategory === 'review') return reviewList.some((r) => (typeof r === 'string' ? r === item.id : r.id === item.id));
      return true; // 'all' yoki 'frequent'
    });

    // Agar "frequent" tanlansa DTM chastotasi bo'yicha saralaymiz
    if (activeCategory === 'frequent') {
      list = [...list].sort((a, b) => (b.frequency || 3) - (a.frequency || 3));
    }

    // Qidiruv bo'yicha filtrlash
    if (!q) return list;

    return list.filter((item) => {
      const matchesTitle = item.title.toLowerCase().includes(q);
      const matchesKeywords = item.keywords.some((k) => k.toLowerCase().includes(q));
      const matchesFormula = item.formula.toLowerCase().includes(q);
      const matchesTrigger = item.trigger_uz ? item.trigger_uz.toLowerCase().includes(q) : false;
      const matchesHint = item.usageHint_uz.toLowerCase().includes(q);
      return matchesTitle || matchesKeywords || matchesFormula || matchesTrigger || matchesHint;
    });
  }, [searchQuery, activeCategory, favorites, reviewList]);

  const counts = useMemo(() => {
    return {
      all: formulasData.length,
      algebra: formulasData.filter((f) => f.category === 'Algebra').length,
      geometry: formulasData.filter((f) => f.category === 'Geometriya').length,
      favorites: favorites.length,
      review: reviewList.length
    };
  }, [favorites, reviewList]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors print:bg-white print:text-black">
      {/* Toast xabar */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl border border-slate-700 dark:border-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in slide-in-from-top-3 print:hidden">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Yuqori Header */}
      <div className="print:hidden">
        <Header
          isDark={isDark}
          onToggleTheme={toggleTheme}
          isPremium={isPremium}
          onOpenPaywall={() => setIsSubscriptionOpen(true)}
          offlineEnabled={offlineEnabled}
          onToggleOffline={handleToggleOffline}
          dueTodayCount={dueTodayCount}
          streakCount={streak.currentStreak}
          distractionFreeMode={distractionFreeMode}
          onToggleDistractionFree={() => setDistractionFreeMode(!distractionFreeMode)}
          onOpenSubscription={() => setIsSubscriptionOpen(true)}
          onOpenExam={() => setIsExamOpen(true)}
          onOpenTeacher={() => setIsTeacherOpen(true)}
          onDownloadPDF={handleDownloadPDF}
        />
      </div>

      {/* Asosiy kontent */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:px-6 space-y-6">
        {/* Banner qismi (printda va diqqat rejimida yashiriladi) */}
        {!distractionFreeMode && (
          <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white shadow-lg shadow-indigo-500/15 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-white text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Interaktiv taʼlim & DTM 2026</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Formulalarni yodlamang — amalda qoʻllang!
              </h2>
              <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-xl">
                Har bir formuladagi <strong>«Sinab koʻrish»</strong> tugmasi orqali yangi dinamik misollarni ishlang, xatolaringiz sababini tahlil qiling va SM-2 interval takrorlash tizimi bilan xotirada saqlang.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsExamOpen(true)}
                className="bg-white/15 hover:bg-white/25 active:scale-95 transition-all backdrop-blur-md rounded-xl p-3 border border-white/20 text-center min-w-[100px]"
              >
                <div className="text-2xl font-black">30 ta</div>
                <div className="text-[11px] text-indigo-200 uppercase font-semibold">DTM Test</div>
              </button>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-center min-w-[90px]">
                <div className="text-2xl font-black">{formulasData.length} ta</div>
                <div className="text-[11px] text-indigo-200 uppercase font-semibold">Formulalar</div>
              </div>
            </div>
          </div>
        )}

        {/* Phase 5A: Kunlik 5 daqiqa & Tezkor takrorlash & Xatolar paneli */}
        {!distractionFreeMode && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 print:hidden">
            {/* Kunlik 5 daqiqa card */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 dark:border-amber-700/50 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400">
                    <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                    {t('labels.daily_practice')}
                  </span>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {streak.currentStreak} kun ketma-ket
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                  Har kuni 5 ta tezkor misol bilan xotirangizni faol ushlab turing.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-between gap-2">
                <button
                  onClick={() => setIsDailyPracticeOpen(true)}
                  className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Boshlash (5 daqiqa)</span>
                </button>
                {isNotificationSupported() && !isNotificationEnabled() && (
                  <button
                    onClick={handleEnableNotifications}
                    className="p-2 rounded-xl text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/60 transition-colors border border-amber-300/40"
                    title="Kunlik eslatmalarni yoqish"
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Tezkor takrorlash (Flashcards) card */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs font-bold text-indigo-700 dark:text-indigo-400">
                  <RotateCw className="w-4 h-4" />
                  <span>{t('labels.flashcards')}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                  Interaktiv kartochkalar: formulani eslang va oʻzlashtirishni baholang.
                </p>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => setIsFlashcardsOpen(true)}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>Kartochkalarni ochish</span>
                </button>
              </div>
            </div>

            {/* Xatolar ustida ishlash card */}
            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{t('labels.error_drill')}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                  Xato qilingan va zaif formulalar boʻyicha yoʻnaltirilgan intensiv mashq.
                </p>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => setIsErrorDrillOpen(true)}
                  className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Xatolarni tuzatish</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Qidiruv va Filtr paneli (printda yashiriladi) */}
        <div className="print:hidden">
          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            counts={counts}
          />
        </div>

        {/* DTM Chastota tushuntirish eslatmasi */}
        {activeCategory === 'frequent' && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2 print:hidden">
            <TrendingUp className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{t('labels.frequency_note')}</span>
          </div>
        )}

        {/* Diqqat rejimi bildirishnomasi */}
        {distractionFreeMode && (
          <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs text-indigo-800 dark:text-indigo-200 flex items-center justify-between">
            <span className="font-semibold">
              Diqqat rejimi yoqilgan: Faqat formulalar, «Qachon qoʻllaniladi?» qoidasi va trenajyor koʻrsatilmoqda.
            </span>
            <button
              onClick={() => setDistractionFreeMode(false)}
              className="text-xs font-bold underline hover:text-indigo-950 dark:hover:text-white"
            >
              Oddiy rejimga qaytish
            </button>
          </div>
        )}

        {/* Formula kartalari ro'yxati */}
        {filteredFormulas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 print:grid-cols-2 print:gap-4">
            {filteredFormulas.map((formula) => (
              <FormulaCard
                key={formula.id}
                formula={formula}
                isPremium={isPremium}
                stats={stats}
                isFav={isFavorite(formula.id)}
                isInReview={isInReviewList(formula.id)}
                distractionFreeMode={distractionFreeMode}
                onToggleFav={handleToggleFav}
                onToggleReview={handleToggleReview}
                onOpenTrainer={(f) => setTrainerFormula(f)}
                onOpenPaywall={() => setIsSubscriptionOpen(true)}
                onSelectFormulaById={handleSelectFormulaById}
                onOpenVisualModal={(f) => setVisualFormula(f)}
                onOpenShare={(f) => setSharePayload({ formula: f, timeTakenSeconds: null })}
              />
            ))}
          </div>
        ) : (
          /* Natija topilmagan holat */
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 print:hidden">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Formula topilmadi
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              «{searchQuery}» soʻrovi boʻyicha hech narsa chiqmadi. Boshqa kalit soʻz yoki nom bilan qidirib koʻring.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-4 px-4 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 rounded-xl transition-colors"
            >
              Filtrlarni tozalash
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 mt-12 bg-white dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 text-center print:hidden">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong>Formula va Qoidalar</strong> — Maktab va abituriyentlar uchun interaktiv qoʻllanma.
          </div>
          <div className="text-slate-400 dark:text-slate-500">
            Barcha huquqlar himoyalangan © 2026
          </div>
        </div>
      </footer>

      {/* Mikro-trenajyor Modali */}
      {trainerFormula && (
        <MikroTrainerModal
          formula={trainerFormula}
          onClose={() => setTrainerFormula(null)}
          onScoreUpdated={handleScoreUpdated}
          onOpenShare={(f, score, total) => setSharePayload({ formula: f, score, total })}
        />
      )}

      {/* Obuna va Taʼriflar Modali */}
      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        onPlanUpdated={handlePlanUpdated}
      />

      {/* Eski Paywall Modali (Zaxira / To'g'ridan-to'g'ri chaqiruv) */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onUnlockSuccess={handlePlanUpdated}
      />

      {/* Kunlik 5 daqiqa mashq modali */}
      {isDailyPracticeOpen && (
        <DailyPracticeModal
          isOpen={isDailyPracticeOpen}
          onClose={() => setIsDailyPracticeOpen(false)}
          onPracticeCompleted={handleDailyPracticeCompleted}
          currentStreak={streak.currentStreak}
        />
      )}

      {/* Tezkor takrorlash (Flashcards) modali */}
      {isFlashcardsOpen && (
        <FlashcardsModal
          isOpen={isFlashcardsOpen}
          onClose={() => setIsFlashcardsOpen(false)}
          onScheduleUpdated={handleScoreUpdated}
        />
      )}

      {/* Xatolar ustida ishlash modali */}
      {isErrorDrillOpen && (
        <ErrorDrillModal
          isOpen={isErrorDrillOpen}
          onClose={() => setIsErrorDrillOpen(false)}
          onOpenPaywall={() => setIsSubscriptionOpen(true)}
          onReviewUpdated={handleScoreUpdated}
        />
      )}

      {/* Ulashish (Share Card) modali */}
      {sharePayload && (
        <ShareModal
          formula={sharePayload.formula}
          timeTakenSeconds={sharePayload.timeTakenSeconds || (sharePayload.score === 3 ? 45 : null)}
          onClose={() => setSharePayload(null)}
        />
      )}

      {/* Vizual Modallar va DTM Imtihon */}
      {visualFormula && (
        <VisualToolsModal
          formula={visualFormula}
          onClose={() => setVisualFormula(null)}
        />
      )}

      {isExamOpen && (
        <DTMExamModal
          isOpen={isExamOpen}
          onClose={() => setIsExamOpen(false)}
          onReviewAdded={handleScoreUpdated}
          onOpenPaywall={() => setIsSubscriptionOpen(true)}
        />
      )}

      {isTeacherOpen && (
        <TeacherModal
          isOpen={isTeacherOpen}
          onClose={() => setIsTeacherOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
