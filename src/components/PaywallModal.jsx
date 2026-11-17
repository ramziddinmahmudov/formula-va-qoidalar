import React, { useState } from 'react';
import { Crown, Check, X, ShieldCheck, Zap, WifiOff, Sparkles, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PaywallModal({ isOpen, onClose, onUnlockSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [provider, setProvider] = useState('click'); // 'click' | 'payme' | 'uzum'

  if (!isOpen) return null;

  const handlePurchase = () => {
    setIsProcessing(true);

    /* =========================================================================
     * TO'LOV TIZIMI INTEGRATSIYASI (CLICK / PAYME / UZUM BANK):
     * -------------------------------------------------------------------------
     * Haqiqiy muhitda quyidagi amallar bajariladi:
     * 1. Backend API ga so'rov yuboriladi:
     *    const res = await fetch('/api/create-order', {
     *      method: 'POST',
     *      body: JSON.stringify({ provider, amount: 29000, plan: 'lifetime_premium' })
     *    });
     *    const { paymentUrl } = await res.json();
     *
     * 2. Click yoki Payme to'lov sahifasiga yo'naltiriladi:
     *    - Click: `https://my.click.uz/services/pay?service_id=...&merchant_id=...&amount=29000...`
     *    - Payme: `https://checkout.paycom.uz/...`
     *
     * 3. Muvaffaqiyatli to'lovdan so'ng webhook callback kelgach, foydalanuvchiga
     *    premium huquqi beriladi va localStorage / hisob holati yangilanadi.
     * ========================================================================= */

    setTimeout(() => {
      setIsProcessing(false);
      onUnlockSuccess();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 }
      });
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-amber-200 dark:border-amber-900/60 overflow-hidden flex flex-col relative">
        {/* Yuqori yopish tugmasi */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
          aria-label="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Banner qismi */}
        <div className="p-6 bg-gradient-to-br from-amber-500 via-amber-600 to-indigo-700 text-white text-center relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20">
            <Crown className="w-8 h-8 text-amber-200" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Formula va Qoidalar PRO
          </h2>
          <p className="text-xs text-amber-100 mt-1">
            Imtihon va darslarga tayyorgarlik uchun toʻliq imkoniyatlar
          </p>
        </div>

        {/* Asosiy matn va afzalliklar */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200/80 dark:border-amber-900/60 text-center">
            <p className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
              Bu boʻlim premium. Bir martalik toʻlov bilan oching.
            </p>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Barcha Geometriya formulalari va murakkab shakllar</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span>Cheksiz Mikro-trenajyor mashqlari (har safar yangi)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <WifiOff className="w-3.5 h-3.5" />
              </div>
              <span>Toʻliq oflayn rejim (internetsiz ishlaydi)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span>Bir martalik toʻlov — doimiy cheksiz foydalanish</span>
            </div>
          </div>

          {/* To'lov usuli tanlash (Mock Click / Payme / Uzum) */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Toʻlov tizimini tanlang (Demo):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'click', label: 'Click' },
                { id: 'payme', label: 'Payme' },
                { id: 'uzum', label: 'Uzum' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setProvider(item.id)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center ${
                    provider === item.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-500 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sotib olish tugmasi */}
          <button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full py-3.5 px-4 rounded-xl font-black text-sm sm:text-base text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Sotib olish — 29 000 soʻm</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
            Xavfsiz toʻlov kafolatlangan. Sinov rejimida darhol aktivlashadi.
          </p>
        </div>
      </div>
    </div>
  );
}
