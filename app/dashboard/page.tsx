"use client";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentTestimonials from "@/components/dashboard/RecentTestimonials";
import CategoriesChart from "@/components/dashboard/CategoriesChart";
import PendingTestimonials from "@/components/dashboard/PendingTestimonials";
import { useStore } from "@/store/zustand";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/config";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
// import api from '@/lib/api';
export default function DashboardPage() {
  const { currentOrganization } = useStore();
  const { data: organization } = useQuery({
    queryKey: ["organization", currentOrganization],
    queryFn: async () => {
      // const organization = await api.get(`/organizations/${currentOrganization}`)
      // return organization.data
      return {
        name: "Organization " + currentOrganization,
        description: "Description " + currentOrganization,
      };
    },
    enabled: !!currentOrganization,
  });
  return (
    <>
      <div>
        <Link className="flex items-center gap-2" href={"/"}>
          <ArrowLeftIcon className="h-6 w-6" /> Volver
        </Link>
      </div>
      <div>
        <p>{organization?.name}</p>
        <p>{organization?.description}</p>
      </div>
      {/* Contenido del dashboard */}
      <div className="space-y-6">
        {/* Stats Cards */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Testimonials - Takes 2 columns */}
          <div className="lg:col-span-2">
            <RecentTestimonials />
          </div>

          {/* Categories Chart - Takes 1 column */}
          <div className="lg:col-span-1">
            <CategoriesChart />
          </div>
        </div>

        {/* Pending Testimonials */}
        <PendingTestimonials />
      </div>
    </>
  );
}
