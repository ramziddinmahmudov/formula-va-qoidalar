import React from 'react';
import { Search, X, BookOpen, Shapes, Layers, Star, RotateCcw, TrendingUp } from 'lucide-react';
import t from '../i18n';

export default function SearchAndFilter({
  searchQuery,
  onSearchChange,
  activeCategory,
  onSelectCategory,
  counts
}) {
  const categories = [
    { id: 'all', label: 'Barchasi', icon: Layers, count: counts.all },
    { id: 'Algebra', label: 'Algebra', icon: BookOpen, count: counts.algebra },
    { id: 'Geometriya', label: 'Geometriya', icon: Shapes, count: counts.geometry },
    { id: 'favorites', label: 'Sevimlilar', icon: Star, count: counts.favorites },
    { id: 'review', label: 'Takrorlash', icon: RotateCcw, count: counts.review },
    { id: 'frequent', label: 'Eng koʻp uchraydigan', icon: TrendingUp, count: counts.all }
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Qidiruv maydoni */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Formula qidirish..."
          className="w-full pl-11 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all text-sm sm:text-base"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Kategoriya va maxsus toifalar tugmalari */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all select-none ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-2 ring-indigo-600/30'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
              <span>{cat.label}</span>
              {cat.count !== undefined && (
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-indigo-700/60 text-indigo-100'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
