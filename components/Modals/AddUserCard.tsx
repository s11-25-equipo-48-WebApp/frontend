"use client";

import { useState } from "react";
import { UserRoundPlus, Mail } from "lucide-react";
import ManagementCard from "@/components/dashboard/ManagementCard";

interface AddUserCardProps {
  onClose?: () => void;
  onConfirm?: (_emails: string[]) => void | Promise<void>;
}

export default function AddUserCard({ onClose, onConfirm }: AddUserCardProps) {
  const [emails, setEmails] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleAddEmail = () => {
    setEmails([...emails, ""]);
  };

  const handleRemoveEmail = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const validEmails = emails.filter((email) => email.trim() !== "");
      if (validEmails.length > 0) {
        await onConfirm?.(validEmails);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    onClose?.();
  };

  return (
    <ManagementCard
      icon={
        <div className="bg-yellow-500 text-white shadow-xl rounded-lg p-3">
          <UserRoundPlus size={24} />
        </div>
      }
      title="Invitar colaboradores"
      description="Tu organización ha sido creada. Invita colegas para colaborar en tu organización. "
      onConfirm={handleConfirm}
      onReset={handleReset}
      confirmLabel="Confirmar"
      resetLabel="Cancelar"
      isLoading={isLoading}
    >
      <div>
        <h2 className="text-foreground text-lg font-semibold">
          ingresar los correos de los colaboradores:
        </h2>
      </div>
      {/* Inputs de emails */}
      <div className="space-y-3">
        {emails.map((email, index) => (
          <div key={index} className="flex gap-2">
            {/* ✅ Contenedor flex para input + icono */}
            <div className="flex-1 flex items-center gap-3 py-3 px-4 bg-white border border-gray-300 rounded-md focus-within:border-foreground/50">
              <Mail size={20} className="text-gray-400 shrink-0" />

              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                className="flex-1 bg-transparent outline-0"
                disabled={isLoading}
              />
            </div>

            {emails.length > 1 && (
              <button
                onClick={() => handleRemoveEmail(index)}
                className="px-3 py-2 text-sm text-red-500 bg-red-500/10 cursor-pointer hover:bg-red-500/20 rounded-md transition-colors"
                disabled={isLoading}
              >
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Botón agregar más */}
      <button
        onClick={handleAddEmail}
        className="text-sm text-white px-3 py-2 rounded-md border-2 border-white rounded-r-3xl bg-foreground/50 hover:bg-foreground font-medium duration-400 ease-in-out hover:scale-105 cursor-pointer "
        disabled={isLoading}
      >
        + Agregar otro
      </button>
    </ManagementCard>
  );
}
