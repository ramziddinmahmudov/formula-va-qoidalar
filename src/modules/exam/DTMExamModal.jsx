import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Clock,
  Flag,
  CheckCircle2,
  XCircle,
  Trophy,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  BookmarkPlus,
  Crown,
  Play,
  Zap,
  Sparkles
} from 'lucide-react';
import { formulasData } from '../../data/formulas';
import { saveExamResult, addToReviewList } from '../../utils/storage';
import { canAccessExamMode } from '../monetization/entitlements';
import confetti from 'canvas-confetti';
import t from '../../i18n';

export default function DTMExamModal({
  isOpen,
  onClose,
  onReviewAdded,
  onOpenPaywall
}) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qIndex]: optionIndex }
  const [flagged, setFlagged] = useState({}); // { [qIndex]: boolean }
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 daqiqa (3600 sekund)
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [addedToReview, setAddedToReview] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const timerRef = useRef(null);
  const hasAccess = canAccessExamMode();

  // Test savollarini generatsiya qilish
  const generateDTMTest = (questionCount = 30) => {
    setIsLoading(true);
    try {
      const weightedPool = [];
      formulasData.forEach((formula) => {
        const weight = formula.frequency || 3;
        for (let i = 0; i < weight; i++) {
          weightedPool.push(formula);
        }
      });

      const selectedQuestions = [];

      for (let i = 0; i < questionCount; i++) {
        const formula = weightedPool[Math.floor(Math.random() * weightedPool.length)] || formulasData[0];
        const gen = formula.generators[Math.floor(Math.random() * formula.generators.length)] || formula.generators[0];
        const ex = gen('orta');

        const correctVal = ex.answer;
        let rawDistractors = ex.distractors || [
          typeof correctVal === 'number' ? correctVal + 2 : '10',
          typeof correctVal === 'number' ? correctVal - 3 : '5',
          typeof correctVal === 'number' ? correctVal * 2 : '15'
        ];

        const uniqueDistractors = rawDistractors
          .filter((d) => String(d) !== String(correctVal))
          .slice(0, 3);

        while (uniqueDistractors.length < 3) {
          const fake = typeof correctVal === 'number' ? correctVal + (uniqueDistractors.length + 1) * 3 : `Variant ${uniqueDistractors.length + 2}`;
          uniqueDistractors.push(fake);
        }

        const allOptions = [
          { text: String(correctVal).replace('.', ','), isCorrect: true, raw: correctVal },
          ...uniqueDistractors.map((d) => ({ text: String(d).replace('.', ','), isCorrect: false, raw: d }))
        ].sort(() => Math.random() - 0.5);

        selectedQuestions.push({
          id: i + 1,
          formulaId: formula.id,
          formulaTitle: formula.title,
          category: formula.category,
          question_uz: ex.question_uz,
          options: allOptions,
          steps_uz: ex.steps_uz
        });
      }

      setQuestions(selectedQuestions);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setFlagged({});
      setTimeLeft(questionCount === 5 ? 10 * 60 : 60 * 60);
      setIsSubmitted(false);
      setAddedToReview(false);
    } catch (e) {
      console.error('DTM test generatsiyasida xatolik:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (hasAccess) {
        generateDTMTest(30);
      } else {
        // Bepul foydalanuvchi uchun dastlab savol yaratmay turamiz, paywall yoki demo tanlanadi
        setQuestions([]);
        setIsDemoMode(false);
      }
    }
  }, [isOpen, hasAccess]);

  // Taymerni ishga tushirish
  useEffect(() => {
    if (isOpen && questions.length > 0 && !isSubmitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [isOpen, questions.length, isSubmitted]);

  if (!isOpen) return null;

  // Agar foydalanuvchi pullik bo'lmasa va demo tanlamagan bo'lsa: DTM Preview ekrani
  if (!hasAccess && !isDemoMode) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {t('exam.title')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  30 ta savol • 60 daqiqa • Vaznlangan standart sinov
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center border border-amber-200 dark:border-amber-800 shadow-sm">
              <Crown className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              DTM Standart Test Sinovi
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              Ushbu test davlat imtihonlari (DTM) standarti boʻyicha tuzilgan boʻlib, algebra va geometriya boʻyicha 30 ta vaznlangan savollar, sarflangan vaqt nazorati va zaif mavzular tahlilini beradi.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenPaywall) onOpenPaywall();
                }}
                className="py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Toʻliq testni ochish (Obuna)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsDemoMode(true);
                  generateDTMTest(5);
                }}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
              >
                <Play className="w-4 h-4 text-indigo-600" />
                <span>5 talik bepul demo sinov</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Yuklanish holati
  if (isLoading || questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-3 border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            DTM test savollari tayyorlanmoqda...
          </p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex] || questions[0];
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSelectOption = (optIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIdx
    }));
  };

  const toggleFlag = (idx) => {
    setFlagged((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Testni topshirish
  const handleSubmitTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSubmitted(true);

    let correct = 0;
    const weakFormulaIds = [];

    questions.forEach((q, idx) => {
      const chosen = selectedAnswers[idx];
      if (chosen !== undefined && q.options[chosen].isCorrect) {
        correct++;
      } else {
        weakFormulaIds.push(q.formulaId);
      }
    });

    const timeSpentSeconds = (isDemoMode ? 600 : 3600) - timeLeft;
    saveExamResult({
      date: new Date().toISOString(),
      score: correct,
      total: questions.length,
      timeSpentSeconds,
      weakFormulaIds: [...new Set(weakFormulaIds)]
    });

    if (correct >= Math.floor(questions.length * 0.8)) {
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
    }
  };

  // Kuchsiz mavzularni takrorlash ro'yxatiga qo'shish
  const handleAddWeakToReview = () => {
    const weakSet = new Set();
    questions.forEach((q, idx) => {
      const chosen = selectedAnswers[idx];
      if (chosen === undefined || !q.options[chosen].isCorrect) {
        weakSet.add(q.formulaId);
      }
    });

    weakSet.forEach((fId) => {
      addToReviewList(fId, 'exam_mistake');
    });

    setAddedToReview(true);
    if (onReviewAdded) onReviewAdded();
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Yuqori Panel */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <Trophy className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {t('exam.title')} {isDemoMode && <span className="text-xs text-amber-500 font-bold">(5 talik Demo)</span>}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {questions.length} ta savol • Abituriyent standarti
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-mono font-bold text-sm border border-amber-200 dark:border-amber-800">
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Tana Qismi */}
        {isSubmitted ? (
          /* ================= NATIJALAR VA TAHLIL EKRANI ================= */
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {t('exam.results_title')}
              </h3>
              <p className="text-sm text-slate-500">
                Umumiy ball: <strong className="text-indigo-600 text-lg font-black">{questions.filter((q, idx) => selectedAnswers[idx] !== undefined && q.options[selectedAnswers[idx]].isCorrect).length} / {questions.length}</strong>
              </p>
            </div>

            {/* Xatoliklar va zaif mavzular tahlili */}
            {questions.some((q, idx) => selectedAnswers[idx] === undefined || !q.options[selectedAnswers[idx]].isCorrect) && (
              <div className="p-4 bg-rose-50/70 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/60 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                      {t('exam.weak_topics')}
                    </h4>
                    <p className="text-xs text-rose-700/80 dark:text-rose-300">
                      Xato qilingan formulalarni takrorlash roʻyxatiga qoʻshishingiz mumkin.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleAddWeakToReview}
                  disabled={addedToReview}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>{addedToReview ? 'Takrorlashga qoʻshildi!' : t('buttons.review_weak_formulas')}</span>
                </button>
              </div>
            )}

            {/* Savollar bo'yicha batafsil tekshiruv */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Batafsil tahlil:
              </h4>

              <div className="space-y-3">
                {questions.map((q, idx) => {
                  const chosen = selectedAnswers[idx];
                  const isRight = chosen !== undefined && q.options[chosen].isCorrect;
                  const correctOption = q.options.find((o) => o.isCorrect);

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border text-xs sm:text-sm ${
                        isRight
                          ? 'bg-emerald-50/40 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/60'
                          : 'bg-rose-50/40 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {idx + 1}-savol: {q.formulaTitle} ({q.category})
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isRight ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {isRight ? 'Toʻgʻri' : 'Xato'}
                        </span>
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 font-medium mb-2">
                        {q.question_uz}
                      </p>

                      <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                        <div>Sizning javobingiz: <strong className={isRight ? 'text-emerald-600' : 'text-rose-600'}>{chosen !== undefined ? q.options[chosen].text : 'Belgilanmagan'}</strong></div>
                        {!isRight && (
                          <div>Toʻgʻri javob: <strong className="text-emerald-600">{correctOption?.text}</strong></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl text-sm"
              >
                Yopish
              </button>
            </div>
          </div>
        ) : (
          /* ================= TEST TOPSHIRISH EKRANI ================= */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Chap taraf: Savol va Variantlar */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {currentQ.category} • {currentQ.formulaTitle}
                </span>

                <button
                  onClick={() => toggleFlag(currentIndex)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                    flagged[currentIndex]
                      ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" fill={flagged[currentIndex] ? 'currentColor' : 'none'} />
                  <span>{flagged[currentIndex] ? 'Belgilangan' : 'Belgilab qoʻyish'}</span>
                </button>
              </div>

              {/* Savol matni */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.question_uz}
              </div>

              {/* 4 ta Variant (A, B, C, D) */}
              <div className="grid grid-cols-1 gap-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const letters = ['A', 'B', 'C', 'D'];
                  const isSelected = selectedAnswers[currentIndex] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all active:scale-[0.99] ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500/20 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {letters[optIdx]}
                      </span>
                      <span className="text-sm font-semibold">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Oldingi / Keyingi navigatsiya */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(currentIndex - 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 disabled:opacity-40"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Oldingi</span>
                </button>

                <button
                  type="button"
                  disabled={currentIndex === questions.length - 1}
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40"
                >
                  <span>Keyingi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* O'ng taraf: Savollar matritsasi */}
            <div className="w-full md:w-64 p-4 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 flex justify-between">
                  <span>Savollar jadvali</span>
                  <span className="text-indigo-600 font-extrabold">{answeredCount} / {questions.length}</span>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 gap-1.5 max-h-56 md:max-h-96 overflow-y-auto p-1">
                  {questions.map((_, qIdx) => {
                    const isAns = selectedAnswers[qIdx] !== undefined;
                    const isFlag = flagged[qIdx];
                    const isCurrent = currentIndex === qIdx;

                    let btnClass = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300';
                    if (isAns) btnClass = 'bg-indigo-600 text-white border-indigo-600';
                    if (isFlag) btnClass = 'bg-amber-500 text-white border-amber-500';
                    if (isCurrent) btnClass += ' ring-2 ring-indigo-400 font-black';

                    return (
                      <button
                        key={qIdx}
                        type="button"
                        onClick={() => setCurrentIndex(qIdx)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center border transition-all ${btnClass}`}
                      >
                        {qIdx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Testni topshirish tugmasi */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                <button
                  type="button"
                  onClick={handleSubmitTest}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  Testni yakunlash ({answeredCount}/{questions.length})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
