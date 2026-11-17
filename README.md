# «Formula va Qoidalar» (Formulas & Rules) v3.0

Maktab va oliygohlarga kiruvchi abituriyentlar uchun maktab (5–11-sinf) hamda DTM / Milliy sertifikat algebra va geometriya fanlaridan toʻliq 69 ta formula jamlanmasi, dinamik **Mikro-trenajyor**, **SM-2 interval takrorlash tizimi**, **Vizual geometrik simulyatorlar**, **Parabola grafigi**, **30 talik DTM Standart Test Sinovi**, **Kunlik 5 daqiqa (Streak)**, **Tezkor takrorlash (Flashcards)**, **Xatolar ustida ishlash (Error Drill)**, **Telegram Mini App (TMA)** hamda **Ulashish kartochkalari (Share Card)**.

---

## 🚀 Yangi imkoniyatlar va Arxitektura

### 1. Retention & Oʻrganish odatini shakllantirish (Phase 5A)
- 🔥 **Ketma-ket kunlar (Streak):** Har bir oʻquvchining uzluksiz kunlik faolligini hisoblab boruvchi timezone-safe (vaqt mintaqasiga mos) mexanizm.
- ⚡ **«Kunlik 5 daqiqa» mashgʻuloti:** Bugun takrorlanishi kerak boʻlgan (SM-2) yoki eng koʻp uchraydigan mavzulardan 5 ta tezkor misol.
- 🔔 **Brauzer eslatmalari (Notification API):** Foydalanuvchi roziligi bilan har kuni *«Bugungi 5 daqiqalik mashqingiz kutmoqda»* eslatmasi.
- 🎲 **Ketma-ket takrorlanmaslik kafolati (Non-repetition):** Generatorlar `withNoRepetition` xotira qobigʻi orqali ketma-ket bir xil sonli misollarni takrorlamaydi.

### 2. Monetizatsiya va Taʼriflar (Phase 5B)
- 💳 **Toʻrtta aniq reja modeli:**
  - **Bepul (Free):** Barcha algebra formulalari, dastlabki 5 ta geometriya va asosiy trenajyor.
  - **Premium (29 000 soʻm, bir martalik):** Barcha geometriya formulalari, toʻliq trenajyor, oflayn rejim (PWA), PDF konspekt, vizual simulyatorlar va DTM 30 talik imtihon.
  - **Obuna (12 000 soʻm/oy, avto-uzaytirish bilan):** Premiumdagi barcha imkoniyatlar + «Tezkor takrorlash» (Flashcards), «Xatolar ustida ishlash» (Error Drill), «Kunlik 5 daqiqa» va Telegram bot eslatmalari.
  - **Imtihon oldi paketi (19 000 soʻm, 60 kunlik intensiv):** Imtihon mavsumi uchun DTM testlari va tahlillariga ixtisoslashgan toʻliq paket.
- 🛡️ **Markazlashtirilgan huquqlar moduli (`entitlements.js`):** Tarqoq shartlar oʻrniga yagona `canAccessFormula()`, `canAccessExamMode()`, `canAccessFlashcards()`, `canAccessErrorDrill()`.
- 🔌 **Click va Payme uchun yagona integratsiya nuqtasi:** `initiatePaymentAdapter()` funksiyasi real toʻlov tizimlarining webhook va checkout havolalariga oson ulanish uchun tayyorlangan.
- 🗂️ **«Tezkor takrorlash» (Flashcards):** KaTeX formulalari, «Qachon qoʻllaniladi?» qoidasi, oʻgirish animatsiyasi va SM-2 reytingi bilan.
- ⚠️ **«Xatolar ustida ishlash» (Error Drill):** Oʻquvchi test yoki trenajyorda adashgan mavzularni toʻplaydi, *«Siz bu formulada ko'p xato qildingiz»* ogohlantirishini koʻrsatadi va xatolarni toʻliq oʻzlashtirib tuzatmaguncha maqsadli misollar beradi.

### 3. Oʻsish va Tarqatish (Phase 5C)
- 🖼️ **Client-Side Share Card Generator:** HTML Canvas orqali foydalanuvchi natijasini chiroyli PNG rasm shaklida yaratish va Web Share API yoki Telegram orqali ulashish.
- 🎯 **Oltin qoʻllanilish qoidasi (`trigger_uz`):** Barcha 27 ta formulada oʻquvchi qachon aynan shu formulani tanlashi kerakligini koʻrsatuvchi aniq matn (masalan, *«Tenglamada x² va x qatnashsa va koʻpaytuvchilarga ajratish qiyin boʻlsa, ildizlarni diskriminant orqali toping»*).
- 📱 **Telegram Mini App (TMA):** Telegram ichida ochilganda ranglar mavzusini (`themeParams`) avtomatik sinxronlash, PWA oʻrnatish tugmalarini yashirish va Telegram WebApp SDK integratsiyasi.
- 🧘 **Diqqat rejimi (Distraction-Free Mode):** Barcha chalgʻituvchi belgilarni yashirib, faqat formula, `trigger_uz` va trenajyorni koʻrsatuvchi toza oʻrganish ekrani.

---

## 📁 Loyiha papkalari tuzilishi

```text
startup/
├── src/
│   ├── components/               # Asosiy UI komponentlar
│   │   ├── FormulaCard.jsx       # trigger_uz, DTM belgisi, audio va diqqat rejimi
│   │   ├── Header.jsx            # Sarlavha, Streak 🔥, Diqqat rejimi, DTM test, PDF
│   │   ├── KaTeXMath.jsx         # KaTeX LaTeX renderlash komponenti
│   │   ├── MikroTrainerModal.jsx # Klassik, Qadam-baqadam, 60s va xatoliklar logi
│   │   ├── PaywallModal.jsx      # Toʻlovlar oynasi
│   │   └── SearchAndFilter.jsx   # Kategoriya filtrlari va jonli qidiruv
│   ├── data/
│   │   ├── formulas.js           # 69 ta toʻliq formula (trigger_uz, examSource, chastota bilan)
│   │   ├── moreAlgebraFormulas.js # Trigonometriya, Hosilalar, Integrallar, Kombinatorika
│   │   ├── moreGeometryFormulas.js # Sinuslar/Kosinuslar teoremalari, Vektorlar, Fazoviy shakllar
│   │   ├── generators.js         # Takrorlanmas parametrlangan misollar generatori
│   │   ├── moreAlgebraGenerators.js
│   │   └── moreGeometryGenerators.js
│   ├── i18n/
│   │   ├── uz.json               # 100% Oʻzbekcha yagona lokalizatsiya fayli
│   │   └── index.js              # Tarjima helperi t('key')
│   ├── modules/
│   │   ├── exam/                 # DTM Standart Test Sinovi
│   │   ├── visual/               # Geometrik shakllar va Parabola simulyatori
│   │   ├── teacher/              # Oʻqituvchi sinflari va adapteri
│   │   ├── retention/            # Streak, Kunlik 5 daqiqa va Eslatmalar
│   │   │   ├── streak.js         # Timezone-safe ketma-ket kunlar hisobi
│   │   │   ├── DailyPracticeModal.jsx
│   │   │   └── notifications.js  # Web Notification API
│   │   ├── monetization/         # Taʼriflar va Premium imkoniyatlar
│   │   │   ├── entitlements.js   # Markazlashtirilgan huquqlar tekshiruvi
│   │   │   ├── SubscriptionModal.jsx # Click/Payme 4 ta tarif moduli
│   │   │   ├── FlashcardsModal.jsx   # Tezkor takrorlash kartochkalari
│   │   │   └── ErrorDrillModal.jsx   # Xatolar ustida ishlash trenajyori
│   │   ├── share/                # Natijalarni ulashish
│   │   │   ├── shareCard.js      # Canvas PNG generatsiyasi
│   │   │   └── ShareModal.jsx
│   │   └── telegram/             # Telegram integratsiyasi
│   │       ├── telegramWebApp.js # Telegram WebApp / Mini App moslashuvi
│   │       └── telegramBotAdapter.js # Eslatmalar uchun bot adapteri
│   ├── utils/
│   │   ├── mathCheck.js          # Matematik tekshiruv (absolyut xatolik chegarasi bilan)
│   │   ├── spacedRepetition.js   # SM-2 algoritmi sof moduli
│   │   └── storage.js            # Xatolar tarixi va versiyalangan LocalStorage (v2)
│   ├── App.jsx                   # Bosh ilova integratsiyasi
│   ├── index.css                 # Tailwind stillari
│   └── main.jsx                  # Kirish nuqtasi va PWA xizmati
├── tests/                        # 10 ta birlik va integratsion testlar toʻplami
│   ├── entitlements.test.js
│   ├── errorDrillAndSubscription.test.js
│   ├── formulas.test.js
│   ├── generatorRepetition.test.js
│   ├── mistakesAndGenerators.test.js
│   ├── shareCard.test.js
│   ├── spacedRepetition.test.js
│   ├── streak.test.js
│   ├── telegramWebApp.test.js
│   └── triggerUz.test.js
├── CHANGELOG.md                  # Versiyalar tarixi
├── README.md                     # Ushbu qoʻllanma
└── package.json
```

---

## 🛠️ Oʻrnatish va ishga tushirish

```bash
# 1. Bogʻliqliklarni oʻrnatish
npm install

# 2. Dasturchi rejimida ishga tushirish (Localhost: 5173)
npm run dev

# 3. Barcha 47 ta testni ishga tushirish
npm test

# 4. Production build tayyorlash
npm run build
```

---

## 🤖 Telegram Mini App sifatida sozlash
1. Telegramda `@BotFather` orqali yangi bot oching yoki mavjud botni tanlang.
2. `/newapp` buyrugʻini yuboring va web app havolasi sifatida loyihaning xosting URL manzilini koʻrsating.
3. Foydalanuvchi Telegram ichida ochganda `initTelegramWebApp()` avtomatik ravishda tema ranglarini moslashtiradi va PWA oʻrnatish elementlarini yashiradi.

---

## 📝 Til va Matn qoidalari
- Barcha foydalanuvchi interfeysi matnlari qatʼiy ravishda oʻzbek adabiy tilida (lotin yozuvida, standart `ʻ` va `ʼ` tutuq belgilari bilan) yozilgan.
- Barcha matnlar `src/i18n/uz.json` faylida markazlashtirilgan.
