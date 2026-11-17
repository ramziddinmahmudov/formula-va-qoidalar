import React, { useState, useEffect } from 'react';
import { X, Share2, Download, Check, Sparkles, Send } from 'lucide-react';
import { generateShareCardBlob, shareResult, generateShareText } from './shareCard';
import t from '../../i18n';

export default function ShareModal({ formula, timeTakenSeconds, onClose }) {
  if (!formula) return null;

  const [blob, setBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [sharedStatus, setSharedStatus] = useState(null);

  useEffect(() => {
    let active = true;
    generateShareCardBlob({
      formulaTitle: formula.title,
      timeTakenSeconds,
      formulaKatex: formula.formula
    }).then((b) => {
      if (active && b) {
        setBlob(b);
        setPreviewUrl(URL.createObjectURL(b));
      }
    });

    return () => {
      active = false;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [formula?.id, timeTakenSeconds]);

  const handleShare = async () => {
    setIsSharing(true);
    const res = await shareResult({
      formulaTitle: formula.title,
      timeTakenSeconds,
      blob
    });
    setIsSharing(false);
    if (res.success) {
      setSharedStatus(t('feedback.shared_success'));
      setTimeout(() => setSharedStatus(null), 3000);
    }
  };

  const handleDownload = () => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Formula_${formula.id}_100_foiz.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-indigo-200 dark:border-indigo-900/60 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Natijani doʻstlarga ulashing!
              </h2>
              <p className="text-xs text-slate-500">
                100% toʻgʻri yechdingiz. Oʻz bilimlaringiz bilan faxrlaning!
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rasm ko'rinishi (Preview) */}
        <div className="p-4 sm:p-6 space-y-4 text-center">
          {previewUrl ? (
            <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <img src={previewUrl} alt="Natija kartochkasi" className="w-full h-auto object-contain max-h-72" />
            </div>
          ) : (
            <div className="h-56 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center text-xs text-slate-400">
              Karta tayyorlanmoqda...
            </div>
          )}

          {sharedStatus && (
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{sharedStatus}</span>
            </div>
          )}

          {/* Tugmalar */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Ulashish</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={!blob}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Yuklab olish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
