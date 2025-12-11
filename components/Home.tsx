"use client";
import { useStore } from "@/store/zustand";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Button from "@/components/Button";
import UserInfo from "@/components/UserInfo";
import OrganizationModal from "@/components/Modals/OrganizationModal";
import DeleteModal from "@/components/Modals/DeleteModal";
import api from "@/services/config";
import { useState, useEffect } from "react";
import useRefreshAccessTokenClient from "@/hooks/useRefreshToken.client";
import { SquarePen, Users, Trash2 } from "lucide-react";
interface Organization {
  id: string;
  name: string;
  description: string;
  role: string;
  editors: number;
  createdAt: string;
}

export default function Home() {
  const { setCurrentOrganization } = useStore();
  const { data: session } = useSession();
  const refreshAccessToken = useRefreshAccessTokenClient();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] =
    useState<Organization | null>(null);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: resp } = await api.get("/organization/my-organizations", {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      });
      const data = resp.data;
      // asegurar que no haya duplicados por id (a veces la API puede devolver entradas repetidas)
      if (Array.isArray(data)) {
        const unique = Array.from(
          new Map(data.map((o: any) => [o.id, o])).values()
        );
        setOrganizations(unique);
      } else {
        setOrganizations([]);
      }
    } catch (err) {
      console.error("Error fetching organizations:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchOrganizations();
    }
  }, [session]);

  const toggleOrganization = (organization: Organization) => {
    // Guardamos únicamente el ID (string) para mantener compatibilidad con el resto del código
    setCurrentOrganization(organization.id);
    redirect("/dashboard");
  };

  const handleCreateNew = () => {
    setSelectedOrganization(null);
    setIsModalOpen(true);
  };

  const handleEdit = (organization: Organization, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOrganization(organization);
    setIsModalOpen(true);
  };

  const openDeleteModal = (organization: Organization, e: React.MouseEvent) => {
    e.stopPropagation();
    setOrganizationToDelete(organization);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteClose = () => {
    setIsDeleteModalOpen(false);
    setOrganizationToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!organizationToDelete) return;

    const doRequest = async (token?: string | null) => {
      return api.delete(`/organization/${organizationToDelete.id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    };

    try {
      const token = session?.user?.accessToken as string | undefined;
      await doRequest(token);
      await refreshAccessToken();
      fetchOrganizations();
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          await doRequest(newToken);
          fetchOrganizations();
          return;
        }
      }
      throw err;
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOrganization(null);
  };

  const handleModalSuccess = () => {
    fetchOrganizations();
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
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
          <div className="mx-auto max-w-7xl mt-8 mb-12 px-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="bg-winered rounded-full px-6 py-2 w-fit">
                <h2 className="text-3xl font-semibold text-white">
                  Sus organizaciones
                </h2>
              </div>

              <Button
                variant="wineAlt"
                size="fit"
                className="px-4"
                onClick={handleCreateNew}
              >
                Crear nueva organización
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-winered"></div>
            </div>
          ) : error || organizations.length === 0 ? (
            <div className="text-center py-20">
              <div className="mx-auto max-w-md">
                <div className="bg-card border-4 border-winered/30 rounded-3xl p-8">
                  <Users
                    size={64}
                    className="mx-auto text-foreground/20 mb-4"
                  />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    No tienes organizaciones
                  </h3>
                  <p className="text-foreground/60 mb-6">
                    {error
                      ? "No se pudieron cargar las organizaciones. Intenta nuevamente."
                      : "Comienza creando tu primera organización para empezar a trabajar."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((organization) => (
                <div
                  key={organization.id}
                  className="border-6 border-winered/30 rounded-3xl overflow-hidden bg-card hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => toggleOrganization(organization)}
                >
                  <div className="flex items-center justify-between px-6 py-3">
                    <span className="px-3 py-1 border-2 border-winered text-skyblue text-sm font-medium rounded-full">
                      {organization.role}
                    </span>
                    <div>
                      <button
                        className="p-2 transform hover:scale-110 transition-colors"
                        onClick={(e) => handleEdit(organization, e)}
                      >
                        <SquarePen size={28} className="text-skyblue" />
                      </button>
                      <button
                        className="p-2 ml-2 text-red-600 hover:text-red-700"
                        onClick={(e) => openDeleteModal(organization, e)}
                        title="Eliminar organización"
                      >
                        <Trash2 size={28} className="text-winered" />
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-14 flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {organization.name}
                    </h3>
                    <p className="text-foreground/60 text-sm">
                      {organization.description}
                    </p>
                  </div>

                  <div className="px-6 py-4 text-xl flex items-center justify-between">
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
                      {formatDate(organization.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 text-center py-12">
          <p className="text-foreground/60">
            Landing page para usuario no logueado
          </p>
        </div>
      )}

      <OrganizationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        organization={selectedOrganization}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Organización"
        message="¿Seguro que quieres eliminar esta organización?"
        itemName={organizationToDelete?.name}
      />
    </main>
  );
}
