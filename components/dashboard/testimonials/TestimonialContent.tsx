"use client";

import Image from "next/image";
import Button from "@/components/Button";
import EditIcon from "@/public/pencilIcon.svg";
import CheckboxSuccess from "@/public/checkbox-succes.svg";

interface Testimonial {
  id: string;
  client: string;
  course: string;
  received: string;
  editor: string;
  content: string;
  email?: string;
  image?: string;
  name?: string;
  role?: string;
  review?: string;
  createdAt?: string;
}

interface TestimonialContentProps {
  testimonial: Testimonial;
  isAdmin: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onSaveChanges?: () => void;
}

export default function TestimonialContent({
  testimonial,
  isAdmin,
  onApprove,
  onReject,
  onSaveChanges,
}: TestimonialContentProps) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex mb-6 ">
        <h1 className="text-3xl font-semibold px-6 py-1 rounded-lg  bg-btn-warning/10 text-btn-warning hover:brightness-95 dark:hover:brightness-110">
          Detalles del testimonio
        </h1>
        <h2 className="text-3xl font-semibold ml-auto text-btn-warning hover:brightness-95 dark:hover:brightness-110">
          Editor a cargo: {testimonial.name || testimonial.editor}
        </h2>
      </div>

      <div className=" p-6 space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="text-md lg:text-xl  lg:col-span-2 space-y-6 flex flex-col justify-center">
            <p>
              <strong>Curso relacionado: </strong>
              {testimonial.role || testimonial.course}
            </p>
            <p>
              <strong>Email:</strong> {testimonial.email}
            </p>
            <p>
              <strong>Categoria: </strong>
              <span>{testimonial.review}</span>
            </p>
            <p>
              <strong>Fecha de recepción:</strong>{" "}
              {testimonial.createdAt
                ? new Date(testimonial.createdAt).toLocaleDateString("es-AR")
                : testimonial.received}
            </p>
          </div>

          <div className="pr-0 lg:pr-10 lg:col-span-1 flex justify-center lg:justify-end items-start">
            <div className="border-3 border-[#bf6a0252] py-2 px-4 rounded-lg">
              <div className="relative w-60 h-60 lg:w-76 lg:h-76">
                <Image
                  src={testimonial.image || "/default-avatar.png"}
                  alt={`Foto de ${testimonial.name || testimonial.editor}`}
                  fill
                  className="object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <h3 className="font-bold text-xl mb-4 flex">
            Testimonio en texto
            <span>
              <Image
                src={EditIcon}
                alt="Editar"
                width={32}
                height={32}
                className="ml-5 justify-center items-center"
              />
            </span>
            Editar
          </h3>

          <div className="border-3 border-[#bf6a0252] p-12 rounded-lg bg-gray-50">
            <p className="text-gray-700 leading-relaxed">
              {testimonial.content}
            </p>
          </div>
        </div>

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
