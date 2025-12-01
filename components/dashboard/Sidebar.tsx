"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  BarChart3,
  Image as ImageIcon,
  List,
  Users,
  Settings,
} from "lucide-react";

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
      href: "/dashboard/pending-reviews",
      icon: FileText,
      label: "Revisiones pendientes",
      badge: "NEW",
      iconColor: "text-pink-500",
      activeBg: "bg-pink-100",
    },
    {
      href: "/dashboard/crear",
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
      iconBg: "bg-red-50",
    },
    {
      href: "/dashboard/biblioteca",
      icon: ImageIcon,
      label: "Biblioteca multimedia",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
    },
    {
      href: "/dashboard/categorias",
      icon: List,
      label: "Categorías",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
    },
    {
      href: "/dashboard/editores",
      icon: Users,
      label: "Gestionar editores/permisos",
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-50",
    },
  ];

  const bottomItems = [
    {
      href: "/dashboard/organizaciones",
      icon: Settings,
      label: "Mis organizaciones",
      iconColor: "text-red-500",
      iconBg: "bg-red-50",
    },
  ];

  return (
    <aside className="w-72 bg-[#F5F7F9] rounded-3xl p-4 flex flex-col min-h-[calc(100vh-3rem)]">
      {/* Navigation Menu */}
      <nav className="space-y-1 flex-1 mt-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive ? "bg-green-100" : "hover:bg-white/50"
              }`}
            >
              {/* Icon Container */}
              <div className={`p-1.5 rounded-md ${item.iconBg}`}>
                <Icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>

              <span
                className={`flex-1 text-sm font-medium ${
                  isActive
                    ? "text-gray-700"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Items */}
      <div className="mt-auto pt-4 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive ? "bg-white" : "hover:bg-white/50"
              }`}
            >
              <div className={`p-1.5 rounded-md ${item.iconBg}`}>
                <Icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>

              <span
                className={`flex-1 text-sm font-medium ${
                  isActive
                    ? "text-gray-700"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
