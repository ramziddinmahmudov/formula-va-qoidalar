import { formulaGenerators, generateExamplesForFormula } from './generators.js';
import { moreAlgebraFormulas } from './moreAlgebraFormulas.js';
import { moreGeometryFormulas } from './moreGeometryFormulas.js';

export const formulasData = [
  // ================= ALGEBRA (15 ta) =================
  {
    id: 'alg_kvadrat_yigindi',
    category: 'Algebra',
    title: 'Yigʻindining kvadrati',
    keywords: ['qisqa koʻpaytirish', 'kvadrat', 'yigʻindi', 'koʻphad', 'daraja'],
    formula: '(a + b)^2 = a^2 + 2ab + b^2',
    variables: [
      { symbol: 'a', meaning_uz: 'Birinchi qoʻshiluvchi', unit: 'son / ifoda' },
      { symbol: 'b', meaning_uz: 'Ikkinchi qoʻshiluvchi', unit: 'son / ifoda' }
    ],
    usageHint_uz: 'Ikki son yigʻindisini kvadratga koʻtarishda yoki koʻphadni koʻpaytuvchilarga ajratishda qoʻllaniladi.',
    trigger_uz: 'Ikki son yigʻindisini kvadratga koʻtarishda yoki koʻphadni yoyishda qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_kvadrat_ayirma', 'alg_kvadratlar_ayirmasi'],
    generators: formulaGenerators.alg_kvadrat_yigindi
  },
  {
    id: 'alg_kvadrat_ayirma',
    category: 'Algebra',
    title: 'Ayirmaning kvadrati',
    keywords: ['qisqa koʻpaytirish', 'kvadrat', 'ayirma', 'koʻphad'],
    formula: '(a - b)^2 = a^2 - 2ab + b^2',
    variables: [
      { symbol: 'a', meaning_uz: 'Kamayuvchi', unit: 'son / ifoda' },
      { symbol: 'b', meaning_uz: 'Ayriluvchi', unit: 'son / ifoda' }
    ],
    usageHint_uz: 'Ikki ifoda ayirmasini kvadratga oshirishda va toʻla kvadrat ajratishda ishlatiladi.',
    trigger_uz: 'Ikki ifoda ayirmasini kvadratga oshirishda va toʻla kvadrat ajratishda qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_kvadrat_yigindi', 'alg_kvadratlar_ayirmasi'],
    generators: formulaGenerators.alg_kvadrat_ayirma
  },
  {
    id: 'alg_kvadratlar_ayirmasi',
    category: 'Algebra',
    title: 'Kvadratlar ayirmasi',
    keywords: ['kvadratlar ayirmasi', 'koʻpaytuvchi', 'qisqartirish', 'koʻphad'],
    formula: 'a^2 - b^2 = (a - b)(a + b)',
    variables: [
      { symbol: 'a', meaning_uz: 'Birinchi son', unit: 'son / ifoda' },
      { symbol: 'b', meaning_uz: 'Ikkinchi son', unit: 'son / ifoda' }
    ],
    usageHint_uz: 'Katta sonlar kvadratlari ayirmasini ogʻzaki hisoblashda va kasrlarni qisqartirishda juda qulay.',
    trigger_uz: 'Katta sonlar kvadratlari ayirmasini ogʻzaki tezkor hisoblash yoki kasrni qisqartirishda qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_kvadrat_yigindi', 'alg_kvadrat_ayirma'],
    generators: formulaGenerators.alg_kvadratlar_ayirmasi
  },
  {
    id: 'alg_kublar_yigindi',
    category: 'Algebra',
    title: 'Kublar yigʻindisi',
    keywords: ['kub', 'yigʻindi', 'koʻpaytuvchi', 'uchinchi daraja'],
    formula: 'a^3 + b^3 = (a + b)(a^2 - ab + b^2)',
    variables: [
      { symbol: 'a', meaning_uz: 'Birinchi son', unit: 'son / ifoda' },
      { symbol: 'b', meaning_uz: 'Ikkinchi son', unit: 'son / ifoda' }
    ],
    usageHint_uz: 'Uchinchi darajali ifodalar yigʻindisini koʻpaytuvchilarga ajratishda qoʻllaniladi.',
    trigger_uz: 'Uchinchi darajali ifodalar yigʻindisini koʻpaytuvchilarga ajratish kerak boʻlganda qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_kublar_ayirma', 'alg_kvadrat_yigindi'],
    generators: formulaGenerators.alg_kublar_yigindi
  },
  {
    id: 'alg_kublar_ayirma',
    category: 'Algebra',
    title: 'Kublar ayirmasi',
    keywords: ['kub', 'ayirma', 'koʻpaytuvchilarga ajratish'],
    formula: 'a^3 - b^3 = (a - b)(a^2 + ab + b^2)',
    variables: [
      { symbol: 'a', meaning_uz: 'Birinchi son', unit: 'son / ifoda' },
      { symbol: 'b', meaning_uz: 'Ikkinchi son', unit: 'son / ifoda' }
    ],
    usageHint_uz: 'Kublar ayirmasini chiziqli va toʻliqsiz kvadrat koʻrinishida koʻpaytuvchilarga ajratishda ishlatiladi.',
    trigger_uz: 'Kublar ayirmasini koʻpaytuvchilarga ajratish yoki kasr maxrajidagi irratsionallikni yoʻqotishda qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_kublar_yigindi', 'alg_kvadrat_ayirma'],
    generators: formulaGenerators.alg_kublar_ayirma
  },
  {
    id: 'alg_diskriminant',
    category: 'Algebra',
    title: 'Kvadrat tenglama diskriminanti',
    keywords: ['diskriminant', 'kvadrat tenglama', 'ildizlar', 'D'],
    formula: 'D = b^2 - 4ac',
    variables: [
      { symbol: 'a', meaning_uz: 'Bosh koeffitsiyent', unit: 'son (a ≠ 0)' },
      { symbol: 'b', meaning_uz: 'Ikkinchi koeffitsiyent', unit: 'son' },
      { symbol: 'c', meaning_uz: 'Ozod had', unit: 'son' },
      { symbol: 'D', meaning_uz: 'Diskriminant', unit: 'son' }
    ],
    usageHint_uz: 'Kvadrat tenglamaning nechta haqiqiy ildizga ega ekanligini aniqlash va ildizlarni topishda ishlatiladi.',
    trigger_uz: 'Kvadrat tenglamada ildizlar soni va mavjudligini aniqlashda birinchi navbatda hisoblang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_kvadrat_ildizlar', 'alg_viyet'],
    generators: formulaGenerators.alg_diskriminant
  },
  {
    id: 'alg_kvadrat_ildizlar',
    category: 'Algebra',
    title: 'Kvadrat tenglama ildizlari',
    keywords: ['ildizlar', 'kvadrat tenglama', 'yechim'],
    formula: 'x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}',
    variables: [
      { symbol: 'x_{1,2}', meaning_uz: 'Tenglama ildizlari', unit: 'son' },
      { symbol: 'D', meaning_uz: 'Diskriminant (D ≥ 0)', unit: 'son' },
      { symbol: 'a', meaning_uz: 'Katta koeffitsiyent', unit: 'son' },
      { symbol: 'b', meaning_uz: 'Ikkinchi koeffitsiyent', unit: 'son' }
    ],
    usageHint_uz: 'D ≥ 0 boʻlganda kvadrat tenglamaning barcha haqiqiy ildizlarini aniq hisoblash uchun qoʻllaniladi.',
    trigger_uz: 'Diskriminant D ≥ 0 boʻlganda kvadrat tenglamaning aniq ildizlarini topishda qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_diskriminant', 'alg_viyet'],
    generators: formulaGenerators.alg_kvadrat_ildizlar
  },
  {
    id: 'alg_viyet',
    category: 'Algebra',
    title: 'Viyet teoremasi',
    keywords: ['viyet', 'ildizlar yigʻindisi', 'ildizlar koʻpaytmasi'],
    formula: 'x_1 + x_2 = -\\frac{b}{a}, \\quad x_1 x_2 = \\frac{c}{a}',
    variables: [
      { symbol: 'x_1, x_2', meaning_uz: 'Tenglama ildizlari', unit: 'son' },
      { symbol: 'a, b, c', meaning_uz: 'Kvadrat tenglama koeffitsiyentlari', unit: 'sonlar' }
    ],
    usageHint_uz: 'Keltirilgan kvadrat tenglama ildizlarini ogʻzaki tezkor topish yoki ildizlar simmetrik funksiyalarini hisoblashda qoʻllaniladi.',
    trigger_uz: 'Keltirilgan kvadrat tenglama ildizlarini ogʻzaki tezkor topish yoki simmetrik ifodalarni hisoblashda qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_diskriminant', 'alg_kvadrat_ildizlar'],
    generators: formulaGenerators.alg_viyet
  },
  {
    id: 'alg_arifmetik_n_had',
    category: 'Algebra',
    title: 'Arifmetik progressiya n-hadi',
    keywords: ['arifmetik progressiya', 'n-had', 'ayirma', 'd'],
    formula: 'a_n = a_1 + (n - 1)d',
    variables: [
      { symbol: 'a_n', meaning_uz: 'n-had', unit: 'son' },
      { symbol: 'a_1', meaning_uz: 'Birinchi had', unit: 'son' },
      { symbol: 'd', meaning_uz: 'Progressiya ayirmasi', unit: 'son' },
      { symbol: 'n', meaning_uz: 'Had tartib raqami', unit: 'natural son' }
    ],
    usageHint_uz: 'Arifmetik progressiyaning ixtiyoriy tartib raqamli hadini birinchi had va ayirma orqali topishda ishlatiladi.',
    trigger_uz: 'Arifmetik progressiyada birinchi had va ayirma berilib, ixtiyoriy tartibdagi had soʻralganda qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_arifmetik_yigindi'],
    generators: formulaGenerators.alg_arifmetik_n_had
  },
  {
    id: 'alg_arifmetik_yigindi',
    category: 'Algebra',
    title: 'Arifmetik progressiya yigʻindisi',
    keywords: ['arifmetik progressiya', 'yigʻindi', 'dastlabki hadlar'],
    formula: 'S_n = \\frac{a_1 + a_n}{2} \\cdot n',
    variables: [
      { symbol: 'S_n', meaning_uz: 'Dastlabki n ta had yigʻindisi', unit: 'son' },
      { symbol: 'a_1', meaning_uz: 'Birinchi had', unit: 'son' },
      { symbol: 'a_n', meaning_uz: 'n-had', unit: 'son' },
      { symbol: 'n', meaning_uz: 'Hadlar soni', unit: 'natural son' }
    ],
    usageHint_uz: 'Arifmetik ketma-ketlikning dastlabki n ta hadi yigʻindisini qulay va tez hisoblashda qoʻllaniladi.',
    trigger_uz: 'Arifmetik ketma-ketlikning dastlabki n ta hadi yigʻindisini tez topishda qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_arifmetik_n_had'],
    generators: formulaGenerators.alg_arifmetik_yigindi
  },
  {
    id: 'alg_geometrik_n_had',
    category: 'Algebra',
    title: 'Geometrik progressiya n-hadi',
    keywords: ['geometrik progressiya', 'n-had', 'maxraj', 'q'],
    formula: 'b_n = b_1 \\cdot q^{n - 1}',
    variables: [
      { symbol: 'b_n', meaning_uz: 'n-had', unit: 'son' },
      { symbol: 'b_1', meaning_uz: 'Birinchi had', unit: 'son' },
      { symbol: 'q', meaning_uz: 'Progressiya maxraji', unit: 'son (q ≠ 0)' },
      { symbol: 'n', meaning_uz: 'Tartib raqami', unit: 'natural son' }
    ],
    usageHint_uz: 'Har bir hadi oldingisidan q marta kattalashuvchi yoki kichiklashuvchi qatorning istalgan hadini hisoblashda ishlatiladi.',
    trigger_uz: 'Geometrik progressiyada har bir had q marta ortganda ixtiyoriy n-hadni hisoblashda qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_geometrik_yigindi'],
    generators: formulaGenerators.alg_geometrik_n_had
  },
  {
    id: 'alg_geometrik_yigindi',
    category: 'Algebra',
    title: 'Cheksiz kamayuvchi geometrik progressiya',
    keywords: ['cheksiz kamayuvchi', 'geometrik progressiya', 'limit', 'yigʻindi'],
    formula: 'S = \\frac{b_1}{1 - q}, \\quad (|q| < 1)',
    variables: [
      { symbol: 'S', meaning_uz: 'Cheksiz yigʻindi', unit: 'son' },
      { symbol: 'b_1', meaning_uz: 'Birinchi had', unit: 'son' },
      { symbol: 'q', meaning_uz: 'Progressiya maxraji', unit: '|q| < 1' }
    ],
    usageHint_uz: 'Maxraji modul boʻyicha 1 dan kichik boʻlgan cheksiz hadlar yigʻindisini aniqlashda qoʻllaniladi.',
    trigger_uz: 'Maxraji |q| < 1 boʻlgan cheksiz kamayuvchi geometrik qator hadlari yigʻindisini topishda qoʻllang!',
    examSource: 'maktab',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 3,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_geometrik_n_had'],
    generators: formulaGenerators.alg_geometrik_yigindi
  },
  {
    id: 'alg_daraja_kopaytma',
    category: 'Algebra',
    title: 'Bir xil asosli darajalar koʻpaytmasi',
    keywords: ['daraja', 'asos', 'koʻpaytma', 'koʻrsatkich'],
    formula: 'a^m \\cdot a^n = a^{m + n}',
    variables: [
      { symbol: 'a', meaning_uz: 'Daraja asosi', unit: 'son' },
      { symbol: 'm, n', meaning_uz: 'Daraja koʻrsatkichlari', unit: 'sonlar' }
    ],
    usageHint_uz: 'Asoslari bir xil boʻlgan darajali ifodalarni ixchamlash va hisoblashda qoʻllaniladi.',
    trigger_uz: 'Asoslari bir xil darajalarni koʻpaytirish yoki darajali tenglamalarni ixchamlashda qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_logarifm_asosiy', 'alg_logarifm_daraja'],
    generators: formulaGenerators.alg_daraja_kopaytma
  },
  {
    id: 'alg_logarifm_asosiy',
    category: 'Algebra',
    title: 'Asosiy logarifmik ayniyat',
    keywords: ['logarifm', 'ayniyat', 'koʻpaytma logarifmi'],
    formula: 'a^{\\log_a b} = b, \\quad \\log_a(xy) = \\log_a x + \\log_a y',
    variables: [
      { symbol: 'a', meaning_uz: 'Logarifm asosi', unit: 'a > 0, a ≠ 1' },
      { symbol: 'b', meaning_uz: 'Logarifmlanuvchi son', unit: 'b > 0' }
    ],
    usageHint_uz: 'Koʻrsatkichli va logarifmik ifodalarni soddalashtirish hamda tenglamalarni yechishda qoʻllaniladi.',
    trigger_uz: 'Logarifm asosidagi son darajaga koʻtarilganda yoki logarifmlar yigʻindisini bitta logarifmga keltirishda qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_logarifm_daraja', 'alg_daraja_kopaytma'],
    generators: formulaGenerators.alg_logarifm_asosiy
  },
  {
    id: 'alg_logarifm_daraja',
    category: 'Algebra',
    title: 'Logarifm daraja xossasi',
    keywords: ['logarifm', 'daraja', 'xossa', 'koeffitsiyent'],
    formula: '\\log_a (b^k) = k \\cdot \\log_a b',
    variables: [
      { symbol: 'a', meaning_uz: 'Asos', unit: 'a > 0, a ≠ 1' },
      { symbol: 'b', meaning_uz: 'Son', unit: 'b > 0' },
      { symbol: 'k', meaning_uz: 'Daraja koʻrsatkichi', unit: 'haqiqiy son' }
    ],
    usageHint_uz: 'Sonning darajasini logarifm oldiga koʻpaytuvchi sifatida chiqarish orqali hisoblashni osonlashtiradi.',
    trigger_uz: 'Logarifmlanuvchi sonning darajasi berilganda uni oldinga koʻpaytuvchi qilib chiqarishda qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['alg_logarifm_asosiy'],
    generators: formulaGenerators.alg_logarifm_daraja
  },

  ...moreAlgebraFormulas,

  // ================= GEOMETRIYA (29 ta) =================
  {
    id: 'geom_pifagor',
    category: 'Geometriya',
    title: 'Pifagor teoremasi',
    keywords: ['pifagor', 'toʻgʻri burchak', 'gipotenuza', 'katet'],
    formula: 'c^2 = a^2 + b^2 \\implies c = \\sqrt{a^2 + b^2}',
    variables: [
      { symbol: 'a, b', meaning_uz: 'Katetlar uzunligi', unit: 'sm / m' },
      { symbol: 'c', meaning_uz: 'Gipotenuza uzunligi', unit: 'sm / m' }
    ],
    usageHint_uz: 'Toʻgʻri burchakli uchburchakda ikki tomon maʼlum boʻlganda uchinchi tomonni topishda qoʻllaniladi.',
    trigger_uz: 'Toʻgʻri burchakli uchburchakda 2 ta tomon maʼlum boʻlib, 3-tomoni soʻralganda darhol qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    shape: { type: 'triangle', defaultParams: { a: 6, b: 8, h: 8 } },
    related: ['geom_uchburchak_asos_balandlik', 'geom_geron'],
    generators: formulaGenerators.geom_pifagor
  },
  {
    id: 'geom_uchburchak_asos_balandlik',
    category: 'Geometriya',
    title: 'Uchburchak yuzi',
    keywords: ['uchburchak yuzi', 'asos', 'balandlik', 'yuza'],
    formula: 'S = \\frac{1}{2} a \\cdot h_a',
    variables: [
      { symbol: 'a', meaning_uz: 'Asos tomoni', unit: 'sm / m' },
      { symbol: 'h_a', meaning_uz: 'Asosga tushirilgan balandlik', unit: 'sm / m' },
      { symbol: 'S', meaning_uz: 'Uchburchak yuzi', unit: 'sm² / m²' }
    ],
    usageHint_uz: 'Uchburchakning asosi va unga tushirilgan balandligi berilganda uning yuzini hisoblashda qoʻllaniladi.',
    trigger_uz: 'Uchburchak asosi va unga tushirilgan balandlik berilganda yuzini hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    shape: { type: 'triangle', defaultParams: { a: 10, h: 6 } },
    related: ['geom_geron', 'geom_pifagor'],
    generators: formulaGenerators.geom_uchburchak_asos_balandlik
  },
  {
    id: 'geom_geron',
    category: 'Geometriya',
    title: 'Geron formulasi',
    keywords: ['geron', 'uchburchak yuzi', 'uchta tomon', 'yarimperimetr'],
    formula: 'S = \\sqrt{p(p-a)(p-b)(p-c)}, \\quad p = \\frac{a+b+c}{2}',
    variables: [
      { symbol: 'a, b, c', meaning_uz: 'Uchburchak tomonlari', unit: 'sm / m' },
      { symbol: 'p', meaning_uz: 'Yarimperimetr', unit: 'sm / m' },
      { symbol: 'S', meaning_uz: 'Uchburchak yuzi', unit: 'sm² / m²' }
    ],
    usageHint_uz: 'Uchburchakning balandligini bilmasdan, faqat uchta tomoni maʼlum boʻlganda yuzini hisoblashda ishlatiladi.',
    trigger_uz: 'Uchburchakning balandligi maʼlum boʻlmay, faqat 3 ta tomoni berilganda yuzini topish uchun qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    shape: { type: 'triangle', defaultParams: { a: 13, b: 14, c: 15 } },
    related: ['geom_uchburchak_asos_balandlik', 'geom_pifagor'],
    generators: formulaGenerators.geom_geron
  },
  {
    id: 'geom_togri_tortburchak',
    category: 'Geometriya',
    title: 'Toʻgʻri toʻrtburchak yuzi va perimetri',
    keywords: ['toʻgʻri toʻrtburchak', 'yuza', 'perimetr', 'tomonlar'],
    formula: 'S = a \\cdot b, \\quad P = 2(a + b)',
    variables: [
      { symbol: 'a', meaning_uz: 'Uzunligi', unit: 'sm / m' },
      { symbol: 'b', meaning_uz: 'Kengligi', unit: 'sm / m' },
      { symbol: 'S', meaning_uz: 'Yuzi', unit: 'sm² / m²' },
      { symbol: 'P', meaning_uz: 'Perimetri', unit: 'sm / m' }
    ],
    usageHint_uz: 'Toʻgʻri toʻrtburchak shaklidagi maydonlar, xonalar va tekisliklar yuzi hamda perimetrini aniqlashda qoʻllaniladi.',
    trigger_uz: 'Toʻgʻri toʻrtburchakning boʻyi va eni berilganda uning yuzi va perimetrini hisoblashda qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    shape: { type: 'rectangle', defaultParams: { a: 12, b: 7 } },
    related: ['geom_romb', 'geom_trapetsiya'],
    generators: formulaGenerators.geom_togri_tortburchak
  },
  {
    id: 'geom_romb',
    category: 'Geometriya',
    title: 'Romb yuzi',
    keywords: ['romb', 'diagonal', 'yuza', 'diagonallar koʻpaytmasi'],
    formula: 'S = \\frac{1}{2} d_1 \\cdot d_2',
    variables: [
      { symbol: 'd_1, d_2', meaning_uz: 'Diagonallar uzunligi', unit: 'sm / m' },
      { symbol: 'S', meaning_uz: 'Romb yuzi', unit: 'sm² / m²' }
    ],
    usageHint_uz: 'Rombning oʻzaro perpendikulyar ikki diagonali orqali yuzini hisoblashda qoʻllaniladi.',
    trigger_uz: 'Rombning oʻzaro perpendikulyar ikki diagonali uzunligi berilganda yuzini hisoblashda qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    shape: { type: 'rhombus', defaultParams: { d1: 12, d2: 8 } },
    related: ['geom_togri_tortburchak', 'geom_trapetsiya'],
    generators: formulaGenerators.geom_romb
  },
  {
    id: 'geom_trapetsiya',
    category: 'Geometriya',
    title: 'Trapetsiya yuzi',
    keywords: ['trapetsiya', 'asoslar', 'oʻrta chiziq', 'balandlik'],
    formula: 'S = \\frac{a + b}{2} \\cdot h',
    variables: [
      { symbol: 'a, b', meaning_uz: 'Asoslar uzunligi', unit: 'sm / m' },
      { symbol: 'h', meaning_uz: 'Balandlik', unit: 'sm / m' },
      { symbol: 'S', meaning_uz: 'Trapetsiya yuzi', unit: 'sm² / m²' }
    ],
    usageHint_uz: 'Trapetsiyaning ikki parallel asosi va balandligi maʼlum boʻlganda yuzini hisoblashda ishlatiladi.',
    trigger_uz: 'Trapetsiyaning ikkita parallel asosi va balandligi (yoki oʻrta chizigʻi) berilganda yuzini topishda qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    shape: { type: 'trapezoid', defaultParams: { a: 6, b: 14, h: 5 } },
    related: ['geom_togri_tortburchak', 'geom_romb'],
    generators: formulaGenerators.geom_trapetsiya
  },
  {
    id: 'geom_aylana_uzunligi',
    category: 'Geometriya',
    title: 'Aylana uzunligi',
    keywords: ['aylana', 'uzunlik', 'radius', 'diametr', 'pi'],
    formula: 'L = 2\\pi R = \\pi D',
    variables: [
      { symbol: 'R', meaning_uz: 'Aylana radiusi', unit: 'sm / m' },
      { symbol: 'D', meaning_uz: 'Aylana diametri (2R)', unit: 'sm / m' },
      { symbol: 'L', meaning_uz: 'Aylana uzunligi', unit: 'sm / m' },
      { symbol: '\\pi', meaning_uz: 'Pi soni (≈ 3.14)', unit: 'oʻzgarmas' }
    ],
    usageHint_uz: 'Gʻildirak aylanishi, dumaloq buyumlar cheti uzunligini aniqlashda qoʻllaniladi.',
    trigger_uz: 'Aylananing radiusi yoki diametri berilganda uning toʻliq perimetri (aylana uzunligi)ni topishda qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    shape: { type: 'circle', defaultParams: { r: 6 } },
    related: ['geom_doira_yuzi', 'geom_silindr_hajmi'],
    generators: formulaGenerators.geom_aylana_uzunligi
  },
  {
    id: 'geom_doira_yuzi',
    category: 'Geometriya',
    title: 'Doira yuzi',
    keywords: ['doira', 'yuza', 'radius', 'pi'],
    formula: 'S = \\pi R^2',
    variables: [
      { symbol: 'R', meaning_uz: 'Doira radiusi', unit: 'sm / m' },
      { symbol: 'S', meaning_uz: 'Doira yuzi', unit: 'sm² / m²' },
      { symbol: '\\pi', meaning_uz: 'Pi soni (≈ 3.14)', unit: 'oʻzgarmas' }
    ],
    usageHint_uz: 'Doira shaklidagi tekis yuzalar maydonini hisoblashda ishlatiladi.',
    trigger_uz: 'Doira radiusi maʼlum boʻlganda tekis doira maydonini hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    shape: { type: 'circle', defaultParams: { r: 5 } },
    related: ['geom_aylana_uzunligi', 'geom_silindr_hajmi', 'geom_konus_hajmi'],
    generators: formulaGenerators.geom_doira_yuzi
  },
  {
    id: 'geom_silindr_hajmi',
    category: 'Geometriya',
    title: 'Silindr hajmi',
    keywords: ['silindr', 'hajm', 'asos radiusi', 'balandlik'],
    formula: 'V = \\pi R^2 h = S_{asos} \\cdot h',
    variables: [
      { symbol: 'R', meaning_uz: 'Asos radiusi', unit: 'sm / m' },
      { symbol: 'h', meaning_uz: 'Silindr balandligi', unit: 'sm / m' },
      { symbol: 'V', meaning_uz: 'Silindr hajmi', unit: 'sm³ / m³ / litr' }
    ],
    usageHint_uz: 'Quvur, bochka va rezervuarlar sigʻimi hamda hajmini hisoblashda qoʻllaniladi.',
    trigger_uz: 'Silindrsimon idish, truba yoki rezervuarning sigʻimi (hajmi)ni hisoblashda qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    shape: { type: 'cylinder', defaultParams: { r: 4, h: 8 } },
    related: ['geom_konus_hajmi', 'geom_doira_yuzi'],
    generators: formulaGenerators.geom_silindr_hajmi
  },
  {
    id: 'geom_konus_hajmi',
    category: 'Geometriya',
    title: 'Konus hajmi',
    keywords: ['konus', 'hajm', 'balandlik', 'asos'],
    formula: 'V = \\frac{1}{3} \\pi R^2 h',
    variables: [
      { symbol: 'R', meaning_uz: 'Asos radiusi', unit: 'sm / m' },
      { symbol: 'h', meaning_uz: 'Konus balandligi', unit: 'sm / m' },
      { symbol: 'V', meaning_uz: 'Konus hajmi', unit: 'sm³ / m³' }
    ],
    usageHint_uz: 'Konus shaklidagi inshootlar, qum yoki don uyumlari hajmini hisoblashda qoʻllaniladi.',
    trigger_uz: 'Konus shaklidagi inshoot yoki idishning asos radiusi va balandligi berilganda hajmini topishda qoʻllang!',
    examSource: 'maktab',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 3,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    shape: { type: 'cone', defaultParams: { r: 4, h: 9 } },
    related: ['geom_silindr_hajmi', 'geom_piramida_hajmi'],
    generators: formulaGenerators.geom_konus_hajmi
  },
  {
    id: 'geom_shar_hajmi',
    category: 'Geometriya',
    title: 'Shar hajmi va sirt yuzi',
    keywords: ['shar', 'hajm', 'sirt yuzi', 'radius'],
    formula: 'V = \\frac{4}{3} \\pi R^3, \\quad S = 4\\pi R^2',
    variables: [
      { symbol: 'R', meaning_uz: 'Shar radiusi', unit: 'sm / m' },
      { symbol: 'V', meaning_uz: 'Shar hajmi', unit: 'sm³ / m³' },
      { symbol: 'S', meaning_uz: 'Shar sirti yuzi', unit: 'sm² / m²' }
    ],
    usageHint_uz: 'Koptok, sayyora yoki shar shaklidagi jismlar hajmi va sirtini aniqlashda qoʻllaniladi.',
    trigger_uz: 'Shar shaklidagi jism yoki koptokning radiusi berilganda uning hajmi va sirtini hisoblashda qoʻllang!',
    examSource: 'maktab',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 3,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    shape: { type: 'sphere', defaultParams: { r: 4 } },
    related: ['geom_silindr_hajmi', 'geom_konus_hajmi'],
    generators: formulaGenerators.geom_shar_hajmi
  },
  {
    id: 'geom_piramida_hajmi',
    category: 'Geometriya',
    title: 'Piramida hajmi',
    keywords: ['piramida', 'hajm', 'asos yuzi', 'balandlik'],
    formula: 'V = \\frac{1}{3} S_{asos} \\cdot h',
    variables: [
      { symbol: 'S_{asos}', meaning_uz: 'Asosining yuzi', unit: 'sm² / m²' },
      { symbol: 'h', meaning_uz: 'Piramida balandligi', unit: 'sm / m' },
      { symbol: 'V', meaning_uz: 'Piramida hajmi', unit: 'sm³ / m³' }
    ],
    usageHint_uz: 'Ixtiyoriy asosli piramida shaklidagi binolar va jismlar hajmini hisoblashda qoʻllaniladi.',
    trigger_uz: 'Piramidaning asos yuzi va balandligi berilganda uning hajmini aniqlash uchun qoʻllang!',
    examSource: 'maktab',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 3,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    shape: { type: 'pyramid', defaultParams: { a: 5, h: 6 } },
    related: ['geom_konus_hajmi', 'geom_uchburchak_asos_balandlik'],
    generators: formulaGenerators.geom_piramida_hajmi
  },
  ...moreGeometryFormulas
];

export { generateExamplesForFormula };
