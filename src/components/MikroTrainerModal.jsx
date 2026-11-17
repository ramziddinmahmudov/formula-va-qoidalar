import React, { useState, useEffect, useRef } from 'react';
import KaTeXMath from './KaTeXMath';
import { generateExamplesForFormula } from '../data/formulas';
import { checkAnswer } from '../utils/mathCheck';
import {
  saveFormulaScore,
  addToReviewList,
  isInReviewList,
  removeFromReviewList,
  getFormulaSM2,
  saveFormulaSM2,
  logError
} from '../utils/storage';
import { calculateNextReview, RECALL_RATINGS } from '../utils/spacedRepetition';
import confetti from 'canvas-confetti';
import {
  X,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Trophy,
  Clock,
  Layers,
  HelpCircle,
  Bookmark,
  BookmarkCheck,
  Zap,
  Share2,
  Lightbulb
} from 'lucide-react';
import t from '../i18n';

export default function MikroTrainerModal({ formula, onClose, onScoreUpdated, onOpenShare }) {
  // Trenajyor rejimi: 'standard' | 'step_by_step' | 'timed_60'
  const [trainerMode, setTrainerMode] = useState('standard');
  const [difficulty, setDifficulty] = useState('orta'); // 'oson' | 'orta' | 'qiyin'

  const [examples, setExamples] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInputs, setUserInputs] = useState(['', '', '']);
  const [feedback, setFeedback] = useState([null, null, null]);
  const [mistakeHints, setMistakeHints] = useState([null, null, null]);
  const [showSolutions, setShowSolutions] = useState([false, false, false]);
  const [isFinished, setIsFinished] = useState(false);

  // Qadam-baqadam rejimi holati
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepInput, setStepInput] = useState('');
  const [stepFeedback, setStepFeedback] = useState(null);

  // 60 soniya rejimi holati
  const [timeLeft, setTimeLeft] = useState(60);
  const [timedScore, setTimedScore] = useState(0);
  const [timedTotal, setTimedTotal] = useState(0);
  const [timedQuestion, setTimedQuestion] = useState(null);
  const [timedInput, setTimedInput] = useState('');
  const [timedFeedback, setTimedFeedback] = useState(null);
  const timerRef = useRef(null);

  // Spaced repetition bahosi
  const [recallRated, setRecallRated] = useState(false);
  const [inReview, setInReview] = useState(() => isInReviewList(formula?.id));

  // Misollarni yangilash
  const generateNewSet = () => {
    if (!formula) return;
    const newExs = generateExamplesForFormula(formula.id, 3, difficulty);
    setExamples(newExs);
    setCurrentIndex(0);
    setUserInputs(['', '', '']);
    setFeedback([null, null, null]);
    setMistakeHints([null, null, null]);
    setShowSolutions([false, false, false]);
    setIsFinished(false);
    setCurrentStepIndex(0);
    setStepInput('');
    setStepFeedback(null);
    setRecallRated(false);
  };

  useEffect(() => {
    generateNewSet();
  }, [formula?.id, difficulty, trainerMode]);

  // 60 soniya taymeri
  useEffect(() => {
    if (trainerMode === 'timed_60' && !isFinished) {
      setTimeLeft(60);
      setTimedScore(0);
      setTimedTotal(0);
      const firstQ = generateExamplesForFormula(formula.id, 1, difficulty)[0];
      setTimedQuestion(firstQ);
      setTimedInput('');
      setTimedFeedback(null);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [trainerMode, formula?.id, difficulty]);

  if (!formula || (trainerMode !== 'timed_60' && examples.length === 0)) return null;

  const currentExample = examples[currentIndex];
  const currentFeedback = feedback[currentIndex];
  const currentInput = userInputs[currentIndex];
  const currentHint = mistakeHints[currentIndex];
  const currentShowSolution = showSolutions[currentIndex];

  const handleInputChange = (val) => {
    const nextInputs = [...userInputs];
    nextInputs[currentIndex] = val;
    setUserInputs(nextInputs);
  };

  // Klassik tekshirish va xatolik klassifikatsiyasi
  const handleCheck = (e) => {
    if (e) e.preventDefault();
    if (!currentInput.trim()) return;

    const res = checkAnswer(currentInput, currentExample.answer);
    const nextFeedback = [...feedback];
    nextFeedback[currentIndex] = res;
    setFeedback(nextFeedback);

    // Agar noto'g'ri bo'lsa xato turini tekshiramiz va qayd qilamiz
    if (!res.isCorrect) {
      let detectedHint = null;
      if (currentExample.mistakePatterns) {
        const numVal = parseFloat(currentInput.replace(',', '.'));
        for (const pattern of currentExample.mistakePatterns) {
          if (!isNaN(numVal) && pattern.check(numVal)) {
            detectedHint = pattern.hint_uz;
            break;
          }
        }
        const nextHints = [...mistakeHints];
        nextHints[currentIndex] = detectedHint;
        setMistakeHints(nextHints);
      }
      logError({
        formulaId: formula.id,
        mistakeType: detectedHint ? 'classified' : 'calculation',
        problemText: currentExample.problem_uz,
        studentAnswer: currentInput,
        correctAnswer: String(currentExample.answer)
      });
    }

    const answeredCount = nextFeedback.filter((f) => f !== null).length;
    if (answeredCount === 3 || (currentIndex === 2 && res.isCorrect)) {
      const correctCount = nextFeedback.filter((f) => f?.isCorrect).length;
      saveFormulaScore(formula.id, correctCount, 3);
      if (onScoreUpdated) onScoreUpdated();

      if (correctCount === 3) {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  // Qadam-baqadam rejimida qadamni tekshirish
  const handleCheckStep = (e) => {
    if (e) e.preventDefault();
    const steps = currentExample?.stepQuestions;
    if (!steps || !steps[currentStepIndex]) return;

    const targetStep = steps[currentStepIndex];
    const isStepCorrect = checkAnswer(stepInput, targetStep.step_answer).isCorrect;

    setStepFeedback({ isCorrect: isStepCorrect });

    if (isStepCorrect) {
      if (currentStepIndex + 1 < steps.length) {
        setTimeout(() => {
          setCurrentStepIndex(currentStepIndex + 1);
          setStepInput('');
          setStepFeedback(null);
        }, 800);
      } else {
        // Barcha qadamlar tugadi
        const nextFeedback = [...feedback];
        nextFeedback[currentIndex] = { isCorrect: true };
        setFeedback(nextFeedback);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    }
  };

  // 60 soniya rejimida javob tekshirish
  const handleCheckTimed = (e) => {
    if (e) e.preventDefault();
    if (!timedInput.trim() || timeLeft <= 0) return;

    const res = checkAnswer(timedInput, timedQuestion.answer);
    setTimedTotal((prev) => prev + 1);
    if (res.isCorrect) {
      setTimedScore((prev) => prev + 1);
      setTimedFeedback({ isCorrect: true });
    } else {
      setTimedFeedback({ isCorrect: false });
    }

    setTimeout(() => {
      const nextQ = generateExamplesForFormula(formula.id, 1, difficulty)[0];
      setTimedQuestion(nextQ);
      setTimedInput('');
      setTimedFeedback(null);
    }, 450);
  };

  // Keyingi misolga o'tish
  const handleNext = () => {
    if (currentIndex < 2) {
      setCurrentIndex(currentIndex + 1);
      setCurrentStepIndex(0);
      setStepInput('');
      setStepFeedback(null);
    } else {
      setIsFinished(true);
      const correctCount = feedback.filter((f) => f?.isCorrect).length;
      saveFormulaScore(formula.id, correctCount, 3);
      if (onScoreUpdated) onScoreUpdated();

      if (correctCount === 3) {
        confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
      }
    }
  };

  // Takrorlash ro'yxatiga qo'shish/olib tashlash
  const handleToggleReviewList = () => {
    if (inReview) {
      removeFromReviewList(formula.id);
      setInReview(false);
    } else {
      addToReviewList(formula.id, 'user_flagged_hard');
      setInReview(true);
    }
    if (onScoreUpdated) onScoreUpdated();
  };

  // Spaced repetition bahosini saqlash
  const handleRateRecall = (rating) => {
    const prevSM2 = getFormulaSM2(formula.id);
    const updated = calculateNextReview(prevSM2, rating);
    saveFormulaSM2(formula.id, updated);
    setRecallRated(true);
    if (onScoreUpdated) onScoreUpdated();
  };

  const correctTotal = feedback.filter((f) => f?.isCorrect).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Yuqori Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {t('app_title') === 'Formula va Qoidalar' ? 'Mikro-trenajyor' : t('app_title')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formula.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Takrorlash ro'yxatiga qo'shish tugmasi */}
            <button
              onClick={handleToggleReviewList}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors ${
                inReview
                  ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                  : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:text-slate-800'
              }`}
              title={inReview ? t('feedback.removed_from_review') : t('buttons.mark_hard')}
            >
              {inReview ? <BookmarkCheck className="w-4 h-4 text-amber-600" /> : <Bookmark className="w-4 h-4" />}
              <span className="hidden sm:inline">{inReview ? 'Qiyin deb belgilandi' : 'Qiyin deb belgilash'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Rejim va Qiyinlik tanlov paneli */}
        <div className="px-4 py-2.5 bg-slate-100/70 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
          {/* Rejimlar */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setTrainerMode('standard')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                trainerMode === 'standard'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Klassik (3 misol)
            </button>
            <button
              onClick={() => setTrainerMode('step_by_step')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                trainerMode === 'step_by_step'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Qadam-baqadam
            </button>
            <button
              onClick={() => setTrainerMode('timed_60')}
              className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition-all ${
                trainerMode === 'timed_60'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3 h-3" />
              60 soniya
            </button>
          </div>

          {/* Qiyinlik darajalari */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 dark:text-slate-500 mr-1 hidden sm:inline">Qiyinlik:</span>
            {[
              { id: 'oson', label: 'Oson' },
              { id: 'orta', label: 'Oʻrta' },
              { id: 'qiyin', label: 'Qiyin' }
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setDifficulty(lvl.id)}
                className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-all ${
                  difficulty === lvl.id
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200 font-bold'
                    : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Tana Qismi */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Formula vidjeti */}
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-center">
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1 block">
              Formula
            </span>
            <KaTeXMath math={formula.formula} block />
            {formula.trigger_uz && (
              <div className="mt-2 text-xs text-indigo-950 dark:text-indigo-200 bg-white/80 dark:bg-slate-900/70 p-2.5 rounded-lg border border-indigo-200/50 dark:border-indigo-800/40 text-left flex flex-col gap-1">
                <span className="font-bold text-indigo-700 dark:text-indigo-300 text-[11px] uppercase tracking-wider">«Qachon qoʻllaniladi?»</span>
                <span className="leading-relaxed">{formula.trigger_uz}</span>
              </div>
            )}
          </div>

          {/* 60 SONIYA REJIMI */}
          {trainerMode === 'timed_60' ? (
            isFinished ? (
              <div className="py-6 text-center space-y-3">
                <Trophy className="w-12 h-12 mx-auto text-amber-500" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  60 soniya yakunlandi!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Toʻgʻri javoblar: <strong className="text-indigo-600 text-lg font-black">{timedScore} / {timedTotal}</strong>
                </p>
                <button
                  onClick={() => {
                    setIsFinished(false);
                    setTimeLeft(60);
                    setTimedScore(0);
                    setTimedTotal(0);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
                >
                  Qayta boshlash
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 font-bold text-sm">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                    <span>Qolgan vaqt: {timeLeft}s</span>
                  </div>
                  <div>Ball: {timedScore} ta toʻgʻri</div>
                </div>

                {timedQuestion && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="text-base font-semibold text-slate-900 dark:text-white">
                      {timedQuestion.question_uz}
                    </div>

                    <form onSubmit={handleCheckTimed} className="flex gap-2">
                      <input
                        type="text"
                        autoFocus
                        value={timedInput}
                        onChange={(e) => setTimedInput(e.target.value)}
                        placeholder="Tezkor javob..."
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-base focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm"
                      >
                        Yuborish
                      </button>
                    </form>

                    {timedFeedback && (
                      <div className={`p-2 rounded-lg text-xs font-bold text-center ${timedFeedback.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {timedFeedback.isCorrect ? "To'g'ri!" : "Noto'g'ri"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          ) : isFinished ? (
            /* YAKUNIY NATIJA VA SPACED REPETITION EKRAANI */
            <div className="py-5 text-center space-y-4">
              <Trophy className="w-12 h-12 mx-auto text-amber-500" />
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Mashgʻulot yakunlandi!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Natijangiz: <strong className="text-indigo-600 dark:text-indigo-400 font-extrabold">{correctTotal}/3 to'g'ri</strong>
                </p>
              </div>

              {/* SM-2 Baholash so'rovi */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-left space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                  Ushbu formulani qanchalik yaxshi eslab qoldingiz?
                </span>
                <p className="text-[11px] text-slate-400">
                  SM-2 algoritmi sizning javobingizga qarab keyingi takrorlash sanasini hisoblaydi.
                </p>

                {recallRated ? (
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Interval takrorlash jadvaliga kiritildi!</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => handleRateRecall(RECALL_RATINGS.FORGOT)}
                      className="py-2 px-2 text-xs font-bold rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100"
                    >
                      Esimda yoʻq
                    </button>
                    <button
                      onClick={() => handleRateRecall(RECALL_RATINGS.HARD)}
                      className="py-2 px-2 text-xs font-bold rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100"
                    >
                      Qiyin edi
                    </button>
                    <button
                      onClick={() => handleRateRecall(RECALL_RATINGS.REMEMBERED)}
                      className="py-2 px-2 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                    >
                      Esladim
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ODDIY VA QADAM-BAQADAM MISOL EKRAANI */
            <div className="space-y-4">
              {/* Progress indikator */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
                <span>Misol {currentIndex + 1} / 3</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{correctTotal}/3 to'g'ri</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((idx) => {
                  const fb = feedback[idx];
                  const isCurrent = currentIndex === idx;
                  let bg = 'bg-slate-200 dark:bg-slate-800';
                  if (fb?.isCorrect === true) bg = 'bg-emerald-500 text-white';
                  else if (fb?.isCorrect === false) bg = 'bg-rose-500 text-white';
                  else if (isCurrent) bg = 'bg-indigo-600 text-white ring-2 ring-indigo-400/40';

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all ${bg}`}
                      title={`${idx + 1}-misol`}
                    />
                  );
                })}
              </div>

              {/* Misol matni */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Misol {currentIndex + 1} ({difficulty})
                </div>
                <div className="text-base sm:text-lg font-medium text-slate-900 dark:text-white leading-relaxed">
                  {currentExample.question_uz}
                </div>
              </div>

              {/* QADAM-BAQADAM REJIMI */}
              {trainerMode === 'step_by_step' && currentExample.stepQuestions ? (
                <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    <span>Qadam-baqadam yechish ({currentStepIndex + 1} / {currentExample.stepQuestions.length})</span>
                  </div>

                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {currentExample.stepQuestions[currentStepIndex].step_prompt_uz}
                  </div>

                  <form onSubmit={handleCheckStep} className="flex gap-2">
                    <input
                      type="text"
                      value={stepInput}
                      onChange={(e) => setStepInput(e.target.value)}
                      placeholder="Ushbu qadam javobi..."
                      className="flex-1 px-4 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                    />
                    <button
                      type="submit"
                      disabled={!stepInput.trim()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs"
                    >
                      Keyingi qadam
                    </button>
                  </form>

                  {stepFeedback && (
                    <div className={`p-2.5 rounded-lg text-xs font-semibold ${stepFeedback.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {stepFeedback.isCorrect
                        ? `To'g'ri! ${currentExample.stepQuestions[currentStepIndex].explanation_uz}`
                        : "Noto'g'ri, qayta urinib koʻring."}
                    </div>
                  )}
                </div>
              ) : (
                /* STANDART JAVOB KIRITISH REJIMI */
                <form onSubmit={handleCheck} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                      Javob
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={currentInput}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="Javobingizni kiriting..."
                        disabled={currentFeedback?.isCorrect}
                        className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                      />
                      <button
                        type="submit"
                        disabled={!currentInput.trim() || currentFeedback?.isCorrect}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all active:scale-95 whitespace-nowrap shadow-sm shadow-indigo-600/20"
                      >
                        Javobni tekshirish
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Fikr-mulohaza va Xatolik klassifikatsiyasi */}
              {currentFeedback && (
                <div className="space-y-2">
                  <div
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
                      currentFeedback.isCorrect
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                        : 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {currentFeedback.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                      )}
                      <span className="font-bold text-sm">
                        {currentFeedback.isCorrect
                          ? "To'g'ri!"
                          : "Noto'g'ri, qayta urinib koʻring."}
                      </span>
                    </div>

                    <button
                      onClick={handleNext}
                      className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span>Keyingi misol</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Maxsus xatolik maslahati (Error classification hint) */}
                  {!currentFeedback.isCorrect && currentHint && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Xatolik sababi:</strong> {currentHint}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Yechim (Collapsible Solution) - Faqat javob tekshirilgandan keyin ko'rsatiladi */}
              {currentFeedback && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...showSolutions];
                      next[currentIndex] = !next[currentIndex];
                      setShowSolutions(next);
                    }}
                    className="w-full flex items-center justify-between text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 py-1.5"
                  >
                    <span>Yechim</span>
                    {currentShowSolution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {currentShowSolution && (
                    <div className="mt-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2 animate-in fade-in duration-150">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Qadamma-qadam yechim:
                      </div>
                      <ul className="list-disc list-inside space-y-1 pl-1">
                        {currentExample.steps_uz.map((step, sIdx) => (
                          <li key={sIdx} className="leading-relaxed">
                            {step}
                          </li>
                        ))}
                      </ul>
                      <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800 font-bold text-indigo-600 dark:text-indigo-400">
                        Toʻgʻri javob: {String(currentExample.answer).replace('.', ',')}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Pastki Paneli */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <button
              onClick={generateNewSet}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Yangi misollar</span>
            </button>

            {onOpenShare && (
              <button
                onClick={() => onOpenShare(formula, correctTotal, 3)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-xl hover:bg-indigo-100 transition-colors shadow-sm"
                title="Natijani ulashish"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ulashish</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}
