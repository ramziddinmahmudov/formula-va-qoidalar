import { describe, it, expect } from 'vitest';
import { formulasData } from '../src/data/formulas';

describe('Generatorlarning tasodifiyligi va takrorlanmaslik testi', () => {
  it('Bir xil generator ketma-ket 2 martadan ortiq bir xil savol ishlab chiqarmaydi', () => {
    formulasData.forEach((f) => {
      f.generators.forEach((gen) => {
        let repeatStreak = 1;
        let lastQ = null;

        // 10 marta ketma-ket generatsiya qilib ko'ramiz
        for (let i = 0; i < 10; i++) {
          const ex = gen('orta');
          if (ex.question_uz === lastQ) {
            repeatStreak++;
          } else {
            repeatStreak = 1;
          }
          lastQ = ex.question_uz;

          // Ketma-ket 2 tadan ortiq bir xil savol chiqmasligi shart
          expect(repeatStreak).toBeLessThanOrEqual(2);
        }
      });
    });
  });
});
