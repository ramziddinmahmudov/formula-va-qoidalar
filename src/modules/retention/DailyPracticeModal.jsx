import React, { useState, useEffect } from 'react';
import { X, Flame, CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { formulasData } from '../../data/formulas';
import { getFormulaSM2, saveFormulaScore } from '../../utils/storage';
import { isDueToday } from '../../utils/spacedRepetition';
import { checkAnswer } from '../../utils/mathCheck';
import confetti from 'canvas-confetti';
import t from '../../i18n';

export default function DailyPracticeModal({ isOpen, onClose, onPracticeCompleted, currentStreak }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState([null, null, null, null, null]);
  const [isFinished, setIsFinished] = useState(false);

  // 5 ta misol yig'ish (avval bugun takrorlanishi kerak bo'lgan formulalardan, yetmasa chastotasi yuqorilardan)
  const generateDailySet = () => {
    const dueFormulas = formulasData.filter((f) => {
      const sm2 = getFormulaSM2(f.id);
      return sm2 && isDueToday(sm2);
    });

    // 5 ta formula tanlaymiz
    const pool = dueFormulas.length >= 5 ? dueFormulas : [...dueFormulas, ...formulasData];
    const pickedFormulas = [];
    const usedIds = new Set();

    while (pickedFormulas.length < 5) {
      const f = pool[Math.floor(Math.random() * pool.length)];
      if (!usedIds.has(f.id) || pickedFormulas.length >= pool.length) {
        pickedFormulas.push(f);
        usedIds.add(f.id);
      }
    }

    const fiveQuestions = pickedFormulas.map((f, idx) => {
      const gen = f.generators[Math.floor(Math.random() * f.generators.length)];
      const ex = gen('orta');
      return {
        id: idx + 1,
        formulaId: f.id,
        formulaTitle: f.title,
        category: f.category,
        formula: f.formula,
        question_uz: ex.question_uz,
        answer: ex.answer,
        steps_uz: ex.steps_uz
      };
    });

    setQuestions(fiveQuestions);
    setCurrentIndex(0);
    setUserInput('');
    setFeedback([null, null, null, null, null]);
    setIsFinished(false);
  };

  useEffect(() => {
    if (isOpen) {
      generateDailySet();
    }
  }, [isOpen]);

  if (!isOpen || questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const currentFb = feedback[currentIndex];

  const handleCheck = (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim()) return;

    const res = checkAnswer(userInput, currentQ.answer);
    const nextFb = [...feedback];
    nextFb[currentIndex] = res;
    setFeedback(nextFb);

    // Ballni saqlash
    saveFormulaScore(currentQ.formulaId, res.isCorrect ? 1 : 0, 1);

    if (currentIndex === 4 || nextFb.filter((f) => f !== null).length === 5) {
      setIsFinished(true);
      if (onPracticeCompleted) onPracticeCompleted();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleNext = () => {
    if (currentIndex < 4) {
      setCurrentIndex(currentIndex + 1);
      setUserInput('');
    } else {
      setIsFinished(true);
      if (onPracticeCompleted) onPracticeCompleted();
    }
  };

  const correctCount = feedback.filter((f) => f?.isCorrect).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-amber-200 dark:border-amber-900/60 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-50/70 dark:bg-amber-950/40">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
              <Flame className="w-5 h-5 text-amber-500" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                {t('labels.daily_practice')}
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 font-bold">
                  🔥 {currentStreak} kun
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                5 ta tezkor misol • Har kungi bilimni mustahkamlash
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tana Qismi */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* 5 ta qadam indikatori */}
          <div className="grid grid-cols-5 gap-1.5">
            {[0, 1, 2, 3, 4].map((idx) => {
              const fb = feedback[idx];
              const isCurrent = currentIndex === idx;
              let bg = 'bg-slate-200 dark:bg-slate-800';
              if (fb?.isCorrect === true) bg = 'bg-emerald-500 text-white';
              else if (fb?.isCorrect === false) bg = 'bg-rose-500 text-white';
              else if (isCurrent) bg = 'bg-amber-500 text-white ring-2 ring-amber-400/40';

              return (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all ${bg}`}
                  title={`${idx + 1}-misol`}
                />
              );
            })}
          </div>

          {isFinished ? (
            /* Yakuniy ekran */
            <div className="py-6 text-center space-y-4">
              <Trophy className="w-14 h-14 mx-auto text-amber-500" />
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Bugungi mashq yakunlandi!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Natijangiz: <strong className="text-indigo-600 font-extrabold">{correctCount} / 5 toʻgʻri</strong>
                </p>
                <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 text-xs font-black">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Ketma-ket kunlar: {currentStreak} kunga yetdi!</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md"
              >
                Ajoyib, tushundim
              </button>
            </div>
          ) : (
            /* Misol ekrani */
            <div className="space-y-4">
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {currentQ.category} • {currentQ.formulaTitle} ({currentIndex + 1} / 5)
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-base font-semibold text-slate-900 dark:text-white">
                {currentQ.question_uz}
              </div>

              <form onSubmit={handleCheck} className="flex gap-2">
                <input
                  type="text"
                  autoFocus
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={currentFb?.isCorrect}
                  placeholder="Javobingiz..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-base focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!userInput.trim() || currentFb?.isCorrect}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs sm:text-sm active:scale-95 transition-all shadow-sm"
                >
                  Tekshirish
                </button>
              </form>

              {currentFb && (
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                    currentFb.isCorrect
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-rose-50 text-rose-800 border-rose-300'
                  }`}
                >
                  <span>{currentFb.isCorrect ? "To'g'ri!" : "Noto'g'ri"}</span>
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1 px-3 py-1 bg-white dark:bg-slate-900 rounded-lg border text-xs shadow-sm"
                  >
                    <span>Keyingi misol</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
