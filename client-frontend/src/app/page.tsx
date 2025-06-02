"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import type { Car, Booking } from "@/types/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Calendar,
  CarIcon,
  CreditCard,
  Star,
  MapPin,
  Clock,
  Heart,
  Search,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

interface DashboardStats {
  totalBookings: number;
  activeBookings: number;
  totalSpent: number;
  favoriteCount: number;
}

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Welcome Section Skeleton */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 p-8 h-64">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="mt-6 bg-white/20 rounded-xl p-4">
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-[60px] mb-1" />
              <Skeleton className="h-3 w-[100px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardHeader>
              <Skeleton className="h-6 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                  <Skeleton className="h-6 w-[80px]" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Stats card component
function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  iconBg,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  gradient: string;
  iconBg: string;
}) {
  return (
    <Card
      className={`border-0 shadow-lg ${gradient} hover:shadow-xl hover:scale-105 transition-all duration-300 group`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium group-hover:opacity-90 transition-opacity">
          {title}
        </CardTitle>
        <div
          className={`p-2 ${iconBg} rounded-lg group-hover:scale-110 transition-transform shadow-lg`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold group-hover:scale-105 transition-transform">
          {value}
        </div>
        <p className="text-xs opacity-80 flex items-center mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

// Quick action button component
function QuickActionButton({
  icon: Icon,
  label,
  gradient,
  onClick,
}: {
  icon: any;
  label: string;
  gradient: string;
  onClick?: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      className={`h-24 flex-col gap-3 ${gradient} border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 group`}
      variant="default">
      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-colors shadow-inner">
        <Icon className="h-6 w-6" />
      </div>
      <span className="font-medium">{label}</span>
    </Button>
  );
}

// Empty state component
function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: any;
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
}) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <p className="text-muted-foreground mb-2 font-medium">{title}</p>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Button
        variant="outline"
        size="sm"
        onClick={onAction}
        className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
        {actionLabel}
      </Button>
    </div>
  );
}

export default function ClientHome() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    activeBookings: 0,
    totalSpent: 0,
    favoriteCount: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load user's bookings to calculate stats
      const bookings = await api.bookings.getUserBookings();

      // Calculate stats
      const activeBookings = bookings.filter(
        (booking: Booking) =>
          booking.status === "Confirmed" || booking.status === "Pending"
      ).length;

      const totalSpent = bookings
        .filter((booking: Booking) => booking.status === "Completed")
        .reduce((sum: number, booking: Booking) => sum + booking.totalPrice, 0);

      setStats({
        totalBookings: bookings.length,
        activeBookings,
        totalSpent,
        favoriteCount: 0, // Will be updated when favorites API is implemented
      });

      // Get recent bookings (last 3)
      setRecentBookings(bookings.slice(0, 3));

      // Load featured cars
      const carsResponse = await api.cars.getAllCars();
      setFeaturedCars(carsResponse.data?.slice(0, 6) || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to cars page with search query
      console.log("Searching for:", searchQuery);
    }
  };

  const handleQuickAction = (action: string) => {
    console.log("Quick action:", action);
    // Handle navigation based on action
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="border-red-200 bg-red-50 max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600 mb-4">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Error Loading Dashboard</span>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <Button
              onClick={loadDashboardData}
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-100">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white shadow-2xl">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Welcome back!
              </h1>
              <p className="text-blue-100 text-base md:text-lg opacity-90">
                Discover amazing cars and manage your rentals effortlessly.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-xl">
                <CarIcon className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Quick Search */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-inner">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-3 top-3 h-5 w-5 text-white/70 group-focus-within:text-white transition-colors duration-200" />
                <Input
                  type="text"
                  placeholder="Search for cars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all duration-200"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="bg-white text-blue-600 hover:bg-white/90 px-6 sm:px-8 py-3 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl font-semibold">
                Search Cars
              </Button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute -top-4 -right-4 w-20 h-20 md:w-24 md:h-24 bg-white/5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white/30 rounded-full animate-ping delay-1000"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Bookings"
          value={stats.totalBookings}
          subtitle="All time bookings"
          icon={Calendar}
          gradient="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700"
          iconBg="bg-blue-600"
        />
        <StatsCard
          title="Active Rentals"
          value={stats.activeBookings}
          subtitle="Currently active"
          icon={CarIcon}
          gradient="bg-gradient-to-br from-green-50 to-green-100 text-green-700"
          iconBg="bg-green-600"
        />
        <StatsCard
          title="Total Spent"
          value={formatCurrency(stats.totalSpent)}
          subtitle="Lifetime spending"
          icon={CreditCard}
          gradient="bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700"
          iconBg="bg-purple-600"
        />
        <StatsCard
          title="Favorites"
          value={stats.favoriteCount}
          subtitle="Saved cars"
          icon={Heart}
          gradient="bg-gradient-to-br from-pink-50 to-pink-100 text-pink-700"
          iconBg="bg-pink-600"
        />
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
          <CardDescription>Jump to your most common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <QuickActionButton
              icon={Search}
              label="Browse Cars"
              gradient="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              onClick={() => handleQuickAction("browse")}
            />
            <QuickActionButton
              icon={Calendar}
              label="New Booking"
              gradient="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              onClick={() => handleQuickAction("booking")}
            />
            <QuickActionButton
              icon={Clock}
              label="View History"
              gradient="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              onClick={() => handleQuickAction("history")}
            />
            <QuickActionButton
              icon={CreditCard}
              label="Payments"
              gradient="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              onClick={() => handleQuickAction("payments")}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Bookings */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">
                Recent Bookings
              </CardTitle>
              <CardDescription>Your latest car rentals</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200"
              onClick={() => handleQuickAction("all-bookings")}>
              View all
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBookings.length === 0 ? (
              <EmptyState
                icon={CarIcon}
                title="No bookings yet"
                description="Start by browsing our available cars"
                actionLabel="Browse Cars"
                onAction={() => handleQuickAction("browse")}
              />
            ) : (
              recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center space-x-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md hover:from-blue-50 hover:to-blue-100 transition-all duration-200 border border-transparent hover:border-blue-200 cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-md flex items-center justify-center shadow-inner">
                    <CarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {booking.car?.make} {booking.car?.model}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(booking.startDate)} -{" "}
                      {formatDate(booking.endDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        booking.status === "Confirmed"
                          ? "default"
                          : booking.status === "Completed"
                          ? "secondary"
                          : booking.status === "Cancelled"
                          ? "destructive"
                          : "outline"
                      }
                      className="mb-1 shadow-sm">
                      {booking.status}
                    </Badge>
                    <p className="text-xs font-medium text-gray-700">
                      {formatCurrency(booking.totalPrice)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Featured Cars */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">
                Featured Cars
              </CardTitle>
              <CardDescription>Popular cars you might like</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200"
              onClick={() => handleQuickAction("browse")}>
              View all
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {featuredCars.slice(0, 3).map((car) => (
              <div
                key={car.id}
                className="flex items-center space-x-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md hover:from-green-50 hover:to-green-100 transition-all duration-200 border border-transparent hover:border-green-200 cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-md flex items-center justify-center shadow-inner">
                  <CarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {car.make} {car.model}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {car.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {formatCurrency(car.pricePerDay)}/day
                  </p>
                  {car.rating && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                      {car.rating.toFixed(1)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your recent actions and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  Welcome to CarRental!
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Complete your profile to start booking cars
                </p>
              </div>
              <div className="text-xs text-blue-600 bg-blue-200 px-2 py-1 rounded-full shadow-sm">
                Just now
              </div>
            </div>

            <Separator className="my-4" />

            <EmptyState
              icon={Clock}
              title="No recent activity"
              description="More activity will appear here as you use the platform"
              actionLabel="Get Started"
              onAction={() => handleQuickAction("browse")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
