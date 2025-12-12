import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/Topbar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen ">
      <TopBar user={session.user} />

      <div className="flex p-4 md:p-6 gap-8 max-w-[1600px] mx-auto pb-20 lg:pb-6">
        <div className="shrink-0">
          <Sidebar />
        </div>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
