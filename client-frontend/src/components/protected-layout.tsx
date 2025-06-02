"use client";

import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/client-sidebar";
import { ClientHeader } from "@/components/client-header";
import { LoadingPage } from "@/components/ui/loading";
import { usePathname } from "next/navigation";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Don't show sidebar/header on auth page
  if (pathname === "/auth") {
    return <>{children}</>;
  }
  // Show loading spinner while checking auth
  if (loading) {
    return <LoadingPage />;
  }

  // If not authenticated, don't render the protected layout (AuthContext will handle redirect)
  if (!user) {
    return null;
  }

  // Render the full dashboard layout for authenticated users
  return (
    <SidebarProvider defaultOpen>
      <ClientSidebar />
      <SidebarInset className="flex-1">
        <ClientHeader />
        <main className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-slate-100 min-h-screen overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
