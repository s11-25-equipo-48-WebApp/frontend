import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentTestimonials from '@/components/dashboard/RecentTestimonials';
import CategoriesChart from '@/components/dashboard/CategoriesChart';
import PendingTestimonials from '@/components/dashboard/PendingTestimonials';

export default function DashboardPage() {

  return (
    <>
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