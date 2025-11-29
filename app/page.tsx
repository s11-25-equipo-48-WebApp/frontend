"use client";
import { useStore } from "@/store/zustand";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Button from "@/components/Button";
import { SquarePen, Users } from "lucide-react";
import UserInfo from "@/components/UserInfo";

const organizations = [
  {
    id: 1,
    name: "Organization 1",
    description: "Description 1",
    role: "Admin",
    editors: 5,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Organization 2",
    description: "Description 2",
    role: "Editor",
    editors: 3,
    createdAt: "2024-02-20",
  },
];

export default function Home() {
  const { setCurrentOrganization } = useStore();
  const { data: session } = useSession();

  const toggleOrganization = (organizationId: string) => {
    setCurrentOrganization(organizationId);
    redirect("/dashboard");
  };

  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b border-foreground/10 bg-card sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-foreground">Mi App</h1>
            </div>
            <div className="flex items-center gap-4">
              <UserInfo />
            </div>
          </div>
        </div>
      </nav>

      {session?.user ? (
        <div className="mx-auto max-w-7xl px-4 pb-8">
          <div className="flex justify-between items-center mx-auto max-w-7xl mt-8 mb-12 px-4">
            <div className="bg-winered rounded-full px-6 py-4">
              <h2 className="text-3xl font-semibold text-white">
                Sus organizaciones
              </h2>
            </div>
            <Button variant="wineAlt">Crear nueva organización</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((organization) => (
              <div
                key={organization.id}
                className="border-6 border-winered/30 rounded-3xl overflow-hidden bg-card hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => toggleOrganization(organization.id.toString())}
              >
                <div className="flex items-center justify-between px-6 py-3">
                  <span className="px-3 py-1 border-2 border-winered text-skyblue text-sm font-medium rounded-full">
                    {organization.role}
                  </span>
                  <button
                    className="p-2 transform hover:scale-110 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Aquí la lógica para editar
                    }}
                  >
                    <SquarePen size={28} className="text-skyblue" />
                  </button>
                </div>

                {/* Card Body */}
                <div className="px-6 py-14 flex flex-col items-center text-center">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {organization.name}
                  </h3>
                  <p className="text-foreground/60 text-sm">
                    {organization.description}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 text-xl  flex items-center justify-between">
                  <div>
                    <Users
                      size={28}
                      className="inline-block mr-4 text-yellow-500"
                    />
                    <span className="text-skyblue font-bold">
                      {organization.editors} Editores
                    </span>
                  </div>

                  <span className="text-black font-semibold">
                    {organization.createdAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 text-center py-12">
          <p className="text-foreground/60">
            Landing page para usuario no logueado
          </p>
        </div>
      )}
    </main>
  );
}
