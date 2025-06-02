"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Car,
  Home,
  Search,
  Calendar,
  User,
  CreditCard,
  Star,
  MessageCircle,
  LogOut,
  History,
  Heart,
  Settings,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const mainMenuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    badge: null as string | null,
  },
  {
    title: "Browse Cars",
    url: "/cars",
    icon: Search,
    badge: null as string | null,
  },
];

const bookingMenuItems = [
  {
    title: "My Bookings",
    url: "/bookings",
    icon: Calendar,
    badge: "2" as string | null,
  },
  {
    title: "Booking History",
    url: "/history",
    icon: History,
    badge: null as string | null,
  },
  {
    title: "Favorites",
    url: "/favorites",
    icon: Heart,
    badge: "5" as string | null,
  },
];

const accountMenuItems = [
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    badge: null as string | null,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
    badge: null as string | null,
  },
  {
    title: "Reviews",
    url: "/reviews",
    icon: Star,
    badge: null as string | null,
  },
];

const supportMenuItems = [
  {
    title: "Support",
    url: "/support",
    icon: MessageCircle,
    badge: "1" as string | null,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    badge: null as string | null,
  },
];

export function ClientSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const renderMenuItems = (
    items: typeof mainMenuItems,
    groupTitle?: string
  ) => (
    <SidebarGroup>
      {groupTitle && (
        <SidebarGroupLabel
          className={cn(
            "text-slate-500 font-semibold text-xs uppercase tracking-wider px-2 mb-2 transition-opacity duration-200",
            state === "collapsed" ? "opacity-0" : "opacity-100"
          )}>
          {groupTitle}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={cn(
                  "group relative transition-all duration-200 hover:bg-slate-100 rounded-lg",
                  pathname === item.url
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-700 hover:text-slate-900"
                )}
                tooltip={state === "collapsed" ? item.title : undefined}>
                <Link
                  href={item.url}
                  className="flex items-center justify-between px-3 py-2.5">
                  <div className="flex items-center space-x-3">
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-colors flex-shrink-0",
                        pathname === item.url
                          ? "text-white"
                          : "text-slate-600 group-hover:text-blue-600"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm font-medium transition-opacity duration-200",
                        state === "collapsed" ? "opacity-0 w-0" : "opacity-100"
                      )}>
                      {item.title}
                    </span>
                  </div>
                  {item.badge && state !== "collapsed" && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs transition-all duration-200",
                        pathname === item.url
                          ? "bg-white/20 text-white border-white/30"
                          : "bg-blue-100 text-blue-700 border-blue-200"
                      )}>
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar
      className="border-r border-slate-200 z-20 bg-white"
      collapsible="icon">
      <div className="h-full flex flex-col">
        {/* Modern Header with gradient */}
        <SidebarHeader className="p-6 border-b border-slate-100 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="relative flex-shrink-0">
              <Car className="h-8 w-8 text-blue-600" />
              {state !== "collapsed" && (
                <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1" />
              )}
            </div>
            <div
              className={cn(
                "transition-opacity duration-200",
                state === "collapsed"
                  ? "opacity-0 w-0 overflow-hidden"
                  : "opacity-100"
              )}>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CarRental
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Find Your Perfect Ride
              </p>
            </div>
          </div>
        </SidebarHeader>

        {/* Scrollable Content */}
        <SidebarContent
          className={cn(
            "flex-1 px-4 py-6 space-y-8 overflow-y-auto transition-all duration-200",
            state === "collapsed" ? "px-2" : "px-4"
          )}>
          {renderMenuItems(mainMenuItems, "Main")}
          {renderMenuItems(bookingMenuItems, "Bookings")}
          {renderMenuItems(accountMenuItems, "Account")}
          {renderMenuItems(supportMenuItems, "Support")}
        </SidebarContent>

        {/* Modern Footer */}
        <SidebarFooter className="p-4 border-t border-slate-100 bg-slate-50/50">
          <SidebarMenuButton
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
            tooltip={state === "collapsed" ? "Sign Out" : undefined}>
            <LogOut className="h-4 w-4 group-hover:text-red-600 transition-colors flex-shrink-0" />
            <span
              className={cn(
                "font-medium transition-opacity duration-200",
                state === "collapsed" ? "opacity-0 w-0" : "opacity-100"
              )}>
              Sign Out
            </span>
          </SidebarMenuButton>
        </SidebarFooter>
      </div>
      <SidebarRail />
    </Sidebar>
  );
}
