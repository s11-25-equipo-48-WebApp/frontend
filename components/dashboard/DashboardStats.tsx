"use client";
import { ArrowUpRight } from "lucide-react";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import Link from "next/link";
import { useStore } from "@/store/zustand";

export default function DashboardStats() {
  const { metrics, isLoading } = useDashboardMetrics();
  const { role: userRole } = useStore();
  const allCardItems = [
    {
      title: "Testimonios publicados (mes)",
      value: metrics?.publishedMonth ?? 0,
      color: "bg-green-500",
      link: "/dashboard/testimonials/published",
      showViewAll: true,
      roles: ["admin", "editor"] as const,
    },
    {
      title: "Testimonios recibidos (mes)",
      value: metrics?.receivedMonth ?? 0,
      color: "bg-blue-500",
      link: "/dashboard/testimonials/received",
      showViewAll: true,
      roles: ["admin", "editor"] as const,
    },
    {
      title: "Tasa de aprobación",
      value: `${metrics?.approvalRate ?? 0}%`,
      color: "bg-orange-500",
      showViewAll: false,
      roles: ["admin"] as const,
    },
    {
      title: "Visualizaciones",
      value: metrics?.views ?? 0,
      color: "bg-gray-800",
      showViewAll: false,
      roles: ["admin"] as const,
    },
  ];

  const cardsItems = userRole
    ? allCardItems.filter((card) =>
        (card.roles as readonly string[]).includes(userRole)
      )
    : allCardItems.filter((card) =>
        (card.roles as readonly string[]).includes("editor")
      );

  if (isLoading) {
    const skeletonCount = cardsItems.length || 2;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-sm animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 ${
        cardsItems.length > 2 ? "lg:grid-cols-4" : "lg:grid-cols-2"
      } gap-4`}
    >
      {cardsItems.map((card, index) => (
        <div
          key={index}
          className={`${
            card.color
          } rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden ${
            card.showViewAll ? "group cursor-pointer" : ""
          }`}
        >
          <div className="relative z-10">
            <h3 className="text-sm font-medium mb-2 opacity-90">
              {card.title}
            </h3>
            <p className="text-3xl font-bold mb-4">{card.value}</p>

            {card.showViewAll && card.link && (
              <Link
                href={card.link}
                className="flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all"
              >
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
          </div>
          {card.showViewAll && (
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
          )}
        </div>
      ))}
    </div>
  );
}
