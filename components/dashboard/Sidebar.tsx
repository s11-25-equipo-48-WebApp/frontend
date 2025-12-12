"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  BarChart3,
  ImageIcon,
  Settings,
  Users,
} from "lucide-react";
import { useStore } from "@/store/zustand";

export default function Sidebar() {
  const pathname = usePathname();
  const { role: userRole } = useStore();

  const allMenuItems = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      iconColor: "text-purple-600",
      activeBg: "bg-purple-100",
      roles: ["admin", "editor"] as const,
    },
    {
      href: "/dashboard/testimonials/pending-reviews",
      icon: FileText,
      label: "Revisiones pendientes",
      badge: "NEW",
      iconColor: "text-pink-500",
      activeBg: "bg-pink-100",
      roles: ["admin", "editor"] as const,
    },
    {
      href: "/dashboard/testimonials/create",
      icon: PenSquare,
      label: "Crear testimonio",
      iconColor: "text-teal-500",
      activeBg: "bg-teal-100",
      roles: ["admin", "editor"] as const,
    },
    {
      href: "/dashboard/analytics",
      icon: BarChart3,
      label: "Analytics",
      iconColor: "text-red-500",
      iconBg: "bg-red-50",
      roles: ["admin"] as const,
    },
    {
      href: "/dashboard/library",
      icon: ImageIcon,
      label: "Biblioteca multimedia",
      iconColor: "text-blue-500",
      activeBg: "bg-blue-100",
      roles: ["admin", "editor"] as const,
    },
    {
      href: "/dashboard/categories",
      icon: LayoutDashboard,
      label: "Categorías",
      iconColor: "text-blue-500",
      activeBg: "bg-blue-100",
      roles: ["admin"] as const,
    },
    {
      href: "/dashboard/editors",
      icon: Users,
      label: "Gestionar editores/permisos",
      iconColor: "text-yellow-500",
      activeBg: "bg-yellow-100",
      roles: ["admin"] as const,
    },
    {
      href: "/",
      icon: Settings,
      label: "Mis organizaciones",
      iconColor: "text-winered",
      activeBg: "bg-winered",
      roles: ["admin", "editor"] as const,
    },
  ];

  const menuItems = userRole
    ? allMenuItems.filter((item) =>
        (item.roles as readonly string[]).includes(userRole)
      )
    : allMenuItems.filter((item) =>
        (item.roles as readonly string[]).includes("editor")
      );

  return (
    <>
      <aside className="hidden lg:flex sticky top-20 w-full bg-card rounded-[2.5rem] p-6 flex-col">
        <nav className="space-y-1 flex-1 mt-2">
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
                <div className={`p-1 rounded ${item.iconColor}`}>
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
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-gray-200 shadow-lg z-50">
        <div className="flex items-center justify-around px-2 py-2 sm:py-3 max-w-screen-xl mx-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center px-1 py-2 sm:px-3 sm:py-2.5 rounded-xl transition-all duration-200 flex-1 max-w-[80px] sm:max-w-[100px] ${
                  isActive ? "bg-[#BCDBB8]" : "hover:bg-gray-100"
                }`}
              >
                <div className={`${item.iconColor}`}>
                  <Icon size={22} className="sm:hidden" />
                  <Icon size={26} className="hidden sm:block" />
                </div>
              </Link>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>

      <div className="lg:hidden h-16 sm:h-20" />
    </>
  );
}
