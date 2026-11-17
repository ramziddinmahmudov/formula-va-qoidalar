import { moreAlgebraGenerators } from './moreAlgebraGenerators.js';
import { moreGeometryGenerators } from './moreGeometryGenerators.js';

/**
 * Mikro-trenajyor va DTM imtihon rejimi uchun dinamik misollar generatori (Kengaytirilgan v2)
 *
 * Imkoniyatlar:
 * 1. Qiyinlik darajalari: 'oson' (easy), 'orta' (medium), 'qiyin' (hard/abituriyent)
 * 2. Xatolar klassifikatsiyasi (mistakePatterns): ishora xatosi, kvadratni unutish, 1/2 koeffitsiyentini unutish va h.k.
 * 3. Qadam-baqadam yechish (stepQuestions): o'quvchi har bir qadamni o'zi bajaradi
 * 4. DTM testi uchun variantlar (options / distractors)
 */

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generator natijasini ketma-ket 2 martadan ortiq takrorlanishidan himoya qiluvchi wrapper
 */
function withNoRepetition(gen) {
  let lastQ = null;
  let streak = 0;

  return (difficulty = 'orta') => {
    let ex = gen(difficulty);
    if (ex.question_uz === lastQ) {
      streak++;
      if (streak >= 2) {
        // Qayta generatsiya qilib boshqa qiymat olamiz
        for (let tries = 0; tries < 8; tries++) {
          const candidate = gen(difficulty);
          if (candidate.question_uz !== lastQ) {
            ex = candidate;
            streak = 1;
            break;
          }
        }
      }
    } else {
      streak = 1;
    }
    lastQ = ex.question_uz;
    return ex;
  };
}

/**
 * Generatorlar lug'ati
 */
const rawGenerators = {
  // 1. Yig'indining kvadrati: (a + b)^2 = a^2 + 2ab + b^2
  alg_kvadrat_yigindi: [
    (difficulty = 'orta') => {
      let a = randInt(2, 6);
      let b = randInt(1, 5);
      if (difficulty === 'oson') { a = randInt(1, 4); b = randInt(1, 3); }
      if (difficulty === 'qiyin') { a = randInt(7, 18); b = randInt(4, 12); }

      const sum = a + b;
      const ans = sum * sum;
      const missedDouble = a * a + b * b; // 2ab tushib qolgan
      const halfMid = a * a + a * b + b * b; // 2ab o'rniga ab olingan

      return {
        question_uz: `Qisqa koʻpaytirish formulasidan foydalanib hisoblang: (${a} + ${b})² = ?`,
        answer: ans,
        steps_uz: [
          `Formulani qoʻllaymiz: (a + b)² = a² + 2ab + b²`,
          `a = ${a}, b = ${b}`,
          `${a}² + 2 · ${a} · ${b} + ${b}² = ${a * a} + ${2 * a * b} + ${b * b}`,
          `Natija: ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `1-qadam: a² + b² yigʻindisini hisoblang (${a}² + ${b}² = ?)`,
            step_answer: a * a + b * b,
            explanation_uz: `${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}`
          },
          {
            step_prompt_uz: `2-qadam: Ikkilangan koʻpaytma 2ab ni hisoblang (2 · ${a} · ${b} = ?)`,
            step_answer: 2 * a * b,
            explanation_uz: `2 · ${a} · ${b} = ${2 * a * b}`
          },
          {
            step_prompt_uz: `3-qadam: Umumiy yigʻindini toping (${a * a + b * b} + ${2 * a * b} = ?)`,
            step_answer: ans,
            explanation_uz: `Yakuniy javob: ${ans}`
          }
        ],
        mistakePatterns: [
          {
            id: 'forgot_2ab',
            hint_uz: 'Yigʻindining kvadratida oʻrta had (2ab) tushib qolgan. Faqat a² + b² ni hisobladingiz.',
            check: (val) => Math.abs(val - missedDouble) < 0.01
          },
          {
            id: 'forgot_double',
            hint_uz: 'Oʻrta haddagi 2 ga koʻpaytirish esdan chiqqanga oʻxshaydi (ab oʻrniga 2ab boʻlishi kerak).',
            check: (val) => Math.abs(val - halfMid) < 0.01
          }
        ],
        distractors: [missedDouble, halfMid, ans + 10]
      };
    },
    (difficulty = 'orta') => {
      const a = difficulty === 'qiyin' ? randInt(4, 9) : randInt(2, 5);
      const b = randInt(2, 6);
      const mid = 2 * a * b;
      return {
        question_uz: `(${a}x + ${b})² koʻphad yoyilmasidagi oʻrta had (x oldidagi) koeffitsiyenti nechaga teng?`,
        answer: mid,
        steps_uz: [
          `Formulaga koʻra: (kx + m)² = (kx)² + 2 · (kx) · m + m²`,
          `Oʻrta had: 2 · (${a}x) · ${b} = ${mid}x`,
          `Demak, x oldidagi koeffitsiyent: ${mid}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `Birinchi va ikkinchi hadlar koʻpaytmasi nechaga teng? (${a} · ${b} = ?)`,
            step_answer: a * b,
            explanation_uz: `${a} · ${b} = ${a * b}`
          },
          {
            step_prompt_uz: `Oʻrta had uchun uni 2 ga koʻpaytiring (2 · ${a * b} = ?)`,
            step_answer: mid,
            explanation_uz: `Koeffitsiyent: ${mid}`
          }
        ],
        mistakePatterns: [
          {
            id: 'forgot_multiplier_2',
            hint_uz: 'Ikkilangan koʻpaytma (2 karra) esdan chiqqan boʻlishi mumkin.',
            check: (val) => Math.abs(val - a * b) < 0.01
          }
        ],
        distractors: [a * b, mid + 2, a * a]
      };
    }
  ],

  // 2. Ayirmaning kvadrati: (a - b)^2 = a^2 - 2ab + b^2
  alg_kvadrat_ayirma: [
    (difficulty = 'orta') => {
      let a = randInt(10, 20);
      let b = randInt(1, 4);
      if (difficulty === 'oson') { a = randInt(5, 10); b = randInt(1, 3); }
      if (difficulty === 'qiyin') { a = randInt(25, 50); b = randInt(3, 8); }

      const diff = a - b;
      const ans = diff * diff;
      const wrongSign = (a + b) * (a + b);
      return {
        question_uz: `Hisoblang: (${a} - ${b})² = ?`,
        answer: ans,
        steps_uz: [
          `Formulani qoʻllaymiz: (a - b)² = a² - 2ab + b²`,
          `a = ${a}, b = ${b}`,
          `${a}² - 2 · ${a} · ${b} + ${b}² = ${a * a} - ${2 * a * b} + ${b * b}`,
          `Natija: ${ans}`
        ],
        mistakePatterns: [
          {
            id: 'sign_error',
            hint_uz: 'Ishorani xato qildingiz: ayirmaning kvadratida oʻrta had oldida minus boʻladi (-2ab).',
            check: (val) => Math.abs(val - wrongSign) < 0.01
          }
        ],
        distractors: [wrongSign, a * a - b * b, ans - 10]
      };
    },
    (difficulty = 'orta') => {
      const b = randInt(2, 6);
      const ans = b * b;
      return {
        question_uz: `(x - ${b})² yoyilmasidagi ozod had (x qatnashmagan had) nechaga teng?`,
        answer: ans,
        steps_uz: [
          `Formulaga koʻra: (x - b)² = x² - 2bx + b²`,
          `Ozod had bu (-${b})² = +${ans} boʻladi`,
          `Natija: ${ans}`
        ],
        mistakePatterns: [
          {
            id: 'negative_square',
            hint_uz: 'Manfiy sonning kvadrati doimo musbat boʻladi: (-b)² = +b².',
            check: (val) => Math.abs(val - (-ans)) < 0.01
          }
        ],
        distractors: [-ans, 2 * b, ans + 2]
      };
    }
  ],

  // 3. Kvadratlar ayirmasi: a^2 - b^2 = (a - b)(a + b)
  alg_kvadratlar_ayirmasi: [
    (difficulty = 'orta') => {
      const k = difficulty === 'qiyin' ? randInt(5, 12) : randInt(2, 6);
      const base = randInt(20, 60);
      const a = base + k;
      const b = base - k;
      const ans = a * a - b * b;
      return {
        question_uz: `Kvadratlar ayirmasi formulasidan foydalanib hisoblang: ${a}² - ${b}² = ?`,
        answer: ans,
        steps_uz: [
          `Formula: a² - b² = (a - b)(a + b)`,
          `a - b = ${a} - ${b} = ${a - b}`,
          `a + b = ${a} + ${b} = ${a + b}`,
          `${a - b} · ${a + b} = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `1-qadam: Ayirmani hisoblang (${a} - ${b} = ?)`,
            step_answer: a - b,
            explanation_uz: `${a} - ${b} = ${a - b}`
          },
          {
            step_prompt_uz: `2-qadam: Yigʻindini hisoblang (${a} + ${b} = ?)`,
            step_answer: a + b,
            explanation_uz: `${a} + ${b} = ${a + b}`
          },
          {
            step_prompt_uz: `3-qadam: Ularning koʻpaytmasini toping (${a - b} · ${a + b} = ?)`,
            step_answer: ans,
            explanation_uz: `Natija: ${ans}`
          }
        ],
        distractors: [(a - b) * 2, ans + 20, (a + b) * 2]
      };
    },
    (difficulty = 'orta') => {
      const p = randInt(12, 40);
      const q = randInt(2, 8);
      const ans = p * p - q * q;
      return {
        question_uz: `Koʻpaytmani hisoblang: (${p} - ${q}) · (${p} + ${q}) = ?`,
        answer: ans,
        steps_uz: [
          `Formula: (a - b)(a + b) = a² - b²`,
          `${p}² - ${q}² = ${p * p} - ${q * q} = ${ans}`
        ],
        distractors: [p * p + q * q, p * p - q, ans - 10]
      };
    }
  ],

  // 4. Kublar yig'indisi: a^3 + b^3 = (a + b)(a^2 - ab + b^2)
  alg_kublar_yigindi: [
    (difficulty = 'orta') => {
      const a = randInt(2, difficulty === 'qiyin' ? 5 : 4);
      const b = randInt(1, 3);
      const ans = a * a * a + b * b * b;
      return {
        question_uz: `Hisoblang: ${a}³ + ${b}³ = ?`,
        answer: ans,
        steps_uz: [
          `Formula: a³ + b³ = (a + b)(a² - ab + b²)`,
          `${a}³ = ${a * a * a}, ${b}³ = ${b * b * b}`,
          `${a * a * a} + ${b * b * b} = ${ans}`
        ],
        distractors: [Math.pow(a + b, 3), a * a * a - b * b * b, ans + 4]
      };
    },
    (difficulty = 'orta') => {
      const aPlusB = randInt(4, 10);
      const incSq = randInt(12, 35);
      const ans = aPlusB * incSq;
      return {
        question_uz: `Agar a + b = ${aPlusB} va a² - ab + b² = ${incSq} boʻlsa, a³ + b³ ni toping.`,
        answer: ans,
        steps_uz: [
          `Kublar yigʻindisi: a³ + b³ = (a + b)(a² - ab + b²)`,
          `${aPlusB} · ${incSq} = ${ans}`
        ],
        distractors: [aPlusB + incSq, ans - 10, ans + 10]
      };
    }
  ],

  // 5. Kublar ayirmasi: a^3 - b^3 = (a - b)(a^2 + ab + b^2)
  alg_kublar_ayirma: [
    (difficulty = 'orta') => {
      const a = randInt(3, 5);
      const b = randInt(1, 2);
      const ans = a * a * a - b * b * b;
      return {
        question_uz: `Hisoblang: ${a}³ - ${b}³ = ?`,
        answer: ans,
        steps_uz: [
          `Formula: a³ - b³ = (a - b)(a² + ab + b²)`,
          `${a}³ = ${a * a * a}, ${b}³ = ${b * b * b}`,
          `Natija: ${ans}`
        ],
        distractors: [Math.pow(a - b, 3), a * a * a + b * b * b, ans + 5]
      };
    },
    (difficulty = 'orta') => {
      const aMinusB = randInt(2, 5);
      const incSq = randInt(15, 40);
      const ans = aMinusB * incSq;
      return {
        question_uz: `Agar a - b = ${aMinusB} va a² + ab + b² = ${incSq} boʻlsa, a³ - b³ ni toping.`,
        answer: ans,
        steps_uz: [
          `Formula: a³ - b³ = (a - b)(a² + ab + b²)`,
          `${aMinusB} · ${incSq} = ${ans}`
        ],
        distractors: [aMinusB + incSq, ans + 8, ans - 8]
      };
    }
  ],

  // 6. Kvadrat tenglama diskriminanti: D = b^2 - 4ac
  alg_diskriminant: [
    (difficulty = 'orta') => {
      const a = difficulty === 'qiyin' ? randInt(2, 4) : 1;
      const b = randInt(-7, 7);
      const c = randInt(-5, 5);
      const ans = b * b - 4 * a * c;
      const bStr = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`;
      const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
      const eq = a === 1 ? `x² ${bStr} ${cStr} = 0` : `${a}x² ${bStr} ${cStr} = 0`;

      const wrongSign = b * b + 4 * a * c; // -4ac o'rniga +4ac olingan
      return {
        question_uz: `${eq} tenglamaning diskriminanti (D) nechaga teng?`,
        answer: ans,
        steps_uz: [
          `Formula: D = b² - 4ac`,
          `a = ${a}, b = ${b}, c = ${c}`,
          `D = (${b})² - 4 · (${a}) · (${c}) = ${b * b} - (${4 * a * c}) = ${ans}`
        ],
        mistakePatterns: [
          {
            id: 'sign_error_4ac',
            hint_uz: 'Diskriminant formulasida -4ac ishorasiga eʼtibor bering. Manfiy sonlar koʻpaytirilganda ishora oʻzgaradi.',
            check: (val) => Math.abs(val - wrongSign) < 0.01
          }
        ],
        distractors: [wrongSign, b * b - a * c, ans + 4]
      };
    },
    (difficulty = 'orta') => {
      const r1 = randInt(1, 4);
      const r2 = randInt(5, 8);
      const b = -(r1 + r2);
      const c = r1 * r2;
      const ans = b * b - 4 * 1 * c;
      return {
        question_uz: `x² ${b}x + ${c} = 0 kvadrat tenglama diskriminantini toping.`,
        answer: ans,
        steps_uz: [
          `D = b² - 4ac`,
          `D = (${b})² - 4 · 1 · ${c} = ${b * b} - ${4 * c} = ${ans}`
        ],
        distractors: [b * b + 4 * c, b * b - c, ans + 8]
      };
    }
  ],

  // 7. Kvadrat tenglama ildizlari: x = (-b +- sqrt(D)) / 2a
  alg_kvadrat_ildizlar: [
    (difficulty = 'orta') => {
      const r1 = randInt(1, 5);
      const r2 = randInt(6, 10);
      const b = -(r1 + r2);
      const c = r1 * r2;
      return {
        question_uz: `x² ${b}x + ${c} = 0 tenglamaning KATTA ildizini toping.`,
        answer: r2,
        steps_uz: [
          `D = b² - 4ac = (${b})² - 4 · 1 · ${c} = ${b * b - 4 * c}`,
          `√D = ${r2 - r1}`,
          `Ildizlar: x₁ = ${r1}, x₂ = ${r2}`,
          `Katta ildiz: ${r2}`
        ],
        mistakePatterns: [
          {
            id: 'picked_small_root',
            hint_uz: 'Siz kichik ildizni kiritdingiz, savolda KATTA ildiz soʻralgan.',
            check: (val) => Math.abs(val - r1) < 0.01
          }
        ],
        distractors: [r1, -r2, r2 + 2]
      };
    },
    (difficulty = 'orta') => {
      const r1 = randInt(-7, -2);
      const r2 = randInt(2, 6);
      const b = -(r1 + r2);
      const c = r1 * r2;
      const bSign = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`;
      const cSign = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
      return {
        question_uz: `x² ${bSign} ${cSign} = 0 tenglamaning KICHIK ildizini toping.`,
        answer: r1,
        steps_uz: [
          `D = ${b * b - 4 * c}`,
          `Ildizlar: x₁ = ${r1}, x₂ = ${r2}`,
          `Kichik ildiz: ${r1}`
        ],
        mistakePatterns: [
          {
            id: 'picked_large_root',
            hint_uz: 'Siz katta ildizni tanladingiz, savolda esa KICHIK ildiz soʻralgan.',
            check: (val) => Math.abs(val - r2) < 0.01
          }
        ],
        distractors: [r2, -r1, r1 - 1]
      };
    }
  ],

  // 8. Viyet teoremasi: x1 + x2 = -b/a, x1 * x2 = c/a
  alg_viyet: [
    (difficulty = 'orta') => {
      const b = randInt(-14, 14);
      const c = randInt(-18, 18);
      const bStr = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`;
      const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
      const ans = -b;
      return {
        question_uz: `x² ${bStr} ${cStr} = 0 tenglama ildizlari yigʻindisini (x₁ + x₂) toping.`,
        answer: ans,
        steps_uz: [
          `Viyet teoremasiga koʻra: x₁ + x₂ = -b / a`,
          `Bu yerda a = 1, b = ${b}`,
          `x₁ + x₂ = -(${b}) = ${ans}`
        ],
        mistakePatterns: [
          {
            id: 'forgot_minus_sign',
            hint_uz: 'Viyet teoremasida ildizlar yigʻindisi qarama-qarshi ishora bilan olinadi: -(b/a).',
            check: (val) => Math.abs(val - b) < 0.01
          }
        ],
        distractors: [b, c, -c]
      };
    },
    (difficulty = 'orta') => {
      const b = randInt(-10, 10);
      const c = randInt(-20, 20);
      const bStr = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`;
      const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
      return {
        question_uz: `x² ${bStr} ${cStr} = 0 tenglama ildizlari koʻpaytmasini (x₁ · x₂) toping.`,
        answer: c,
        steps_uz: [
          `Viyet teoremasiga koʻra: x₁ · x₂ = c / a`,
          `x₁ · x₂ = ${c} / 1 = ${c}`
        ],
        distractors: [-c, -b, b]
      };
    }
  ],

  // 9. Arifmetik progressiya n-hadi: an = a1 + (n - 1)d
  alg_arifmetik_n_had: [
    (difficulty = 'orta') => {
      const a1 = randInt(2, 10);
      const d = randInt(2, 5);
      const n = difficulty === 'qiyin' ? randInt(15, 30) : randInt(6, 12);
      const ans = a1 + (n - 1) * d;
      return {
        question_uz: `Arifmetik progressiyada a₁ = ${a1} va ayirma d = ${d} boʻlsa, a₍${n}₎ hadini toping.`,
        answer: ans,
        steps_uz: [
          `Formula: a_n = a₁ + (n - 1) · d`,
          `a₍${n}₎ = ${a1} + (${n} - 1) · ${d} = ${a1} + ${(n - 1) * d} = ${ans}`
        ],
        mistakePatterns: [
          {
            id: 'used_n_instead_of_n_minus_1',
            hint_uz: 'Formulada n emas, (n - 1) koʻpaytiriladi: a₁ + (n - 1)d.',
            check: (val) => Math.abs(val - (a1 + n * d)) < 0.01
          }
        ],
        distractors: [a1 + n * d, ans - d, ans + d]
      };
    },
    (difficulty = 'orta') => {
      const a1 = randInt(1, 8);
      const d = randInt(3, 7);
      const n = randInt(5, 10);
      const an = a1 + (n - 1) * d;
      return {
        question_uz: `Arifmetik progressiyada a₁ = ${a1} va a₍${n}₎ = ${an} boʻlsa, ayirma d nechaga teng?`,
        answer: d,
        steps_uz: [
          `d = (a_n - a₁) / (n - 1)`,
          `d = (${an} - ${a1}) / (${n} - 1) = ${an - a1} / ${n - 1} = ${d}`
        ],
        distractors: [d + 1, d - 1, Math.round((an - a1) / n)]
      };
    }
  ],

  // 10. Arifmetik progressiya dastlabki n ta hadi yig'indisi: Sn = ((a1 + an)/2) * n
  alg_arifmetik_yigindi: [
    (difficulty = 'orta') => {
      const a1 = randInt(2, 8);
      const d = randInt(2, 4);
      const n = randPick([6, 8, 10]);
      const an = a1 + (n - 1) * d;
      const ans = ((a1 + an) * n) / 2;
      return {
        question_uz: `a₁ = ${a1}, a₍${n}₎ = ${an} boʻlsa, dastlabki ${n} ta hadi yigʻindisini (S₍${n}₎) toping.`,
        answer: ans,
        steps_uz: [
          `Formula: S_n = ((a₁ + a_n) / 2) · n`,
          `S₍${n}₎ = ((${a1} + ${an}) / 2) · ${n} = ${ans}`
        ],
        distractors: [(a1 + an) * n, ans / 2, ans + 10]
      };
    },
    (difficulty = 'orta') => {
      const a1 = randInt(1, 4);
      const d = randInt(2, 4);
      const n = randPick([4, 6]);
      const ans = ((2 * a1 + (n - 1) * d) * n) / 2;
      return {
        question_uz: `a₁ = ${a1} va d = ${d} boʻlsa, dastlabki ${n} ta hadi yigʻindisi S₍${n}₎ nechaga teng?`,
        answer: ans,
        steps_uz: [
          `Formula: S_n = ((2a₁ + (n - 1)d) / 2) · n`,
          `Natija: ${ans}`
        ],
        distractors: [ans * 2, ans - 5, ans + 5]
      };
    }
  ],

  // 11. Geometrik progressiya n-hadi: bn = b1 * q^(n - 1)
  alg_geometrik_n_had: [
    (difficulty = 'orta') => {
      const b1 = randInt(2, 4);
      const q = randPick([2, 3]);
      const n = randInt(3, 5);
      const ans = b1 * Math.pow(q, n - 1);
      return {
        question_uz: `Geometrik progressiyada b₁ = ${b1} va q = ${q} boʻlsa, b₍${n}₎ hadini toping.`,
        answer: ans,
        steps_uz: [
          `Formula: b_n = b₁ · q^(n - 1)`,
          `b₍${n}₎ = ${b1} · ${q}^${n - 1} = ${ans}`
        ],
        distractors: [b1 * Math.pow(q, n), ans / q, ans + q]
      };
    },
    (difficulty = 'orta') => {
      const q = randPick([2, 3]);
      const b1 = randInt(1, 3);
      const b3 = b1 * q * q;
      return {
        question_uz: `Musbat hadli geometrik progressiyada b₁ = ${b1} va b₃ = ${b3} boʻlsa, q ni toping.`,
        answer: q,
        steps_uz: [
          `b₃ = b₁ · q² => q² = ${b3} / ${b1} = ${q * q}`,
          `q = ${q}`
        ],
        distractors: [q * q, q + 1, 1]
      };
    }
  ],

  // 12. Cheksiz kamayuvchi geometrik progressiya yig'indisi: S = b1 / (1 - q)
  alg_geometrik_yigindi: [
    (difficulty = 'orta') => {
      const b1 = randInt(4, 20);
      const ans = b1 * 2; // q = 0.5 bo'lsa S = b1 / 0.5 = 2*b1
      return {
        question_uz: `Cheksiz kamayuvchi geometrik progressiyada b₁ = ${b1} va q = 0.5 boʻlsa, yigʻindini (S) toping.`,
        answer: ans,
        steps_uz: [
          `Formula: S = b₁ / (1 - q)`,
          `S = ${b1} / (1 - 0.5) = ${b1} / 0.5 = ${ans}`
        ],
        distractors: [b1 / 2, ans + 4, b1]
      };
    },
    (difficulty = 'orta') => {
      const k = randInt(3, 8);
      const b1 = 2 * k;
      const ans = 3 * k; // q = 1/3 bo'lsa S = b1 / (2/3) = 1.5 * b1
      return {
        question_uz: `b₁ = ${b1} va q = 1/3 boʻlgan cheksiz kamayuvchi geometrik progressiya yigʻindisini toping.`,
        answer: ans,
        steps_uz: [
          `Formula: S = b₁ / (1 - q)`,
          `S = ${b1} / (1 - 1/3) = ${b1} / (2/3) = ${ans}`
        ],
        distractors: [b1 * 3, ans - 3, ans + 3]
      };
    }
  ],

  // 13. Bir xil asosli darajalar ko'paytmasi: a^m * a^n = a^(m+n)
  alg_daraja_kopaytma: [
    (difficulty = 'orta') => {
      const a = randPick([2, 3]);
      const m = randInt(2, 4);
      const n = randInt(1, 3);
      const ans = Math.pow(a, m + n);
      return {
        question_uz: `Hisoblang: ${a}^${m} · ${a}^${n} = ?`,
        answer: ans,
        steps_uz: [
          `Xossa: a^m · a^n = a^(m + n)`,
          `${a}^(${m} + ${n}) = ${a}^${m + n} = ${ans}`
        ],
        distractors: [Math.pow(a, m * n), ans * a, ans / a]
      };
    },
    (difficulty = 'orta') => {
      const m = randInt(4, 9);
      const n = randInt(2, 7);
      const ans = m + n;
      return {
        question_uz: `a^${m} · a^${n} = a^k tenglikdan k daraja koʻrsatkichini toping.`,
        answer: ans,
        steps_uz: [
          `Bir xil asosli darajalar koʻpaytirilganda koʻrsatkichlar qoʻshiladi: a^m · a^n = a^(m+n)`,
          `Demak: k = ${m} + ${n} = ${ans}`
        ],
        distractors: [m * n, Math.abs(m - n), ans + 1]
      };
    }
  ],

  // 14. Asosiy logarifmik ayniyat va ko'paytma logarifmi
  alg_logarifm_asosiy: [
    (difficulty = 'orta') => {
      const m = randInt(1, 4);
      const n = randInt(1, 3);
      const x = Math.pow(2, m);
      const y = Math.pow(2, n);
      const ans = m + n;
      return {
        question_uz: `Hisoblang: log₂(${x}) + log₂(${y}) = ?`,
        answer: ans,
        steps_uz: [
          `log_a x + log_a y = log_a(x · y)`,
          `log₂(${x}) = ${m}, log₂(${y}) = ${n} => ${m} + ${n} = ${ans}`
        ],
        distractors: [m * n, ans + 1, ans - 1]
      };
    },
    (difficulty = 'orta') => {
      const b = randInt(2, 4);
      const val = randInt(4, 15);
      return {
        question_uz: `Hisoblang: ${b}^(log_${b}(${val})) = ?`,
        answer: val,
        steps_uz: [
          `Asosiy logarifmik ayniyat: a^(log_a b) = b`,
          `Demak: ${val}`
        ],
        distractors: [b, val * b, val + 1]
      };
    }
  ],

  // 15. Logarifm daraja xossasi: log_a(b^k) = k * log_a b
  alg_logarifm_daraja: [
    (difficulty = 'orta') => {
      const base = randPick([2, 3]);
      const k = randInt(3, 7);
      const val = Math.pow(base, k);
      return {
        question_uz: `Hisoblang: log_${base}(${val}) = ?`,
        answer: k,
        steps_uz: [
          `${val} = ${base}^${k}`,
          `log_${base}(${base}^${k}) = ${k}`
        ],
        distractors: [k + 1, k - 1, val / base]
      };
    },
    (difficulty = 'orta') => {
      const k = randInt(2, 6);
      const ans = k * 3;
      return {
        question_uz: `Agar log₃ b = 3 boʻlsa, log₃ (b^${k}) qiymatini toping.`,
        answer: ans,
        steps_uz: [
          `Daraja xossasiga koʻra: log_a (b^k) = k · log_a b`,
          `Demak: log₃ (b^${k}) = ${k} · log₃ b = ${k} · 3 = ${ans}`
        ],
        distractors: [k + 3, Math.pow(3, k), ans - 3]
      };
    }
  ],

  // ================= GEOMETRIYA =================

  // 16. Pifagor teoremasi: c^2 = a^2 + b^2
  geom_pifagor: [
    (difficulty = 'orta') => {
      const sets = [
        [3, 4, 5],
        [6, 8, 10],
        [5, 12, 13],
        [8, 15, 17],
        [7, 24, 25]
      ];
      const [a, b, c] = randPick(sets);
      const directAdd = a + b; // Xato: kvadratlarsiz qo'shish
      const forgotSqrt = a * a + b * b; // Xato: ildiz olmagan

      return {
        question_uz: `Toʻgʻri burchakli uchburchakning katetlari ${a} sm va ${b} sm. Gipotenuzani (sm) toping.`,
        answer: c,
        steps_uz: [
          `Pifagor teoremasi: c² = a² + b²`,
          `c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}`,
          `c = √${c * c} = ${c} sm`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `1-qadam: Katetlar kvadratlari yigʻindisini hisoblang (${a}² + ${b}² = ?)`,
            step_answer: c * c,
            explanation_uz: `${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}`
          },
          {
            step_prompt_uz: `2-qadam: Chiqqan natijadan kvadrat ildiz oling (√${c * c} = ?)`,
            step_answer: c,
            explanation_uz: `Gipotenuza: ${c} sm`
          }
        ],
        mistakePatterns: [
          {
            id: 'added_directly',
            hint_uz: 'Katetlarni shunchaki qoʻshib yubordingiz (a + b). Pifagor teoremasida kvadratlarini qoʻshib, soʻng ildiz chiqarish kerak.',
            check: (val) => Math.abs(val - directAdd) < 0.01
          },
          {
            id: 'forgot_square_root',
            hint_uz: 'Gipotenuza kvadratini hisobladingiz, lekin kvadrat ildiz chiqarishni unutdingiz.',
            check: (val) => Math.abs(val - forgotSqrt) < 0.01
          }
        ],
        distractors: [directAdd, c + 2, c * c]
      };
    },
    (difficulty = 'orta') => {
      const sets = [
        [3, 4, 5],
        [6, 8, 10],
        [5, 12, 13],
        [8, 15, 17]
      ];
      const [a, b, c] = randPick(sets);
      return {
        question_uz: `Toʻgʻri burchakli uchburchakda gipotenuza ${c} sm va bir katet ${a} sm boʻlsa, ikkinchi katetni toping.`,
        answer: b,
        steps_uz: [
          `b² = c² - a² = ${c * c} - ${a * a} = ${b * b}`,
          `b = ${b} sm`
        ],
        distractors: [c - a, b + 2, Math.round(Math.sqrt(c * c + a * a))]
      };
    }
  ],

  // 17. Uchburchak yuzi: S = 1/2 * a * h
  geom_uchburchak_asos_balandlik: [
    (difficulty = 'orta') => {
      const a = randInt(4, 16);
      const h = randInt(3, 10);
      const ans = (a * h) / 2;
      const missedHalf = a * h; // 1/2 esdan chiqqan

      return {
        question_uz: `Uchburchak asosi ${a} sm va balandligi ${h} sm. Yuzini (sm²) toping.`,
        answer: ans,
        steps_uz: [
          `Formula: S = (1/2) · a · h`,
          `S = (${a} · ${h}) / 2 = ${a * h} / 2 = ${ans} sm²`
        ],
        mistakePatterns: [
          {
            id: 'forgot_half',
            hint_uz: '1/2 koeffitsiyenti esdan chiqqan (yoki 2 ga boʻlishni unutdingiz). Uchburchak yuzi toʻrtburchak yuzining yarmiga teng.',
            check: (val) => Math.abs(val - missedHalf) < 0.01
          }
        ],
        distractors: [missedHalf, ans + 2, (a + h) * 2]
      };
    },
    (difficulty = 'orta') => {
      const h = randInt(4, 10);
      const a = randInt(6, 14);
      const S = (a * h) / 2;
      return {
        question_uz: `Uchburchak yuzi ${S} sm² va asosi ${a} sm boʻlsa, balandlikni (sm) toping.`,
        answer: h,
        steps_uz: [
          `S = (a · h) / 2 formulasidan balandlik: h = 2S / a`,
          `h = (2 · ${S}) / ${a} = ${h} sm`
        ],
        distractors: [S / a, h + 2, h - 1]
      };
    }
  ],

  // 18. Geron formulasi
  geom_geron: [
    (difficulty = 'orta') => {
      const sets = [
        { a: 3, b: 4, c: 5, S: 6, p: 6 },
        { a: 6, b: 8, c: 10, S: 24, p: 12 },
        { a: 5, b: 5, c: 6, S: 12, p: 8 },
        { a: 13, b: 14, c: 15, S: 84, p: 21 }
      ];
      const item = randPick(sets);
      return {
        question_uz: `Tomonlari ${item.a} sm, ${item.b} sm, ${item.c} sm boʻlgan uchburchak yuzini Geron formulasi bilan toping.`,
        answer: item.S,
        steps_uz: [
          `p = (${item.a} + ${item.b} + ${item.c}) / 2 = ${item.p}`,
          `S = √(p(p-a)(p-b)(p-c)) = ${item.S} sm²`
        ],
        distractors: [item.p, item.S * 2, item.S - 2]
      };
    },
    (difficulty = 'orta') => {
      const a = randInt(5, 9);
      const b = randInt(6, 10);
      const c = randInt(7, 11);
      const p = (a + b + c) / 2;
      return {
        question_uz: `Tomonlari ${a}, ${b} va ${c} boʻlgan uchburchakning yarimperimetrini (p) toping.`,
        answer: p,
        steps_uz: [
          `Yarimperimetr formulasi: p = (a + b + c) / 2`,
          `p = (${a} + ${b} + ${c}) / 2 = ${a + b + c} / 2 = ${p}`
        ],
        distractors: [a + b + c, p + 1, p - 1]
      };
    }
  ],

  // 19. To'g'ri to'rtburchak yuzi va perimetri
  geom_togri_tortburchak: [
    (difficulty = 'orta') => {
      const a = randInt(4, 18);
      const b = randInt(3, 12);
      const S = a * b;
      return {
        question_uz: `Toʻgʻri toʻrtburchakning tomonlari ${a} sm va ${b} sm. Uning yuzini (sm²) toping.`,
        answer: S,
        steps_uz: [
          `Toʻgʻri toʻrtburchak yuzi formulasi: S = a · b`,
          `S = ${a} · ${b} = ${S} sm²`
        ],
        distractors: [2 * (a + b), S + 4, S - 4]
      };
    },
    (difficulty = 'orta') => {
      const a = randInt(5, 18);
      const b = randInt(4, 12);
      const P = 2 * (a + b);
      return {
        question_uz: `Tomonlari ${a} sm va ${b} sm boʻlgan toʻgʻri toʻrtburchakning perimetrini (sm) toping.`,
        answer: P,
        steps_uz: [
          `Perimetr formulasi: P = 2(a + b)`,
          `P = 2 · (${a} + ${b}) = 2 · ${a + b} = ${P} sm`
        ],
        distractors: [a + b, a * b, P + 2]
      };
    }
  ],

  // 20. Romb yuzi: S = 1/2 * d1 * d2
  geom_romb: [
    (difficulty = 'orta') => {
      const d1 = randInt(6, 16);
      const d2 = randInt(4, 14);
      const S = (d1 * d2) / 2;
      return {
        question_uz: `Rombning diagonallari ${d1} sm va ${d2} sm. Yuzini (sm²) toping.`,
        answer: S,
        steps_uz: [
          `Formula: S = (1/2) · d₁ · d₂`,
          `S = (${d1} · ${d2}) / 2 = ${S} sm²`
        ],
        mistakePatterns: [
          {
            id: 'forgot_half',
            hint_uz: 'Diagonallar koʻpaytmasini 2 ga boʻlish esdan chiqqan: S = (d₁ · d₂)/2.',
            check: (val) => Math.abs(val - d1 * d2) < 0.01
          }
        ],
        distractors: [d1 * d2, S + 4, S - 4]
      };
    },
    (difficulty = 'orta') => {
      const d1 = randInt(6, 14);
      const d2 = randInt(4, 10);
      const S = (d1 * d2) / 2;
      return {
        question_uz: `Romb yuzi ${S} sm² va bitta diagonali ${d1} sm boʻlsa, ikkinchi diagonalini toping.`,
        answer: d2,
        steps_uz: [
          `d₂ = (2 · S) / d₁ formulasidan:`,
          `d₂ = (2 · ${S}) / ${d1} = ${d2} sm`
        ],
        distractors: [S / d1, d2 + 2, d2 - 1]
      };
    }
  ],

  // 21. Trapetsiya yuzi
  geom_trapetsiya: [
    (difficulty = 'orta') => {
      const a = randInt(4, 10);
      const b = randInt(8, 16);
      const h = randInt(3, 8);
      const S = ((a + b) / 2) * h;
      return {
        question_uz: `Trapetsiyaning asoslari ${a} sm va ${b} sm, balandligi ${h} sm. Yuzini (sm²) hisoblang.`,
        answer: S,
        steps_uz: [
          `Trapetsiya yuzi: S = ((a + b) / 2) · h`,
          `S = ${(a + b) / 2} · ${h} = ${S} sm²`
        ],
        distractors: [(a + b) * h, S + 3, S - 3]
      };
    },
    (difficulty = 'orta') => {
      const mid = randInt(6, 16);
      const h = randInt(4, 10);
      const S = mid * h;
      return {
        question_uz: `Trapetsiyaning oʻrta chizigʻi ${mid} sm va balandligi ${h} sm boʻlsa, yuzini toping.`,
        answer: S,
        steps_uz: [
          `Formula: S = oʻrta chiziq · balandlik`,
          `S = ${mid} · ${h} = ${S} sm²`
        ],
        distractors: [mid + h, S * 2, S - 4]
      };
    }
  ],

  // 22. Aylana uzunligi: L = 2piR (pi = 3)
  geom_aylana_uzunligi: [
    (difficulty = 'orta') => {
      const R = randInt(3, 10);
      const ans = 2 * 3 * R;
      return {
        question_uz: `Aylananing radiusi R = ${R} sm. Uning uzunligini toping (π = 3 deb oling).`,
        answer: ans,
        steps_uz: [
          `Formula: L = 2πR`,
          `L = 2 · 3 · ${R} = ${ans} sm`
        ],
        distractors: [3 * R, 3 * R * R, ans + 6]
      };
    },
    (difficulty = 'orta') => {
      const D = randInt(4, 16);
      const ans = 3 * D;
      return {
        question_uz: `Aylananing diametri D = ${D} sm. Uning uzunligini toping (π = 3 deb hisoblang).`,
        answer: ans,
        steps_uz: [
          `Formula: L = πD`,
          `L = 3 · ${D} = ${ans} sm`
        ],
        distractors: [6 * D, 3 * D * D, ans + 3]
      };
    }
  ],

  // 23. Doira yuzi: S = pi * R^2 (pi = 3)
  geom_doira_yuzi: [
    (difficulty = 'orta') => {
      const R = randInt(2, 8);
      const ans = 3 * R * R;
      return {
        question_uz: `Radiusi R = ${R} sm boʻlgan doiraning yuzini hisoblang (π = 3 deb oling).`,
        answer: ans,
        steps_uz: [
          `Formula: S = πR²`,
          `S = 3 · ${R}² = ${ans} sm²`
        ],
        distractors: [2 * 3 * R, ans + 6, ans - 6]
      };
    },
    (difficulty = 'orta') => {
      const R = randInt(2, 6);
      const S = 3 * R * R;
      return {
        question_uz: `Doira yuzi ${S} sm² boʻlsa (π = 3 deb oling), uning radiusini (sm) toping.`,
        answer: R,
        steps_uz: [
          `R² = S / π = ${S} / 3 = ${R * R}`,
          `Radius: R = √${R * R} = ${R} sm`
        ],
        distractors: [R * 2, R + 1, R - 1]
      };
    }
  ],

  // 24. Silindr hajmi: V = pi * R^2 * h (pi = 3)
  geom_silindr_hajmi: [
    (difficulty = 'orta') => {
      const R = randInt(2, 5);
      const h = randInt(3, 8);
      const ans = 3 * R * R * h;
      return {
        question_uz: `Silindrning asos radiusi R = ${R} sm, balandligi h = ${h} sm. Hajmini toping (π = 3 deb hisoblang).`,
        answer: ans,
        steps_uz: [
          `Formula: V = πR²h`,
          `V = 3 · ${R}² · ${h} = 3 · ${R * R} · ${h} = ${ans} sm³`
        ],
        distractors: [ans / 3, ans * 2, ans + 10]
      };
    },
    (difficulty = 'orta') => {
      const sAsos = randInt(12, 35);
      const h = randInt(4, 10);
      const V = sAsos * h;
      return {
        question_uz: `Silindr asosining yuzi ${sAsos} sm² va balandligi ${h} sm boʻlsa, hajmini hisoblang.`,
        answer: V,
        steps_uz: [
          `Formula: V = S_asos · h`,
          `V = ${sAsos} · ${h} = ${V} sm³`
        ],
        distractors: [sAsos + h, (sAsos * h) / 3, V + 12]
      };
    }
  ],

  // 25. Konus hajmi: V = 1/3 * pi * R^2 * h (pi = 3)
  geom_konus_hajmi: [
    (difficulty = 'orta') => {
      const R = randInt(2, 5);
      const h = randPick([3, 6, 9]);
      const ans = R * R * h; // 1/3 * 3 = 1
      return {
        question_uz: `Konusning asos radiusi R = ${R} sm va balandligi h = ${h} sm boʻlsa, hajmini toping (π = 3 deb hisoblang).`,
        answer: ans,
        steps_uz: [
          `Formula: V = (1/3)πR²h`,
          `V = (1/3) · 3 · ${R}² · ${h} = ${ans} sm³`
        ],
        distractors: [ans * 3, ans + 6, ans - 6]
      };
    },
    (difficulty = 'orta') => {
      const sAsos = randPick([12, 18, 24, 30]);
      const h = randInt(3, 8);
      const ans = (sAsos * h) / 3;
      return {
        question_uz: `Konus asosining yuzi ${sAsos} sm² va balandligi ${h} sm boʻlsa, hajmini hisoblang.`,
        answer: ans,
        steps_uz: [
          `Formula: V = (1/3) · S_asos · h`,
          `V = (${sAsos} · ${h}) / 3 = ${ans} sm³`
        ],
        distractors: [sAsos * h, ans + 4, ans - 2]
      };
    }
  ],

  // 26. Shar hajmi: V = 4/3 * pi * R^3 (pi = 3)
  geom_shar_hajmi: [
    (difficulty = 'orta') => {
      const R = randInt(2, 4);
      const ans = 4 * R * R * R;
      return {
        question_uz: `Radiusi R = ${R} sm boʻlgan sharning hajmini toping (π = 3 deb oling).`,
        answer: ans,
        steps_uz: [
          `Formula: V = (4/3)πR³`,
          `V = 4 · ${R}³ = 4 · ${R * R * R} = ${ans} sm³`
        ],
        distractors: [12 * R * R, ans / 2, ans + 10]
      };
    },
    (difficulty = 'orta') => {
      const R = randInt(2, 5);
      const ans = 12 * R * R;
      return {
        question_uz: `Radiusi R = ${R} sm boʻlgan shar sirtining yuzini hisoblang (π = 3 deb oling).`,
        answer: ans,
        steps_uz: [
          `Formula: S = 4πR²`,
          `S = 4 · 3 · ${R}² = 12 · ${R * R} = ${ans} sm²`
        ],
        distractors: [4 * R * R * R, ans + 8, ans - 8]
      };
    }
  ],

  // 27. Piramida hajmi: V = 1/3 * S_asos * h
  geom_piramida_hajmi: [
    (difficulty = 'orta') => {
      const sAsos = randPick([15, 21, 27, 36]);
      const h = randInt(3, 8);
      const ans = (sAsos * h) / 3;
      return {
        question_uz: `Piramidaning asos yuzi ${sAsos} sm² va balandligi ${h} sm. Hajmini toping.`,
        answer: ans,
        steps_uz: [
          `Formula: V = (1/3) · S_asos · h`,
          `V = (${sAsos} · ${h}) / 3 = ${ans} sm³`
        ],
        distractors: [sAsos * h, ans + 5, ans - 5]
      };
    },
    (difficulty = 'orta') => {
      const a = randInt(3, 6);
      const h = randPick([3, 6]);
      const sAsos = a * a;
      const ans = (sAsos * h) / 3;
      return {
        question_uz: `Asosi tomoni ${a} sm boʻlgan kvadratdan iborat piramidaning balandligi ${h} sm boʻlsa, hajmini toping.`,
        answer: ans,
        steps_uz: [
          `Kvadrat asos yuzi: S_asos = ${a}² = ${sAsos} sm²`,
          `Piramida hajmi: V = (${sAsos} · ${h}) / 3 = ${ans} sm³`
        ],
        distractors: [sAsos * h, ans + 3, ans - 3]
      };
    }
  ],
  ...moreAlgebraGenerators,
  ...moreGeometryGenerators
};

// Har bir generatorni takrorlanmaslik wrappper bilan o'rab eksport qilamiz
export const formulaGenerators = Object.keys(rawGenerators).reduce((acc, key) => {
  acc[key] = rawGenerators[key].map((fn) => withNoRepetition(fn));
  return acc;
}, {});

/**
 * Berilgan formula uchun count ta misol hosil qilish
 */
export function generateExamplesForFormula(formulaId, count = 3, difficulty = 'orta') {
  const genList = formulaGenerators[formulaId];
  if (!genList || genList.length === 0) return [];

  const results = [];
  for (let i = 0; i < count; i++) {
    const gen = genList[i % genList.length];
    results.push(gen(difficulty));
  }
  return results;
}
