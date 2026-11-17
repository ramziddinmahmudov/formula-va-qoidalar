import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
  Crown,
  Trash2,
  ArrowRight
} from 'lucide-react';
import KaTeXMath from '../../components/KaTeXMath';
import { formulasData, generateExamplesForFormula } from '../../data/formulas';
import { checkAnswer } from '../../utils/mathCheck';
import {
  getWeakFormulas,
  removeFromReviewList,
  clearFormulaErrors,
  saveFormulaScore
} from '../../utils/storage';
import { canAccessErrorDrill } from './entitlements';
import confetti from 'canvas-confetti';
import t from '../../i18n';

export default function ErrorDrillModal({
  isOpen,
  onClose,
  onOpenPaywall,
  onReviewUpdated
}) {
  const [weakList, setWeakList] = useState([]);
  const [activeFormula, setActiveFormula] = useState(null);
  const [examples, setExamples] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [mistakeHints, setMistakeHints] = useState([]);
  const [showSolution, setShowSolution] = useState(false);
  const [drillCompleted, setDrillCompleted] = useState(false);

  // Zaif formulalarni yuklash
  const reloadWeakFormulas = () => {
    const list = getWeakFormulas(formulasData);
    setWeakList(list);
  };

  useEffect(() => {
    if (isOpen) {
      reloadWeakFormulas();
      setActiveFormula(null);
      setDrillCompleted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hasAccess = canAccessErrorDrill();

  // Muayyan formula bo'yicha maqsadli mashqni boshlash
  const handleStartDrill = (formula) => {
    const freshExamples = generateExamplesForFormula(formula, 3, 'medium');
    setActiveFormula(formula);
    setExamples(freshExamples);
    setCurrentIndex(0);
    setUserInput('');
    setFeedback([null, null, null]);
    setMistakeHints([null, null, null]);
    setShowSolution(false);
    setDrillCompleted(false);
  };

  // Javobni tekshirish
  const handleCheck = (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || !examples[currentIndex]) return;

    const currentEx = examples[currentIndex];
    const res = checkAnswer(userInput, currentEx.answer);

    const nextFeedback = [...feedback];
    nextFeedback[currentIndex] = res;
    setFeedback(nextFeedback);

    // Xatolik sababini aniqlash
    if (!res.isCorrect && currentEx.mistakePatterns) {
      const numVal = parseFloat(userInput.replace(',', '.'));
      let hint = null;
      for (const pattern of currentEx.mistakePatterns) {
        if (!isNaN(numVal) && pattern.check(numVal)) {
          hint = pattern.hint_uz;
          break;
        }
      }
      const nextHints = [...mistakeHints];
      nextHints[currentIndex] = hint;
      setMistakeHints(nextHints);
    }

    const answeredCount = nextFeedback.filter((f) => f !== null).length;
    if (answeredCount === 3 || (currentIndex === 2 && res.isCorrect)) {
      const correctCount = nextFeedback.filter((f) => f?.isCorrect).length;
      saveFormulaScore(activeFormula.id, correctCount, 3);

      if (correctCount === 3) {
        // Hammasi to'g'ri bo'lsa xatolar ro'yxatidan avtomatik olib tashlanadi
        removeFromReviewList(activeFormula.id);
        clearFormulaErrors(activeFormula.id);
        reloadWeakFormulas();
        if (onReviewUpdated) onReviewUpdated();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
      setDrillCompleted(true);
    }
  };

  // Keyingi misolga o'tish
  const handleNextProblem = () => {
    if (currentIndex < 2) {
      setCurrentIndex((prev) => prev + 1);
      setUserInput('');
      setShowSolution(false);
    } else {
      setDrillCompleted(true);
    }
  };

  // Ro'yxatdan qo'lda o'chirish
  const handleRemoveFromList = (formulaId) => {
    removeFromReviewList(formulaId);
    clearFormulaErrors(formulaId);
    reloadWeakFormulas();
    if (onReviewUpdated) onReviewUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                {t('labels.error_drill')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Koʻp xato qilingan va zaif mavzular boʻyicha maqsadli mashgʻulot
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tana qismi */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Agar foydalanuvchida ruxsat bo'lmasa (Freemium paywall) */}
          {!hasAccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center border border-amber-200 dark:border-amber-800 shadow-sm">
                <Crown className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                «Xatolar ustida ishlash» — Obuna imkoniyati
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Ushbu boʻlim siz trenajyor va testlarda adashgan formulalaringizni avtomatik toʻplab, xatolaringiz sababini tahlil qiladi va mustahkamlash uchun maxsus misollar beradi.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenPaywall();
                }}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-md transition-all"
              >
                Obunani faollashtirish
              </button>
            </div>
          ) : activeFormula ? (
            /* INTERAKTIV MASHG'ULOT KO'RINISHI */
            <div className="space-y-4">
              {/* Formula vidjeti */}
              <div className="p-3.5 bg-rose-50/60 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/50">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                    {activeFormula.title}
                  </span>
                  <button
                    onClick={() => setActiveFormula(null)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
                  >
                    Barcha xatolarga qaytish
                  </button>
                </div>
                <div className="my-2">
                  <KaTeXMath math={activeFormula.formula} block />
                </div>
                {activeFormula.trigger_uz && (
                  <div className="text-xs text-rose-900 dark:text-rose-200 bg-white/80 dark:bg-slate-900/70 p-2.5 rounded-lg border border-rose-200/60 flex flex-col gap-1">
                    <span className="font-bold text-rose-800 dark:text-rose-300 text-[11px] uppercase tracking-wider">«Qachon qoʻllaniladi?»</span>
                    <span className="leading-relaxed">{activeFormula.trigger_uz}</span>
                  </div>
                )}
              </div>

              {drillCompleted ? (
                /* Natija oynasi */
                <div className="py-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Mashq yakunlandi!
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Natija: <strong className="text-indigo-600 font-bold">{feedback.filter((f) => f?.isCorrect).length} / 3 toʻgʻri</strong>
                  </p>
                  {feedback.filter((f) => f?.isCorrect).length === 3 ? (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                      Ajoyib natija! Bu formula toʻliq oʻzlashtirildi va xatolar roʻyxatidan olib tashlandi.
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                      Hali xatolar bor. Formulani yana bir bor takrorlab, yangi misollarni sinab koʻring.
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => handleStartDrill(activeFormula)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      Qayta topshirish
                    </button>
                    <button
                      onClick={() => setActiveFormula(null)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                    >
                      Boshqa xatolarga oʻtish
                    </button>
                  </div>
                </div>
              ) : (
                /* Joriy misol */
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">Misol {currentIndex + 1} / 3</span>
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((idx) => (
                        <div
                          key={idx}
                          className={`w-2.5 h-2.5 rounded-full ${
                            feedback[idx] === null
                              ? 'bg-slate-200 dark:bg-slate-700'
                              : feedback[idx]?.isCorrect
                              ? 'bg-emerald-500'
                              : 'bg-rose-500'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                      {examples[currentIndex]?.problem_uz}
                    </p>
                  </div>

                  {/* Javob kiritish */}
                  <form onSubmit={handleCheck} className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Javobni kiriting..."
                        disabled={feedback[currentIndex]?.isCorrect}
                        className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="submit"
                        disabled={!userInput.trim() || feedback[currentIndex]?.isCorrect}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-sm whitespace-nowrap"
                      >
                        {t('buttons.check_answer')}
                      </button>
                    </div>
                  </form>

                  {/* Tekshirish natijasi */}
                  {feedback[currentIndex] && (
                    <div className="space-y-2">
                      <div
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                          feedback[currentIndex].isCorrect
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {feedback[currentIndex].isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                          )}
                          <span className="font-bold text-sm">
                            {feedback[currentIndex].isCorrect
                              ? t('feedback.correct')
                              : t('feedback.incorrect')}
                          </span>
                        </div>

                        <button
                          onClick={handleNextProblem}
                          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <span>{t('buttons.next_problem')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Xatolik sababi maslahati */}
                      {!feedback[currentIndex].isCorrect && mistakeHints[currentIndex] && (
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Xatolik sababi:</strong> {mistakeHints[currentIndex]}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Yechim */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowSolution(!showSolution)}
                      className="w-full flex items-center justify-between text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 py-1"
                    >
                      <span>{t('labels.solution')}</span>
                      {showSolution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showSolution && (
                      <div className="mt-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2">
                        <ul className="list-disc list-inside space-y-1">
                          {examples[currentIndex]?.steps_uz.map((step, sIdx) => (
                            <li key={sIdx}>{step}</li>
                          ))}
                        </ul>
                        <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800 font-bold text-indigo-600 dark:text-indigo-400">
                          {t('labels.answer')}: {String(examples[currentIndex]?.answer).replace('.', ',')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* XATOLAR VA ZAIF FORMULALAR RO'YXATI */
            weakList.length === 0 ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Ajoyib! Hozircha xatolar yoʻq
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Siz barcha trenajyor misollarini xatosiz yechgansiz yoki hali tekshiruv boshlamagansiz. Mikro-trenajyor yoki DTM testini boshlang!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Aniqlangan zaif mavzular: <strong className="text-rose-600">{weakList.length} ta</strong>
                  </span>
                </div>

                {weakList.map((formula) => (
                  <div
                    key={formula.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-800 transition-all shadow-sm space-y-2.5"
                  >
                    {/* Yuqori xatolik ogohlantirish burchagi */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                        <span>{t('feedback.frequent_mistakes_warning')}</span>
                      </div>

                      <button
                        onClick={() => handleRemoveFromList(formula.id)}
                        className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded-lg transition-colors"
                        title="Takrorlashdan oʻchirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {formula.title}
                        </h4>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {formula.category}
                        </span>
                      </div>
                    </div>

                    {/* Formula KaTeX */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 flex items-center justify-center">
                      <KaTeXMath math={formula.formula} block />
                    </div>

                    {/* Trigger line */}
                    {formula.trigger_uz && (
                      <div className="text-xs p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border border-amber-200/50 dark:border-amber-900/40 flex flex-col gap-1">
                        <span className="font-bold text-amber-800 dark:text-amber-300 text-[11px] uppercase tracking-wider">«Qachon qoʻllaniladi?»</span>
                        <span className="leading-relaxed">{formula.trigger_uz}</span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="pt-2 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleRemoveFromList(formula.id)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 py-1.5 px-2"
                      >
                        Oʻzlashtirildi deb belgilash
                      </button>

                      <button
                        onClick={() => handleStartDrill(formula)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-rose-600/20 active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Xatolar ustida ishlash</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/70 dark:bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {t('buttons.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
