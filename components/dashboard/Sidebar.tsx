'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store/zustand';
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  BarChart3,
  Image as ImageIcon,
  Settings,
  Users,
} from 'lucide-react';

// interface Editor {
//   id: string;
//   name: string;
//   status: "active" | "wait" | "offline";
// }

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const currentOrganization = useStore((s) => s.currentOrganization);

  // Obtener el rol del usuario en la organización actual
  const getUserRole = (): 'admin' | 'editor' | null => {
    if (!session?.user?.organizations || !currentOrganization) {
      return null;
    }

    const organizations = session.user.organizations as Array<{
      id: string;
      name: string;
      role: string;
    }>;

    const currentOrg = organizations.find((org) => org.id === currentOrganization);
    if (!currentOrg) {
      return null;
    }
    if (currentOrg.role === 'admin' || currentOrg.role === 'editor') {
      return currentOrg.role as 'admin' | 'editor';
    }

    return null;
  };

  const userRole = getUserRole();

  const allMenuItems = [
    {
      href: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      iconColor: 'text-purple-600',
      activeBg: 'bg-purple-100',
      roles: ['admin', 'editor'] as const,
    },
    {
      href: '/dashboard/pending-reviews',
      icon: FileText,
      label: 'Revisiones pendientes',
      badge: 'NEW',
      iconColor: 'text-pink-500',
      activeBg: 'bg-pink-100',
      roles: ['admin'] as const, 
    },
    {
      href: '/dashboard/testimonials/create',
      icon: PenSquare,
      label: 'Crear testimonio',
      iconColor: 'text-teal-500',
      activeBg: 'bg-teal-100',
      roles: ['admin', 'editor'] as const, 
    },
    {
      href: '/dashboard/analytics',
      icon: BarChart3,
      label: 'Analytics',
      iconColor: 'text-red-500',
      iconBg: 'bg-red-50',
      roles: ['admin'] as const, 
    },
    {
      href: '/dashboard/library',
      icon: ImageIcon,
      label: 'Biblioteca multimedia',
      iconColor: 'text-blue-500',
      activeBg: 'bg-blue-100',
      roles: ['admin', 'editor'] as const, 
    },
    {
      href: '/dashboard/categories',
      icon: LayoutDashboard,
      label: 'Categorías',
      iconColor: 'text-blue-500',
      activeBg: 'bg-blue-100',
      roles: ['admin'] as const,
    },
    {
      href: '/dashboard/editors',
      icon: Users,
      label: 'Gestionar editores/permisos',
      iconColor: 'text-yellow-500',
      activeBg: 'bg-yellow-100',
      roles: ['admin'] as const,
    },
    {
      href: '/',
      icon: Settings,
      label: 'Mis organizaciones',
      iconColor: 'text-winered',
      activeBg: 'bg-winered',
      roles: ['admin', 'editor'] as const,
    },
  ];

  const menuItems = userRole
    ? allMenuItems.filter((item) => (item.roles as readonly string[]).includes(userRole))
    : allMenuItems.filter((item) => (item.roles as readonly string[]).includes('editor')); // Fallback seguro: mostrar solo opciones de editor

  return (
    <aside className="w-full bg-card  rounded-[2.5rem] p-6 flex flex-col">
      {/* Navigation Menu */}
      <nav className="space-y-1 flex-1 mt-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-[#BCDBB8] shadow-sm' : 'hover:bg-white/50'
                }`}
            >
              {/* Icon Container */}
              <div
                className={`p-1 rounded ${isActive ? '' : ''} ${item.iconColor
                  }`}
              >
                <Icon size={26} />
              </div>

              <span
                className={`flex-1 text-sm font-semibold ${isActive
                  ? 'text-gray-800'
                  : 'text-gray-500 group-hover:text-gray-700'
                  }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
