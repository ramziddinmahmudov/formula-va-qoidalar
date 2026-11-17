import { formulaGenerators } from './generators.js';

export const moreAlgebraFormulas = [
  {
    id: 'alg_yigindi_kubi',
    category: 'Algebra',
    title: 'Yigʻindining kubi',
    keywords: ['yigʻindining kubi', 'uchinchi daraja', 'qisqa koʻpaytirish', 'koʻphad'],
    formula: '(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3',
    variables: [
      { symbol: 'a', meaning_uz: 'Birinchi qoʻshiluvchi', unit: 'son / ifoda' },
      { symbol: 'b', meaning_uz: 'Ikkinchi qoʻshiluvchi', unit: 'son / ifoda' }
    ],
    usageHint_uz: 'Ikki son yigʻindisini 3-darajaga (kubga) oshirishda va koʻphadlarni yoyishda ishlatiladi.',
    trigger_uz: 'Ikki son yigʻindisini kubga koʻtarish yoki koʻphad yoyilmasidagi hadlarni hisoblashda qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_ayirma_kubi', 'alg_kvadrat_yigindi'],
    generators: formulaGenerators.alg_yigindi_kubi
  },
  {
    id: 'alg_ayirma_kubi',
    category: 'Algebra',
    title: 'Ayirmaning kubi',
    keywords: ['ayirmaning kubi', 'uchinchi daraja', 'qisqa koʻpaytirish', 'minus'],
    formula: '(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3',
    variables: [
      { symbol: 'a', meaning_uz: 'Kamayuvchi', unit: 'son / ifoda' },
      { symbol: 'b', meaning_uz: 'Ayriluvchi', unit: 'son / ifoda' }
    ],
    usageHint_uz: 'Ikki son ayirmasini uchinchi darajaga koʻtarishda qoʻllaniladi.',
    trigger_uz: 'Ikki ifoda ayirmasining kubini ochish yoki ozod hadni topishda qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_yigindi_kubi', 'alg_kublar_ayirma'],
    generators: formulaGenerators.alg_ayirma_kubi
  },
  {
    id: 'alg_daraja_bolinma',
    category: 'Algebra',
    title: 'Darajalarni boʻlish qoidasi',
    keywords: ['daraja', 'boʻlish', 'koʻrsatkich', 'asos'],
    formula: '\\frac{a^m}{a^n} = a^{m - n} \\quad (a \\ne 0)',
    variables: [
      { symbol: 'a', meaning_uz: 'Daraja asosi', unit: 'son' },
      { symbol: 'm, n', meaning_uz: 'Daraja koʻrsatkichlari', unit: 'butun son' }
    ],
    usageHint_uz: 'Bir xil asosli darajalarni boʻlishda daraja koʻrsatkichlari ayriladi.',
    trigger_uz: 'Asoslari bir xil boʻlgan darajali ifodalarni boʻlishda yoki ixchamlashtirishda qoʻllang!',
    examSource: 'maktab',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_daraja_kopaytma', 'alg_daraja_daraja'],
    generators: formulaGenerators.alg_daraja_bolinma
  },
  {
    id: 'alg_daraja_daraja',
    category: 'Algebra',
    title: 'Darajani darajaga koʻtarish',
    keywords: ['daraja', 'koʻpaytirish', 'darajaga koʻtarish'],
    formula: '(a^m)^n = a^{m \\cdot n}',
    variables: [
      { symbol: 'a', meaning_uz: 'Daraja asosi', unit: 'son' },
      { symbol: 'm, n', meaning_uz: 'Daraja koʻrsatkichlari', unit: 'butun son' }
    ],
    usageHint_uz: 'Darajali ifodani yangi darajaga koʻtarishda koʻrsatkichlar oʻzaro koʻpaytiriladi.',
    trigger_uz: 'Qavs ichidagi darajali ifodani yangi darajaga oshirish kerak boʻlganda qoʻllang!',
    examSource: 'maktab',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_daraja_kopaytma', 'alg_daraja_bolinma'],
    generators: formulaGenerators.alg_daraja_daraja
  },
  {
    id: 'alg_daraja_manfiy',
    category: 'Algebra',
    title: 'Manfiy daraja xossasi',
    keywords: ['manfiy daraja', 'kasr', 'teskari son'],
    formula: 'a^{-n} = \\frac{1}{a^n} \\quad (a \\ne 0)',
    variables: [
      { symbol: 'a', meaning_uz: 'Noldan farqli daraja asosi', unit: 'son' },
      { symbol: 'n', meaning_uz: 'Musbat koʻrsatkich', unit: 'butun son' }
    ],
    usageHint_uz: 'Manfiy darajali sonni musbat darajali kasr shakliga keltirishda qoʻllaniladi.',
    trigger_uz: 'Manfiy daraja koʻrsatkichini musbat darajali kasrga aylantirish uchun qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_daraja_bolinma'],
    generators: formulaGenerators.alg_daraja_manfiy
  },
  {
    id: 'alg_ildiz_kopaytma',
    category: 'Algebra',
    title: 'Kvadrat ildizlar koʻpaytmasi',
    keywords: ['ildiz', 'koʻpaytma', 'irratsional', 'kvadrat'],
    formula: '\\sqrt{a \\cdot b} = \\sqrt{a} \\cdot \\sqrt{b} \\quad (a \\ge 0, b \\ge 0)',
    variables: [
      { symbol: 'a, b', meaning_uz: 'Nomanfiy koʻpaytuvchilar', unit: 'son' }
    ],
    usageHint_uz: 'Ildiz ostidagi koʻpaytmani ajratish yoki ikkita ildizni bitta umumiy ildiz ostiga kiritishda qoʻllaniladi.',
    trigger_uz: 'Ildiz ostidan koʻpaytuvchini chiqarish yoki alohida ildizlarni birlashtirishda qoʻllang!',
    examSource: 'maktab',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_ildiz_modul'],
    generators: formulaGenerators.alg_ildiz_kopaytma
  },
  {
    id: 'alg_ildiz_modul',
    category: 'Algebra',
    title: 'Ildiz va modul munosabati',
    keywords: ['ildiz', 'modul', 'kvadrat', 'absolyut qiymat'],
    formula: '\\sqrt{a^2} = |a|',
    variables: [
      { symbol: 'a', meaning_uz: 'Ixtiyoriy haqiqiy son yoki ifoda', unit: 'son' }
    ],
    usageHint_uz: 'Kvadrat ifodadan ildiz chiqarayotganda modul belgisi qolishi shart.',
    trigger_uz: 'Kvadrat ildiz ostida ifoda kvadrati turganda uning ishorasini toʻgʻri aniqlash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_ildiz_kopaytma'],
    generators: formulaGenerators.alg_ildiz_modul
  },
  {
    id: 'alg_logarifm_kopaytma',
    category: 'Algebra',
    title: 'Koʻpaytmaning logarifmi',
    keywords: ['logarifm', 'koʻpaytma', 'yigʻindi', 'xossa'],
    formula: '\\log_a(x \\cdot y) = \\log_a x + \\log_a y',
    variables: [
      { symbol: 'a', meaning_uz: 'Asos (a > 0, a != 1)', unit: 'son' },
      { symbol: 'x, y', meaning_uz: 'Musbat argumentlar', unit: 'son' }
    ],
    usageHint_uz: 'Bir xil asosli logarifmlar yigʻindisini bitta umumiy logarifmga keltirishda qoʻllaniladi.',
    trigger_uz: 'Bir xil asosli logarifmlar yigʻindisini ixchamlashtirish va hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_logarifm_bolinma', 'alg_logarifm_asosiy'],
    generators: formulaGenerators.alg_logarifm_kopaytma
  },
  {
    id: 'alg_logarifm_bolinma',
    category: 'Algebra',
    title: 'Boʻlinmaning logarifmi',
    keywords: ['logarifm', 'boʻlinma', 'ayirma', 'kasr'],
    formula: '\\log_a\\left(\\frac{x}{y}\\right) = \\log_a x - \\log_a y',
    variables: [
      { symbol: 'a', meaning_uz: 'Asos (a > 0, a != 1)', unit: 'son' },
      { symbol: 'x, y', meaning_uz: 'Musbat argumentlar', unit: 'son' }
    ],
    usageHint_uz: 'Bir xil asosli logarifmlar ayirmasini kasr koʻrinishidagi bitta logarifmga keltirishda qoʻllaniladi.',
    trigger_uz: 'Logarifmlar ayirmasini bitta logarifmga birlashtirish yoki hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_logarifm_kopaytma', 'alg_logarifm_daraja'],
    generators: formulaGenerators.alg_logarifm_bolinma
  },
  {
    id: 'alg_logarifm_asos_almashtirish',
    category: 'Algebra',
    title: 'Logarifm asosini almashtirish',
    keywords: ['logarifm', 'asos almashtirish', 'kasr', 'koʻpaytma'],
    formula: '\\log_a b = \\frac{\\log_c b}{\\log_c a} = \\frac{1}{\\log_b a}',
    variables: [
      { symbol: 'a, b', meaning_uz: 'Logarifm asosi va soni', unit: 'son' },
      { symbol: 'c', meaning_uz: 'Yangi ixtiyoriy asos', unit: 'son' }
    ],
    usageHint_uz: 'Turli asosli logarifmlar qatnashgan ifodalarni bir xil asosga keltirishda qoʻllaniladi.',
    trigger_uz: 'Turli asosli logarifmlarni yagona asosga keltirib soddalashtirish yoki hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_logarifm_asosiy', 'alg_logarifm_kopaytma'],
    generators: formulaGenerators.alg_logarifm_asos_almashtirish
  },
  {
    id: 'alg_cheksiz_geometrik_yigindi',
    category: 'Algebra',
    title: 'Cheksiz kamayuvchi geometrik progressiya yigʻindisi',
    keywords: ['progressiya', 'cheksiz', 'geometrik', 'yigʻindi'],
    formula: 'S = \\frac{b_1}{1 - q} \\quad (|q| < 1)',
    variables: [
      { symbol: 'b_1', meaning_uz: 'Birinchi had', unit: 'son' },
      { symbol: 'q', meaning_uz: 'Maxraj (|q| < 1)', unit: 'son' },
      { symbol: 'S', meaning_uz: 'Cheksiz yigʻindi', unit: 'son' }
    ],
    usageHint_uz: 'Maxraji moduli boʻyicha 1 dan kichik boʻlgan cheksiz geometrik progressiyaning barcha hadlari yigʻindisini topishda qoʻllaniladi.',
    trigger_uz: 'Davriy cheksiz kasrlarni oddiy kasrga aylantirish yoki cheksiz yigʻindini hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_geometrik_yigindi', 'alg_geometrik_n_had'],
    generators: formulaGenerators.alg_cheksiz_geometrik_yigindi
  },
  {
    id: 'alg_trig_asosiy_ayniyat',
    category: 'Algebra',
    title: 'Asosiy trigonometrik ayniyat',
    keywords: ['trigonometriya', 'sinus', 'kosinus', 'ayniyat'],
    formula: '\\sin^2\\alpha + \\cos^2\\alpha = 1',
    variables: [
      { symbol: '\\alpha', meaning_uz: 'Ixtiyoriy burchak', unit: 'gradus / rad' }
    ],
    usageHint_uz: 'Sinus maʼlum boʻlganda kosinusni (yoki aksincha) hisoblashda va trigonometrik ifodalarni soddalashtirishda qoʻllaniladi.',
    trigger_uz: 'Sinus va kosinus kvadratlari yigʻindisini 1 ga tenglash yoki biridan ikkinchisini hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_trig_tg_ctg', 'alg_trig_ikkilangan_kosinus'],
    generators: formulaGenerators.alg_trig_asosiy_ayniyat
  },
  {
    id: 'alg_trig_tg_ctg',
    category: 'Algebra',
    title: 'Tangens va kotangens koʻpaytmasi',
    keywords: ['tangens', 'kotangens', 'trigonometriya', 'koʻpaytma'],
    formula: '\\text{tg}\\,\\alpha \\cdot \\text{ctg}\\,\\alpha = 1',
    variables: [
      { symbol: '\\alpha', meaning_uz: 'Burchak (\\alpha \\ne \\frac{\\pi k}{2})', unit: 'gradus / rad' }
    ],
    usageHint_uz: 'Tangens va kotangens oʻzaro teskari miqdorlar ekanligini ifodalaydi.',
    trigger_uz: 'Tangens va kotangens oʻzaro koʻpayganda darhol 1 deb soddalashtirish uchun qoʻllang!',
    examSource: 'maktab',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_trig_asosiy_ayniyat'],
    generators: formulaGenerators.alg_trig_tg_ctg
  },
  {
    id: 'alg_trig_ikkilangan_sinus',
    category: 'Algebra',
    title: 'Ikkilangan burchak sinusi',
    keywords: ['ikkilangan burchak', 'sinus', 'trigonometriya'],
    formula: '\\sin(2\\alpha) = 2\\sin\\alpha\\cos\\alpha',
    variables: [
      { symbol: '\\alpha', meaning_uz: 'Burchak', unit: 'gradus / rad' }
    ],
    usageHint_uz: 'Sinus va kosinus koʻpaytmasini bitta sinus funksiyasiga keltirishda juda muhim formula.',
    trigger_uz: '2sin(x)cos(x) koʻpaytmasini sin(2x) ga birlashtirish yoki ikkilangan burchakni ochish uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_trig_ikkilangan_kosinus', 'alg_trig_yigindi_sinus'],
    generators: formulaGenerators.alg_trig_ikkilangan_sinus
  },
  {
    id: 'alg_trig_ikkilangan_kosinus',
    category: 'Algebra',
    title: 'Ikkilangan burchak kosinusi',
    keywords: ['ikkilangan burchak', 'kosinus', 'trigonometriya'],
    formula: '\\cos(2\\alpha) = \\cos^2\\alpha - \\sin^2\\alpha = 2\\cos^2\\alpha - 1 = 1 - 2\\sin^2\\alpha',
    variables: [
      { symbol: '\\alpha', meaning_uz: 'Burchak', unit: 'gradus / rad' }
    ],
    usageHint_uz: 'cos(2α) ni faqat bitta trigonometrik funksiya orqali ifodalashda qoʻllaniladi.',
    trigger_uz: 'Ikkilangan burchak kosinusini kvadratlar orqali hisoblash yoki tenglamalarni yechishda qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_trig_ikkilangan_sinus', 'alg_trig_daraja_pasaytirish'],
    generators: formulaGenerators.alg_trig_ikkilangan_kosinus
  },
  {
    id: 'alg_trig_yigindi_sinus',
    category: 'Algebra',
    title: 'Burchaklar yigʻindisining sinusi',
    keywords: ['qoʻshish formulasi', 'sinus', 'burchaklar yigʻindisi'],
    formula: '\\sin(\\alpha + \\beta) = \\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta',
    variables: [
      { symbol: '\\alpha, \\beta', meaning_uz: 'Burchaklar', unit: 'gradus / rad' }
    ],
    usageHint_uz: 'Ikki burchak yigʻindisi sinusini standart burchaklar qiymatlari orqali hisoblashda qoʻllaniladi.',
    trigger_uz: 'Nomaʼlum burchak sinusini ikkita qulay burchak yigʻindisiga ajratib hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_trig_ikkilangan_sinus'],
    generators: formulaGenerators.alg_trig_yigindi_sinus
  },
  {
    id: 'alg_trig_daraja_pasaytirish',
    category: 'Algebra',
    title: 'Darajani pasaytirish formulasi',
    keywords: ['darajani pasaytirish', 'sinus kvadrat', 'kosinus kvadrat'],
    formula: '\\sin^2\\alpha = \\frac{1 - \\cos(2\\alpha)}{2}, \\quad \\cos^2\\alpha = \\frac{1 + \\cos(2\\alpha)}{2}',
    variables: [
      { symbol: '\\alpha', meaning_uz: 'Burchak', unit: 'gradus / rad' }
    ],
    usageHint_uz: 'Trigonometrik tenglamalarda va integrallarni hisoblashda darajani 1-darajaga tushirishda qoʻllaniladi.',
    trigger_uz: 'Sinus yoki kosinusning kvadratini chiziqli ikkilangan burchakka aylantirish uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_trig_ikkilangan_kosinus'],
    generators: formulaGenerators.alg_trig_daraja_pasaytirish
  },
  {
    id: 'alg_hosila_daraja',
    category: 'Algebra',
    title: 'Darajali funksiya hosilasi',
    keywords: ['hosila', 'daraja', 'funksiya', 'differensial'],
    formula: '(x^n)\' = n \\cdot x^{n - 1}',
    variables: [
      { symbol: 'x', meaning_uz: 'Erkli oʻzgaruvchi', unit: 'argument' },
      { symbol: 'n', meaning_uz: 'Daraja koʻrsatkichi', unit: 'son' }
    ],
    usageHint_uz: 'Koʻphadlar va darajali funksiyalarning hosilasini topishda asosiy qoida.',
    trigger_uz: 'Darajali funksiyadan hosila olib kritik nuqtalarni yoki oʻsish tezligini hisoblashda qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_hosila_kopaytma', 'alg_integral_daraja'],
    generators: formulaGenerators.alg_hosila_daraja
  },
  {
    id: 'alg_hosila_kopaytma',
    category: 'Algebra',
    title: 'Funksiyalar koʻpaytmasining hosilasi',
    keywords: ['hosila', 'koʻpaytma', 'differensial'],
    formula: '(u \\cdot v)\' = u\'v + uv\'',
    variables: [
      { symbol: 'u, v', meaning_uz: 'Differensiallanuvchi funksiyalar', unit: 'funksiya' }
    ],
    usageHint_uz: 'Ikkita murakkab funksiya koʻpaytmasidan hosila olishda ishlatiladi.',
    trigger_uz: 'Ikkita oʻzgaruvchili ifodalar koʻpaytmasidan hosila olish kerak boʻlganda qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_hosila_daraja', 'alg_hosila_trig_sin'],
    generators: formulaGenerators.alg_hosila_kopaytma
  },
  {
    id: 'alg_hosila_trig_sin',
    category: 'Algebra',
    title: 'Trigonometrik funksiyalar hosilasi',
    keywords: ['hosila', 'sinus', 'kosinus', 'trigonometriya'],
    formula: '(\\sin x)\' = \\cos x, \\quad (\\cos x)\' = -\\sin x',
    variables: [
      { symbol: 'x', meaning_uz: 'Burchak argumenti', unit: 'radian' }
    ],
    usageHint_uz: 'Sinus va kosinus funksiyalarining hosilasini hisoblashda qoʻllaniladi.',
    trigger_uz: 'Trigonometrik ifodalardan hosila olib urinma burchak koeffitsiyentini hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_hosila_daraja'],
    generators: formulaGenerators.alg_hosila_trig_sin
  },
  {
    id: 'alg_integral_daraja',
    category: 'Algebra',
    title: 'Darajali funksiyaning boshlangʻich funksiyasi',
    keywords: ['integral', 'boshlangʻich funksiya', 'daraja'],
    formula: '\\int x^n dx = \\frac{x^{n + 1}}{n + 1} + C \\quad (n \\ne -1)',
    variables: [
      { symbol: 'x', meaning_uz: 'Integrallash oʻzgaruvchisi', unit: 'son' },
      { symbol: 'C', meaning_uz: 'Ixtiyoriy oʻzgarmas son', unit: 'konstanta' }
    ],
    usageHint_uz: 'Darajali funksiyalardan aniqmas integral olishda ishlatiladi.',
    trigger_uz: 'Funksiyaning boshlangʻich funksiyasini topish yoki yuzani hisoblashda qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_integral_nyuton_leybnits', 'alg_hosila_daraja'],
    generators: formulaGenerators.alg_integral_daraja
  },
  {
    id: 'alg_integral_nyuton_leybnits',
    category: 'Algebra',
    title: 'Nyuton-Leybnits formulasi',
    keywords: ['aniq integral', 'nyuton leybnits', 'yuza'],
    formula: '\\int_a^b f(x) dx = F(b) - F(a)',
    variables: [
      { symbol: 'a, b', meaning_uz: 'Integrallash chegaralari', unit: 'son' },
      { symbol: 'F(x)', meaning_uz: 'Boshlangʻich funksiya', unit: 'funksiya' }
    ],
    usageHint_uz: 'Egri chiziqli trapetsiya yuzini va aniq integrallarni hisoblashda asosiy formula.',
    trigger_uz: 'Aniq integral chegaralari boʻyicha qiymatni yoki egri chiziq ostidagi yuzani hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_integral_daraja'],
    generators: formulaGenerators.alg_integral_nyuton_leybnits
  },
  {
    id: 'alg_komb_permutatsiya',
    category: 'Algebra',
    title: 'Oʻrinlashtirishlar (Permutatsiya)',
    keywords: ['kombinatorika', 'faktorial', 'permutatsiya', 'tartib'],
    formula: 'P_n = n! = 1 \\cdot 2 \\cdot 3 \\dots n',
    variables: [
      { symbol: 'n', meaning_uz: 'Elementlar soni', unit: 'butun son' }
    ],
    usageHint_uz: 'n ta turli elementni qatorda necha xil ketma-ketlikda joylashtirish mumkinligini aniqlaydi.',
    trigger_uz: 'Elementlarning joylashuv tartibi muhim boʻlgan barcha oʻrin almashtirishlarni hisoblashda qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_komb_kombinatsiya'],
    generators: formulaGenerators.alg_komb_permutatsiya
  },
  {
    id: 'alg_komb_kombinatsiya',
    category: 'Algebra',
    title: 'Guruhlashlar (Kombinatsiya)',
    keywords: ['kombinatsiya', 'guruhlash', 'kombinatorika'],
    formula: 'C_n^k = \\frac{n!}{k!(n - k)!}',
    variables: [
      { symbol: 'n', meaning_uz: 'Jami elementlar', unit: 'son' },
      { symbol: 'k', meaning_uz: 'Tanlab olingan elementlar', unit: 'son' }
    ],
    usageHint_uz: 'n ta elementdan k tasini tanlashda tartib ahamiyatsiz boʻlganda qoʻllaniladi.',
    trigger_uz: 'Guruhdan bir nechta aʼzoni tartibsiz tanlab olish usullari sonini hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_komb_permutatsiya', 'alg_ehtimollik_klassik'],
    generators: formulaGenerators.alg_komb_kombinatsiya
  },
  {
    id: 'alg_ehtimollik_klassik',
    category: 'Algebra',
    title: 'Klassik ehtimollik formulasi',
    keywords: ['ehtimollik', 'hodisa', 'klassik', 'nisbat'],
    formula: 'P(A) = \\frac{m}{n}',
    variables: [
      { symbol: 'm', meaning_uz: 'Qulay natijalar soni', unit: 'butun son' },
      { symbol: 'n', meaning_uz: 'Teng imkoniyatli jami natijalar', unit: 'butun son' }
    ],
    usageHint_uz: 'Tasodifiy hodisaning roʻy berish ehtimolligini hisoblashda asosiy formula.',
    trigger_uz: 'Barcha teng imkoniyatli sinovlarda biror hodisaning yuz berish ehtimolini hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_komb_kombinatsiya'],
    generators: formulaGenerators.alg_ehtimollik_klassik
  }
];
