import React, { useState } from 'react';
import {
  Crown,
  Check,
  X,
  Sparkles,
  Zap,
  Calendar,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  CreditCard
} from 'lucide-react';
import {
  PLANS,
  getUserPlan,
  setUserPlan,
  isAutoRenewEnabled
} from './entitlements';
import confetti from 'canvas-confetti';
import t from '../../i18n';

/**
 * Click va Payme to'lov tizimlari uchun yagona integratsiya nuqtasi (Single integration point)
 * 
 * TODO: Real ishlab chiqarish muhitida backend server API ga POST /api/payments/checkout
 * so'rovi yuborilib, olingan to'lov havolasiga yo'naltiriladi (Click/Payme merchant invoice).
 */
export async function initiatePaymentAdapter({ plan, autoRenew = false }) {
  // Simulyatsiya qilingan to'lov kechikishi (UX uchun)
  await new Promise((resolve) => setTimeout(resolve, 400));

  const durationDays = plan === PLANS.SUBSCRIPTION ? 30 : plan === PLANS.EXAM_PACK ? 60 : null;
  setUserPlan(plan, autoRenew, durationDays);

  return {
    success: true,
    plan,
    autoRenew,
    transactionId: `tx_${Date.now()}`
  };
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  onPlanUpdated
}) {
  const currentPlan = getUserPlan();
  const [selectedPlan, setSelectedPlan] = useState(currentPlan === PLANS.FREE ? PLANS.SUBSCRIPTION : currentPlan);
  const [autoRenew, setAutoRenew] = useState(isAutoRenewEnabled());
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!isOpen) return null;

  const planOptions = [
    {
      id: PLANS.FREE,
      title: 'Bepul',
      badge: 'Boshlangʻich',
      price: '0 soʻm',
      period: 'cheksiz',
      features: [
        'Barcha algebra formulalari',
        'Dastlabki 5 ta geometriya formulasi',
        'Asosiy mikro-trenajyor (3 ta misol)',
        'Qidiruv va formulalar kartalari'
      ],
      popular: false
    },
    {
      id: PLANS.PREMIUM,
      title: 'Premium',
      badge: 'Bir martalik',
      price: '29 000 soʻm',
      period: 'umrbod foydalanish',
      features: [
        'Barcha geometriya va algebra formulalari',
        'Toʻliq mikro-trenajyor (barcha qiyinlik darajalari)',
        'Oflayn rejim (PWA — internetsiz ishlash)',
        'PDF konspekt yuklab olish',
        'Interaktiv geometriya va parabola simulyatori',
        'DTM standart 30 talik test rejimi'
      ],
      popular: false
    },
    {
      id: PLANS.SUBSCRIPTION,
      title: 'Obuna',
      badge: 'Tavsiya etiladi',
      price: '12 000 soʻm',
      period: '/ oy',
      features: [
        'Premiumdagi barcha imkoniyatlar',
        '«Tezkor takrorlash» (Flashcards kartochkalari)',
        '«Xatolar ustida ishlash» (zaif mavzular tahlili)',
        '«Kunlik 5 daqiqa» va Ketma-ket kunlar (Streak)',
        'Avtomatik uzaytirish imkoniyati',
        'Telegram bot eslatmalari'
      ],
      popular: true
    },
    {
      id: PLANS.EXAM_PACK,
      title: 'Imtihon oldi paketi',
      badge: '60 kunlik intensiv',
      price: '19 000 soʻm',
      period: 'mavsumiy paket',
      features: [
        'Barcha Obuna imkoniyatlari 60 kunga',
        'DTM vaznlangan testlar toʻplami',
        'Abituriyentlar uchun chuqurlashtirilgan tahlil',
        'Xatolar trenajyori va flashcards',
        'Imtihon mavsumi uchun maxsus yoʻnaltirilgan'
      ],
      popular: false
    }
  ];

  const handleSelectAndPay = async (planId) => {
    setIsProcessing(true);
    try {
      const res = await initiatePaymentAdapter({
        plan: planId,
        autoRenew: planId === PLANS.SUBSCRIPTION ? autoRenew : false
      });

      if (res.success) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        setSuccessMessage('Tarif muvaffaqiyatli faollashtirildi!');
        if (onPlanUpdated) onPlanUpdated(planId);
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error('Toʻlov xatoligi:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {t('buttons.manage_subscription')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Joriy tarifingiz: <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">{currentPlan}</span>
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

        {/* Muvaffaqiyat xabari */}
        {successMessage && (
          <div className="p-3 bg-emerald-500 text-white font-bold text-center text-sm animate-in fade-in duration-150">
            {successMessage}
          </div>
        )}

        {/* Modal Tana qismi */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Tariflar toʻplami */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planOptions.map((plan) => {
              const isCurrent = currentPlan === plan.id;
              const isSelected = selectedPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-bold shadow-sm uppercase tracking-wider">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {plan.title}
                      </h3>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          Joriy reja
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-1 my-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {plan.period}
                      </span>
                    </div>

                    {/* Imkoniyatlar ro'yxati */}
                    <ul className="space-y-2 my-4 text-xs text-slate-600 dark:text-slate-300">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isCurrent || isProcessing}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAndPay(plan.id);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isCurrent
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default'
                          : plan.popular
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
                      }`}
                    >
                      {isCurrent ? (
                        'Faol rejangiz'
                      ) : isProcessing && selectedPlan === plan.id ? (
                        'Faollashtirilmoqda...'
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>Tanlash va ochish</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Obuna avtomatik uzaytirish tanlovi */}
          {selectedPlan === PLANS.SUBSCRIPTION && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-indigo-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Har oy avtomatik uzaytirish
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Muddati tugaganda obunani avtomatik davom ettirish
                  </div>
                </div>
              </div>

              <input
                type="checkbox"
                checked={autoRenew}
                onChange={(e) => setAutoRenew(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </div>
          )}

          {/* To'lov tizimlari ma'lumoti va kafolat */}
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
            <CreditCard className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                Xavfsiz mahalliy toʻlov tizimlari (Click & Payme)
              </div>
              <p className="leading-relaxed">
                Toʻlovlar toʻgʻridan-toʻgʻri Oʻzbekiston bank kartalari (Uzcard / Humo) orqali amalga oshiriladi. Har qanday vaqtda bekor qilish yoki tarifni oʻzgartirish mumkin.
              </p>
            </div>
          </div>
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
