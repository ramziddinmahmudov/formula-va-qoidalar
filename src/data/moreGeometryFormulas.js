import { formulaGenerators } from './generators.js';

export const moreGeometryFormulas = [
  {
    id: 'geom_muntazam_uchburchak',
    category: 'Geometriya',
    title: 'Muntazam uchburchak yuzi',
    keywords: ['muntazam uchburchak', 'teng tomonli', 'yuza', 'ildiz 3'],
    formula: 'S = \\frac{a^2\\sqrt{3}}{4}',
    variables: [
      { symbol: 'a', meaning_uz: 'Uchburchak tomoni', unit: 'sm / m' }
    ],
    usageHint_uz: 'Barcha tomonlari teng boʻlgan uchburchakning yuzini birgina tomoni orqali hisoblashda qoʻllaniladi.',
    trigger_uz: 'Teng tomonli (muntazam) uchburchak berilganda uning yuzini tezkor hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: true,
    plansRequired: ['free', 'premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    shape: { type: 'triangle', defaultParams: { a: 6, b: 6, h: 5.2 } },
    related: ['geom_uchburchak_asos_balandlik', 'geom_pifagor'],
    generators: formulaGenerators.geom_muntazam_uchburchak
  },
  {
    id: 'geom_uchburchak_sinus',
    category: 'Geometriya',
    title: 'Ikki tomon va burchak orqali uchburchak yuzi',
    keywords: ['uchburchak yuzi', 'sinus', 'burchak', 'yuza'],
    formula: 'S = \\frac{1}{2}ab\\sin\\alpha',
    variables: [
      { symbol: 'a, b', meaning_uz: 'Uchburchak tomonlari', unit: 'sm / m' },
      { symbol: '\\alpha', meaning_uz: 'Tomonlar orasidagi burchak', unit: 'gradus' }
    ],
    usageHint_uz: 'Uchburchakning ikki tomoni va ular orasidagi burchak maʼlum boʻlganda yuzini hisoblashda qoʻllaniladi.',
    trigger_uz: 'Ikki tomon va ular orasidagi burchak berilganda uchburchak yuzini topish uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    shape: { type: 'triangle', defaultParams: { a: 6, b: 8, h: 5 } },
    related: ['geom_uchburchak_asos_balandlik', 'geom_sinuslar_teoremasi'],
    generators: formulaGenerators.geom_uchburchak_sinus
  },
  {
    id: 'geom_sinuslar_teoremasi',
    category: 'Geometriya',
    title: 'Sinuslar teoremasi',
    keywords: ['sinuslar teoremasi', 'tashqi aylana radiusi', 'burchak', 'nisbat'],
    formula: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R',
    variables: [
      { symbol: 'a, b, c', meaning_uz: 'Uchburchak tomonlari', unit: 'sm / m' },
      { symbol: 'R', meaning_uz: 'Tashqi chizilgan aylana radiusi', unit: 'sm / m' }
    ],
    usageHint_uz: 'Uchburchak tomoni va qarshisidagi burchak orqali tashqi aylana radiusini yoki boshqa tomonni topishda qoʻllaniladi.',
    trigger_uz: 'Tomon va uning roʻparasidagi burchak maʼlum boʻlganda tashqi aylana radiusini hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['geom_kosinuslar_teoremasi', 'geom_tashqi_aylana_radius'],
    generators: formulaGenerators.geom_sinuslar_teoremasi
  },
  {
    id: 'geom_kosinuslar_teoremasi',
    category: 'Geometriya',
    title: 'Kosinuslar teoremasi',
    keywords: ['kosinuslar teoremasi', 'uchinchi tomon', 'burchak kosinusi'],
    formula: 'c^2 = a^2 + b^2 - 2ab\\cos C',
    variables: [
      { symbol: 'a, b', meaning_uz: 'Maʼlum tomonlar', unit: 'sm / m' },
      { symbol: 'C', meaning_uz: 'Tomonlar orasidagi burchak', unit: 'gradus' },
      { symbol: 'c', meaning_uz: 'Nomaʼlum tomon', unit: 'sm / m' }
    ],
    usageHint_uz: 'Ixtiyoriy uchburchakning ikki tomoni va burchagi orqali uchinchi tomonni topishda (umumlashtirilgan Pifagor teoremasi).',
    trigger_uz: 'Ikki tomon va ular orasidagi burchakdan uchinchi tomon uzunligini hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['geom_pifagor', 'geom_sinuslar_teoremasi'],
    generators: formulaGenerators.geom_kosinuslar_teoremasi
  },
  {
    id: 'geom_parallelogramm',
    category: 'Geometriya',
    title: 'Parallelogramm yuzi',
    keywords: ['parallelogramm', 'yuza', 'asos', 'balandlik'],
    formula: 'S = a \\cdot h_a = ab\\sin\\alpha',
    variables: [
      { symbol: 'a', meaning_uz: 'Asos tomoni', unit: 'sm / m' },
      { symbol: 'h_a', meaning_uz: 'Asosga tushirilgan balandlik', unit: 'sm / m' }
    ],
    usageHint_uz: 'Parallelogramm yuzini asosi va balandligi orqali hisoblashda qoʻllaniladi.',
    trigger_uz: 'Parallelogramm asosi va unga tushirilgan balandlik berilganda yuzini hisoblash uchun qoʻllang!',
    examSource: 'maktab',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    shape: { type: 'rectangle', defaultParams: { a: 8, b: 5 } },
    related: ['geom_togri_tortburchak', 'geom_romb'],
    generators: formulaGenerators.geom_parallelogramm
  },
  {
    id: 'geom_ichki_aylana_radius',
    category: 'Geometriya',
    title: 'Ichki chizilgan aylana radiusi',
    keywords: ['ichki aylana', 'radius', 'yarim perimetr', 'yuza'],
    formula: 'r = \\frac{S}{p} \\quad \\left(p = \\frac{a+b+c}{2}\\right)',
    variables: [
      { symbol: 'S', meaning_uz: 'Uchburchak yuzi', unit: 'sm² / m²' },
      { symbol: 'p', meaning_uz: 'Yarim perimetr', unit: 'sm / m' },
      { symbol: 'r', meaning_uz: 'Ichki aylana radiusi', unit: 'sm / m' }
    ],
    usageHint_uz: 'Ixtiyoriy koʻpburchakka (uchburchakka) ichki chizilgan aylana radiusini yuzasi va yarim perimetri orqali hisoblash.',
    trigger_uz: 'Uchburchakka ichki chizilgan aylana radiusini uning yuzi va perimetridan hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['geom_tashqi_aylana_radius', 'geom_geron'],
    generators: formulaGenerators.geom_ichki_aylana_radius
  },
  {
    id: 'geom_tashqi_aylana_radius',
    category: 'Geometriya',
    title: 'Tashqi chizilgan aylana radiusi',
    keywords: ['tashqi aylana', 'radius', 'gipotenuza', 'diametr'],
    formula: 'R = \\frac{abc}{4S} \\quad (\\text{Toʻgʻri burchakli uchburchakda } R = \\frac{c}{2})',
    variables: [
      { symbol: 'c', meaning_uz: 'Gipotenuza yoki tomon', unit: 'sm / m' },
      { symbol: 'R', meaning_uz: 'Tashqi aylana radiusi', unit: 'sm / m' }
    ],
    usageHint_uz: 'Uchburchakka tashqi chizilgan aylana radiusini tomonlar orqali hisoblashda qoʻllaniladi.',
    trigger_uz: 'Toʻgʻri burchakli uchburchak gipotenuzasidan tashqi aylana radiusini hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['geom_ichki_aylana_radius', 'geom_sinuslar_teoremasi'],
    generators: formulaGenerators.geom_tashqi_aylana_radius
  },
  {
    id: 'geom_doira_sektori',
    category: 'Geometriya',
    title: 'Doira sektori yuzi',
    keywords: ['doira sektori', 'markaziy burchak', 'yuza', 'aylana'],
    formula: 'S = \\frac{\\pi R^2 \\alpha}{360^\\circ}',
    variables: [
      { symbol: 'R', meaning_uz: 'Doira radiusi', unit: 'sm / m' },
      { symbol: '\\alpha', meaning_uz: 'Markaziy burchak', unit: 'gradus' }
    ],
    usageHint_uz: 'Doiraning maʼlum bir markaziy burchakka toʻgʻri keluvchi boʻlagi (sektori) yuzini hisoblash.',
    trigger_uz: 'Radius va markaziy burchak berilganda doira sektori yuzini hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    shape: { type: 'circle', defaultParams: { r: 5 } },
    related: ['geom_doira_yuzi', 'geom_aylana_uzunligi'],
    generators: formulaGenerators.geom_doira_sektori
  },
  {
    id: 'geom_kub_hajmi',
    category: 'Geometriya',
    title: 'Kub hajmi va toʻla sirti',
    keywords: ['kub', 'hajm', 'toʻla sirt', 'qirra'],
    formula: 'V = a^3, \\quad S_{toʻla} = 6a^2',
    variables: [
      { symbol: 'a', meaning_uz: 'Kub qirrasi', unit: 'sm / m' },
      { symbol: 'V', meaning_uz: 'Hajm', unit: 'sm³ / m³' },
      { symbol: 'S', meaning_uz: 'Toʻla sirt yuzi', unit: 'sm² / m²' }
    ],
    usageHint_uz: 'Barcha qirralari teng boʻlgan toʻgʻri parallelepiped (kub) hajm va sirtini hisoblashda qoʻllaniladi.',
    trigger_uz: 'Kubning birgina qirrasi berilganda uning hajmi va toʻla sirtini hisoblash uchun qoʻllang!',
    examSource: 'maktab',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['geom_parallelepiped', 'geom_prizma_hajmi'],
    generators: formulaGenerators.geom_kub_hajmi
  },
  {
    id: 'geom_parallelepiped',
    category: 'Geometriya',
    title: 'Toʻgʻri burchakli parallelepiped',
    keywords: ['parallelepiped', 'hajm', 'toʻla sirt', 'oʻlchamlar'],
    formula: 'V = abc, \\quad S_{toʻla} = 2(ab + bc + ac)',
    variables: [
      { symbol: 'a, b, c', meaning_uz: 'Boʻyi, eni va balandligi', unit: 'sm / m' },
      { symbol: 'V', meaning_uz: 'Hajmi', unit: 'sm³ / m³' }
    ],
    usageHint_uz: 'Xona, quti yoki gʻisht kabi toʻgʻri burchakli fazoviy shakllar hajmini aniqlashda qoʻllaniladi.',
    trigger_uz: 'Uchta oʻlchami berilgan toʻgʻri burchakli parallelepipedning hajmi yoki sirtini hisoblashda qoʻllang!',
    examSource: 'maktab',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['geom_kub_hajmi', 'geom_prizma_hajmi'],
    generators: formulaGenerators.geom_parallelepiped
  },
  {
    id: 'geom_prizma_hajmi',
    category: 'Geometriya',
    title: 'Toʻgʻri prizma hajmi',
    keywords: ['prizma', 'hajm', 'asos yuzi', 'balandlik'],
    formula: 'V = S_{asos} \\cdot H',
    variables: [
      { symbol: 'S_{asos}', meaning_uz: 'Asosining yuzi', unit: 'sm² / m²' },
      { symbol: 'H', meaning_uz: 'Prizma balandligi', unit: 'sm / m' }
    ],
    usageHint_uz: 'Ixtiyoriy koʻpburchak asosli toʻgʻri prizmaning hajmini hisoblashda qoʻllaniladi.',
    trigger_uz: 'Prizmaning asos yuzi va balandligidan foydalanib uning hajmini aniqlash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['geom_silindr_hajmi', 'geom_parallelepiped'],
    generators: formulaGenerators.geom_prizma_hajmi
  },
  {
    id: 'geom_silindr_sirti',
    category: 'Geometriya',
    title: 'Silindr toʻla sirti yuzi',
    keywords: ['silindr', 'toʻla sirt', 'yon sirt', 'asos radiusi'],
    formula: 'S_{toʻla} = 2\\pi R(R + H)',
    variables: [
      { symbol: 'R', meaning_uz: 'Asos radiusi', unit: 'sm / m' },
      { symbol: 'H', meaning_uz: 'Silindr balandligi', unit: 'sm / m' }
    ],
    usageHint_uz: 'Silindrning yon sirti va ikkita asos doiralari yuzalari yigʻindisini hisoblash.',
    trigger_uz: 'Silindr radiusi va balandligidan uning toʻla sirti yuzini aniqlash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    shape: { type: 'cylinder', defaultParams: { r: 3, h: 6 } },
    related: ['geom_silindr_hajmi', 'geom_konus_hajmi'],
    generators: formulaGenerators.geom_silindr_sirti
  },
  {
    id: 'geom_shar_sirti',
    category: 'Geometriya',
    title: 'Shar (sfera) sirti yuzi',
    keywords: ['shar', 'sfera', 'sirt yuzi', 'radius'],
    formula: 'S = 4\\pi R^2',
    variables: [
      { symbol: 'R', meaning_uz: 'Shar radiusi', unit: 'sm / m' },
      { symbol: 'S', meaning_uz: 'Sfera sirti yuzi', unit: 'sm² / m²' }
    ],
    usageHint_uz: 'Sfera sferik qobigʻi yoki sharning tashqi sirti yuzini radiusi orqali hisoblash.',
    trigger_uz: 'Shar radiusi berilganda uning tashqi sirti (sfera) yuzini hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    shape: { type: 'sphere', defaultParams: { r: 4 } },
    related: ['geom_shar_hajmi'],
    generators: formulaGenerators.geom_shar_sirti
  },
  {
    id: 'geom_nuqtalar_masofa',
    category: 'Geometriya',
    title: 'Ikki nuqta orasidagi masofa',
    keywords: ['koordinatalar', 'masofa', 'nuqtalar', 'kesma uzunligi'],
    formula: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}',
    variables: [
      { symbol: '(x_1, y_1)', meaning_uz: 'Birinchi nuqta koordinatalari', unit: 'koordinata' },
      { symbol: '(x_2, y_2)', meaning_uz: 'Ikkinchi nuqta koordinatalari', unit: 'koordinata' }
    ],
    usageHint_uz: 'Koordinatalar tekisligida ikki nuqta orasidagi masofani hisoblashda qoʻllaniladi.',
    trigger_uz: 'Tekislikdagi ikki nuqta koordinatalari berilganda ular orasidagi masofani hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['geom_kesma_ortasi', 'geom_vektor_uzunlik'],
    generators: formulaGenerators.geom_nuqtalar_masofa
  },
  {
    id: 'geom_kesma_ortasi',
    category: 'Geometriya',
    title: 'Kesma oʻrtasining koordinatalari',
    keywords: ['kesma oʻrtasi', 'koordinatalar', 'oʻrta nuqta'],
    formula: 'x_0 = \\frac{x_1 + x_2}{2}, \\quad y_0 = \\frac{y_1 + y_2}{2}',
    variables: [
      { symbol: '(x_1, y_1), (x_2, y_2)', meaning_uz: 'Kesma uchlari', unit: 'koordinata' },
      { symbol: '(x_0, y_0)', meaning_uz: 'Oʻrta nuqta', unit: 'koordinata' }
    ],
    usageHint_uz: 'Kesmani teng ikkiga boʻluvchi markaziy nuqta koordinatalarini topishda qoʻllaniladi.',
    trigger_uz: 'Kesmaning ikki uchi koordinatalaridan uning oʻrta nuqtasini hisoblash uchun qoʻllang!',
    examSource: 'maktab',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 4,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['geom_nuqtalar_masofa'],
    generators: formulaGenerators.geom_kesma_ortasi
  },
  {
    id: 'geom_vektor_skalyar',
    category: 'Geometriya',
    title: 'Vektorlarning skalyar koʻpaytmasi',
    keywords: ['vektor', 'skalyar koʻpaytma', 'perpendikulyar'],
    formula: '\\vec{a} \\cdot \\vec{b} = x_1 x_2 + y_1 y_2 = |\\vec{a}| |\\vec{b}| \\cos\\phi',
    variables: [
      { symbol: '\\vec{a}(x_1, y_1)', meaning_uz: 'Birinchi vektor', unit: 'vektor' },
      { symbol: '\\vec{b}(x_2, y_2)', meaning_uz: 'Ikkinchi vektor', unit: 'vektor' }
    ],
    usageHint_uz: 'Vektorlar orasidagi burchakni topish va ularning oʻzaro perpendikulyarligini tekshirishda (a·b = 0).',
    trigger_uz: 'Ikki vektor koordinatalari berilganda ularning skalyar koʻpaytmasini hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['geom_vektor_uzunlik'],
    generators: formulaGenerators.geom_vektor_skalyar
  },
  {
    id: 'geom_vektor_uzunlik',
    category: 'Geometriya',
    title: 'Vektor uzunligi (moduli)',
    keywords: ['vektor moduli', 'uzunlik', 'koordinatalar'],
    formula: '|\\vec{a}| = \\sqrt{x^2 + y^2}',
    variables: [
      { symbol: 'x, y', meaning_uz: 'Vektor koordinatalari', unit: 'son' },
      { symbol: '|\\vec{a}|', meaning_uz: 'Vektor uzunligi', unit: 'uzunlik' }
    ],
    usageHint_uz: 'Berilgan koordinatalar boʻyicha vektorning geometrik uzunligini (modulini) hisoblash.',
    trigger_uz: 'Vektorning koordinatalaridan uning geometrik modulini hisoblash uchun qoʻllang!',
    examSource: 'dtm',
    free: false,
    plansRequired: ['premium', 'obuna', 'imtihon'],
    frequency: 5,
    difficultyLevels: ['oson', 'orta', 'qiyin'],
    related: ['geom_vektor_skalyar', 'geom_nuqtalar_masofa'],
    generators: formulaGenerators.geom_vektor_uzunlik
  }
];
