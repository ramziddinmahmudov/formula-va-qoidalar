import React, { useState } from 'react';
import KaTeXMath from './KaTeXMath';
import {
  Play,
  Lock,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  HelpCircle,
  Star,
  Bookmark,
  Volume2,
  Share2,
  Eye,
  GitBranch
} from 'lucide-react';
import t from '../i18n';

export default function FormulaCard({
  formula,
  isPremium,
  stats,
  isFav,
  isInReview,
  distractionFreeMode = false,
  onToggleFav,
  onToggleReview,
  onOpenTrainer,
  onOpenPaywall,
  onSelectFormulaById,
  onOpenVisualModal,
  onOpenShare
}) {
  const [showVars, setShowVars] = useState(false);
  const [showRelated, setShowRelated] = useState(false);
  const [ttsMessage, setTtsMessage] = useState(null);

  const isLocked = !formula.free && !isPremium;
  const stat = stats && stats[formula.id];

  const handleAction = () => {
    if (isLocked) {
      onOpenPaywall();
    } else {
      onOpenTrainer(formula);
    }
  };

  // Matnni ovozli o'qish (Web Speech API)
  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      setTtsMessage('Brauzer ovozni qoʻllab-quvvatlamaydi');
      setTimeout(() => setTtsMessage(null), 2500);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    const uzVoice = voices.find((v) => v.lang.startsWith('uz') || v.lang.startsWith('tr'));

    const textToRead = `${formula.title}. ${formula.trigger_uz || formula.usageHint_uz}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);

    if (uzVoice) {
      utterance.voice = uzVoice;
    } else {
      setTtsMessage(t('feedback.offline_no_speech'));
      setTimeout(() => setTtsMessage(null), 3000);
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      id={`formula-${formula.id}`}
      className={`group relative bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
        isLocked
          ? 'border-slate-200/80 dark:border-slate-800/80 hover:border-amber-300 dark:hover:border-amber-700/60 shadow-sm'
          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600/50 hover:shadow-lg shadow-sm'
      }`}
    >
      {/* Top bar with category, badges & actions */}
      <div className="p-4 sm:p-5 pb-3">
        {!distractionFreeMode && (
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  formula.category === 'Algebra'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                }`}
              >
                {formula.category}
              </span>

              {/* DTM mavzusi belgisi */}
              {formula.examSource === 'dtm' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  {t('labels.dtm_source')}
                </span>
              )}

              {/* DTM chastota yulduzchasi (1-5) */}
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                title={`DTM imtihonlarida uchrash darajasi: ${formula.frequency || 3}/5`}
              >
                DTM ★ {formula.frequency || 3}
              </span>

              {isLocked ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <Lock className="w-3 h-3" />
                  Premium
                </span>
              ) : stat ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  <CheckCircle className="w-3 h-3 text-indigo-500" />
                  {stat.lastScore} toʻgʻri
                </span>
              ) : null}
            </div>

            {/* O'ng tarafdagi harakatlar: Ulashish, Sevimli, Qiyin (Review), Ovoz */}
            <div className="flex items-center gap-1">
              {onOpenShare && (
                <button
                  onClick={() => onOpenShare(formula)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Formulani ulashish (PNG rasm va havola)"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={handleSpeak}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Ovozli eshitish"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onToggleReview(formula.id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isInReview
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isInReview ? 'Takrorlash roʻyxatidan chiqarish' : 'Qiyin deb belgilash'}
              >
                <Bookmark className="w-4 h-4" fill={isInReview ? 'currentColor' : 'none'} />
              </button>

              <button
                onClick={() => onToggleFav(formula.id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isFav
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                    : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isFav ? 'Sevimlilardan oʻchirish' : 'Sevimlilarga qoʻshish'}
              >
                <Star className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        )}

        {/* TTS xabari */}
        {ttsMessage && (
          <div className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded-lg mb-2">
            {ttsMessage}
          </div>
        )}

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {formula.title}
        </h3>

        {/* KaTeX Formula Display */}
        <div className="my-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 flex items-center justify-center min-h-[64px]">
          <KaTeXMath math={formula.formula} block />
        </div>

        {/* Golden Trigger Callout («Qachon qoʻllaniladi?») */}
        {formula.trigger_uz && (
          <div className="text-xs p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 mb-3 flex flex-col gap-1">
            <span className="font-bold text-amber-800 dark:text-amber-300 text-[11px] uppercase tracking-wider">
              «Qachon qoʻllaniladi?»
            </span>
            <span className="leading-relaxed text-slate-800 dark:text-slate-200">
              {formula.trigger_uz}
            </span>
          </div>
        )}

        {/* Standart Izoh (Faqat diqqat rejimi yoqilmagan bo'lsa) */}
        {!distractionFreeMode && formula.usageHint_uz && !formula.trigger_uz && (
          <div className="text-xs text-slate-600 dark:text-slate-300 mb-3 flex items-start gap-1.5">
            <span className="font-semibold text-slate-800 dark:text-slate-200 shrink-0">Izoh:</span>
            <span className="leading-relaxed">{formula.usageHint_uz}</span>
          </div>
        )}

        {/* Oʻzgaruvchilar (Faqat diqqat rejimi bo'lmaganda) */}
        {!distractionFreeMode && formula.variables && formula.variables.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setShowVars(!showVars)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 py-1"
            >
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                Oʻzgaruvchilar ({formula.variables.length})
              </span>
              {showVars ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showVars && (
              <div className="mt-2 space-y-1.5 bg-slate-50/70 dark:bg-slate-950/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60 text-xs">
                {formula.variables.map((v, idx) => (
                  <div key={idx} className="flex items-baseline justify-between gap-2">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {v.symbol}:
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 text-left flex-1">
                      {v.meaning_uz}
                    </span>
                    {v.unit && (
                      <span className="text-slate-400 dark:text-slate-500 text-[11px] shrink-0">
                        [{v.unit}]
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bogʻliqlik (Faqat diqqat rejimi bo'lmaganda) */}
        {!distractionFreeMode && formula.related && formula.related.length > 0 && (
          <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setShowRelated(!showRelated)}
              className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 py-0.5"
            >
              <span className="flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                Bogʻliqlik ({formula.related.length})
              </span>
              {showRelated ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showRelated && (
              <div className="flex flex-wrap gap-1.5 mt-1.5 pb-1">
                {formula.related.map((relId) => (
                  <button
                    key={relId}
                    onClick={() => onSelectFormulaById(relId)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-medium transition-colors"
                  >
                    #{relId.replace(/^(alg_|geom_)/, '')}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer: Vizual vosita va Sinab koʻrish */}
      <div className="p-4 sm:p-5 pt-0 mt-auto space-y-2">
        {/* Vizual simulyator tugmasi (Diqqat rejimi bo'lmaganda) */}
        {!distractionFreeMode && (formula.shape || formula.id.includes('diskriminant') || formula.id.includes('ildizlar')) && (
          <button
            onClick={() => onOpenVisualModal(formula)}
            className="w-full py-1.5 px-3 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vizual simulyatorda koʻrish</span>
          </button>
        )}

        <button
          onClick={handleAction}
          className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            isLocked
              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300/40 dark:border-amber-700/40'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30'
          }`}
        >
          {isLocked ? (
            <>
              <Lock className="w-4 h-4" />
              <span>Sinab koʻrish</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Sinab koʻrish</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
