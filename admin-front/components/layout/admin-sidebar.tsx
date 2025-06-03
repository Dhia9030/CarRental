"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  Settings,
  User,
  Car,
  AlertTriangle,
  MessageCircle,
  Clock,
  Bell,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    title: "Tableau de bord",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Utilisateurs",
    icon: Users,
    url: "/admin/users",
  },
  {
    title: "Agences",
    icon: Building2,
    url: "/admin/agencies",
  },
  {
    title: "Réclamations",
    url: "/admin/complaints",
    icon: AlertTriangle,
  },
  {
    title: "Chat",
    url: "/admin/chat",
    icon: MessageCircle,
  },
  {
    title: "Notifications",
    url: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Analyses",
    url: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Profil",
    url: "/admin/profile",
    icon: User,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/auth";
  };

  return (
    <Sidebar className="border-r-0">
      <div className="h-full bg-sky-800 text-white flex flex-col">
        <SidebarHeader className="p-6">
          <div className="flex items-center space-x-3">
            <Car className="h-8 w-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">CarRental</h2>
              <h3 className="text-lg font-semibold text-white">Admin</h3>
              <p className="text-sm text-sky-200">Admin Dashboard</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-6 py-4 flex-1">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`text-sky-100 hover:bg-sky-700/50 data-[active=true]:bg-sky-700 data-[active=true]:text-white ${
                        pathname === item.url ? "bg-sky-700 text-white" : ""
                      }`}
                    >
                      <Link
                        href={item.url!}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md transition-colors"
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <div className="border-t border-white/20 pt-3">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-sky-100 hover:bg-sky-700/50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
