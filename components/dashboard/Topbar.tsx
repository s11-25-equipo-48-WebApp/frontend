"use client";
import { useState, useRef, useEffect } from "react";
import { X, CloudUpload } from "lucide-react";
import Button from "@/components/Button";
import SignOutButton from "@/components/SignOutButton";
import { useUser } from "@/hooks/useUser";
import { uploadToCloudinary } from "@/hooks/useCloudinary";
import { toast } from "react-toastify";

interface TopBarProps {
  user: {
    name?: string | null;
    image?: string | null;
  } | null;
  onUserUpdate?: () => void;
}

export default function Topbar({ user, onUserUpdate }: TopBarProps) {
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [previewImage, setPreviewImage] = useState(user?.image || "");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { updateUser, isLoading } = useUser();

  // Sincronizar el nombre cuando cambia el usuario o se abre el modal
  useEffect(() => {
    if (showModal) {
      setNewName(user?.name || "");
      setPreviewImage(user?.image || "");
      setIsEditingName(false);
    }
  }, [showModal, user?.name, user?.image]);

  // Verificar si el nombre ha cambiado
  const hasNameChanged = newName.trim() !== "" && newName !== user?.name;

  /**
   * Habilita el modo de edición del nombre
   */
  const handleEnableNameEdit = () => {
    setIsEditingName(true);
  };

  /**
   * Confirma el cambio de nombre del usuario
   */
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
      toast.success("¡Nombre actualizado correctamente!");
      onUserUpdate?.();
      setIsEditingName(false);
    }
  };

  /**
   * Abre el selector de archivos
   */
  const handleUploadPhoto = () => {
    fileInputRef.current?.click();
  };

  /**
   * Maneja la selección de archivo y subida a Cloudinary
   */
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);

    try {
      const uploadResult = await uploadToCloudinary({
        file,
        folder: "user_avatars",
      });

      if (uploadResult.success && uploadResult.url) {
        const result = await updateUser({ avatar_url: uploadResult.url });
        
        if (result) {
          setPreviewImage(uploadResult.url);
          toast.success("¡Foto actualizada correctamente!");
          onUserUpdate?.();
        }
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Error al subir la foto");
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <header className="flex items-center justify-between px-8 py-6 bg-white">
        <div
          className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setShowModal(true)}
        >
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
            {previewImage || user?.image ? (
              <img
                src={previewImage || user?.image || ""}
                alt={user?.name || ""}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-700">
            ¡Hola {user?.name || "Usuario"}!
          </h1>
        </div>
      </header>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

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
                className="cursor-pointer text-gray-500 hover:text-gray-600 transition-colors"
              >
                <X size={26} />
              </button>
            </div>

            {/* Foto de perfil */}
            <div className="flex justify-between items-center gap-4 mb-6">
              <div className="w-18 h-18 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-3xl overflow-hidden">
                {previewImage || user?.image ? (
                  <img
                    src={previewImage || user?.image || ""}
                    alt={user?.name || ""}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
                )}
              </div>

              <button
                onClick={handleUploadPhoto}
                disabled={isUploadingPhoto || isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full hover:bg-gray-100 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CloudUpload size={20} />
                {isUploadingPhoto ? "Subiendo..." : "Subir foto"}
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
                disabled={!isEditingName || isLoading}
                className={`w-full rounded-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-winered focus:border-transparent transition-colors ${
                  !isEditingName 
                    ? "bg-gray-200 text-gray-600 cursor-not-allowed" 
                    : "bg-white text-gray-900"
                } disabled:opacity-70`}
              />
            </div>
            
            <div className="flex flex-col space-y-4">
              {!isEditingName ? (
                <Button
                  onClick={handleEnableNameEdit}
                  variant="wine"
                  className="px-10"
                  disabled={isLoading || isUploadingPhoto}
                >
                  Cambiar nombre
                </Button>
              ) : (
                <Button
                  onClick={handleConfirmNameChange}
                  variant="wine"
                  className="px-10"
                  disabled={isLoading || isUploadingPhoto || !hasNameChanged}
                >
                  {isLoading ? "Confirmando..." : "Confirmar cambio"}
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