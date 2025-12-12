"use client";
import { useState, useRef, useEffect } from "react";
import { X, CloudUpload, User, Menu } from "lucide-react";
import Link from "next/link";
import Button from "@/components/Button";
import SignOutButton from "@/components/SignOutButton";
import { useUser } from "@/hooks/useUser";
import { useOrganization } from "@/hooks/useOrganization";
import { uploadToCloudinary } from "@/hooks/useCloudinary";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface TopBarProps {
  user: {
    name?: string | null;
    image?: string | null;
  } | null;
}

export default function Topbar({ user }: TopBarProps) {
  const [showModal, setShowModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { updateUser, isLoading } = useUser();
  const { organization } = useOrganization();
  const { data: session, update: updateSession } = useSession();

  const currentImage = session?.user?.image || user?.image || "";
  const currentName = session?.user?.name || user?.name || "Usuario";

  useEffect(() => {
    if (showModal) {
      setNewName(session?.user?.name || user?.name || "");
      setIsEditingName(false);
    }
  }, [showModal, session?.user?.name, user?.name]);

  // Prevenir scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMobileMenu]);

  const hasNameChanged = newName.trim() !== "" && newName !== currentName;

  const handleEnableNameEdit = () => {
    setIsEditingName(true);
  };

  const handleConfirmNameChange = async () => {
    if (!newName.trim()) {
      toast.error("El nombre no puede estar vacío");
      return;
    }

    if (!hasNameChanged) {
      toast.info("El nombre no ha cambiado");
      return;
    }

    const result = await updateUser({ name: newName });

    if (result) {
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: result.name,
        },
      });

      setIsEditingName(false);
    }
  };

  const handleUploadPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar los 5MB");
      return;
    }

    setIsUploadingPhoto(true);

    try {
      const currentSession = await updateSession();

      if (!currentSession?.user?.accessToken) {
        toast.error(
          "No hay una sesión activa. Por favor inicia sesión nuevamente."
        );
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 2000);
        return;
      }

      const uploadResult = await uploadToCloudinary({
        file,
        folder: "user_avatars",
      });

      if (!uploadResult.success || !uploadResult.url) {
        throw new Error(
          uploadResult.error || "Error al subir la imagen a Cloudinary"
        );
      }

      const result = await updateUser({
        profile: {
          avatar_url: uploadResult.url,
        },
      });

      if (result) {
        await updateSession({
          ...currentSession,
          user: {
            ...currentSession.user,
            image: uploadResult.url,
          },
        });

        toast.success("Foto de perfil actualizada correctamente");
      }
    } catch (error: any) {
      console.error("Error uploading photo:", error);

      if (error?.response?.status === 401) {
        toast.error("Sesión expirada. Por favor inicia sesión nuevamente.");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 2000);
      } else {
        toast.error(
          error?.message ||
            "Error al subir la foto. Por favor intenta de nuevo."
        );
      }
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const openProfileModal = () => {
    setShowModal(true);
    setShowMobileMenu(false);
  };

  return (
    <>
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-lg sm:text-xl font-bold text-gray-900 border-3 p-1 px-4 border-winered rounded-bl-3xl rounded-tr-3xl hover:text-gray-700 transition-colors"
              >
                <span className="hidden sm:inline">
                  {organization?.name || "Mi Organización"}
                </span>
                <span className="sm:hidden">
                  {organization?.name?.slice(0, 4) || "MO"}
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-gray-50 transition-all duration-200 group cursor-pointer"
              >
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {currentName}
                </span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden shadow-md ring-2 ring-white group-hover:ring-gray-100 transition-all">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt={currentName}
                      className="w-full h-full object-cover"
                      key={currentImage}
                    />
                  ) : (
                    <span>{currentName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </button>
            </div>

            {/* Mobile: Botón hamburguesa */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                aria-label="Abrir menú"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowMobileMenu(false)}
          />

          <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-card shadow-2xl transform transition-transform duration-300 ease-out">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menú</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <button
                onClick={openProfileModal}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold overflow-hidden shadow-md ring-2 ring-white flex-shrink-0">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt={currentName}
                      className="w-full h-full object-cover"
                      key={currentImage}
                    />
                  ) : (
                    <span className="text-xl">
                      {currentName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {currentName}
                  </p>
                  <p className="text-xs text-gray-500">Ver perfil</p>
                </div>
              </button>

              <div className="space-y-2">
                <Link
                  href="/"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Volver a organizaciones
                </Link>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <SignOutButton />
              </div>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploadingPhoto || isLoading}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          <div
            className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header con botón cerrar */}
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Mi Perfil
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Foto de perfil centrada */}
            <div className="flex flex-col items-center mb-6 sm:mb-8">
              <div className="relative mb-4">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-4xl sm:text-5xl overflow-hidden shadow-lg ring-4 ring-gray-100">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt={currentName}
                      className="w-full h-full object-cover"
                      key={currentImage}
                    />
                  ) : (
                    <User
                      size={48}
                      strokeWidth={1.5}
                      className="sm:w-16 sm:h-16"
                    />
                  )}
                </div>
                {/* Badge de estado */}
                <div className="absolute bottom-2 right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-4 border-white shadow-sm"></div>
              </div>

              <button
                onClick={handleUploadPhoto}
                disabled={isUploadingPhoto || isLoading}
                className="flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <CloudUpload size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="font-medium cursor-pointer">
                  {isUploadingPhoto ? "Subiendo..." : "Cambiar foto"}
                </span>
              </button>
            </div>

            {/* Input de nombre */}
            <div className="mb-6 sm:mb-8">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-3"
              >
                Nombre de usuario
              </label>
              <input
                id="name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={!isEditingName || isLoading}
                className={`w-full rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 border-2 transition-all duration-200 text-sm sm:text-base ${
                  !isEditingName
                    ? "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                } disabled:opacity-70`}
                maxLength={50}
                placeholder="Ingresa tu nombre"
              />
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col gap-3">
              {!isEditingName ? (
                <Button
                  onClick={handleEnableNameEdit}
                  variant="wine"
                  className="w-full py-3 sm:py-3.5 rounded-2xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-sm sm:text-base"
                  disabled={isLoading || isUploadingPhoto}
                >
                  Editar nombre
                </Button>
              ) : (
                <Button
                  onClick={handleConfirmNameChange}
                  variant="wine"
                  className="w-full py-3 sm:py-3.5 rounded-2xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-sm sm:text-base"
                  disabled={isLoading || isUploadingPhoto || !hasNameChanged}
                >
                  {isLoading ? "Guardando..." : "Guardar cambios"}
                </Button>
              )}

              <SignOutButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
