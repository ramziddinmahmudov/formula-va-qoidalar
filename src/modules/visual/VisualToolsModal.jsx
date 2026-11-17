import React, { useState } from 'react';
import { X, Shapes, Sliders, Maximize2, Sparkles } from 'lucide-react';
import KaTeXMath from '../../components/KaTeXMath';
import t from '../../i18n';

export default function VisualToolsModal({ formula, onClose }) {
  const isParabola = formula?.id?.includes('diskriminant') || formula?.id?.includes('ildizlar') || formula?.id?.includes('viyet');
  const shapeType = formula?.shape?.type || (isParabola ? 'parabola' : 'triangle');

  // Parabola holati: y = ax^2 + bx + c
  const [paraA, setParaA] = useState(1);
  const [paraB, setParaB] = useState(-2);
  const [paraC, setParaC] = useState(-3);

  // Geometriya parametrlari
  const [paramA, setParamA] = useState(8);   // Asos yoki tomon
  const [paramB, setParamB] = useState(6);   // Ikkinchi tomon yoki bo'y
  const [paramH, setParamH] = useState(6);   // Balandlik
  const [paramR, setParamR] = useState(5);   // Radius

  // Parabola hisoblashlari
  const D = paraB * paraB - 4 * paraA * paraC;
  const vertexX = -paraB / (2 * (paraA || 1));
  const vertexY = paraA * vertexX * vertexX + paraB * vertexX + paraC;
  const root1 = D >= 0 ? (-paraB - Math.sqrt(D)) / (2 * (paraA || 1)) : null;
  const root2 = D >= 0 ? (-paraB + Math.sqrt(D)) / (2 * (paraA || 1)) : null;

  // Parabola grafigi nuqtalari (SVG koordinata tizimiga o'tkazish)
  // SVG viewBox: -100 -100 200 200 (markaz 0,0)
  const renderParabolaPath = () => {
    const points = [];
    const scaleX = 12;
    const scaleY = 6;
    for (let x = -8; x <= 8; x += 0.25) {
      const y = paraA * x * x + paraB * x + paraC;
      const svgX = x * scaleX;
      const svgY = -y * scaleY; // SVG da Y pastga qarab o'sadi
      points.push(`${svgX.toFixed(1)},${svgY.toFixed(1)}`);
    }
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Shapes className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {isParabola ? 'Parabola grafigi (Kvadrat funksiya)' : 'Interaktiv geometrik simulyator'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formula?.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tana Qismi */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* PARABOLA SIMULYATORI */}
          {isParabola ? (
            <div className="space-y-4">
              {/* Funksiya ifodasi va xossalari */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block font-semibold">Diskriminant (D)</span>
                  <span className={`text-base font-black ${D > 0 ? 'text-emerald-600' : D === 0 ? 'text-amber-600' : 'text-rose-600'}`}>
                    {D}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block font-semibold">Uchi (x₀; y₀)</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    ({vertexX.toFixed(1)}; {vertexY.toFixed(1)})
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block font-semibold">Simmetriya oʻqi</span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    x = {vertexX.toFixed(1)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block font-semibold">Ildizlar</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {D > 0 ? `x₁=${root1.toFixed(1)}, x₂=${root2.toFixed(1)}` : D === 0 ? `x=${root1.toFixed(1)}` : 'Ildiz yoʻq (D<0)'}
                  </span>
                </div>
              </div>

              {/* SVG Parabola grafigi */}
              <div className="relative w-full h-64 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                <svg viewBox="-100 -100 200 200" className="w-full h-full">
                  {/* Grid chiziqlari */}
                  <line x1="-100" y1="0" x2="100" y2="0" stroke="#334155" strokeWidth="1" />
                  <line x1="0" y1="-100" x2="0" y2="100" stroke="#334155" strokeWidth="1" />
                  {/* X va Y o'qlari */}
                  <text x="90" y="-4" fill="#94a3b8" fontSize="8" fontWeight="bold">X</text>
                  <text x="4" y="-88" fill="#94a3b8" fontSize="8" fontWeight="bold">Y</text>

                  {/* Simmetriya o'qi */}
                  <line
                    x1={vertexX * 12}
                    y1="-100"
                    x2={vertexX * 12}
                    y2="100"
                    stroke="#818cf8"
                    strokeDasharray="2,2"
                    strokeWidth="1"
                  />

                  {/* Parabola egri chizig'i */}
                  <path
                    d={renderParabolaPath()}
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Uchi nuqtasi */}
                  <circle
                    cx={vertexX * 12}
                    cy={-vertexY * 6}
                    r="4"
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />

                  {/* Ildizlar nuqtalari */}
                  {root1 !== null && (
                    <circle cx={root1 * 12} cy="0" r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                  )}
                  {root2 !== null && (
                    <circle cx={root2 * 12} cy="0" r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                  )}
                </svg>
                <div className="absolute bottom-2 left-3 text-[11px] text-slate-400 font-mono">
                  y = {paraA}x² {paraB >= 0 ? `+ ${paraB}x` : `- ${Math.abs(paraB)}x`} {paraC >= 0 ? `+ ${paraC}` : `- ${Math.abs(paraC)}`}
                </div>
              </div>

              {/* Slayderlar (a, b, c) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>a koeffitsiyent:</span>
                    <span className="font-bold text-indigo-600">{paraA}</span>
                  </div>
                  <input
                    type="range"
                    min="-3"
                    max="3"
                    step="1"
                    value={paraA}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      setParaA(v === 0 ? 1 : v);
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>b koeffitsiyent:</span>
                    <span className="font-bold text-indigo-600">{paraB}</span>
                  </div>
                  <input
                    type="range"
                    min="-6"
                    max="6"
                    step="1"
                    value={paraB}
                    onChange={(e) => setParaB(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>c (ozod had):</span>
                    <span className="font-bold text-indigo-600">{paraC}</span>
                  </div>
                  <input
                    type="range"
                    min="-8"
                    max="8"
                    step="1"
                    value={paraC}
                    onChange={(e) => setParaC(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* GEOMETRIK SHAKLLAR SIMULYATORI */
            <div className="space-y-4">
              {/* Canli natijalar vidjeti */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-900">
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold block">Yuza (S)</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    {shapeType === 'triangle' && ((paramA * paramH) / 2).toFixed(1)}
                    {shapeType === 'rectangle' && (paramA * paramB).toFixed(1)}
                    {shapeType === 'circle' && (3 * paramR * paramR).toFixed(1)}
                    {shapeType === 'cylinder' && (3 * paramR * paramR * paramH).toFixed(1)}
                    {shapeType === 'cone' && (paramR * paramR * paramH).toFixed(1)}
                    {shapeType === 'sphere' && (12 * paramR * paramR).toFixed(1)}
                    {shapeType === 'pyramid' && ((paramA * paramA * paramH) / 3).toFixed(1)}
                    {shapeType === 'trapezoid' && (((paramA + paramB) / 2) * paramH).toFixed(1)}
                    {shapeType === 'rhombus' && ((paramA * paramB) / 2).toFixed(1)} sm²
                  </span>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold block">Perimetr / Asos</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    {shapeType === 'rectangle' && 2 * (paramA + paramB)}
                    {shapeType === 'circle' && 2 * 3 * paramR}
                    {shapeType === 'triangle' && (paramA + paramH + Math.round(Math.sqrt(paramA * paramA + paramH * paramH)))}
                    {shapeType !== 'rectangle' && shapeType !== 'circle' && shapeType !== 'triangle' && paramA * 4} sm
                  </span>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900">
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-bold block">Hajm (V)</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    {shapeType === 'cylinder' && 3 * paramR * paramR * paramH}
                    {shapeType === 'cone' && paramR * paramR * paramH}
                    {shapeType === 'sphere' && 4 * paramR * paramR * paramR}
                    {shapeType === 'pyramid' && Math.round((paramA * paramA * paramH) / 3)}
                    {['triangle', 'rectangle', 'circle', 'trapezoid', 'rhombus'].includes(shapeType) && 'Tekis shakl'}
                    {!['triangle', 'rectangle', 'circle', 'trapezoid', 'rhombus'].includes(shapeType) && ' sm³'}
                  </span>
                </div>
              </div>

              {/* SVG Geometrik Shakl Chizmasi */}
              <div className="w-full h-64 bg-slate-900 rounded-2xl flex items-center justify-center p-4 border border-slate-800 relative">
                <svg viewBox="0 0 240 180" className="w-full h-full max-h-56">
                  {/* Uchburchak */}
                  {shapeType === 'triangle' && (
                    <g>
                      <polygon points="40,140 200,140 80,40" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="2.5" />
                      {/* Balandlik */}
                      <line x1="80" y1="40" x2="80" y2="140" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
                      <text x="85" y="90" fill="#f59e0b" fontSize="10" fontWeight="bold">h = {paramH}</text>
                      <text x="110" y="155" fill="#a5b4fc" fontSize="10" fontWeight="bold">a = {paramA}</text>
                    </g>
                  )}

                  {/* To'rtburchak */}
                  {shapeType === 'rectangle' && (
                    <g>
                      <rect x="50" y="45" width="140" height="90" rx="4" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2.5" />
                      <text x="110" y="40" fill="#6ee7b7" fontSize="10" fontWeight="bold">a = {paramA}</text>
                      <text x="200" y="95" fill="#6ee7b7" fontSize="10" fontWeight="bold">b = {paramB}</text>
                    </g>
                  )}

                  {/* Doira */}
                  {shapeType === 'circle' && (
                    <g>
                      <circle cx="120" cy="90" r={Math.min(65, paramR * 9)} fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="2.5" />
                      <line cx="120" cy="90" x1="120" y1="90" x2={120 + Math.min(65, paramR * 9)} y2="90" stroke="#f59e0b" strokeWidth="2" />
                      <circle cx="120" cy="90" r="3" fill="#ffffff" />
                      <text x="135" y="85" fill="#fde68a" fontSize="10" fontWeight="bold">R = {paramR}</text>
                    </g>
                  )}

                  {/* Silindr (Aksonometrik proyeksiyada) */}
                  {shapeType === 'cylinder' && (
                    <g>
                      {/* Pastki asos */}
                      <ellipse cx="120" cy="135" rx="55" ry="18" fill="rgba(99, 102, 241, 0.3)" stroke="#6366f1" strokeWidth="2" />
                      {/* Yon tomonlar */}
                      <line x1="65" y1="50" x2="65" y2="135" stroke="#6366f1" strokeWidth="2" />
                      <line x1="175" y1="50" x2="175" y2="135" stroke="#6366f1" strokeWidth="2" />
                      {/* Yuqori asos */}
                      <ellipse cx="120" cy="50" rx="55" ry="18" fill="rgba(99, 102, 241, 0.5)" stroke="#6366f1" strokeWidth="2" />
                      <line x1="120" y1="50" x2="175" y2="50" stroke="#f59e0b" strokeWidth="2" />
                      <text x="135" y="45" fill="#fde68a" fontSize="9" fontWeight="bold">R = {paramR}</text>
                      <text x="185" y="95" fill="#a5b4fc" fontSize="10" fontWeight="bold">h = {paramH}</text>
                    </g>
                  )}

                  {/* Konus */}
                  {shapeType === 'cone' && (
                    <g>
                      <ellipse cx="120" cy="140" rx="60" ry="18" fill="rgba(168, 85, 247, 0.3)" stroke="#a855f7" strokeWidth="2" />
                      <line x1="60" y1="140" x2="120" y2="35" stroke="#a855f7" strokeWidth="2" />
                      <line x1="180" y1="140" x2="120" y2="35" stroke="#a855f7" strokeWidth="2" />
                      <line x1="120" y1="35" x2="120" y2="140" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
                      <text x="125" y="85" fill="#f59e0b" fontSize="10" fontWeight="bold">h = {paramH}</text>
                    </g>
                  )}

                  {/* Shar */}
                  {shapeType === 'sphere' && (
                    <g>
                      <circle cx="120" cy="90" r="55" fill="rgba(236, 72, 153, 0.2)" stroke="#ec4899" strokeWidth="2.5" />
                      <ellipse cx="120" cy="90" rx="55" ry="18" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="4,3" />
                      <line x1="120" y1="90" x2="175" y2="90" stroke="#f59e0b" strokeWidth="2" />
                      <text x="135" y="85" fill="#fde68a" fontSize="10" fontWeight="bold">R = {paramR}</text>
                    </g>
                  )}

                  {/* Piramida */}
                  {shapeType === 'pyramid' && (
                    <g>
                      <polygon points="50,135 150,150 190,120 90,105" fill="rgba(20, 184, 166, 0.2)" stroke="#14b8a6" strokeWidth="1.5" />
                      <line x1="50" y1="135" x2="120" y2="35" stroke="#14b8a6" strokeWidth="2" />
                      <line x1="150" y1="150" x2="120" y2="35" stroke="#14b8a6" strokeWidth="2" />
                      <line x1="190" y1="120" x2="120" y2="35" stroke="#14b8a6" strokeWidth="2" />
                      <line x1="120" y1="35" x2="120" y2="130" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
                      <text x="125" y="80" fill="#f59e0b" fontSize="10" fontWeight="bold">h = {paramH}</text>
                    </g>
                  )}

                  {/* Trapetsiya */}
                  {shapeType === 'trapezoid' && (
                    <g>
                      <polygon points="40,140 200,140 160,55 80,55" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2.5" />
                      <line x1="80" y1="55" x2="80" y2="140" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
                      <text x="110" y="45" fill="#93c5fd" fontSize="10" fontWeight="bold">a = {paramA}</text>
                      <text x="110" y="155" fill="#93c5fd" fontSize="10" fontWeight="bold">b = {paramB}</text>
                      <text x="85" y="100" fill="#f59e0b" fontSize="10" fontWeight="bold">h = {paramH}</text>
                    </g>
                  )}

                  {/* Romb */}
                  {shapeType === 'rhombus' && (
                    <g>
                      <polygon points="120,35 195,90 120,145 45,90" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" strokeWidth="2.5" />
                      <line x1="45" y1="90" x2="195" y2="90" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
                      <line x1="120" y1="35" x2="120" y2="145" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />
                      <text x="125" y="70" fill="#10b981" fontSize="9" fontWeight="bold">d₁={paramA}</text>
                      <text x="160" y="105" fill="#f59e0b" fontSize="9" fontWeight="bold">d₂={paramB}</text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Slayderlar boshqaruvi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                {['triangle', 'rectangle', 'trapezoid', 'rhombus', 'pyramid'].includes(shapeType) && (
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Asos / Tomon (a):</span>
                      <span className="font-bold text-indigo-600">{paramA} sm</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="20"
                      value={paramA}
                      onChange={(e) => setParamA(parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                )}

                {['rectangle', 'trapezoid', 'rhombus'].includes(shapeType) && (
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Ikkinchi tomon / Asos (b):</span>
                      <span className="font-bold text-indigo-600">{paramB} sm</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="18"
                      value={paramB}
                      onChange={(e) => setParamB(parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                )}

                {['triangle', 'cylinder', 'cone', 'pyramid', 'trapezoid'].includes(shapeType) && (
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Balandlik (h):</span>
                      <span className="font-bold text-indigo-600">{paramH} sm</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="15"
                      value={paramH}
                      onChange={(e) => setParamH(parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                )}

                {['circle', 'cylinder', 'cone', 'sphere'].includes(shapeType) && (
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Radius (R):</span>
                      <span className="font-bold text-indigo-600">{paramR} sm</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      value={paramR}
                      onChange={(e) => setParamR(parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/70 dark:bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}
