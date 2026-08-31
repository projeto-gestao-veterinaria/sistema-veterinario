import { auth } from "@/auth";
import Sidebar from "@/components/sidebar/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <Sidebar name={session?.user?.name} image={undefined} />

      <main>{children}</main>
    </>
  );
}
