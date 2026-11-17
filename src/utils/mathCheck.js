/**
 * Matematik javoblarni tekshirish moduli
 * - Vergul va nuqtani birdek qabul qiladi (masalan: 3,5 yoki 3.5)
 * - Oddiy kasrlarni tushunadi (masalan: 1/2 = 0.5)
 * - O'nli kasrlar uchun ±0.01 xatolik oralig'iga (tolerance) ruxsat beradi
 * - Ikki ildizli javoblarni tartibsiz qabul qiladi (masalan: "2; 3" yoki "3, 2")
 */

export function parseNumberOrFraction(input) {
  if (typeof input === 'number') return input;
  if (!input) return NaN;
  
  const clean = String(input).trim().replace(',', '.');
  
  if (clean.includes('/')) {
    const parts = clean.split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        return num / den;
      }
    }
  }
  
  return parseFloat(clean);
}

export function checkAnswer(userRawInput, expectedAnswer, tolerance = 0.02) {
  if (userRawInput === undefined || userRawInput === null) {
    return { isCorrect: false };
  }

  const userClean = String(userRawInput).trim();
  if (userClean === '') {
    return { isCorrect: false };
  }

  // Agar kutilgan javob massiv bo'lsa (masalan, ikkita ildiz [x1, x2])
  if (Array.isArray(expectedAnswer)) {
    // Foydalanuvchi javobini vergul, nuqtali vergul yoki bo'sh joy orqali ajratamiz
    const userParts = userClean
      .split(/[,;\s]+/)
      .map(p => parseNumberOrFraction(p))
      .filter(n => !isNaN(n));

    if (userParts.length !== expectedAnswer.length) {
      return { isCorrect: false };
    }

    const sortedExpected = [...expectedAnswer].sort((a, b) => a - b);
    const sortedUser = [...userParts].sort((a, b) => a - b);

    const allMatch = sortedExpected.every((exp, idx) => {
      const u = sortedUser[idx];
      return Math.abs(u - exp) <= tolerance || Math.abs((u - exp) / (exp || 1)) <= tolerance;
    });

    return { isCorrect: allMatch };
  }

  // Agar kutilgan javob son bo'lsa
  if (typeof expectedAnswer === 'number') {
    const userVal = parseNumberOrFraction(userClean);
    if (isNaN(userVal)) {
      return { isCorrect: false };
    }

    // Mutlaq xatolik (masalan ±0.02) yoki katta sonlar uchun 1% nisbiy xatolik
    const absDiff = Math.abs(userVal - expectedAnswer);
    const isClose = absDiff <= tolerance;

    return { isCorrect: isClose, diff: absDiff };
  }

  // Agar kutilgan javob matn bo'lsa
  const normalizedExpected = String(expectedAnswer).trim().toLowerCase().replace(/\s+/g, '');
  const normalizedUser = userClean.toLowerCase().replace(/\s+/g, '').replace(',', '.');

  return { isCorrect: normalizedExpected === normalizedUser };
}

/**
 * Sonni chiroyli ko'rinishga keltirish (agar butun bo'lsa butun, kasr bo'lsa 2 xonagacha)
 */
export function formatUzbekNumber(num) {
  if (typeof num !== 'number') return String(num);
  if (Number.isInteger(num)) return num.toString();
  return Number(num.toFixed(2)).toString().replace('.', ',');
}
