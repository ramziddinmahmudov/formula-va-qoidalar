import React, { useState, useEffect } from 'react';
import { X, RotateCw, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, Sparkles, Zap, Brain } from 'lucide-react';
import KaTeXMath from '../../components/KaTeXMath';
import { formulasData } from '../../data/formulas';
import { getFormulaSM2, saveFormulaSM2 } from '../../utils/storage';
import { calculateNextReview, RECALL_RATINGS } from '../../utils/spacedRepetition';
import t from '../../i18n';

export default function FlashcardsModal({ isOpen, onClose, onScheduleUpdated }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Barcha formulalarni aralashtiramiz
      const shuffled = [...formulasData].sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [isOpen]);

  // Klaviatura orqali boshqarish (Space: Flip, 1, 2, 3: Baholash, Chap/O'ng: O'tish)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen || cards.length === 0) return;
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === '1' && isFlipped) {
        handleRate(RECALL_RATINGS.FORGOT);
      } else if (e.key === '2' && isFlipped) {
        handleRate(RECALL_RATINGS.HARD);
      } else if (e.key === '3' && isFlipped) {
        handleRate(RECALL_RATINGS.REMEMBERED);
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < cards.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setIsFlipped(false);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
          setIsFlipped(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, cards, currentIndex, isFlipped]);

  if (!isOpen || cards.length === 0) return null;

  const currentCard = cards[currentIndex];

  const handleRate = (rating) => {
    try {
      const prevSM2 = getFormulaSM2(currentCard.id);
      const updated = calculateNextReview(prevSM2, rating);
      saveFormulaSM2(currentCard.id, updated);
      if (onScheduleUpdated) onScheduleUpdated();
    } catch (err) {
      console.warn('SM2 baholash saqlashda xatolik:', err);
    }

    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600">
              <Brain className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {t('labels.flashcards')} ({currentIndex + 1} / {cards.length})
              </h2>
              <p className="text-xs text-slate-500">
                Kartochkani bosing yoki probel (Space) orqali aylantiring
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                if (currentIndex > 0) {
                  setCurrentIndex((prev) => prev - 1);
                  setIsFlipped(false);
                }
              }}
              disabled={currentIndex === 0}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Oldingi karta"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (currentIndex < cards.length - 1) {
                  setCurrentIndex((prev) => prev + 1);
                  setIsFlipped(false);
                }
              }}
              disabled={currentIndex === cards.length - 1}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Keyingi karta"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Asosiy Flashcard */}
        <div className="p-6">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[260px] p-6 rounded-2xl cursor-pointer border-2 transition-all duration-300 flex flex-col justify-between items-center text-center relative select-none shadow-md bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-900 border-indigo-200 dark:border-indigo-800/60 hover:border-indigo-500"
          >
            {/* Yuqori belgi */}
            <div className="w-full flex justify-between items-center text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {currentCard.category}
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <RotateCw className="w-3.5 h-3.5" />
                <span>{isFlipped ? 'Orqa tomoni' : 'Old tomoni'}</span>
              </span>
            </div>

            {/* Kartochka Kontenti */}
            {!isFlipped ? (
              /* OLD TOMONI: Sarlavha va Trigger line */
              <div className="my-auto space-y-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {currentCard.title}
                </h3>

                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-200">
                  <span className="block text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 mb-1">
                    {t('labels.trigger_when')}
                  </span>
                  «{currentCard.trigger_uz}»
                </div>
              </div>
            ) : (
              /* ORQA TOMONI: KaTeX Formula va O'zgaruvchilar */
              <div className="my-auto space-y-4 w-full">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <KaTeXMath math={currentCard.formula} block />
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300">
                  {currentCard.usageHint_uz}
                </div>
              </div>
            )}

            <div className="text-[11px] text-slate-400">
              Aylantirish uchun kartochka ustiga bosing
            </div>
          </div>

          {/* SM-2 Baholash paneli (Faqat orqa tomon ochilganda) */}
          {isFlipped && (
            <div className="mt-5 space-y-2 animate-in fade-in duration-200">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block text-center">
                Qanchalik yaxshi esladingiz? (1, 2, 3 tugmalari)
              </span>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRate(RECALL_RATINGS.FORGOT);
                  }}
                  className="py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-xs hover:bg-rose-100 active:scale-95 transition-all cursor-pointer shadow-sm select-none"
                >
                  [1] Esimda yoʻq
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRate(RECALL_RATINGS.HARD);
                  }}
                  className="py-2.5 px-3 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-xs hover:bg-amber-100 active:scale-95 transition-all cursor-pointer shadow-sm select-none"
                >
                  [2] Qiyin edi
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRate(RECALL_RATINGS.REMEMBERED);
                  }}
                  className="py-2.5 px-3 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 active:scale-95 transition-all cursor-pointer shadow-sm select-none"
                >
                  [3] Esladim
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
