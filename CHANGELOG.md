# CHANGELOG: «Formula va Qoidalar»

## [3.0.0] - 2026-11-17

### Matematika formulalari bazasining toʻliq kengaytirilishi (Complete Math Formulas Library)
- **Kutubxona hajmi 27 tadan 69 taga yetkazildi:**
  - **Algebra (40 ta formula):**
    - Qisqa koʻpaytirish formulalari (kublar yigʻindisi va ayirmasi, yigʻindi va ayirmaning kubi).
    - Darajalar va ildizlar (boʻlish, darajani darajaga koʻtarish, manfiy daraja, ildizlar koʻpaytmasi, modul munosabati $\sqrt{a^2}=|a|$).
    - Logarifmlar (koʻpaytma va boʻlinma logarifmi, daraja logarifmi, asos almashtirish, asosiy logarifmik ayniyat).
    - Progressiyalar (arifmetik va geometrik $n$-had, yigʻindi, cheksiz kamayuvchi geometrik progressiya).
    - Trigonometriya (asosiy trigonometrik ayniyat, $\text{tg}\cdot\text{ctg}=1$, ikkilangan burchak sinusi va kosinusi, burchaklar yigʻindisi sinusi, darajani pasaytirish).
    - Funksiyalar va hosilalar (darajali funksiya hosilasi, funksiyalar koʻpaytmasi hosilasi, trigonometrik funksiyalar hosilasi).
    - Integrallar (darajali funksiya boshlangʻich funksiyasi, Nyuton-Leybnits aniq integrali).
    - Kombinatorika va ehtimollik (permutatsiya $P_n=n!$, kombinatsiya $C_n^k$, klassik ehtimollik $P(A)=m/n$).
  - **Geometriya (29 ta formula):**
    - Planimetriya (Pifagor, uchburchak asos va balandligi, Geron, toʻgʻri toʻrtburchak, romb, trapetsiya, muntazam uchburchak, ikki tomon va burchak orqali uchburchak yuzi, parallelogramm).
    - Doira va aylanalar (aylana uzunligi, doira yuzi, doira sektori, ichki va tashqi chizilgan aylanalar radiusi).
    - Teoremalar (Sinuslar teoremasi, Kosinuslar teoremasi).
    - Stereometriya / Fazoviy jismlar (silindr hajmi va toʻla sirti, konus hajmi, shar hajmi va sirti, piramida hajmi, kub hajmi va sirti, toʻgʻri burchakli parallelepiped, toʻgʻri prizma hajmi).
    - Koordinatalar va Vektorlar (ikki nuqta orasidagi masofa, kesma oʻrtasi, vektorlarning skalyar koʻpaytmasi, vektor moduli/uzunligi).
- **Har bir yangi formula uchun:**
  - Kamida 2 tadan dinamik parametrli misollar generatori (`withNoRepetition` bilan).
  - Oʻzbek tilidagi qadam-baqadam yechimlar (`steps_uz` $\ge 2$).
  - Xatoliklarni aniqlash namunalari (`mistakePatterns`) va interaktiv bosqichlar (`stepQuestions`).
  - Oltin qoʻllanilish qoidasi (`trigger_uz`), oʻzgaruvchilar jadvali, DTM/maktab belgilari.
- Barcha 12 ta test toʻplami (55 ta test) 100% muvaffaqiyatli oʻtdi.

## [2.5.0] - 2026-11-17

### Nimalar qurildi (What was built)

#### Phase 5A: Oʻrganish odati va Retention (Habit & Retention)
- **Ketma-ket kunlar (Streak 🔥):**
  - Sof matematik va timezone-safe sana hisobi (`src/modules/retention/streak.js`).
  - Kun almashishi, oy chegaralari (masalan, 31-oktabrdan 1-noyabrga oʻtish) va kun oʻtkazib yuborilganda streak 1 ga reset boʻlishi qamrab olindi.
  - Sarlavhada va «Kunlik 5 daqiqa» blokida koʻrsatiladi.
- **«Kunlik 5 daqiqa» mini-mashgʻuloti (`DailyPracticeModal.jsx`):**
  - Oʻquvchining SM-2 boʻyicha bugun takrorlanishi kerak boʻlgan formulalaridan yoki yuqori chastotali mavzulardan 5 ta tezkor misol.
  - Muvaffaqiyatli yakunlangach streak yangilanadi va bayramona konfetti otiladi.
- **Brauzer eslatmalari (`notifications.js`):**
  - Web Notification API orqali foydalanuvchi ruxsat berganida har kuni *«Bugungi 5 daqiqalik mashqingiz kutmoqda»* eslatmasi yuboriladi.
- **Generatorlar takrorlanmasligi kafolati (`withNoRepetition`):**
  - `generators.js` dagi barcha misol generatorlari maxsus keshlovchi qobiq bilan oʻraldi. Ketma-ket 2 martadan ortiq bir xil sonli misol tushishi toʻliq cheklandi (`tests/generatorRepetition.test.js`).

#### Phase 5B: Monetizatsiyani yangilash (Monetization Revamp)
- **4 ta aniq reja modeli (`SubscriptionModal.jsx`):**
  - «Bepul»: Barcha algebra, 5 ta geometriya va asosiy trenajyor.
  - «Premium» (29 000 soʻm, bir martalik): Barcha geometriya, toʻliq trenajyor, oflayn rejim (PWA), PDF, vizual simulyatorlar va DTM 30 talik test rejimi.
  - «Obuna» (12 000 soʻm/oy): Premium imkoniyatlari + «Tezkor takrorlash», «Xatolar ustida ishlash», «Kunlik 5 daqiqa» va avtomatik uzaytirish (auto-renew) kaliti.
  - «Imtihon oldi paketi» (19 000 soʻm, 60 kunlik intensiv): DTM testlari va kuchsiz mavzular tahliliga yoʻnaltirilgan toʻliq paket.
- **Markazlashtirilgan huquqlar moduli (`entitlements.js`):**
  - Barcha tarqoq if-tekshiruvlar yagona modulga birlashtirildi (`canAccessFormula`, `canAccessExamMode`, `canAccessFlashcards`, `canAccessErrorDrill`, `canAccessOfflineMode`, `canAccessPDFExport`).
- **Click va Payme integratsiya nuqtasi:**
  - `initiatePaymentAdapter({ plan, autoRenew })` orqali toʻlov tizimlari uchun yagona kirish interfeysi yaratildi.
- **«Tezkor takrorlash» kartochkalari (`FlashcardsModal.jsx`):**
  - Old tomoni: Formula nomi, toifasi va «Qachon qoʻllaniladi?» qoidasi.
  - Orqa tomoni: KaTeX formulasi va oʻzgaruvchilar izohi.
  - Klaviaturadan boshqarish (Boʻsh joy: agʻdarish, 1: «Esimda yoʻq», 2: «Qiyin edi», 3: «Esladim») va SM-2 ga saqlash.
- **«Xatolar ustida ishlash» trenajyori (`ErrorDrillModal.jsx`):**
  - Trenajyor va testlarda xato qilingan barcha formulalar `logError()` orqali avtomatik yozib boriladi.
  - Zaif formulalarda *«Siz bu formulada ko'p xato qildingiz»* ogohlantirish yorligʻi koʻrsatiladi.
  - Har bir zaif formula boʻyicha maqsadli 3 ta misol yechilib, 3/3 toʻgʻri topilganda xatolar roʻyxatidan avtomatik chiqariladi.

#### Phase 5C: Oʻsish va Tarqatish (Growth & Distribution)
- **Client-Side Share Card Generator (`shareCard.js` & `ShareModal.jsx`):**
  - HTML Canvas yordamida chiroyli PNG rasm kartochkasi yaratiladi (Formula nomi, KaTeX formulasi, sarflangan vaqt va «100% toʻgʻri yechildi» nishoni).
  - Web Share API va Telegram orqali ulashish yoki toʻgʻridan-toʻgʻri yuklab olish.
- **Oltin qoʻllanilish qoidasi (`trigger_uz`):**
  - 27 ta formulaning barchasida `trigger_uz` matni toʻliq shakllantirildi.
  - Formula kartalarida, trenajyorda, kartochkalarda va qidiruvda alohida ajratib koʻrsatildi.
- **Telegram Mini App (TMA) moslashuvi (`telegramWebApp.js`):**
  - Telegram WebApp SDK aniqlanganda rang mavzusi (`themeParams`) ilovaga oʻtadi, expand qilinadi va PWA install banneri yashiriladi.
- **Telegram Bot eslatmalari adapteri (`telegramBotAdapter.js`):**
  - `MockTelegramBotAdapter` interfeysi orqali serverli bot xabarnomalari chegarasi ajratildi.
- **Diqqat rejimi (Distraction-Free Mode):**
  - Sarlavhadagi maxsus tugma orqali faqat formula, `trigger_uz` va trenajyor qoladi; ortiqcha barcha tugmalar yashiriladi.

---

### Nimalar keyinga qoldirildi va sababi (What was deferred and why)

1. **Click / Payme real server webhooklari:**
   - *Sababi:* Haqiqiy toʻlovlarni qabul qilish uchun Oʻzbekiston bank hisob raqami, yuridik shaxs shartnomasi va backend server kerak. Shuning uchun barcha huquqlar `entitlements.js` va `initiatePaymentAdapter` interfeysi orqali toʻliq tayyorlab qoʻyildi. Backend ulanganda faqat bitta URL ulanadi.
2. **Telegram Bot webhook serveri:**
   - *Sababi:* Ilova toʻliq serverless va brauzerda oflayn (PWA) ishlashi talab etiladi. Telegram bot bilan aloqa `telegramBotAdapter.js` orqali ajratildi.

---

## [2.0.0] - 2026-11-16
- Shaxsiy taʼlim: Sevimlilar, Takrorlash, SM-2 interval takrorlash.
- Interaktiv vizual vositalar: Geometriya simulyatori, Parabola grafigi, Bogʻliqliklar.
- DTM Imtihon rejimi: 30 talik test, realistik chalgʻituvchi variantlar, natijalar tahlili.
- PDF eksport, Ovozli oʻqish (TTS), Oʻqituvchi sinflari moduli.
