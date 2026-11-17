import React, { useMemo } from 'react';
import katex from 'katex';

/**
 * KaTeX yordamida matematik formulalarni render qilish komponenti
 */
export default function KaTeXMath({ math, block = false, className = '' }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        output: 'htmlAndMathml'
      });
    } catch (e) {
      console.warn('KaTeX render xatosi:', e);
      return `<span class="text-rose-500 font-mono">${math}</span>`;
    }
  }, [math, block]);

  if (block) {
    return (
      <div
        className={`overflow-x-auto py-2 my-1 text-center font-serif text-lg md:text-xl text-slate-800 dark:text-slate-100 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`inline-block font-serif text-slate-800 dark:text-slate-100 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
