import { auth } from "@/auth";
import Header from "@/components/dashboard/Header";

import Sidebar from "@/components/sidebar/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-screen ">
      <Sidebar name={session?.user?.name} />

      <div
        className="flex min-h-screen ml-65 flex-1 flex-col bg-[linear-gradient(135deg,#F8FAFC_0%,#FFFBF5_39.29%,#F0FDFA_71.43%)] p-8
gap-6"
      >
        <main className="flex-1">
          <Header name={session?.user?.name} />
          {children}
        </main>
      </div>
    </div>
  );
}
