"use client";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentTestimonials from "@/components/dashboard/RecentTestimonials";
import CategoriesChart from "@/components/dashboard/CategoriesChart";
import PendingTestimonials from "@/components/dashboard/PendingTestimonials";
import PageHeader from "@/components/PageHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        backTo={{
          href: "/",
          label: "Volver a organizaciones"
        }}
      />

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTestimonials />
        </div>

        <div className="lg:col-span-1">
          <CategoriesChart />
        </div>
      </div>

      <PendingTestimonials />
    </div>
  );
}