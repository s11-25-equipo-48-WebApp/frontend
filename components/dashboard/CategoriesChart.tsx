'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from "next-auth/react";
import { useStore } from "@/store/zustand";
import { categoryService } from '@/services/dashboard.service';
import useRefreshAccessTokenClient from "@/hooks/useRefreshToken.client";
import { RiLoader5Line } from "react-icons/ri";

export default function CategoriesChart() {
  const { data: session } = useSession();
  const organizationId = useStore((s) => s.currentOrganization);
  const refreshToken = useRefreshAccessTokenClient();
  const accessToken = session?.user?.accessToken as string | undefined;

  const { data: categories, isLoading } = useQuery({
    queryKey: ['dashboard-categories', organizationId],
    queryFn: async () => {
      if (!organizationId) return [];
      const newToken = await refreshToken();
      const tokenToUse = newToken ?? accessToken;
      const data = await categoryService.getCategories(organizationId, tokenToUse);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!organizationId,
  });

  // Calcular el total de usos
  const totalUsage = categories?.reduce((sum, cat) => sum + cat.usage_count, 0) || 0;

  // Obtener las top 3 categorías más usadas
  const topCategories = categories
    ?.sort((a, b) => b.usage_count - a.usage_count)
    .slice(0, 3) || [];

  // Colores para el gráfico
  const colors = ['#86efac', '#fbbf24', '#fca5a5'];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Categorías más usadas</h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RiLoader5Line className="animate-spin w-8 h-8 text-gray-400" />
        </div>
      ) : !categories || categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-gray-500 mb-2">No hay categorías creadas</p>
          <p className="text-sm text-gray-400">Crea categorías para ver estadísticas</p>
        </div>
      ) : totalUsage === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-gray-500 mb-2">Sin usos registrados</p>
          <p className="text-sm text-gray-400">Las categorías aún no han sido utilizadas</p>
        </div>
      ) : (
        <>
          {/* Donut Chart */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {topCategories.map((category, index) => {
                  const percentage = category.usage_count / totalUsage;
                  const circumference = 251.2;
                  const dashArray = percentage * circumference;
                  
                  // Calcular el offset basado en las categorías anteriores
                  const previousPercentages = topCategories
                    .slice(0, index)
                    .reduce((sum, cat) => sum + (cat.usage_count / totalUsage), 0);
                  const dashOffset = -previousPercentages * circumference;

                  return (
                    <circle
                      key={category.id}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={colors[index]}
                      strokeWidth="20"
                      strokeDasharray={`${dashArray} ${circumference}`}
                      strokeDashoffset={dashOffset}
                    />
                  );
                })}
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-gray-800">{totalUsage}</div>
                <div className="text-xs text-gray-500">Total usos</div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {topCategories.map((category, index) => {
              const percentage = ((category.usage_count / totalUsage) * 100).toFixed(1);
              return (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: colors[index] }}
                    />
                    <span className="text-sm text-gray-700 truncate" title={category.name}>
                      {category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className="text-xs text-gray-500">
                      ({category.usage_count})
                    </span>
                    <span className="font-semibold text-gray-800 min-w-[3rem] text-right">
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
            
            {/* Mostrar "Otras" si hay más de 3 categorías */}
            {categories.length > 3 && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                  <span className="text-sm text-gray-700">Otras ({categories.length - 3})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    ({categories.slice(3).reduce((sum, cat) => sum + cat.usage_count, 0)})
                  </span>
                  <span className="font-semibold text-gray-800 min-w-[3rem] text-right">
                    {(((categories.slice(3).reduce((sum, cat) => sum + cat.usage_count, 0)) / totalUsage) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}