import { Search, MessageSquare, Bell, Users, BarChart2 } from "lucide-react";

interface TopBarProps {
  user: {
    name?: string | null;
    image?: string | null;
  } | null;
}

export default function Topbar({ user }: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-8 py-6 bg-white">
      {/* Izquierda: Saludo y Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
          {/* Si tienes imagen real úsala, si no la inicial */}
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name || ""}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{user?.name?.charAt(0) || "U"}</span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-700">
          ¡Hola {user?.name || "Usuario"}!
        </h1>
      </div>

      {/* Centro: Buscador */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative group">
          <input
            type="text"
            placeholder="buscar"
            className="w-full bg-white border border-gray-200 rounded-full py-3 px-6 pl-6 pr-12 text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-100 shadow-sm transition-all"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Derecha: Iconos de acción */}
      <div className="flex items-center gap-4">
        <button className="p-2 bg-pink-100 text-pink-500 rounded-lg hover:bg-pink-200 transition">
          <MessageSquare className="w-5 h-5" />
        </button>
        <button className="p-2 bg-teal-100 text-teal-500 rounded-lg hover:bg-teal-200 transition">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition">
          <Users className="w-5 h-5" />
        </button>
        <button className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition">
          <BarChart2 className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}