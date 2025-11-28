'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  BarChart3,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Settings,
  Users,
} from 'lucide-react';

interface Editor {
  id: string;
  name: string;
  status: 'active' | 'wait' | 'offline';
}

export default function Sidebar() {
  const pathname = usePathname();
  const [showEditores, setShowEditores] = useState(true);

  const editores: Editor[] = [
    { id: '1', name: 'María Rodríguez', status: 'active' },
    { id: '2', name: 'Antonio Ortiz', status: 'active' },
    { id: '3', name: 'Amanda Santos', status: 'active' },
    { id: '4', name: 'Oliver Harmon', status: 'wait' },
    { id: '5', name: 'Lorena Todd', status: 'offline' },
    { id: '6', name: 'Bruno Foster', status: 'offline' },
  ];

  const menuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', iconColor: 'text-purple-600', activeBg: 'bg-purple-100' },
    { href: '/dashboard/revisiones', icon: FileText, label: 'Revisiones pendientes', badge: 'NEW', iconColor: 'text-pink-500', activeBg: 'bg-pink-100' },
    { href: '/dashboard/testimonials/create', icon: PenSquare, label: 'Crear testimonio', iconColor: 'text-teal-500', activeBg: 'bg-teal-100' },
    { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics', iconColor: 'text-red-500', activeBg: 'bg-red-100' },
    { href: '/dashboard/biblioteca', icon: ImageIcon, label: 'Biblioteca multimedia', iconColor: 'text-blue-500', activeBg: 'bg-blue-100' },
  ];

  const getStatusColor = (status: Editor['status']) => {
    switch (status) {
      case 'active': return 'border-2 border-green-500 text-green-600'; // Ring style
      case 'wait': return 'border-2 border-yellow-500 text-yellow-600';
      case 'offline': return 'border-2 border-gray-300 text-gray-400';
      default: return 'border-gray-300';
    }
  };

  return (
    <aside className="w-72 bg-[#F5F7F9] rounded-[2.5rem] p-6 flex flex-col min-h-[calc(100vh-6rem)]">

      {/* Navigation Menu */}
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                }`}
            >
              {/* Icon Container */}
              <div className={`p-1 rounded ${isActive ? '' : ''} ${item.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>

              <span className={`flex-1 text-sm font-semibold ${isActive ? 'text-gray-800' : 'text-gray-500 group-hover:text-gray-700'}`}>
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

        {/* Categorías */}
        <div className="pt-4">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-white/50 w-full transition-colors">
            <div className="w-6 h-6 flex items-center justify-center bg-blue-100 rounded text-blue-500">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <span className="flex-1 text-sm font-semibold text-left">Categorías</span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </button>
        </div>

        {/* Editores Section */}
        <div className="pt-2">
          <button
            onClick={() => setShowEditores(!showEditores)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-white/50 w-full transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center bg-yellow-100 rounded text-yellow-600">
              <Users className="w-4 h-4" />
            </div>
            <span className="flex-1 text-sm font-semibold text-left">Editores</span>
            <span className="w-5 h-5 flex items-center justify-center bg-white text-gray-600 text-xs font-bold rounded-full shadow-sm">
              {editores.length}
            </span>
            {showEditores ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
          </button>

          {showEditores && (
            <div className="mt-2 space-y-2 pl-2">
              {editores.map((editor) => (
                <div key={editor.id} className="flex items-center gap-3 px-4 py-1.5">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden">
                      {/* Placeholder avatar */}
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${editor.name}`} alt="avatar" />
                    </div>
                  </div>
                  <span className="flex-1 text-sm font-medium text-gray-600">{editor.name}</span>
                  {/* Status dot similar a la imagen (círculos vacíos con borde de color) */}
                  <div className={`w-2.5 h-2.5 rounded-full border-2 ${editor.status === 'active' ? 'border-green-500' :
                    editor.status === 'wait' ? 'border-yellow-400' : 'border-gray-300'
                    }`} />
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Bottom Actions (Settings) */}
      <div className="mt-4 pt-4">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-white/50 w-full transition-colors">
          <Settings className="w-5 h-5 text-yellow-500" /> {/* Icono amarillo en la foto */}
          <span className="text-sm font-semibold">Gestionar editores/permisos</span>
        </button>
      </div>
    </aside>
  );
}