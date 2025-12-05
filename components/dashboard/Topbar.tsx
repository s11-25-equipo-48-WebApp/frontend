"use client";
import { useState } from "react";
import { Search, X, CloudUpload } from "lucide-react";
import Button from "@/components/Button";
import SignOutButton from "@/components/SignOutButton";

interface TopBarProps {
  user: {
    name?: string | null;
    image?: string | null;
  } | null;
}

export default function Topbar({ user }: TopBarProps) {
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");

  const handleChangeName = () => {
    console.log("Cambiar nombre a:", newName);
    // Aquí iría la lógica para cambiar el nombre
  };

  const handleUploadPhoto = () => {
    console.log("Subir foto");
    // Aquí iría la lógica para subir foto
  };

  return (
    <>
      <header className="flex items-center justify-between px-8 py-6 bg-white">
        {/* Centro: Buscador */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-xl">
            <div className="relative group">
              <input
                type="text"
                placeholder="buscar"
                className="w-full bg-white border border-gray-200 rounded-full py-3 px-6 pl-6 pr-12 text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-100 shadow-sm transition-all"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Derecha: Usuario */}
        <div
          className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setShowModal(true)}
        >
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
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
      </header>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-8">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowModal(false)}
          />

          <div
            className="relative bg-[#DBD1D5] rounded-2xl shadow-2xl p-6 w-96 mt-20 mr-8 animate-in slide-in-from-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowModal(false)}
                className=" cursor-pointer  text-gray-500 hover:text-gray-600 transition-colors"
              >
                <X size={26} />
              </button>
            </div>

            {/* Foto de perfil */}
            <div className="flex justify-between items-center gap-4 mb-6">
              <div className="w-18 h-18 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-3xl overflow-hidden">
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

              <button
                onClick={handleUploadPhoto}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <CloudUpload size={20} />
                Subir foto
              </button>
            </div>

            {/* Input de nombre */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-md font-medium mb-2">
                Nombre de usuario:
              </label>
              <input
                id="name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-full px-4 py-3 bg-white border border-gray-300  focus:outline-none focus:ring-2 focus:ring-winered focus:border-transparent"
              />
            </div>
            <div className="flex flex-col space-y-4 ">
              <Button
                onClick={handleChangeName}
                variant="wine"
                className="px-10"
              >
                Cambiar
              </Button>

              <SignOutButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
