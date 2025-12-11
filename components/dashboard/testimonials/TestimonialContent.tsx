"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import CheckboxSuccess from "@/public/checkbox-succes.svg";
import { Testimonial } from "@/services/testimonial.service";
import { PencilLine } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

interface TestimonialContentProps {
  testimonial: Testimonial;
  isAdmin: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onSaveChanges?: (newBody: string) => void;
  // nuevos flags
  approving?: boolean;
  rejecting?: boolean;
  saving?: boolean;
}

const getVideoId = (url: string): string | null => {
  if (!url) return null;
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
};

/**
 * Normaliza status localmente por si el componente recibe valores en inglés.
 */
const normalizeStatusLocal = (
  status?: string | null
): "pendiente" | "aprobado" | "rechazado" => {
  if (!status) return "pendiente";
  const s = String(status).trim().toLowerCase();
  if (s === "approved" || s === "aprobado") return "aprobado";
  if (s === "rejected" || s === "rechazado") return "rechazado";
  if (s === "pending" || s === "pendiente") return "pendiente";
  return "pendiente";
};

export default function TestimonialContent({
  testimonial,
  isAdmin,
  onApprove,
  onReject,
  onSaveChanges,
  approving = false,
  rejecting = false,
  saving = false,
}: TestimonialContentProps) {
  // Soporte para media_type (snake) o mediaType (camel)
  const mediaType =
    (testimonial as any).media_type || (testimonial as any).mediaType;
  const mediaUrl =
    testimonial.media_url || testimonial.image || testimonial.media_url;

  const isVideo = mediaType === "video" && mediaUrl;
  const isImage = mediaType === "image" && mediaUrl;
  const videoId = isVideo ? getVideoId(String(mediaUrl || "")) : null;

  const authorName =
    testimonial.author_name ||
    testimonial.author ||
    testimonial.editor ||
    "Anónimo";
  const title = testimonial.title || "Testimonio";
  const body = testimonial.body || testimonial.content || "";
  const createdDate = testimonial.created_at || testimonial.createdAt;

  // Normalizar status localmente (para evitar discrepancias idioma)
  const status = normalizeStatusLocal(testimonial.status);
  // Determinar qué botones mostrar según el status
  const showApproveButton = status !== "aprobado";
  const showRejectButton = status === "pendiente";

  const [editableBody, setEditableBody] = useState<string>(body);

  useEffect(() => {
    setEditableBody(body);
  }, [body, testimonial.id]);

  const { data: categories = [] } = useCategories();
  const categoryName =
    categories.find((c: any) => c.id === testimonial.category_id)?.name ||
    testimonial.category_id ||
    "Sin categoría";

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex md:justify-center mb-6">
        <h2 className="text-3xl font-semibold ml-auto px-6 py-1 rounded-lg bg-btn-warning/10 text-btn-warning hover:brightness-95 dark:hover:brightness-110">
          Editor a cargo: {authorName}
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Layout para VIDEO */}
        {isVideo && videoId ? (
          <>
            <div className="w-full">
              <div
                className="relative w-full aspect-video border-5 bg-gray-200 border-[#bf6a0270] rounded-lg overflow-hidden"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="Video testimonio"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Detalles - más grandes */}
              <div className="space-y-6">
                <h3 className="font-bold text-2xl">Detalles</h3>
                <div className="space-y-4 text-lg">
                  <p>
                    <strong>Nombre del cliente: </strong>
                    {authorName}
                  </p>
                  <p>
                    <strong>Email:</strong> {testimonial.email}
                  </p>
                  <p>
                    <strong>Categoría: </strong>
                    <span>{categoryName}</span>
                  </p>
                  <p>
                    <strong>Fecha de recepción:</strong>{" "}
                    {createdDate
                      ? new Date(createdDate).toLocaleDateString("es-AR")
                      : testimonial.received}
                  </p>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <h3 className="font-bold text-xl mb-4 flex items-center">
                  <span>Descripción del testimonio</span>
                  <PencilLine size={32} className="ml-5" />
                </h3>
                <div className="border-4 border-[#bf6a0252] p-6 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <textarea
                    value={editableBody}
                    onChange={(e) => setEditableBody(e.target.value)}
                    disabled={!isAdmin}
                    placeholder="Editar descripción..."
                    className="w-full h-56 p-4 resize-none text-gray-700 dark:text-gray-300 bg-transparent focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </>
        ) : isImage ? (
          /* Layout para IMAGEN */
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="text-md lg:text-xl lg:col-span-2 space-y-6 flex flex-col justify-center">
                <p>
                  <strong>Nombre del cliente: </strong>
                  {authorName}
                </p>
                <p>
                  <strong>Email:</strong> {testimonial.email}
                </p>
                <p>
                  <strong>Categoría: </strong>
                  <span>{categoryName}</span>
                </p>
                <p>
                  <strong>Fecha de recepción:</strong>{" "}
                  {createdDate
                    ? new Date(createdDate).toLocaleDateString("es-AR")
                    : testimonial.received}
                </p>
              </div>

              <div className="pr-0 lg:pr-10 lg:col-span-1 flex justify-center lg:justify-end items-start">
                <div className="border-3 border-[#bf6a0252] py-2 px-4 rounded-lg">
                  <div className="relative w-60 h-60 lg:w-76 lg:h-76">
                    <Image
                      src={
                        testimonial.media_url ||
                        testimonial.image ||
                        "/default-avatar.png"
                      }
                      alt={`Foto de ${authorName}`}
                      fill
                      className="object-cover rounded-lg shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonio en texto para imágenes */}
            <div className="pt-8">
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <span>Testimonio en texto</span>
                <PencilLine size={32} className="ml-5" />
              </h3>
              <div className="border-4 border-[#bf6a0252] p-12 rounded-lg bg-gray-50 dark:bg-gray-900">
                <textarea
                  value={editableBody}
                  onChange={(e) => setEditableBody(e.target.value)}
                  disabled={!isAdmin}
                  placeholder="Editar testimonio..."
                  className="w-full h-40 p-4 resize-none text-gray-700 dark:text-gray-300 bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </>
        ) : (
          /* Layout para SOLO TEXTO (sin imagen ni video) */
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Detalles - columna más pequeña */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="font-bold text-2xl">Detalles</h3>
              <div className="space-y-4 text-lg">
                <p>
                  <strong>Nombre del cliente: </strong>
                  {authorName}
                </p>
                <p>
                  <strong>Email:</strong> {testimonial.email}
                </p>
                <p>
                  <strong>Categoría: </strong>
                  <span>{categoryName}</span>
                </p>
                <p>
                  <strong>Fecha de recepción:</strong>{" "}
                  {createdDate
                    ? new Date(createdDate).toLocaleDateString("es-AR")
                    : testimonial.received}
                </p>
              </div>
            </div>

            {/* TextArea más grande para solo texto */}
            <div className="lg:col-span-3">
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <span>Testimonio completo</span>
                <PencilLine size={32} className="ml-5" />
              </h3>
              <div className="border-4 border-[#bf6a0252] p-8 rounded-lg bg-gray-50 dark:bg-gray-900">
                <textarea
                  value={editableBody}
                  onChange={(e) => setEditableBody(e.target.value)}
                  disabled={!isAdmin}
                  placeholder="Editar testimonio..."
                  className="w-full h-96 p-4 resize-none text-gray-700 dark:text-gray-300 bg-transparent focus:outline-none text-lg"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex ml-auto mt-8 lg:mt-14 p-4 rounded-2xl bg-btn-success/25 w-fit gap-3 items-center">
          <Image
            src={CheckboxSuccess}
            alt="Checkbox success"
            width={24}
            height={24}
            className="pointer-events-none"
          />
          <label className="font-bold pr-10">
            Testimonio con consentimiento
          </label>
        </div>

        {/* Botones según el status */}
        {isAdmin && (
          <div className="flex gap-5 ml-auto justify-end pt-8">
            {showApproveButton && (
              <Button
                color="green"
                size="fit"
                onClick={onApprove}
                disabled={approving || rejecting || saving}
              >
                {approving ? "Aprobando..." : "Aprobar"}
              </Button>
            )}
            {showRejectButton && (
              <Button
                color="red"
                size="fit"
                onClick={onReject}
                disabled={approving || rejecting || saving}
              >
                {rejecting ? "Rechazando..." : "Rechazar"}
              </Button>
            )}
            <Button
              color="orange"
              size="fit"
              onClick={() => onSaveChanges?.(editableBody)}
              disabled={approving || rejecting || saving}
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
