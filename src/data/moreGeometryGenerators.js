import { randInt, randPick } from './generators.js';

export const moreGeometryGenerators = {
  // 1. Muntazam uchburchak yuzi: S = (a^2 * sqrt(3)) / 4
  geom_muntazam_uchburchak: [
    (difficulty = 'orta') => {
      const a = randPick([2, 4, 6, 8, 10, 12]);
      const k = (a * a) / 4;
      return {
        question_uz: `Tomoni a = ${a} sm boʻlgan muntazam (teng tomonli) uchburchakning yuzi S = k√3 sm² boʻlsa, k koeffitsiyentini toping:`,
        answer: k,
        steps_uz: [
          `Muntazam uchburchak yuzi: S = (a²√3) / 4`,
          `a = ${a} boʻlganda: S = (${a}²√3) / 4 = (${a * a}√3) / 4 = ${k}√3`,
          `Demak, k = ${k}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${a} ning kvadratini hisoblang:`,
            step_answer: a * a,
            explanation_uz: `${a}² = ${a * a}`
          },
          {
            step_prompt_uz: `${a * a} sonini 4 ga boʻling:`,
            step_answer: k,
            explanation_uz: `${a * a} / 4 = ${k}`
          }
        ],
        mistakePatterns: [
          {
            id: 'forgot_divide_by_4',
            hint_uz: 'Muntazam uchburchak yuzi formulasida maxrajda 4 bor: a²√3 / 4.',
            check: (val) => Math.abs(val - (a * a)) < 0.01
          }
        ],
        distractors: [a * a, k * 2, k + 2]
      };
    },
    (difficulty = 'orta') => {
      const a = randPick([4, 6, 8, 10, 12, 14]);
      const P = 3 * a;
      const k = (a * a) / 4;
      return {
        question_uz: `Perimetri ${P} sm boʻlgan muntazam uchburchak yuzi S = k√3 sm² boʻlsa, k sonini toping:`,
        answer: k,
        steps_uz: [
          `Muntazam uchburchak tomoni: a = P / 3 = ${P} / 3 = ${a} sm`,
          `Yuzi: S = (${a}²√3) / 4 = ${k}√3`,
          `k = ${k}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `Uchburchak tomoni a ni toping (${P} / 3 = ?):`,
            step_answer: a,
            explanation_uz: `a = ${P} / 3 = ${a}`
          },
          {
            step_prompt_uz: `k = a² / 4 = ${a}² / 4 = ?`,
            step_answer: k,
            explanation_uz: `k = ${k}`
          }
        ],
        distractors: [P, a * a, k + 3]
      };
    }
  ],

  // 2. Ikki tomon va burchak orqali uchburchak yuzi: S = 0.5 * a * b * sin(alpha)
  geom_uchburchak_sinus: [
    (difficulty = 'orta') => {
      const a = randPick([4, 6, 8, 10, 12]);
      const b = randPick([4, 6, 8, 10, 14]);
      const ans = 0.25 * a * b; // sin(30) = 0.5 => 0.5 * 0.5 * a * b
      return {
        question_uz: `Uchburchakning ikki tomoni ${a} sm va ${b} sm, ular orasidagi burchak 30° ga teng. Uchburchak yuzi S ni hisoblang (sm²):`,
        answer: ans,
        steps_uz: [
          `S = (1/2) · a · b · sin(α) formulani qoʻllaymiz.`,
          `sin(30°) = 0.5`,
          `S = 0.5 · ${a} · ${b} · 0.5 = ${ans} sm²`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `a · b koʻpaytmasini hisoblang (${a} · ${b} = ?):`,
            step_answer: a * b,
            explanation_uz: `${a} · ${b} = ${a * b}`
          },
          {
            step_prompt_uz: `S = 0.25 · ${a * b} = ?`,
            step_answer: ans,
            explanation_uz: `S = ${ans}`
          }
        ],
        mistakePatterns: [
          {
            id: 'forgot_half_or_sin',
            hint_uz: 'S = 0.5 · a · b · sin(α) formulasidagi koeffitsiyentlarni toʻliq hisoblang.',
            check: (val) => Math.abs(val - (a * b)) < 0.01
          }
        ],
        distractors: [a * b, 0.5 * a * b, ans + 2]
      };
    },
    (difficulty = 'orta') => {
      const a = randPick([6, 8, 10, 12]);
      const b = randPick([4, 6, 8, 10]);
      const ans = 0.25 * a * b; // sin(150) = 0.5
      return {
        question_uz: `Uchburchakning ikki tomoni ${a} sm va ${b} sm, ular orasidagi burchak 150° boʻlsa, uchburchak yuzini toping:`,
        answer: ans,
        steps_uz: [
          `sin(150°) = sin(180° - 30°) = sin(30°) = 0.5`,
          `S = 0.5 · ${a} · ${b} · 0.5 = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `sin(150°) qiymatini oʻnli kasrda yozing:`,
            step_answer: 0.5,
            explanation_uz: `sin(150°) = 0.5`
          },
          {
            step_prompt_uz: `Uchburchak yuzini toping:`,
            step_answer: ans,
            explanation_uz: `S = ${ans}`
          }
        ],
        distractors: [ans * 2, ans + 4, a * b]
      };
    }
  ],

  // 3. Sinuslar teoremasi: a / sin(A) = 2R
  geom_sinuslar_teoremasi: [
    (difficulty = 'orta') => {
      const a = randPick([6, 8, 10, 12, 14, 16, 18, 20]);
      const ansR = a;
      return {
        question_uz: `Uchburchakda a = ${a} sm li tomon qarshisida 30° li burchak yotadi. Ushbu uchburchakka tashqi chizilgan aylana radiusi R ni toping (sm):`,
        answer: ansR,
        steps_uz: [
          `Sinuslar teoremasiga koʻra: a / sin(A) = 2R`,
          `${a} / sin(30°) = 2R => ${a} / 0.5 = 2R => ${2 * a} = 2R`,
          `R = ${ansR} sm`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `a / sin(30°) nisbatni toping (${a} / 0.5 = ?):`,
            step_answer: 2 * a,
            explanation_uz: `${a} / 0.5 = ${2 * a}`
          },
          {
            step_prompt_uz: `Radius R = ${2 * a} / 2 = ?`,
            step_answer: ansR,
            explanation_uz: `R = ${ansR}`
          }
        ],
        mistakePatterns: [
          {
            id: 'confused_2R_with_R',
            hint_uz: 'a / sin(A) nisbat 2R (diametr) ga teng, radius R ni topish uchun 2 ga boʻlish kerak.',
            check: (val) => Math.abs(val - (2 * a)) < 0.01
          }
        ],
        distractors: [2 * a, a / 2, ansR + 3]
      };
    },
    (difficulty = 'orta') => {
      const R = randInt(5, 20);
      const a = R;
      return {
        question_uz: `Tashqi chizilgan aylana radiusi R = ${R} sm boʻlgan uchburchakda 30° li burchak qarshisidagi a tomon uzunligini toping (sm):`,
        answer: a,
        steps_uz: [
          `a = 2R · sin(A) formulani qoʻllaymiz.`,
          `a = 2 · ${R} · sin(30°) = 2 · ${R} · 0.5 = ${a} sm`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `2 · ${R} · 0.5 = ?`,
            step_answer: a,
            explanation_uz: `Natija: ${a}`
          }
        ],
        distractors: [2 * R, R / 2, R + 2]
      };
    }
  ],

  // 4. Kosinuslar teoremasi: c^2 = a^2 + b^2 - 2ab*cos(C)
  geom_kosinuslar_teoremasi: [
    (difficulty = 'orta') => {
      const cases = [
        { a: 3, b: 8, angle: 60, cSq: 49 },
        { a: 5, b: 8, angle: 60, cSq: 49 },
        { a: 5, b: 3, angle: 60, cSq: 19 },
        { a: 7, b: 8, angle: 60, cSq: 57 },
        { a: 4, b: 6, angle: 60, cSq: 28 },
        { a: 6, b: 10, angle: 60, cSq: 76 }
      ];
      const item = randPick(cases);
      return {
        question_uz: `Uchburchakda a = ${item.a} sm, b = ${item.b} sm va ular orasidagi burchak C = 60° boʻlsa, uchinchi tomonning kvadrati c² ni toping:`,
        answer: item.cSq,
        steps_uz: [
          `Kosinuslar teoremasi: c² = a² + b² - 2ab · cos(C)`,
          `cos(60°) = 0.5 boʻlgani uchun: c² = ${item.a}² + ${item.b}² - 2 · ${item.a} · ${item.b} · 0.5`,
          `c² = ${item.a * item.a} + ${item.b * item.b} - ${item.a * item.b} = ${item.cSq}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `a² + b² ni hisoblang (${item.a * item.a} + ${item.b * item.b} = ?):`,
            step_answer: item.a * item.a + item.b * item.b,
            explanation_uz: `${item.a}² + ${item.b}² = ${item.a * item.a + item.b * item.b}`
          },
          {
            step_prompt_uz: `c² = ${item.a * item.a + item.b * item.b} - ${item.a * item.b} = ?`,
            step_answer: item.cSq,
            explanation_uz: `c² = ${item.cSq}`
          }
        ],
        mistakePatterns: [
          {
            id: 'sign_error_cos',
            hint_uz: 'Kosinuslar teoremasida ayriladi: a² + b² - 2ab·cos(C).',
            check: (val) => Math.abs(val - (item.a * item.a + item.b * item.b + item.a * item.b)) < 0.01
          }
        ],
        distractors: [item.a * item.a + item.b * item.b, item.cSq + 4, item.cSq - 4]
      };
    },
    (difficulty = 'orta') => {
      const cases = [
        { a: 3, b: 8, angle: 60, ans: 7 },
        { a: 5, b: 8, angle: 60, ans: 7 },
        { a: 8, b: 5, angle: 60, ans: 7 },
        { a: 3, b: 5, angle: 120, ans: 7 },
        { a: 7, b: 8, angle: 120, ans: 13 }
      ];
      const item = randPick(cases);
      return {
        question_uz: `Uchburchakda a = ${item.a} sm, b = ${item.b} sm va ∠C = ${item.angle}° boʻlsa, uchinchi tomon c ni toping (sm):`,
        answer: item.ans,
        steps_uz: [
          `c² = a² + b² - 2ab · cos(${item.angle}°)`,
          `c² = ${item.ans * item.ans}`,
          `c = √${item.ans * item.ans} = ${item.ans} sm`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `c² ning qiymatini hisoblang:`,
            step_answer: item.ans * item.ans,
            explanation_uz: `c² = ${item.ans * item.ans}`
          },
          {
            step_prompt_uz: `c = √${item.ans * item.ans} = ?`,
            step_answer: item.ans,
            explanation_uz: `c = ${item.ans}`
          }
        ],
        distractors: [item.ans + 1, item.ans - 1, item.ans + 2]
      };
    }
  ],

  // 5. Parallelogramm yuzi: S = a * h_a
  geom_parallelogramm: [
    (difficulty = 'orta') => {
      const a = randInt(4, 15);
      const h = randInt(3, 12);
      const ans = a * h;
      return {
        question_uz: `Parallelogrammning asosi a = ${a} sm va unga tushirilgan balandligi h = ${h} sm. Uning yuzi S ni toping (sm²):`,
        answer: ans,
        steps_uz: [
          `Parallelogramm yuzi: S = a · h`,
          `S = ${a} · ${h} = ${ans} sm²`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${a} · ${h} koʻpaytmasini hisoblang:`,
            step_answer: ans,
            explanation_uz: `${a} · ${h} = ${ans}`
          }
        ],
        distractors: [ans / 2, ans + a, ans + h]
      };
    },
    (difficulty = 'orta') => {
      const a = randInt(5, 14);
      const h = randInt(4, 12);
      const S = a * h;
      return {
        question_uz: `Yuzi S = ${S} sm² va asosi a = ${a} sm boʻlgan parallelogrammning balandligi h ni toping (sm):`,
        answer: h,
        steps_uz: [
          `h = S / a formulaga koʻra:`,
          `h = ${S} / ${a} = ${h} sm`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${S} sonini ${a} ga boʻling:`,
            step_answer: h,
            explanation_uz: `${S} / ${a} = ${h}`
          }
        ],
        distractors: [h + 1, h - 1, h * 2]
      };
    }
  ],

  // 6. Ichki chizilgan aylana radiusi: r = S / p
  geom_ichki_aylana_radius: [
    (difficulty = 'orta') => {
      const cases = [
        { a: 6, b: 8, c: 10, S: 24, p: 12, r: 2 },
        { a: 5, b: 12, c: 13, S: 30, p: 15, r: 2 },
        { a: 9, b: 12, c: 15, S: 54, p: 18, r: 3 },
        { a: 8, b: 15, c: 17, S: 60, p: 20, r: 3 },
        { a: 12, b: 16, c: 20, S: 96, p: 24, r: 4 }
      ];
      const item = randPick(cases);
      return {
        question_uz: `Katetlari ${item.a} sm va ${item.b} sm boʻlgan toʻgʻri burchakli uchburchakka ichki chizilgan aylana radiusi r ni toping (sm):`,
        answer: item.r,
        steps_uz: [
          `Gipotenuza c = √(${item.a}² + ${item.b}²) = ${item.c} sm`,
          `Yarim perimetr: p = (${item.a} + ${item.b} + ${item.c}) / 2 = ${item.p} sm`,
          `Yuzi: S = (${item.a} · ${item.b}) / 2 = ${item.S} sm²`,
          `Radius: r = S / p = ${item.S} / ${item.p} = ${item.r} sm`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `Yarim perimetr p ni hisoblang:`,
            step_answer: item.p,
            explanation_uz: `p = ${item.p}`
          },
          {
            step_prompt_uz: `r = S / p = ${item.S} / ${item.p} = ?`,
            step_answer: item.r,
            explanation_uz: `r = ${item.r}`
          }
        ],
        mistakePatterns: [
          {
            id: 'used_full_perimeter',
            hint_uz: 'Ichki aylana radiusida toʻla perimetr emas, yarim perimetr p ishlatiladi: r = S/p.',
            check: (val) => Math.abs(val - (item.S / (item.p * 2))) < 0.01
          }
        ],
        distractors: [item.r + 1, item.r * 2, item.r + 2]
      };
    },
    (difficulty = 'orta') => {
      const r = randInt(2, 6);
      const p = randInt(10, 25);
      const S = r * p;
      return {
        question_uz: `Yuzi S = ${S} sm² va yarim perimetri p = ${p} sm boʻlgan uchburchakka ichki chizilgan aylana radiusi r ni hisoblang (sm):`,
        answer: r,
        steps_uz: [
          `r = S / p formulani qoʻllaymiz.`,
          `r = ${S} / ${p} = ${r} sm`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${S} : ${p} boʻlinmasini toping:`,
            step_answer: r,
            explanation_uz: `${S} / ${p} = ${r}`
          }
        ],
        distractors: [r + 1, r - 1, r * 2]
      };
    }
  ],

  // 7. Tashqi chizilgan aylana radiusi: to'g'ri burchakli uchburchakda R = c / 2
  geom_tashqi_aylana_radius: [
    (difficulty = 'orta') => {
      const c = randPick([10, 12, 14, 16, 18, 20, 22, 24]);
      const ans = c / 2;
      return {
        question_uz: `Gipotenuzasi c = ${c} sm boʻlgan toʻgʻri burchakli uchburchakka tashqi chizilgan aylana radiusi R ni toping (sm):`,
        answer: ans,
        steps_uz: [
          `Toʻgʻri burchakli uchburchakka tashqi chizilgan aylana markazi gipotenuzaning oʻrtasida yotadi.`,
          `R = c / 2 = ${c} / 2 = ${ans} sm`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${c} sonini 2 ga boʻling:`,
            step_answer: ans,
            explanation_uz: `${c} / 2 = ${ans}`
          }
        ],
        mistakePatterns: [
          {
            id: 'confused_radius_with_diameter',
            hint_uz: 'Gipotenuza tashqi aylana diametriga teng. Radius uning yarmi boʻladi (R = c/2).',
            check: (val) => Math.abs(val - c) < 0.01
          }
        ],
        distractors: [c, ans + 2, ans - 1]
      };
    },
    (difficulty = 'orta') => {
      const R = randInt(4, 18);
      const c = 2 * R;
      return {
        question_uz: `Toʻgʻri burchakli uchburchakka tashqi chizilgan aylana radiusi R = ${R} sm boʻlsa, uning gipotenuzasi uzunligini toping (sm):`,
        answer: c,
        steps_uz: [
          `c = 2R formulani qoʻllaymiz.`,
          `c = 2 · ${R} = ${c} sm`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `2 · ${R} = ?`,
            step_answer: c,
            explanation_uz: `2 · ${R} = ${c}`
          }
        ],
        distractors: [R, c + 2, c - 2]
      };
    }
  ],

  // 8. Doira sektori yuzi: S = (pi * R^2 * alpha) / 360
  geom_doira_sektori: [
    (difficulty = 'orta') => {
      const cases = [
        { R: 6, alpha: 60, k: 6 },
        { R: 12, alpha: 30, k: 12 },
        { R: 6, alpha: 90, k: 9 },
        { R: 12, alpha: 60, k: 24 },
        { R: 10, alpha: 36, k: 10 },
        { R: 6, alpha: 120, k: 12 },
        { R: 12, alpha: 90, k: 36 }
      ];
      const item = randPick(cases);
      return {
        question_uz: `Radiusi R = ${item.R} sm va markaziy burchagi α = ${item.alpha}° boʻlgan doira sektori yuzi S = kπ sm² boʻlsa, k sonini toping:`,
        answer: item.k,
        steps_uz: [
          `Doira sektori yuzi: S = (π · R² · α) / 360°`,
          `k = (${item.R}² · ${item.alpha}) / 360 = (${item.R * item.R} · ${item.alpha}) / 360 = ${item.k}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `R² = ${item.R}² ni hisoblang:`,
            step_answer: item.R * item.R,
            explanation_uz: `${item.R}² = ${item.R * item.R}`
          },
          {
            step_prompt_uz: `k = (${item.R * item.R} · ${item.alpha}) / 360 = ?`,
            step_answer: item.k,
            explanation_uz: `k = ${item.k}`
          }
        ],
        distractors: [item.k * 2, item.k + 3, item.R * 2]
      };
    },
    (difficulty = 'orta') => {
      const R = randPick([4, 6, 8, 10, 12, 14]);
      const k = (R * R) / 4;
      return {
        question_uz: `Radiusi R = ${R} sm boʻlgan chorak doira (α = 90°) sektori yuzi S = kπ sm² boʻlsa, k ni toping:`,
        answer: k,
        steps_uz: [
          `Chorak doira: S = (π · R²) / 4`,
          `k = ${R}² / 4 = ${R * R} / 4 = ${k}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${R}² / 4 = ?`,
            step_answer: k,
            explanation_uz: `${R * R} / 4 = ${k}`
          }
        ],
        distractors: [R * R, k * 2, k + 2]
      };
    }
  ],

  // 9. Kub hajmi va sirti: V = a^3, S = 6a^2
  geom_kub_hajmi: [
    (difficulty = 'orta') => {
      const a = randInt(2, 7);
      const ans = a ** 3;
      return {
        question_uz: `Qirrasi a = ${a} sm boʻlgan kubning hajmi V ni hisoblang (sm³):`,
        answer: ans,
        steps_uz: [
          `Kub hajmi: V = a³`,
          `V = ${a}³ = ${ans} sm³`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${a} ning kubini hisoblang:`,
            step_answer: ans,
            explanation_uz: `${a}³ = ${ans}`
          }
        ],
        mistakePatterns: [
          {
            id: 'squared_instead_of_cubed',
            hint_uz: 'Hajm hisoblashda qirra kubga oshiriladi (a³), kvadratga emas.',
            check: (val) => Math.abs(val - (a * a)) < 0.01
          }
        ],
        distractors: [a * a, 6 * a * a, ans + 4]
      };
    },
    (difficulty = 'orta') => {
      const a = randInt(2, 7);
      const ans = 6 * a * a;
      return {
        question_uz: `Qirrasi a = ${a} sm boʻlgan kubning toʻla sirti yuzi S = 6a² ni toping (sm²):`,
        answer: ans,
        steps_uz: [
          `Kubda 6 ta kvadrat yoq bor: S = 6a²`,
          `S = 6 · ${a}² = 6 · ${a * a} = ${ans} sm²`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `Bir yogʻining yuzi a² = ${a}² = ?`,
            step_answer: a * a,
            explanation_uz: `${a}² = ${a * a}`
          },
          {
            step_prompt_uz: `6 · ${a * a} = ?`,
            step_answer: ans,
            explanation_uz: `6 · ${a * a} = ${ans}`
          }
        ],
        distractors: [a ** 3, 4 * a * a, ans + 6]
      };
    }
  ],

  // 10. To'g'ri burchakli parallelepiped: V = abc, S = 2(ab + bc + ac)
  geom_parallelepiped: [
    (difficulty = 'orta') => {
      const a = randInt(2, 6);
      const b = randInt(2, 5);
      const c = randInt(2, 6);
      const ans = a * b * c;
      return {
        question_uz: `Oʻlchamlari ${a} sm, ${b} sm va ${c} sm boʻlgan toʻgʻri burchakli parallelepipedning hajmi V ni hisoblang (sm³):`,
        answer: ans,
        steps_uz: [
          `Parallelepiped hajmi: V = a · b · c`,
          `V = ${a} · ${b} · ${c} = ${ans} sm³`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${a} · ${b} = ?`,
            step_answer: a * b,
            explanation_uz: `${a} · ${b} = ${a * b}`
          },
          {
            step_prompt_uz: `${a * b} · ${c} = ?`,
            step_answer: ans,
            explanation_uz: `${a * b} · ${c} = ${ans}`
          }
        ],
        distractors: [a + b + c, 2 * (a * b + b * c + a * c), ans + 4]
      };
    },
    (difficulty = 'orta') => {
      const a = randInt(2, 5);
      const b = randInt(2, 5);
      const c = randInt(2, 6);
      const ans = 2 * (a * b + b * c + a * c);
      return {
        question_uz: `Oʻlchamlari ${a} sm, ${b} sm va ${c} sm boʻlgan toʻgʻri burchakli parallelepipedning toʻla sirti yuzini toping (sm²):`,
        answer: ans,
        steps_uz: [
          `S = 2 · (ab + bc + ac) formulani qoʻllaymiz.`,
          `ab = ${a * b}, bc = ${b * c}, ac = ${a * c}`,
          `S = 2 · (${a * b} + ${b * c} + ${a * c}) = 2 · ${a * b + b * c + a * c} = ${ans} sm²`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `ab + bc + ac yigʻindisini toping:`,
            step_answer: a * b + b * c + a * c,
            explanation_uz: `${a * b} + ${b * c} + ${a * c} = ${a * b + b * c + a * c}`
          },
          {
            step_prompt_uz: `2 · ${a * b + b * c + a * c} = ?`,
            step_answer: ans,
            explanation_uz: `S = ${ans}`
          }
        ],
        distractors: [a * b * c, ans / 2, ans + 6]
      };
    }
  ],

  // 11. To'g'ri prizma hajmi: V = S_asos * H
  geom_prizma_hajmi: [
    (difficulty = 'orta') => {
      const sAsos = randInt(12, 40);
      const H = randInt(4, 14);
      const ans = sAsos * H;
      return {
        question_uz: `Asosining yuzi S_asos = ${sAsos} sm² va balandligi H = ${H} sm boʻlgan toʻgʻri prizmaning hajmi V ni toping (sm³):`,
        answer: ans,
        steps_uz: [
          `Toʻgʻri prizma hajmi: V = S_asos · H`,
          `V = ${sAsos} · ${H} = ${ans} sm³`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${sAsos} · ${H} = ?`,
            step_answer: ans,
            explanation_uz: `${sAsos} · ${H} = ${ans}`
          }
        ],
        distractors: [Math.floor(ans / 3), ans + sAsos, ans + H]
      };
    },
    (difficulty = 'orta') => {
      const sAsos = randInt(10, 30);
      const H = randInt(5, 15);
      const V = sAsos * H;
      return {
        question_uz: `Hajmi V = ${V} sm³ va asosi yuzi S_asos = ${sAsos} sm² boʻlgan toʻgʻri prizmaning balandligi H ni toping (sm):`,
        answer: H,
        steps_uz: [
          `H = V / S_asos formulaga koʻra:`,
          `H = ${V} / ${sAsos} = ${H} sm`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${V} sonini ${sAsos} ga boʻling:`,
            step_answer: H,
            explanation_uz: `${V} / ${sAsos} = ${H}`
          }
        ],
        distractors: [H + 1, H - 1, H * 2]
      };
    }
  ],

  // 12. Silindr to'la sirti: S = 2 * pi * R * (R + H)
  geom_silindr_sirti: [
    (difficulty = 'orta') => {
      const R = randInt(2, 6);
      const H = randInt(3, 8);
      const k = 2 * R * (R + H);
      return {
        question_uz: `Asos radiusi R = ${R} sm va balandligi H = ${H} sm boʻlgan silindr toʻla sirti S = kπ sm² boʻlsa, k sonini toping:`,
        answer: k,
        steps_uz: [
          `Silindr toʻla sirti: S = 2πR(R + H)`,
          `k = 2 · ${R} · (${R} + ${H}) = ${2 * R} · ${R + H} = ${k}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `R + H ni hisoblang (${R} + ${H} = ?):`,
            step_answer: R + H,
            explanation_uz: `${R} + ${H} = ${R + H}`
          },
          {
            step_prompt_uz: `2 · ${R} · ${R + H} = ?`,
            step_answer: k,
            explanation_uz: `k = ${k}`
          }
        ],
        mistakePatterns: [
          {
            id: 'forgot_base_circles',
            hint_uz: 'Silindr toʻla sirtida ikkita asos doirasi ham kiradi: 2πRH + 2πR² = 2πR(R + H).',
            check: (val) => Math.abs(val - (2 * R * H)) < 0.01
          }
        ],
        distractors: [2 * R * H, k / 2, k + 4]
      };
    },
    (difficulty = 'orta') => {
      const R = randInt(2, 7);
      const H = randInt(4, 10);
      const k = 2 * R * H;
      return {
        question_uz: `Radiusi R = ${R} sm va balandligi H = ${H} sm boʻlgan silindr yon sirti yuzi S_yon = kπ sm² boʻlsa, k koeffitsiyentini toping:`,
        answer: k,
        steps_uz: [
          `Silindr yon sirti: S_yon = 2πRH`,
          `k = 2 · ${R} · ${H} = ${k}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `2 · ${R} · ${H} = ?`,
            step_answer: k,
            explanation_uz: `k = ${k}`
          }
        ],
        distractors: [R * H, k * 2, k + 2]
      };
    }
  ],

  // 13. Shar sirti yuzi: S = 4 * pi * R^2
  geom_shar_sirti: [
    (difficulty = 'orta') => {
      const R = randInt(2, 7);
      const k = 4 * R * R;
      return {
        question_uz: `Radiusi R = ${R} sm boʻlgan shar (sfera) sirti yuzi S = kπ sm² boʻlsa, k koeffitsiyentini toping:`,
        answer: k,
        steps_uz: [
          `Shar sirti: S = 4πR²`,
          `k = 4 · ${R}² = 4 · ${R * R} = ${k}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${R}² = ?`,
            step_answer: R * R,
            explanation_uz: `${R}² = ${R * R}`
          },
          {
            step_prompt_uz: `4 · ${R * R} = ?`,
            step_answer: k,
            explanation_uz: `4 · ${R * R} = ${k}`
          }
        ],
        distractors: [R * R, (4 / 3) * (R ** 3), k + 4]
      };
    },
    (difficulty = 'orta') => {
      const R = randInt(2, 8);
      const k = 4 * R * R;
      return {
        question_uz: `Sirti yuzi S = ${k}π sm² boʻlgan sharning radiusi R ni toping (sm):`,
        answer: R,
        steps_uz: [
          `S = 4πR² => 4R² = ${k} => R² = ${k} / 4 = ${R * R}`,
          `R = √${R * R} = ${R} sm`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${k} sonini 4 ga boʻling:`,
            step_answer: R * R,
            explanation_uz: `${k} / 4 = ${R * R}`
          },
          {
            step_prompt_uz: `√${R * R} = ?`,
            step_answer: R,
            explanation_uz: `R = ${R}`
          }
        ],
        distractors: [R + 1, R * 2, R - 1]
      };
    }
  ],

  // 14. Ikki nuqta orasidagi masofa: d = sqrt((x2 - x1)^2 + (y2 - y1)^2)
  geom_nuqtalar_masofa: [
    (difficulty = 'orta') => {
      const triples = [
        { dx: 3, dy: 4, d: 5 },
        { dx: 6, dy: 8, d: 10 },
        { dx: 5, dy: 12, d: 13 },
        { dx: 8, dy: 15, d: 17 }
      ];
      const t = randPick(triples);
      const x1 = randInt(0, 4);
      const y1 = randInt(0, 4);
      const x2 = x1 + t.dx;
      const y2 = y1 + t.dy;
      return {
        question_uz: `A(${x1}; ${y1}) va B(${x2}; ${y2}) nuqtalar orasidagi masofa d ni hisoblang:`,
        answer: t.d,
        steps_uz: [
          `Masofa formulasi: d = √((x₂ - x₁)² + (y₂ - y₁)²)`,
          `x₂ - x₁ = ${x2} - ${x1} = ${t.dx}, y₂ - y₁ = ${y2} - ${y1} = ${t.dy}`,
          `d = √(${t.dx}² + ${t.dy}²) = √(${t.dx * t.dx} + ${t.dy * t.dy}) = √${t.d * t.d} = ${t.d}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `(x₂ - x₁)² + (y₂ - y₁)² yigʻindisini hisoblang:`,
            step_answer: t.d * t.d,
            explanation_uz: `${t.dx * t.dx} + ${t.dy * t.dy} = ${t.d * t.d}`
          },
          {
            step_prompt_uz: `√${t.d * t.d} ildiz qiymatini toping:`,
            step_answer: t.d,
            explanation_uz: `d = ${t.d}`
          }
        ],
        distractors: [t.dx + t.dy, t.d + 1, t.d - 1]
      };
    },
    (difficulty = 'orta') => {
      const pairs = [
        { dx: 3, dy: 4, d: 5 },
        { dx: 6, dy: 8, d: 10 },
        { dx: 5, dy: 12, d: 13 },
        { dx: 8, dy: 15, d: 17 },
        { dx: 8, dy: 6, d: 10 },
        { dx: 12, dy: 5, d: 13 }
      ];
      const p = randPick(pairs);
      return {
        question_uz: `Koordinatalar boshi O(0; 0) dan M(${p.dx}; ${p.dy}) nuqtagacha boʻlgan masofani toping:`,
        answer: p.d,
        steps_uz: [
          `d = √(x² + y²) formulani qoʻllaymiz.`,
          `d = √(${p.dx}² + ${p.dy}²) = √(${p.dx * p.dx} + ${p.dy * p.dy}) = √${p.d * p.d} = ${p.d}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${p.dx}² + ${p.dy}² = ?`,
            step_answer: p.d * p.d,
            explanation_uz: `${p.dx * p.dx} + ${p.dy * p.dy} = ${p.d * p.d}`
          },
          {
            step_prompt_uz: `d = √${p.d * p.d} = ?`,
            step_answer: p.d,
            explanation_uz: `d = ${p.d}`
          }
        ],
        distractors: [p.dx + p.dy, p.d + 2, p.d - 1]
      };
    }
  ],

  // 15. Kesma o'rtasining koordinatalari: x = (x1 + x2)/2, y = (y1 + y2)/2
  geom_kesma_ortasi: [
    (difficulty = 'orta') => {
      const x1 = 2 * randInt(0, 4);
      const x2 = 2 * randInt(1, 5);
      const y1 = 2 * randInt(0, 4);
      const y2 = 2 * randInt(1, 5);
      const x0 = (x1 + x2) / 2;
      const y0 = (y1 + y2) / 2;
      const ans = x0 + y0;
      return {
        question_uz: `A(${x1}; ${y1}) va B(${x2}; ${y2}) nuqtalarni tutashtiruvchi kesma oʻrtasi C(x; y) koordinatalari yigʻindisi (x + y) ni toping:`,
        answer: ans,
        steps_uz: [
          `Kesma oʻrtasi: x = (x₁ + x₂) / 2 = (${x1} + ${x2}) / 2 = ${x0}`,
          `y = (y₁ + y₂) / 2 = (${y1} + ${y2}) / 2 = ${y0}`,
          `x + y = ${x0} + ${y0} = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `x koordinatani toping (${x1} + ${x2}) / 2 = ?`,
            step_answer: x0,
            explanation_uz: `x = ${x0}`
          },
          {
            step_prompt_uz: `y koordinatani toping (${y1} + ${y2}) / 2 = ?`,
            step_answer: y0,
            explanation_uz: `y = ${y0}`
          }
        ],
        distractors: [ans + 1, ans - 1, x1 + y1]
      };
    },
    (difficulty = 'orta') => {
      const x1 = randInt(1, 6);
      const x0 = x1 + randInt(2, 6);
      const x2 = 2 * x0 - x1;
      return {
        question_uz: `Kesmaning bir uchi A(${x1}; 2) va uning oʻrtasi C(${x0}; 5) boʻlsa, ikkinchi uchi B nuqtaning x koordinatasini toping:`,
        answer: x2,
        steps_uz: [
          `x_oʻrta = (x₁ + x₂) / 2 => x₂ = 2 · x_oʻrta - x₁`,
          `x₂ = 2 · ${x0} - ${x1} = ${2 * x0} - ${x1} = ${x2}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `2 · ${x0} - ${x1} = ?`,
            step_answer: x2,
            explanation_uz: `x₂ = ${x2}`
          }
        ],
        distractors: [x2 + 2, x0, x2 - 2]
      };
    }
  ],

  // 16. Vektorlarning skalyar ko'paytmasi: a * b = x1*x2 + y1*y2
  geom_vektor_skalyar: [
    (difficulty = 'orta') => {
      const x1 = randInt(-3, 5);
      const y1 = randInt(1, 4);
      const x2 = randInt(1, 4);
      const y2 = randInt(-3, 4);
      const ans = x1 * x2 + y1 * y2;
      return {
        question_uz: `a(${x1}; ${y1}) va b(${x2}; ${y2}) vektorlarning skalyar koʻpaytmasi a · b ni hisoblang:`,
        answer: ans,
        steps_uz: [
          `Skalyar koʻpaytma formulasi: a · b = x₁ · x₂ + y₁ · y₂`,
          `= (${x1} · ${x2}) + (${y1} · ${y2}) = ${x1 * x2} + ${y1 * y2} = ${ans}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `x₁ · x₂ = ${x1} · ${x2} = ?`,
            step_answer: x1 * x2,
            explanation_uz: `${x1} · ${x2} = ${x1 * x2}`
          },
          {
            step_prompt_uz: `y₁ · y₂ = ${y1} · ${y2} = ?`,
            step_answer: y1 * y2,
            explanation_uz: `${y1} · ${y2} = ${y1 * y2}`
          }
        ],
        distractors: [ans + 2, ans - 2, x1 * y2 + x2 * y1]
      };
    },
    (difficulty = 'orta') => {
      const pairs = [
        { x1: 2, y1: 3, x2: 3, y2: -2 },
        { x1: 3, y1: 4, x2: 4, y2: -3 },
        { x1: 4, y1: 2, x2: 2, y2: -4 },
        { x1: 5, y1: 2, x2: 2, y2: -5 },
        { x1: 3, y1: 5, x2: 5, y2: -3 },
        { x1: 6, y1: 2, x2: 2, y2: -6 }
      ];
      const p = randPick(pairs);
      return {
        question_uz: `Agar a(${p.x1}; ${p.y1}) va b(${p.x2}; y) vektorlar oʻzaro perpendikulyar boʻlsa (a · b = 0), nomaʼlum y koordinatani toping:`,
        answer: p.y2,
        steps_uz: [
          `Perpendikulyarlik sharti: a · b = 0 => x₁x₂ + y₁y = 0`,
          `${p.x1} · ${p.x2} + ${p.y1} · y = 0 => ${p.x1 * p.x2} + ${p.y1}y = 0`,
          `y = -${p.x1 * p.x2} / ${p.y1} = ${p.y2}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${p.x1} · ${p.x2} koʻpaytmasini toping:`,
            step_answer: p.x1 * p.x2,
            explanation_uz: `${p.x1} · ${p.x2} = ${p.x1 * p.x2}`
          },
          {
            step_prompt_uz: `y = -${p.x1 * p.x2} / ${p.y1} = ?`,
            step_answer: p.y2,
            explanation_uz: `y = ${p.y2}`
          }
        ],
        distractors: [-p.y2, p.y1, 0]
      };
    }
  ],

  // 17. Vektor uzunligi: |a| = sqrt(x^2 + y^2)
  geom_vektor_uzunlik: [
    (difficulty = 'orta') => {
      const pairs = [
        { x: 3, y: 4, len: 5 },
        { x: 6, y: 8, len: 10 },
        { x: 5, y: 12, len: 13 },
        { x: 8, y: 15, len: 17 },
        { x: 7, y: 24, len: 25 }
      ];
      const p = randPick(pairs);
      return {
        question_uz: `a(${p.x}; ${p.y}) vektorning uzunligi (moduli) |a| ni toping:`,
        answer: p.len,
        steps_uz: [
          `Vektor uzunligi: |a| = √(x² + y²)`,
          `|a| = √(${p.x}² + ${p.y}²) = √(${p.x * p.x} + ${p.y * p.y}) = √${p.len * p.len} = ${p.len}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `${p.x}² + ${p.y}² yigʻindisini hisoblang:`,
            step_answer: p.len * p.len,
            explanation_uz: `${p.x * p.x} + ${p.y * p.y} = ${p.len * p.len}`
          },
          {
            step_prompt_uz: `√${p.len * p.len} = ?`,
            step_answer: p.len,
            explanation_uz: `|a| = ${p.len}`
          }
        ],
        mistakePatterns: [
          {
            id: 'added_components_directly',
            hint_uz: 'Vektor uzunligi komponentlarning kvadratlari yigʻindisining ildiziga teng (√(x² + y²)).',
            check: (val) => Math.abs(val - (p.x + p.y)) < 0.01
          }
        ],
        distractors: [p.x + p.y, p.len + 2, p.len - 1]
      };
    },
    (difficulty = 'orta') => {
      const pairs = [
        { x: 3, y: 4, len: 5 },
        { x: 8, y: 6, len: 10 },
        { x: 5, y: 12, len: 13 },
        { x: 12, y: 5, len: 13 },
        { x: 6, y: 8, len: 10 }
      ];
      const p = randPick(pairs);
      return {
        question_uz: `b(${p.x}; -${p.y}) vektorning uzunligi |b| ni hisoblang:`,
        answer: p.len,
        steps_uz: [
          `|b| = √(x² + (-y)²) = √(${p.x}² + (-${p.y})²)`,
          `|b| = √(${p.x * p.x} + ${p.y * p.y}) = √${p.len * p.len} = ${p.len}`
        ],
        stepQuestions: [
          {
            step_prompt_uz: `|b| = ?`,
            step_answer: p.len,
            explanation_uz: `|b| = ${p.len}`
          }
        ],
        distractors: [p.len + 1, p.len - 1, p.x]
      };
    }
  ]
};
