"use client";

import Image from "next/image";
import Button from "@/components/Button";
import EditIcon from "@/public/pencilIcon.svg";
import CheckboxSuccess from "@/public/checkbox-succes.svg";

interface Testimonial {
  id: string;
  title: string;
  body: string;
  email?: string;
  media_url?: string;
  media_type?: "image" | "video" | "none";
  author_name?: string;
  category_id?: string;
  tags?: string[];
  status?: "pending" | "approved" | "rejected";
  created_at?: string;
  // Campos legacy para compatibilidad
  client?: string;
  course?: string;
  received?: string;
  editor?: string;
  image?: string;
  author?: string;
  role?: string;
  createdAt?: string;
  content?: string;
}

interface TestimonialContentProps {
  testimonial: Testimonial;
  isAdmin: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onSaveChanges?: () => void;
}

const getVideoId = (url: string): string | null => {
  if (!url) return null;
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
};

export default function TestimonialContent({
  testimonial,
  isAdmin,
  onApprove,
  onReject,
  onSaveChanges,
}: TestimonialContentProps) {
  const isVideo = testimonial.media_type === "video" && testimonial.media_url;
  const isImage = testimonial.media_type === "image" && testimonial.media_url;
  const videoId = isVideo ? getVideoId(testimonial.media_url || "") : null;

  const authorName =
    testimonial.author_name ||
    testimonial.author ||
    testimonial.editor ||
    "Anónimo";
  const title = testimonial.title || "Testimonio";
  const body = testimonial.body || testimonial.content || "";
  const createdDate = testimonial.created_at || testimonial.createdAt;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex mb-6 ">
        <h1 className="text-3xl font-semibold px-6 py-1 rounded-lg  bg-btn-warning/10 text-btn-warning hover:brightness-95 dark:hover:brightness-110">
          Detalles del testimonio
        </h1>
        <h2 className="text-3xl font-semibold ml-auto text-btn-warning hover:brightness-95 dark:hover:brightness-110">
          Editor a cargo: {authorName}
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Media Section - Full width for video, grid for image */}
        {isVideo && videoId ? (
          <div className="w-full">
            <div
              className="relative w-full bg-black rounded-lg overflow-hidden"
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
        ) : isImage ? (
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
                <strong>Categoria: </strong>
                <span>{testimonial.category_id}</span>
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
        ) : (
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
                <strong>Categoria: </strong>
                <span>{testimonial.category_id}</span>
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
                    src={testimonial.image || "/default-avatar.png"}
                    alt={`Foto de ${authorName}`}
                    fill
                    className="object-cover rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Layout condicional para video: detalles abajo */}
        {isVideo && videoId && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-xl">Detalles</h3>
              <div className="space-y-3">
                <p>
                  <strong>Nombre del cliente: </strong>
                  {authorName}
                </p>
                <p>
                  <strong>Email:</strong> {testimonial.email}
                </p>
                <p>
                  <strong>Categoria: </strong>
                  <span>{testimonial.category_id}</span>
                </p>
                <p>
                  <strong>Fecha de recepción:</strong>{" "}
                  {createdDate
                    ? new Date(createdDate).toLocaleDateString("es-AR")
                    : testimonial.received}
                </p>
              </div>
            </div>

            <div className="pt-8">
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <span>Descripción del testimonio</span>
                <Image
                  src={EditIcon}
                  alt="Editar"
                  width={32}
                  height={32}
                  className="ml-5"
                />
              </h3>
              <div className="border-3 border-[#bf6a0252] p-6 rounded-lg bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {body}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Testimonio en texto - Solo mostrar si NO es video */}
        {!isVideo && (
          <div className="pt-8">
            <h3 className="font-bold text-xl mb-4 flex items-center">
              <span>Testimonio en texto</span>
              <Image
                src={EditIcon}
                alt="Editar"
                width={32}
                height={32}
                className="ml-5"
              />
            </h3>

            <div className="border-3 border-[#bf6a0252] p-12 rounded-lg bg-gray-50 dark:bg-gray-900">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {body}
              </p>
            </div>
          </div>
        )}

        <div className="flex ml-auto mt-8 lg:mt-14 p-4 rounded-lg bg-btn-success/25 w-fit gap-3 items-center">
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

        {/* Solo mostrar botones si es Admin */}
        {isAdmin && (
          <div className="flex gap-5 ml-auto justify-end pt-8">
            <Button color="green" size="fit" onClick={onApprove}>
              Aprobar
            </Button>
            <Button color="red" size="fit" onClick={onReject}>
              Rechazar
            </Button>
            <Button color="orange" size="fit" onClick={onSaveChanges}>
              Guardar Cambios
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
