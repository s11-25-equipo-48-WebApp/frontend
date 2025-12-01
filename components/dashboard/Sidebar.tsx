"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  BarChart3,
  Image as ImageIcon,
  ChevronDown,
  Settings,
  Users,
} from "lucide-react";

// interface Editor {
//   id: string;
//   name: string;
//   status: "active" | "wait" | "offline";
// }

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      iconColor: "text-purple-600",
      activeBg: "bg-purple-100",
    },
    {
      href: "/dashboard/revisiones",
      icon: FileText,
      label: "Revisiones pendientes",
      badge: "NEW",
      iconColor: "text-pink-500",
      activeBg: "bg-pink-100",
    },
    {
      href: "/dashboard/testimonials/create",
      icon: PenSquare,
      label: "Crear testimonio",
      iconColor: "text-teal-500",
      activeBg: "bg-teal-100",
    },
    {
      href: "/dashboard/analytics",
      icon: BarChart3,
      label: "Analytics",
      iconColor: "text-red-500",
      activeBg: "bg-red-100",
    },
    {
      href: "/dashboard/biblioteca",
      icon: ImageIcon,
      label: "Biblioteca multimedia",
      iconColor: "text-blue-500",
      activeBg: "bg-blue-100",
    },
    {
      href: "/dashboard/categories",
      icon: LayoutDashboard,
      label: "Categorías",
      iconColor: "text-blue-500",
      activeBg: "bg-blue-100",
    },
    {
      href: "/dashboard/permissions",
      icon: Users,
      label: "Gestionar editores/permisos",
      iconColor: "text-yellow-500",
      activeBg: "bg-yellow-100",
    },
    {
      href: "/",
      icon: Settings,
      label: "Mis organizaciones",
      iconColor: "text-winered",
      activeBg: "bg-winered",
    },
  ];

  // const getStatusColor = (status: Editor["status"]) => {
  //   switch (status) {
  //     case "active":
  //       return "border-2 border-green-500 text-green-600"; // Ring style
  //     case "wait":
  //       return "border-2 border-yellow-500 text-yellow-600";
  //     case "offline":
  //       return "border-2 border-gray-300 text-gray-400";
  //     default:
  //       return "border-gray-300";
  //   }
  // };

  return (
    <aside className="w-full bg-[#F5F7F9] rounded-[2.5rem] p-6 flex flex-col">
      {/* Navigation Menu */}
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive ? "bg-[#BCDBB8] shadow-sm" : "hover:bg-white/50"
              }`}
            >
              {/* Icon Container */}
              <div
                className={`p-1 rounded ${isActive ? "" : ""} ${
                  item.iconColor
                }`}
              >
                <Icon size={26} />
              </div>

              <span
                className={`flex-1 text-sm font-semibold ${
                  isActive
                    ? "text-gray-800"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
              >
                {item.label}
              </span>

              {item.badge && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
