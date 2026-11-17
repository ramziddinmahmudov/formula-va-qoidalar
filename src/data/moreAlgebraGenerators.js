import { randInt, randPick } from './generators.js';

function factorial(n) {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

function comb(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  return factorial(n) / (factorial(k) * factorial(n - k));
}

export const moreAlgebraGenerators = {
  // 1. Yig'indining kubi: (a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3
  alg_yigindi_kubi: [
    (difficulty = 'orta') => {
      let a = randInt(1, 3);
      let b = randInt(1, 2);
      if (difficulty === 'qiyin') { a = randInt(2, 4); b = randInt(2, 3); }
      const sum = a + b;
      const ans = sum * sum * sum;
      const missedTriple = a * a * a + b * b * b;
      return {
        question_uz: `Qisqa koʻpaytirish formulasidan foydalanib hisoblang: (${a} + ${b})³ = ?`,
        answer: ans,
        steps_uz: [
          `Formulani qoʻllaymiz: (a + b)³ = a³ + 3a²b + 3ab² + b³`,
          `a = ${a}, b = ${b}`,
          `a³ = ${a ** 3}, 3a²b = ${3 * a * a * b}, 3ab² = ${3 * a * b * b}, b³ = ${b ** 3}`,
          `Yigʻindi: ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `1-qadam: a³ + b³ qiymatini hisoblang (${a}³ + ${b}³ = ?)`,
            step_answer: a ** 3 + b ** 3,
            explanation_uz: `${a}³ + ${b}³ = ${a ** 3 + b ** 3}`
          },
          {
            step_prompt_uz: `2-qadam: 3a²b + 3ab² qiymatini hisoblang`,
            step_answer: 3 * a * a * b + 3 * a * b * b,
            explanation_uz: `3·${a}²·${b} + 3·${a}·${b}² = ${3 * a * a * b + 3 * a * b * b}`
          }
        ],
        mistakePatterns: [
          {
            id: 'forgot_middle_terms',
            hint_uz: 'Kublar yigʻindisida 3a²b va 3ab² oʻrta hadlar unutilmasligi kerak.',
            check: (val) => Math.abs(val - missedTriple) < 0.01
          }
        ],
        distractors: [missedTriple, ans + 6, ans - 6]
      };
    },
    (difficulty = 'orta') => {
      const b = difficulty === 'qiyin' ? randInt(3, 7) : randInt(1, 5);
      const coeff = 3 * b;
      return {
        question_uz: `(x + ${b})³ koʻphad yoyilmasidagi x² ning koeffitsiyenti nechaga teng?`,
        answer: coeff,
        steps_uz: [
          `(x + b)³ = x³ + 3bx² + 3b²x + b³ formulaga koʻra:`,
          `x² oldidagi koeffitsiyent 3 · b ga teng: 3 · ${b} = ${coeff}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `x² oldidagi koeffitsiyent formulasini eslang (3 · b): 3 · ${b} = ?`,
            step_answer: coeff,
            explanation_uz: `3 · ${b} = ${coeff}`
          }
        ],
        mistakePatterns: [
          {
            id: 'forgot_factor_3',
            hint_uz: 'Koeffitsiyent 3b boʻladi, faqat b emas.',
            check: (val) => Math.abs(val - b) < 0.01
          }
        ],
        distractors: [b, b * b, coeff + 3]
      };
    }
  ],

  // 2. Ayirmaning kubi: (a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3
  alg_ayirma_kubi: [
    (difficulty = 'orta') => {
      let a = randInt(2, 5);
      let b = randInt(1, a - 1);
      if (difficulty === 'qiyin') { a = randInt(5, 7); b = randInt(1, 4); }
      const diff = a - b;
      const ans = diff * diff * diff;
      return {
        question_uz: `Ayirmaning kubi formulasidan foydalanib hisoblang: (${a} - ${b})³ = ?`,
        answer: ans,
        steps_uz: [
          `(a - b)³ = a³ - 3a²b + 3ab² - b³ formulaga koʻra:`,
          `(${a} - ${b})³ = ${diff}³ = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `Qavs ichidagi (${a} - ${b}) ayirmani toping:`,
            step_answer: diff,
            explanation_uz: `${a} - ${b} = ${diff}`
          },
          {
            step_prompt_uz: `${diff} sonining kubini hisoblang:`,
            step_answer: ans,
            explanation_uz: `${diff}³ = ${ans}`
          }
        ],
        mistakePatterns: [
          {
            id: 'sign_error_b3',
            hint_uz: 'Ayirmaning kubida oxirgi had oldida minus ishora turadi (-b³).',
            check: (val) => Math.abs(val - (a ** 3 + b ** 3)) < 0.01
          }
        ],
        distractors: [ans + 4, a ** 3 - b ** 3, ans + 8]
      };
    },
    (difficulty = 'orta') => {
      const b = randInt(2, 6);
      const freeTerm = -(b ** 3);
      return {
        question_uz: `(x - ${b})³ koʻphad yoyilmasidagi ozod hadni (x qatnashmagan hadni) toping:`,
        answer: freeTerm,
        steps_uz: [
          `(x - b)³ yoyilmasidagi ozod had (-b)³ ga teng.`,
          `(-${b})³ = -${b ** 3}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `(-${b}) sonini kubga oshiring:`,
            step_answer: freeTerm,
            explanation_uz: `(-${b})³ = ${freeTerm}`
          }
        ],
        mistakePatterns: [
          {
            id: 'missed_minus',
            hint_uz: 'Toq darajada manfiy son manfiy boʻlib qoladi: (-b)³ = -b³.',
            check: (val) => Math.abs(val - (b ** 3)) < 0.01
          }
        ],
        distractors: [b ** 3, -(b * 3), b * 3]
      };
    }
  ],

  // 3. Darajalarni bo'lish: a^m / a^n = a^(m - n)
  alg_daraja_bolinma: [
    (difficulty = 'orta') => {
      const a = randPick([2, 3, 5, 7, 10]);
      let m = randInt(5, 9);
      let n = randInt(2, m - 1);
      if (difficulty === 'qiyin') { m = randInt(10, 20); n = randInt(4, 9); }
      const ansExp = m - n;
      return {
        question_uz: `Asoslari bir xil darajalarni boʻlish xossasidan foydalaning: ${a}^${m} : ${a}^${n} = ${a}^k boʻlsa, daraja koʻrsatkichi k ni toping:`,
        answer: ansExp,
        steps_uz: [
          `Formulaga koʻra: aᵐ : aⁿ = aᵐ⁻ⁿ`,
          `k = ${m} - ${n} = ${ansExp}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `Koʻrsatkichlar ayirmasini hisoblang (${m} - ${n} = ?):`,
            step_answer: ansExp,
            explanation_uz: `${m} - ${n} = ${ansExp}`
          }
        ],
        mistakePatterns: [
          {
            id: 'divided_exponents',
            hint_uz: 'Darajalar boʻlinganda koʻrsatkichlar boʻlinmaydi, balki ayriladi (m - n)!',
            check: (val) => Math.abs(val - Math.floor(m / n)) < 0.01
          }
        ],
        distractors: [m + n, Math.floor(m / n), ansExp + 1]
      };
    },
    (difficulty = 'orta') => {
      let m = randInt(4, 8);
      let n = randInt(1, m - 2);
      const val = 2 ** (m - n);
      return {
        question_uz: `Hisoblang: 2^${m} / 2^${n} = ?`,
        answer: val,
        steps_uz: [
          `2^${m} / 2^${n} = 2^(${m} - ${n}) = 2^${m - n}`,
          `2^${m - n} = ${val}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `2 ning darajasini hisoblang (2^${m - n} = ?):`,
            step_answer: val,
            explanation_uz: `2^${m - n} = ${val}`
          }
        ],
        distractors: [val * 2, val / 2, val + 2]
      };
    }
  ],

  // 4. Darajani darajaga ko'tarish: (a^m)^n = a^(m * n)
  alg_daraja_daraja: [
    (difficulty = 'orta') => {
      let m = randInt(2, 5);
      let n = randInt(2, 4);
      if (difficulty === 'qiyin') { m = randInt(4, 8); n = randInt(3, 6); }
      const ans = m * n;
      return {
        question_uz: `(x^${m})^${n} = x^k boʻlsa, yangi daraja koʻrsatkichi k ni toping:`,
        answer: ans,
        steps_uz: [
          `Formulaga koʻra: (aᵐ)ⁿ = aᵐ·ⁿ`,
          `k = ${m} · ${n} = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${m} va ${n} sonlarining koʻpaytmasini toping:`,
            step_answer: ans,
            explanation_uz: `${m} · ${n} = ${ans}`
          }
        ],
        mistakePatterns: [
          {
            id: 'added_instead_of_multiplied',
            hint_uz: 'Darajani darajaga oshirganda koʻrsatkichlar koʻpaytiriladi (m · n), qoʻshilmaydi.',
            check: (val) => Math.abs(val - (m + n)) < 0.01
          }
        ],
        distractors: [m + n, m ** n, ans + 2]
      };
    },
    (difficulty = 'orta') => {
      const m = randPick([2, 3]);
      const n = randPick([2, 3]);
      const ans = (2 ** m) ** n;
      return {
        question_uz: `(2^${m})^${n} ifodaning son qiymatini hisoblang:`,
        answer: ans,
        steps_uz: [
          `(2^${m})^${n} = 2^(${m} · ${n}) = 2^${m * n}`,
          `Natija: ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `2^${m * n} qiymatini hisoblang:`,
            step_answer: ans,
            explanation_uz: `2^${m * n} = ${ans}`
          }
        ],
        distractors: [ans / 2, ans * 2, ans + 4]
      };
    }
  ],

  // 5. Manfiy daraja: a^(-n) = 1 / a^n
  alg_daraja_manfiy: [
    (difficulty = 'orta') => {
      const a = randPick([2, 4, 5, 10]);
      const mult = a * randInt(2, 7);
      const ans = mult / a;
      return {
        question_uz: `Hisoblang: ${mult} · ${a}⁻¹ = ?`,
        answer: ans,
        steps_uz: [
          `${a}⁻¹ = 1 / ${a}`,
          `${mult} · (1 / ${a}) = ${mult} / ${a} = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${mult} sonini ${a} ga boʻling:`,
            step_answer: ans,
            explanation_uz: `${mult} / ${a} = ${ans}`
          }
        ],
        mistakePatterns: [
          {
            id: 'treated_negative_as_subtraction',
            hint_uz: 'a⁻¹ bu manfiy son emas, balki 1/a kasrga teng boʻladi.',
            check: (val) => Math.abs(val - (mult - a)) < 0.01
          }
        ],
        distractors: [mult - a, ans * a, ans + 1]
      };
    },
    (difficulty = 'orta') => {
      const a = randPick([2, 3, 4, 5]);
      const n = randInt(1, 3);
      const ans = a ** n;
      return {
        question_uz: `(1 / ${a})⁻${n} ifodaning butun sonli qiymatini toping:`,
        answer: ans,
        steps_uz: [
          `(1/a)⁻ⁿ = aⁿ formulaga koʻra:`,
          `(1/${a})⁻${n} = ${a}^${n} = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${a}^${n} darajasini hisoblang:`,
            step_answer: ans,
            explanation_uz: `${a}^${n} = ${ans}`
          }
        ],
        distractors: [ans + 1, ans - 1, a * n]
      };
    }
  ],

  // 6. Ildizlar ko'paytmasi: sqrt(a * b) = sqrt(a) * sqrt(b)
  alg_ildiz_kopaytma: [
    (difficulty = 'orta') => {
      const pairs = [
        [2, 8, 4],
        [3, 12, 6],
        [2, 18, 6],
        [2, 32, 8],
        [5, 20, 10],
        [3, 27, 9],
        [8, 18, 12]
      ];
      const p = randPick(pairs);
      const a = p[0];
      const b = p[1];
      const ans = p[2];
      return {
        question_uz: `Kvadrat ildizlar koʻpaytmasini hisoblang: √${a} · √${b} = ?`,
        answer: ans,
        steps_uz: [
          `√a · √b = √(a · b) formulani qoʻllaymiz.`,
          `√${a} · √${b} = √(${a} · ${b}) = √${a * b} = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${a} va ${b} koʻpaytmasini toping:`,
            step_answer: a * b,
            explanation_uz: `${a} · ${b} = ${a * b}`
          },
          {
            step_prompt_uz: `√${a * b} ning ildiz qiymatini toping:`,
            step_answer: ans,
            explanation_uz: `√${a * b} = ${ans}`
          }
        ],
        mistakePatterns: [
          {
            id: 'added_inside_roots',
            hint_uz: 'Ildiz ostidagi sonlar qoʻshilmaydi, balki koʻpaytiriladi (a · b).',
            check: (val) => Math.abs(val - (a + b)) < 0.01
          }
        ],
        distractors: [ans + 2, a + b, ans - 1]
      };
    },
    (difficulty = 'orta') => {
      const k = randInt(2, 6);
      const m = randPick([2, 3, 5]);
      const inside = k * k * m;
      return {
        question_uz: `√${inside} ifodadan koʻpaytuvchini ildiz ostidan chiqarib, k√${m} koʻrinishiga keltiring. k koeffitsiyentini toping:`,
        answer: k,
        steps_uz: [
          `√${inside} = √(${k * k} · ${m}) = √(${k}² · ${m})`,
          `k = ${k}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${inside} soni ${m} ga boʻlinganda nechaga teng boʻladi?`,
            step_answer: k * k,
            explanation_uz: `${inside} / ${m} = ${k * k}`
          },
          {
            step_prompt_uz: `√${k * k} ildizdan qanday butun son chiqadi?`,
            step_answer: k,
            explanation_uz: `√${k * k} = ${k}`
          }
        ],
        distractors: [k + 1, k * k, k - 1]
      };
    }
  ],

  // 7. Ildiz va modul: sqrt(a^2) = |a|
  alg_ildiz_modul: [
    (difficulty = 'orta') => {
      const x = randInt(1, 4);
      const k = randInt(6, 12);
      const ans = k - x;
      return {
        question_uz: `Agar x = ${x} boʻlsa, √(x - ${k})² ifodaning son qiymatini hisoblang:`,
        answer: ans,
        steps_uz: [
          `√a² = |a| formulaga koʻra: √(x - ${k})² = |x - ${k}|`,
          `x = ${x} boʻlganda: |${x} - ${k}| = |${x - k}| = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `Qavs ichidagi ${x} - ${k} ayirmani toping:`,
            step_answer: x - k,
            explanation_uz: `${x} - ${k} = ${x - k}`
          },
          {
            step_prompt_uz: `|${x - k}| modul qiymatini musbat son koʻrinishida yozing:`,
            step_answer: ans,
            explanation_uz: `|${x - k}| = ${ans}`
          }
        ],
        mistakePatterns: [
          {
            id: 'forgot_absolute_value',
            hint_uz: 'Kvadrat ildizdan faqat nomanfiy (musbat) qiymat chiqadi: √a² = |a|.',
            check: (val) => Math.abs(val - (x - k)) < 0.01
          }
        ],
        distractors: [x - k, ans + 2, -ans]
      };
    },
    (difficulty = 'orta') => {
      const a = randInt(5, 25);
      return {
        question_uz: `√(-${a})² ifodaning qiymatini toping:`,
        answer: a,
        steps_uz: [
          `√a² = |a| qoidasiga koʻra: √(-${a})² = |-${a}|`,
          `|-${a}| = ${a}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `|-${a}| modul qiymatini toping:`,
            step_answer: a,
            explanation_uz: `|-${a}| = ${a}`
          }
        ],
        mistakePatterns: [
          {
            id: 'kept_negative_sign',
            hint_uz: 'Kvadrat ildiz natijasi manfiy boʻla olmaydi: √(-a)² = a.',
            check: (val) => Math.abs(val - (-a)) < 0.01
          }
        ],
        distractors: [-a, a * a, 0]
      };
    }
  ],

  // 8. Ko'paytma logarifmi: log_a(x * y) = log_a(x) + log_a(y)
  alg_logarifm_kopaytma: [
    (difficulty = 'orta') => {
      const cases = [
        { a: 6, x: 2, y: 18, prod: 36, ans: 2 },
        { a: 2, x: 4, y: 8, prod: 32, ans: 5 },
        { a: 3, x: 9, y: 9, prod: 81, ans: 4 },
        { a: 10, x: 20, y: 5, prod: 100, ans: 2 },
        { a: 12, x: 3, y: 48, prod: 144, ans: 2 },
        { a: 2, x: 2, y: 16, prod: 32, ans: 5 },
        { a: 4, x: 2, y: 32, prod: 64, ans: 3 }
      ];
      const item = randPick(cases);
      return {
        question_uz: `Koʻpaytma logarifmi xossasidan foydalanib hisoblang: log_${item.a}(${item.x}) + log_${item.a}(${item.y}) = ?`,
        answer: item.ans,
        steps_uz: [
          `log_a(x) + log_a(y) = log_a(x · y) formulani qoʻllaymiz.`,
          `log_${item.a}(${item.x} · ${item.y}) = log_${item.a}(${item.prod}) = ${item.ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${item.x} va ${item.y} ning koʻpaytmasini toping:`,
            step_answer: item.prod,
            explanation_uz: `${item.x} · ${item.y} = ${item.prod}`
          },
          {
            step_prompt_uz: `log_${item.a}(${item.prod}) qiymatini hisoblang:`,
            step_answer: item.ans,
            explanation_uz: `${item.a}^${item.ans} = ${item.prod}`
          }
        ],
        distractors: [item.ans + 1, item.ans * 2, item.ans - 1]
      };
    },
    (difficulty = 'orta') => {
      const a = randPick([2, 3]);
      const p = randInt(1, 3);
      const q = randInt(1, 3);
      const x = a ** p;
      const y = a ** q;
      const ans = p + q;
      return {
        question_uz: `log_${a}(${x} · ${y}) ifodaning qiymatini toping:`,
        answer: ans,
        steps_uz: [
          `log_${a}(${x} · ${y}) = log_${a}(${x}) + log_${a}(${y})`,
          `= ${p} + ${q} = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `log_${a}(${x}) + log_${a}(${y}) = ?`,
            step_answer: ans,
            explanation_uz: `${p} + ${q} = ${ans}`
          }
        ],
        distractors: [p * q, ans + 1, ans - 1]
      };
    }
  ],

  // 9. Bo'linma logarifmi: log_a(x / y) = log_a(x) - log_a(y)
  alg_logarifm_bolinma: [
    (difficulty = 'orta') => {
      const cases = [
        { a: 3, x: 54, y: 2, quot: 27, ans: 3 },
        { a: 2, x: 48, y: 3, quot: 16, ans: 4 },
        { a: 5, x: 250, y: 2, quot: 125, ans: 3 },
        { a: 10, x: 5000, y: 5, quot: 1000, ans: 3 },
        { a: 2, x: 128, y: 4, quot: 32, ans: 5 }
      ];
      const item = randPick(cases);
      return {
        question_uz: `Boʻlinma logarifmi xossasidan foydalanib hisoblang: log_${item.a}(${item.x}) - log_${item.a}(${item.y}) = ?`,
        answer: item.ans,
        steps_uz: [
          `log_a(x) - log_a(y) = log_a(x / y) formulani qoʻllaymiz.`,
          `log_${item.a}(${item.x} / ${item.y}) = log_${item.a}(${item.quot}) = ${item.ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${item.x} : ${item.y} boʻlinmasini toping:`,
            step_answer: item.quot,
            explanation_uz: `${item.x} / ${item.y} = ${item.quot}`
          },
          {
            step_prompt_uz: `log_${item.a}(${item.quot}) qiymatini hisoblang:`,
            step_answer: item.ans,
            explanation_uz: `${item.a}^${item.ans} = ${item.quot}`
          }
        ],
        mistakePatterns: [
          {
            id: 'subtracted_numbers_directly',
            hint_uz: 'Logarifmlar ayirilganda ularning argumentlari boʻlinadi (x / y).',
            check: (val) => Math.abs(val - (item.x - item.y)) < 0.01
          }
        ],
        distractors: [item.ans + 1, item.ans - 1, item.ans * 2]
      };
    },
    (difficulty = 'orta') => {
      const pairs = [
        { a: 2, x: 64, y: 4, quot: 16, ans: 4 },
        { a: 2, x: 32, y: 2, quot: 16, ans: 4 },
        { a: 3, x: 81, y: 3, quot: 27, ans: 3 },
        { a: 5, x: 250, y: 2, quot: 125, ans: 3 },
        { a: 10, x: 1000, y: 10, quot: 100, ans: 2 },
        { a: 2, x: 128, y: 8, quot: 16, ans: 4 }
      ];
      const item = randPick(pairs);
      return {
        question_uz: `Hisoblang: log_${item.a}(${item.x}) - log_${item.a}(${item.y}) = ?`,
        answer: item.ans,
        steps_uz: [
          `log_${item.a}(${item.x} / ${item.y}) = log_${item.a}(${item.quot})`,
          `log_${item.a}(${item.quot}) = ${item.ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${item.x} : ${item.y} boʻlinmasi nechaga teng?`,
            step_answer: item.quot,
            explanation_uz: `${item.x} / ${item.y} = ${item.quot}`
          },
          {
            step_prompt_uz: `log_${item.a}(${item.quot}) qiymatini toping:`,
            step_answer: item.ans,
            explanation_uz: `${item.a}^${item.ans} = ${item.quot}`
          }
        ],
        distractors: [item.ans + 1, item.ans - 1, item.ans * 2]
      };
    }
  ],

  // 10. Logarifm asosini almashtirish: log_a(b) = log_c(b) / log_c(a)
  alg_logarifm_asos_almashtirish: [
    (difficulty = 'orta') => {
      const k = randInt(2, 5);
      const pow = 2 ** k;
      return {
        question_uz: `Asos almashtirish formulasidan foydalanib hisoblang: log_2(3) · log_3(${pow}) = ?`,
        answer: k,
        steps_uz: [
          `log_a(b) · log_b(c) = log_a(c) qoidasiga koʻra:`,
          `log_2(3) · log_3(${pow}) = log_2(${pow}) = ${k}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `log_2(${pow}) ifodaning qiymatini hisoblang:`,
            step_answer: k,
            explanation_uz: `2^${k} = ${pow}`
          }
        ],
        distractors: [k + 1, k - 1, pow]
      };
    },
    (difficulty = 'orta') => {
      const a = randPick([2, 3, 5]);
      const k = randInt(2, 5);
      const val = a ** k;
      return {
        question_uz: `Hisoblang: log_7(${val}) / log_7(${a}) = ?`,
        answer: k,
        steps_uz: [
          `log_c(b) / log_c(a) = log_a(b) formulaga koʻra:`,
          `log_7(${val}) / log_7(${a}) = log_${a}(${val}) = ${k}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `log_${a}(${val}) qiymatini hisoblang:`,
            step_answer: k,
            explanation_uz: `${a}^${k} = ${val}`
          }
        ],
        distractors: [k + 1, k * 2, k - 1]
      };
    }
  ],

  // 11. Cheksiz kamayuvchi geometrik progressiya: S = b1 / (1 - q)
  alg_cheksiz_geometrik_yigindi: [
    (difficulty = 'orta') => {
      const b1 = randPick([4, 6, 8, 10, 12, 14, 16]);
      const ans = b1 * 2;
      return {
        question_uz: `Cheksiz kamayuvchi geometrik progressiyada b₁ = ${b1} va maxraj q = 0.5 boʻlsa, barcha hadlar yigʻindisi S ni toping:`,
        answer: ans,
        steps_uz: [
          `S = b₁ / (1 - q) formulani qoʻllaymiz.`,
          `S = ${b1} / (1 - 0.5) = ${b1} / 0.5 = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `1 - q qiymatini hisoblang (1 - 0.5 = ?):`,
            step_answer: 0.5,
            explanation_uz: `1 - 0.5 = 0.5`
          },
          {
            step_prompt_uz: `${b1} sonini 0.5 ga boʻling:`,
            step_answer: ans,
            explanation_uz: `${b1} / 0.5 = ${ans}`
          }
        ],
        distractors: [b1, ans + 2, b1 / 2]
      };
    },
    (difficulty = 'orta') => {
      const b1 = randPick([6, 12, 18, 24, 30]);
      const ans = 1.5 * b1;
      return {
        question_uz: `b₁ = ${b1} va q = 1/3 boʻlgan cheksiz kamayuvchi geometrik progressiya yigʻindisi S ni toping:`,
        answer: ans,
        steps_uz: [
          `S = b₁ / (1 - q) = ${b1} / (1 - 1/3) = ${b1} / (2/3)`,
          `S = ${b1} · 3 / 2 = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `1 - 1/3 ayirmani toping (oʻnli kasr yoki 2/3):`,
            step_answer: 2 / 3,
            explanation_uz: `1 - 1/3 = 2/3`
          },
          {
            step_prompt_uz: `${b1} sonini 2/3 ga boʻling:`,
            step_answer: ans,
            explanation_uz: `${b1} / (2/3) = ${ans}`
          }
        ],
        distractors: [b1 * 3, b1 * 2, ans + 3]
      };
    }
  ],

  // 12. Asosiy trigonometrik ayniyat: sin^2(x) + cos^2(x) = 1
  alg_trig_asosiy_ayniyat: [
    (difficulty = 'orta') => {
      const triplets = [
        { sin: '3/5', mult: 25, ans: 16, text: 'sin(α) = 3/5' },
        { sin: '4/5', mult: 25, ans: 9, text: 'sin(α) = 4/5' },
        { sin: '5/13', mult: 169, ans: 144, text: 'sin(α) = 5/13' },
        { sin: '12/13', mult: 169, ans: 25, text: 'sin(α) = 12/13' },
        { sin: '8/17', mult: 289, ans: 225, text: 'sin(α) = 8/17' }
      ];
      const item = randPick(triplets);
      return {
        question_uz: `Agar ${item.text} boʻlsa, ${item.mult} · cos²(α) ifodaning qiymatini toping:`,
        answer: item.ans,
        steps_uz: [
          `Asosiy ayniyat: sin²(α) + cos²(α) = 1`,
          `cos²(α) = 1 - sin²(α)`,
          `${item.mult} · cos²(α) = ${item.ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${item.mult} · cos²(α) qiymatini toping:`,
            step_answer: item.ans,
            explanation_uz: `Natija: ${item.ans}`
          }
        ],
        distractors: [item.mult - item.ans, item.mult, item.ans + 5]
      };
    },
    (difficulty = 'orta') => {
      const k = randInt(3, 9);
      const extra = randInt(1, 6);
      const ans = k + extra;
      return {
        question_uz: `Ifodani soddalashtirib qiymatini hisoblang: ${k}·sin²(α) + ${k}·cos²(α) + ${extra} = ?`,
        answer: ans,
        steps_uz: [
          `${k} ni qavsdan tashqariga chiqaramiz: ${k} · (sin²α + cos²α) + ${extra}`,
          `sin²α + cos²α = 1 boʻlgani uchun: ${k} · 1 + ${extra} = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `sin²(α) + cos²(α) qiymati nechaga teng?`,
            step_answer: 1,
            explanation_uz: `Asosiy trigonometrik ayniyatga koʻra: 1`
          },
          {
            step_prompt_uz: `${k} · 1 + ${extra} = ?`,
            step_answer: ans,
            explanation_uz: `${k} + ${extra} = ${ans}`
          }
        ],
        distractors: [k, extra, ans + 2]
      };
    }
  ],

  // 13. tg va ctg ko'paytmasi: tg(x) * ctg(x) = 1
  alg_trig_tg_ctg: [
    (difficulty = 'orta') => {
      const tg = randPick([2, 4, 5, 8]);
      const factor = tg * randInt(2, 5);
      const ans = factor / tg;
      return {
        question_uz: `Agar tg(α) = ${tg} boʻlsa, ${factor} · ctg(α) ifodaning qiymatini hisoblang:`,
        answer: ans,
        steps_uz: [
          `tg(α) · ctg(α) = 1 boʻlgani sababli: ctg(α) = 1 / tg(α) = 1 / ${tg}`,
          `${factor} · (1 / ${tg}) = ${factor} / ${tg} = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${factor} sonini ${tg} ga boʻling:`,
            step_answer: ans,
            explanation_uz: `${factor} / ${tg} = ${ans}`
          }
        ],
        distractors: [ans * tg, tg, ans + 1]
      };
    },
    (difficulty = 'orta') => {
      const c = randInt(4, 12);
      const add = randInt(2, 8);
      const ans = c + add;
      return {
        question_uz: `Hisoblang: ${c} · tg(α) · ctg(α) + ${add} = ?`,
        answer: ans,
        steps_uz: [
          `tg(α) · ctg(α) = 1 ga teng.`,
          `${c} · 1 + ${add} = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `tg(α) · ctg(α) qiymati nechaga teng?`,
            step_answer: 1,
            explanation_uz: `tg(α) · ctg(α) = 1`
          }
        ],
        distractors: [c, add, ans + 2]
      };
    }
  ],

  // 14. Ikkilangan burchak sinusi: sin(2x) = 2sin(x)cos(x)
  alg_trig_ikkilangan_sinus: [
    (difficulty = 'orta') => {
      const angles = [
        { a: 15, doubleA: 30, ans: 0.5 },
        { a: 45, doubleA: 90, ans: 1 },
        { a: 75, doubleA: 150, ans: 0.5 }
      ];
      const item = randPick(angles);
      return {
        question_uz: `Hisoblang: 2 · sin(${item.a}°) · cos(${item.a}°) = ? (Oʻnli kasr koʻrinishida)`,
        answer: item.ans,
        steps_uz: [
          `2 · sin(α) · cos(α) = sin(2α) formulani qoʻllaymiz.`,
          `2 · sin(${item.a}°) · cos(${item.a}°) = sin(${item.doubleA}°) = ${item.ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `2 · ${item.a}° burchak necha gradus boʻladi?`,
            step_answer: item.doubleA,
            explanation_uz: `2 · ${item.a}° = ${item.doubleA}°`
          },
          {
            step_prompt_uz: `sin(${item.doubleA}°) ning qiymatini oʻnli kasrda yozing:`,
            step_answer: item.ans,
            explanation_uz: `Natija: ${item.ans}`
          }
        ],
        distractors: [item.ans * 2, item.ans / 2, 0]
      };
    },
    (difficulty = 'orta') => {
      const prod = randPick([0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45]);
      const ans = Number((2 * prod).toFixed(2));
      return {
        question_uz: `Agar sin(α) · cos(α) = ${prod} boʻlsa, sin(2α) ning qiymatini toping:`,
        answer: ans,
        steps_uz: [
          `sin(2α) = 2 · sin(α) · cos(α) formulaga koʻra:`,
          `sin(2α) = 2 · ${prod} = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `2 · ${prod} koʻpaytmasini hisoblang:`,
            step_answer: ans,
            explanation_uz: `2 · ${prod} = ${ans}`
          }
        ],
        distractors: [prod, ans / 2, ans + 0.1]
      };
    }
  ],

  // 15. Ikkilangan burchak kosinusi: cos(2x) = cos^2(x) - sin^2(x) = 2cos^2(x) - 1
  alg_trig_ikkilangan_kosinus: [
    (difficulty = 'orta') => {
      const cosVal = randPick([0.6, 0.7, 0.8, 0.9]);
      const cosSq = Number((cosVal * cosVal).toFixed(2));
      const ans = Number((2 * cosSq - 1).toFixed(2));
      return {
        question_uz: `Agar cos(α) = ${cosVal} boʻlsa, cos(2α) = 2cos²(α) - 1 formuladan foydalanib uning qiymatini hisoblang:`,
        answer: ans,
        steps_uz: [
          `cos²(α) = ${cosVal}² = ${cosSq}`,
          `cos(2α) = 2 · ${cosSq} - 1 = ${Number((2 * cosSq).toFixed(2))} - 1 = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${cosVal} sonining kvadratini hisoblang:`,
            step_answer: cosSq,
            explanation_uz: `${cosVal}² = ${cosSq}`
          },
          {
            step_prompt_uz: `2 · ${cosSq} - 1 = ?`,
            step_answer: ans,
            explanation_uz: `Natija: ${ans}`
          }
        ],
        distractors: [cosVal, 1 - cosSq, ans + 0.1]
      };
    },
    (difficulty = 'orta') => {
      const sinVal = randPick([0.2, 0.3, 0.4, 0.5, 0.6]);
      const sinSq = Number((sinVal * sinVal).toFixed(2));
      const ans = Number((1 - 2 * sinSq).toFixed(2));
      return {
        question_uz: `Agar sin(α) = ${sinVal} boʻlsa, cos(2α) = 1 - 2sin²(α) formuladan foydalanib uning qiymatini hisoblang:`,
        answer: ans,
        steps_uz: [
          `sin²(α) = ${sinVal}² = ${sinSq}`,
          `cos(2α) = 1 - 2 · ${sinSq} = 1 - ${Number((2 * sinSq).toFixed(2))} = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `1 - 2 · ${sinSq} ayirmani hisoblang:`,
            step_answer: ans,
            explanation_uz: `Natija: ${ans}`
          }
        ],
        distractors: [sinSq, ans + 0.2, 0.5]
      };
    }
  ],

  // 16. Burchaklar yig'indisi sinusi: sin(a + b) = sin(a)cos(b) + cos(a)sin(b)
  alg_trig_yigindi_sinus: [
    (difficulty = 'orta') => {
      const pairs = [
        { a: 20, b: 10, sum: 30, ans: 0.5 },
        { a: 50, b: 40, sum: 90, ans: 1 },
        { a: 70, b: 20, sum: 90, ans: 1 },
        { a: 15, b: 15, sum: 30, ans: 0.5 },
        { a: 60, b: 30, sum: 90, ans: 1 }
      ];
      const item = randPick(pairs);
      return {
        question_uz: `Hisoblang: sin(${item.a}°) · cos(${item.b}°) + cos(${item.a}°) · sin(${item.b}°) = ?`,
        answer: item.ans,
        steps_uz: [
          `sin(α + β) = sin(α)cos(β) + cos(α)sin(β) formulani qoʻllaymiz.`,
          `sin(${item.a}° + ${item.b}°) = sin(${item.sum}°) = ${item.ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${item.a}° + ${item.b}° yigʻindisini hisoblang:`,
            step_answer: item.sum,
            explanation_uz: `${item.a}° + ${item.b}° = ${item.sum}°`
          },
          {
            step_prompt_uz: `sin(${item.sum}°) qiymatini yozing:`,
            step_answer: item.ans,
            explanation_uz: `Natija: ${item.ans}`
          }
        ],
        distractors: [0, 2, item.ans + 0.25]
      };
    },
    (difficulty = 'orta') => {
      const pairs = [
        { a: 25, b: 35, ans: 60 },
        { a: 10, b: 20, ans: 30 },
        { a: 40, b: 50, ans: 90 },
        { a: 15, b: 30, ans: 45 },
        { a: 50, b: 70, ans: 120 }
      ];
      const item = randPick(pairs);
      return {
        question_uz: `sin(${item.a}°)cos(${item.b}°) + cos(${item.a}°)sin(${item.b}°) = sin(X) boʻlsa, X burchakni gradusda toping:`,
        answer: item.ans,
        steps_uz: [
          `sin(α)cos(β) + cos(α)sin(β) = sin(α + β)`,
          `X = ${item.a}° + ${item.b}° = ${item.ans}°`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${item.a} + ${item.b} = ?`,
            step_answer: item.ans,
            explanation_uz: `${item.a} + ${item.b} = ${item.ans}`
          }
        ],
        distractors: [90, 45, 30]
      };
    }
  ],

  // 17. Darajani pasaytirish: sin^2(x) = (1 - cos(2x)) / 2
  alg_trig_daraja_pasaytirish: [
    (difficulty = 'orta') => {
      const cos2x = randPick([0.2, 0.4, 0.6, 0.8]);
      const ans = Number(((1 - cos2x) / 2).toFixed(2));
      return {
        question_uz: `Agar cos(2α) = ${cos2x} boʻlsa, darajani pasaytirish formulasidan foydalanib sin²(α) ni toping:`,
        answer: ans,
        steps_uz: [
          `sin²(α) = (1 - cos(2α)) / 2 formulani qoʻllaymiz.`,
          `sin²(α) = (1 - ${cos2x}) / 2 = ${Number((1 - cos2x).toFixed(2))} / 2 = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `1 - ${cos2x} ayirmani hisoblang:`,
            step_answer: Number((1 - cos2x).toFixed(2)),
            explanation_uz: `1 - ${cos2x} = ${Number((1 - cos2x).toFixed(2))}`
          },
          {
            step_prompt_uz: `${Number((1 - cos2x).toFixed(2))} sonini 2 ga boʻling:`,
            step_answer: ans,
            explanation_uz: `Natija: ${ans}`
          }
        ],
        distractors: [cos2x, 1 - cos2x, ans + 0.1]
      };
    },
    (difficulty = 'orta') => {
      const cos2x = randPick([0.2, 0.4, 0.6, 0.8]);
      const ans = Number(((1 + cos2x) / 2).toFixed(2));
      return {
        question_uz: `Agar cos(2α) = ${cos2x} boʻlsa, cos²(α) = (1 + cos(2α)) / 2 ning qiymatini toping:`,
        answer: ans,
        steps_uz: [
          `cos²(α) = (1 + cos(2α)) / 2`,
          `cos²(α) = (1 + ${cos2x}) / 2 = ${Number((1 + cos2x).toFixed(2))} / 2 = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `1 + ${cos2x} = ?`,
            step_answer: Number((1 + cos2x).toFixed(2)),
            explanation_uz: `1 + ${cos2x} = ${Number((1 + cos2x).toFixed(2))}`
          }
        ],
        distractors: [cos2x, ans - 0.2, 1]
      };
    }
  ],

  // 18. Darajali funksiya hosilasi: (x^n)' = n * x^(n - 1)
  alg_hosila_daraja: [
    (difficulty = 'orta') => {
      let n = randInt(2, 4);
      let x0 = randInt(1, 3);
      if (difficulty === 'qiyin') { n = randInt(3, 5); x0 = randInt(2, 4); }
      const ans = n * Math.pow(x0, n - 1);
      return {
        question_uz: `f(x) = x^${n} funksiyaning x = ${x0} nuqtadagi hosilasi f'(${x0}) ni hisoblang:`,
        answer: ans,
        steps_uz: [
          `(xⁿ)' = n · xⁿ⁻¹ formulaga koʻra: f'(x) = ${n}x^${n - 1}`,
          `x = ${x0} da: f'(${x0}) = ${n} · ${x0}^${n - 1} = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `Hosila formulasidagi koeffitsiyent n ni toping:`,
            step_answer: n,
            explanation_uz: `(x^${n})' = ${n}x^${n - 1}`
          },
          {
            step_prompt_uz: `${n} · ${x0}^${n - 1} qiymatini hisoblang:`,
            step_answer: ans,
            explanation_uz: `${n} · ${Math.pow(x0, n - 1)} = ${ans}`
          }
        ],
        mistakePatterns: [
          {
            id: 'forgot_exponent_decrement',
            hint_uz: 'Hosilada daraja 1 ga kamayadi: (xⁿ)\' = n·xⁿ⁻¹.',
            check: (val) => Math.abs(val - Math.pow(x0, n)) < 0.01
          }
        ],
        distractors: [Math.pow(x0, n), ans + n, ans - 1]
      };
    },
    (difficulty = 'orta') => {
      const a = randInt(2, 5);
      const b = randInt(1, 6);
      const x0 = randInt(1, 4);
      const ans = 2 * a * x0 + b;
      return {
        question_uz: `f(x) = ${a}x² + ${b}x funksiya uchun f'(${x0}) hosila qiymatini hisoblang:`,
        answer: ans,
        steps_uz: [
          `f'(x) = (${a}x²)' + (${b}x)' = ${2 * a}x + ${b}`,
          `x = ${x0} da: ${2 * a} · ${x0} + ${b} = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `2 · ${a} · ${x0} koʻpaytmasini hisoblang:`,
            step_answer: 2 * a * x0,
            explanation_uz: `2 · ${a} · ${x0} = ${2 * a * x0}`
          },
          {
            step_prompt_uz: `${2 * a * x0} + ${b} = ?`,
            step_answer: ans,
            explanation_uz: `${2 * a * x0} + ${b} = ${ans}`
          }
        ],
        distractors: [ans - b, 2 * a * x0, ans + 2]
      };
    }
  ],

  // 19. Funksiyalar ko'paytmasi hosilasi: (u * v)' = u'v + uv'
  alg_hosila_kopaytma: [
    (difficulty = 'orta') => {
      const u = randInt(2, 5);
      const du = randInt(1, 4);
      const v = randInt(2, 6);
      const dv = randInt(1, 4);
      const ans = du * v + u * dv;
      return {
        question_uz: `Agar u(2) = ${u}, u'(2) = ${du}, v(2) = ${v}, v'(2) = ${dv} boʻlsa, (u · v)' koʻpaytmaning x = 2 dagi hosilasini hisoblang:`,
        answer: ans,
        steps_uz: [
          `(u · v)' = u' · v + u · v' formulani qoʻllaymiz.`,
          `= (${du} · ${v}) + (${u} · ${dv}) = ${du * v} + ${u * dv} = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `u' · v = ${du} · ${v} = ?`,
            step_answer: du * v,
            explanation_uz: `${du} · ${v} = ${du * v}`
          },
          {
            step_prompt_uz: `u · v' = ${u} · ${dv} = ?`,
            step_answer: u * dv,
            explanation_uz: `${u} · ${dv} = ${u * dv}`
          }
        ],
        mistakePatterns: [
          {
            id: 'multiplied_derivatives_directly',
            hint_uz: 'Koʻpaytma hosilasi u\' · v\' ga teng emas! u\'v + uv\' boʻlishi kerak.',
            check: (val) => Math.abs(val - (du * dv)) < 0.01
          }
        ],
        distractors: [du * dv, u * v, ans + 2]
      };
    },
    (difficulty = 'orta') => {
      const a = randInt(1, 4);
      const b = randInt(1, 5);
      const x0 = 1;
      const ans = 4 * a * x0 + 2 * b;
      return {
        question_uz: `f(x) = (${a}x + ${b}) · (2x) funksiyaning x = 1 nuqtadagi hosilasi f'(1) ni hisoblang:`,
        answer: ans,
        steps_uz: [
          `u = ${a}x + ${b} => u' = ${a}, v = 2x => v' = 2`,
          `f'(x) = ${a} · (2x) + (${a}x + ${b}) · 2`,
          `x = 1 da: ${a * 2} + (${a + b}) · 2 = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `f'(1) yakuniy qiymatini toping:`,
            step_answer: ans,
            explanation_uz: `Natija: ${ans}`
          }
        ],
        distractors: [ans - 2, ans + 2, 2 * a + b]
      };
    }
  ],

  // 20. Trigonometrik funksiyalar hosilasi: (sin x)' = cos x, (cos x)' = -sin x
  alg_hosila_trig_sin: [
    (difficulty = 'orta') => {
      const a = randInt(2, 9);
      return {
        question_uz: `f(x) = ${a} · sin(x) funksiyaning x = 0 nuqtadagi hosilasi f'(0) ni hisoblang:`,
        answer: a,
        steps_uz: [
          `(sin x)' = cos x formulaga koʻra: f'(x) = ${a} · cos(x)`,
          `x = 0 boʻlganda: cos(0) = 1`,
          `f'(0) = ${a} · 1 = ${a}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `cos(0) qiymati nechaga teng?`,
            step_answer: 1,
            explanation_uz: `cos(0) = 1`
          },
          {
            step_prompt_uz: `${a} · 1 = ?`,
            step_answer: a,
            explanation_uz: `${a} · 1 = ${a}`
          }
        ],
        mistakePatterns: [
          {
            id: 'confused_with_sin_zero',
            hint_uz: 'x = 0 da cos(0) = 1 ga teng, 0 emas.',
            check: (val) => Math.abs(val) < 0.01
          }
        ],
        distractors: [0, -a, a + 1]
      };
    },
    (difficulty = 'orta') => {
      const a = randInt(2, 6);
      const b = randInt(2, 9);
      const ans = b; // f'(0) = -a*sin(0) + b = b
      return {
        question_uz: `f(x) = ${a} · cos(x) + ${b}x funksiyaning x = 0 nuqtadagi hosilasi f'(0) ni hisoblang:`,
        answer: ans,
        steps_uz: [
          `f'(x) = -${a} · sin(x) + ${b}`,
          `x = 0 boʻlganda: sin(0) = 0`,
          `f'(0) = -${a} · 0 + ${b} = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `f'(0) qiymatini hisoblang:`,
            step_answer: ans,
            explanation_uz: `f'(0) = ${ans}`
          }
        ],
        distractors: [a + b, b - a, 0]
      };
    }
  ],

  // 21. Darajali funksiya boshlang'ich funksiyasi: int x^n dx = x^(n + 1) / (n + 1) + C
  alg_integral_daraja: [
    (difficulty = 'orta') => {
      const n = randInt(1, 3);
      const coeff = n + 1;
      const xVal = randInt(2, 4);
      const ans = Math.pow(xVal, coeff);
      return {
        question_uz: `f(x) = ${coeff}x^${n} funksiyaning boshlangʻich funksiyasi F(x) uchun (C = 0 deb oling) F(${xVal}) qiymatini hisoblang:`,
        answer: ans,
        steps_uz: [
          `∫ ${coeff}x^${n} dx = ${coeff} · (x^${n + 1} / ${n + 1}) + C = x^${coeff}`,
          `x = ${xVal} da: F(${xVal}) = ${xVal}^${coeff} = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `Boshlangʻich funksiya x^k ning darajasi k ni toping (${n} + 1 = ?):`,
            step_answer: coeff,
            explanation_uz: `${n} + 1 = ${coeff}`
          },
          {
            step_prompt_uz: `${xVal}^${coeff} qiymatini hisoblang:`,
            step_answer: ans,
            explanation_uz: `${xVal}^${coeff} = ${ans}`
          }
        ],
        distractors: [ans / 2, ans * 2, ans + 2]
      };
    },
    (difficulty = 'orta') => {
      const a = randInt(3, 8);
      const x = randInt(2, 6);
      const ans = a * x;
      return {
        question_uz: `f(x) = ${a} oʻzgarmas funksiyaning boshlangʻich funksiyasi F(x) = ${a}x uchun F(${x}) ni hisoblang:`,
        answer: ans,
        steps_uz: [
          `∫ a dx = ax + C formulaga koʻra: F(x) = ${a}x`,
          `F(${x}) = ${a} · ${x} = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${a} · ${x} = ?`,
            step_answer: ans,
            explanation_uz: `${a} · ${x} = ${ans}`
          }
        ],
        distractors: [ans + a, ans - a, a + x]
      };
    }
  ],

  // 22. Nyuton-Leybnits formulasi: int_a^b f(x) dx = F(b) - F(a)
  alg_integral_nyuton_leybnits: [
    (difficulty = 'orta') => {
      const b = randInt(2, 6);
      const ans = b * b;
      return {
        question_uz: `Nyuton-Leybnits formulasi yordamida aniq integralni hisoblang: ∫₀^${b} 2x dx = ?`,
        answer: ans,
        steps_uz: [
          `2x ning boshlangʻich funksiyasi F(x) = x²`,
          `F(${b}) - F(0) = ${b}² - 0² = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `2x funksiyasining boshlangʻich funksiyasi x^k boʻlsa, k ni toping:`,
            step_answer: 2,
            explanation_uz: `∫ 2x dx = x²`
          },
          {
            step_prompt_uz: `${b}² qiymatini hisoblang:`,
            step_answer: ans,
            explanation_uz: `${b}² = ${ans}`
          }
        ],
        distractors: [ans * 2, ans + 2, b]
      };
    },
    (difficulty = 'orta') => {
      const b = randInt(2, 5);
      const ans = b ** 3;
      return {
        question_uz: `Aniq integralni hisoblang: ∫₀^${b} 3x² dx = ?`,
        answer: ans,
        steps_uz: [
          `3x² ning boshlangʻich funksiyasi F(x) = x³`,
          `F(${b}) - F(0) = ${b}³ - 0 = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${b} sonining kubini hisoblang:`,
            step_answer: ans,
            explanation_uz: `${b}³ = ${ans}`
          }
        ],
        distractors: [ans / 2, ans + 3, b * 3]
      };
    }
  ],

  // 23. Permutatsiya: P_n = n!
  alg_komb_permutatsiya: [
    (difficulty = 'orta') => {
      const n = randPick([3, 4, 5, 6]);
      const ans = factorial(n);
      return {
        question_uz: `P_${n} = ${n}! oʻrinlashtirishlar (permutatsiya) sonini hisoblang:`,
        answer: ans,
        steps_uz: [
          `P_n = n! = 1 · 2 · 3 · ... · n formulani qoʻllaymiz.`,
          `P_${n} = ${Array.from({ length: n }, (_, i) => i + 1).join(' · ')} = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${n}! qiymatini hisoblang:`,
            step_answer: ans,
            explanation_uz: `${n}! = ${ans}`
          }
        ],
        distractors: [ans + 6, ans - 6, n * n]
      };
    },
    (difficulty = 'orta') => {
      const n = randPick([3, 4, 5, 6]);
      const ans = factorial(n);
      return {
        question_uz: `${n} ta turli kitobni javonga necha xil usulda ketma-ket taxlash mumkin?`,
        answer: ans,
        steps_uz: [
          `Turli n ta elementning oʻrin almashishlar soni P_n = n! boʻladi.`,
          `${n}! = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${n}! faktorialni hisoblang:`,
            step_answer: ans,
            explanation_uz: `${n}! = ${ans}`
          }
        ],
        distractors: [n * 2, n * (n - 1), ans + 4]
      };
    }
  ],

  // 24. Kombinatsiya: C_n^k = n! / (k! * (n - k)!)
  alg_komb_kombinatsiya: [
    (difficulty = 'orta') => {
      const cases = [
        { n: 5, k: 2, ans: 10 },
        { n: 6, k: 2, ans: 15 },
        { n: 4, k: 2, ans: 6 },
        { n: 5, k: 3, ans: 10 },
        { n: 7, k: 2, ans: 21 },
        { n: 6, k: 3, ans: 20 },
        { n: 7, k: 3, ans: 35 }
      ];
      const item = randPick(cases);
      return {
        question_uz: `Guruhlashlar sonini hisoblang: C_${item.n}^${item.k} = ?`,
        answer: item.ans,
        steps_uz: [
          `C_n^k = n! / (k! · (n - k)!) formulani qoʻllaymiz.`,
          `C_${item.n}^${item.k} = ${item.n}! / (${item.k}! · ${item.n - item.k}!) = ${item.ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `C_${item.n}^${item.k} qiymatini hisoblang:`,
            step_answer: item.ans,
            explanation_uz: `Natija: ${item.ans}`
          }
        ],
        distractors: [item.ans + 2, item.ans - 2, item.n * item.k]
      };
    },
    (difficulty = 'orta') => {
      const n = randPick([4, 5, 6, 7, 8]);
      const k = 2;
      const ans = (n * (n - 1)) / 2;
      return {
        question_uz: `${n} nafar talabadan 2 nafarini olimpiada uchun necha xil usulda tanlab olish mumkin?`,
        answer: ans,
        steps_uz: [
          `Guruhlashlar formulasi: C_n² = n(n - 1) / 2`,
          `C_${n}² = ${n} · ${n - 1} / 2 = ${n * (n - 1)} / 2 = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${n} · ${n - 1} koʻpaytmasini 2 ga boʻling:`,
            step_answer: ans,
            explanation_uz: `${n * (n - 1)} / 2 = ${ans}`
          }
        ],
        distractors: [n * 2, n * (n - 1), ans + 1]
      };
    }
  ],

  // 25. Klassik ehtimollik: P(A) = m / n
  alg_ehtimollik_klassik: [
    (difficulty = 'orta') => {
      const cases = [
        { w: 3, b: 7, total: 10, ans: 0.3 },
        { w: 1, b: 4, total: 5, ans: 0.2 },
        { w: 4, b: 6, total: 10, ans: 0.4 },
        { w: 2, b: 8, total: 10, ans: 0.2 },
        { w: 5, b: 5, total: 10, ans: 0.5 },
        { w: 3, b: 2, total: 5, ans: 0.6 }
      ];
      const item = randPick(cases);
      return {
        question_uz: `Qutida ${item.w} ta oq va ${item.b} ta qora shar bor. Tavakkaliga olingan 1 ta sharning oq boʻlish ehtimolligini toping (oʻnli kasrda):`,
        answer: item.ans,
        steps_uz: [
          `Klassik ehtimollik formulasi: P(A) = m / n`,
          `Jami sharlar soni n = ${item.w} + ${item.b} = ${item.total}`,
          `Qulay imkoniyatlar m = ${item.w}`,
          `P(A) = ${item.w} / ${item.total} = ${item.ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `Jami sharlar sonini toping (${item.w} + ${item.b} = ?):`,
            step_answer: item.total,
            explanation_uz: `${item.w} + ${item.b} = ${item.total}`
          },
          {
            step_prompt_uz: `${item.w} sonini ${item.total} ga boʻling:`,
            step_answer: item.ans,
            explanation_uz: `${item.w} / ${item.total} = ${item.ans}`
          }
        ],
        mistakePatterns: [
          {
            id: 'divided_by_wrong_count',
            hint_uz: 'Ehtimollikni hisoblashda jami sharlar soni (oq + qora) maxrajda boʻladi.',
            check: (val) => Math.abs(val - (item.w / item.b)) < 0.01
          }
        ],
        distractors: [item.ans + 0.1, 1 - item.ans, item.w / item.b]
      };
    },
    (difficulty = 'orta') => {
      const diceCases = [
        { desc: 'juft son (2, 4, 6)', m: 3, ans: 0.5 },
        { desc: 'toq son (1, 3, 5)', m: 3, ans: 0.5 },
        { desc: '4 dan katta son (5, 6)', m: 2, ans: 0.33 },
        { desc: '3 ga karrali son (3, 6)', m: 2, ans: 0.33 },
        { desc: '1 soni', m: 1, ans: 0.17 },
        { desc: '6 soni', m: 1, ans: 0.17 }
      ];
      const item = randPick(diceCases);
      return {
        question_uz: `Oddiy oʻyin suyagi (zarcha) bir marta tashlanganda ${item.desc} tushish ehtimolligini toping (oʻnli kasrda):`,
        answer: item.ans,
        steps_uz: [
          `Jami yoqlar soni n = 6.`,
          `Qulay hollar soni m = ${item.m}.`,
          `P = ${item.m} / 6 ≈ ${item.ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `Qulay hollar soni nechta?`,
            step_answer: item.m,
            explanation_uz: `m = ${item.m}`
          },
          {
            step_prompt_uz: `${item.m} : 6 ehtimollikni oʻnli kasrda yozing:`,
            step_answer: item.ans,
            explanation_uz: `P = ${item.ans}`
          }
        ],
        distractors: [0.5, 0.25, 0.6]
      };
    }
  ]
};
