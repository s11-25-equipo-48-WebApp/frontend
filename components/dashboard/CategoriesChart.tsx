'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/config';
import { useState } from 'react';

interface CategoryData {
  positive: number;
  neutral: number;
  negative: number;
}

export default function CategoriesChart() {
  const [timeframe, setTimeframe] = useState<'semana' | 'mes'>('semana');

  const { data: categories } = useQuery<CategoryData>({
    queryKey: ['categories', timeframe],
    queryFn: async () => {
      const { data } = await api.get(`/dashboard/categories?timeframe=${timeframe}`);
      return data;
    },
  });

  // Mock data
  const mockData = {
    positive: 60,
    neutral: 25,
    negative: 15,
  };

  const displayData = categories || mockData;
  const total = displayData.positive + displayData.neutral + displayData.negative;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Categorías</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeframe('semana')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              timeframe === 'semana'
                ? 'bg-gray-200 text-gray-800 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setTimeframe('mes')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              timeframe === 'mes'
                ? 'bg-gray-200 text-gray-800 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Mes
          </button>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="flex justify-center mb-8">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {/* Positive */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#86efac"
              strokeWidth="20"
              strokeDasharray={`${(displayData.positive / total) * 251.2} 251.2`}
              strokeDashoffset="0"
            />
            {/* Neutral */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="20"
              strokeDasharray={`${(displayData.neutral / total) * 251.2} 251.2`}
              strokeDashoffset={`-${(displayData.positive / total) * 251.2}`}
            />
            {/* Negative */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#fca5a5"
              strokeWidth="20"
              strokeDasharray={`${(displayData.negative / total) * 251.2} 251.2`}
              strokeDashoffset={`-${((displayData.positive + displayData.neutral) / total) * 251.2}`}
            />
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-300" />
            <span className="text-sm text-gray-700">Positivo</span>
          </div>
          <span className="font-semibold text-gray-800">{displayData.positive}%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="text-sm text-gray-700">Neutral</span>
          </div>
          <span className="font-semibold text-gray-800">{displayData.neutral}%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-300" />
            <span className="text-sm text-gray-700">Negativo</span>
          </div>
          <span className="font-semibold text-gray-800">{displayData.negative}%</span>
        </div>
      </div>
    </div>
  );
}