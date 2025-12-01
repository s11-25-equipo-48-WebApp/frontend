"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import ManagementCard from "@/components/dashboard/ManagementCard";

interface AddUserCardProps {
  onClose?: () => void;
  onConfirm?: (emails: string[]) => void | Promise<void>;
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
    setEmails([""]);
  };

  return (
    <ManagementCard
      icon={<Users size={24} />}
      title="Invitar colaboradores"
      description="Tu organización ha sido creada. Invita colegas para colaborar en tu organización. "
      onConfirm={handleConfirm}
      onReset={handleReset}
      confirmLabel="Confirmar"
      resetLabel="Cancelar"
      isLoading={isLoading}
    >
      <div>
        <h2 className="text-gray-600">
          ingresar los correos de los colaboradores:
        </h2>
      </div>
      {/* Inputs de emails */}
      <div className="space-y-3">
        {emails.map((email, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => handleEmailChange(index, e.target.value)}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-md outline-0 focus:border-foreground/50"
              disabled={isLoading}
            />
            {emails.length > 1 && (
              <button
                onClick={() => handleRemoveEmail(index)}
                className="px-3 py-2 text-sm text-red-500 bg-red-500/10 curosr-pointer text-destructive hover:bg-destructive/10 rounded-md transition-colors"
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
        className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
        disabled={isLoading}
      >
        + Agregar otro
      </button>
    </ManagementCard>
  );
}
