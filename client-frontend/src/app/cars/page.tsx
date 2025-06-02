"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { carsAPI } from "@/lib/api";
import type { Car } from "@/types/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Search,
  MapPin,
  Users,
  Fuel,
  Star,
  Calendar as CalendarIcon,
  Filter,
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
  Car as CarIcon,
} from "lucide-react";
import Link from "next/link";

interface SearchFilters {
  search: string;
  company: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  fuelType: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

const fuelTypes = [
  { value: "gasoline", label: "Gasoline" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
];

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    company: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    fuelType: "",
    startDate: undefined,
    endDate: undefined,
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadCars();
    loadFeaturedCars();
  }, [currentPage, filters]);

  const loadCars = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 12,
      };

      // Add filters to params
      if (filters.search) params.search = filters.search;
      if (filters.company) params.company = filters.company;
      if (filters.location) params.location = filters.location;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.fuelType) params.fuelType = filters.fuelType;
      const response = await carsAPI.searchCars(params);
      setCars(response.cars || response.data || []);
      setTotalPages(
        Math.ceil((response.total || response.pagination?.totalItems || 0) / 12)
      );
    } catch (error) {
      console.error("Failed to load cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedCars = async () => {
    try {
      const featured = await carsAPI.getFeaturedCars();
      setFeaturedCars(featured);
    } catch (error) {
      console.error("Failed to load featured cars:", error);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      company: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      fuelType: "",
      startDate: undefined,
      endDate: undefined,
    });
    setCurrentPage(1);
  };

  const toggleFavorite = (carId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(carId)) {
        newFavorites.delete(carId);
      } else {
        newFavorites.add(carId);
      }
      return newFavorites;
    });
  };

  const CarCard = ({ car }: { car: Car }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-50 to-indigo-100 h-48">
          {" "}
          <div className="absolute inset-0 flex items-center justify-center">
            <CarIcon className="h-20 w-20 text-blue-400" />
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:bg-white"
              onClick={() => toggleFavorite(car.id)}>
              <Heart
                className={`h-4 w-4 ${
                  favorites.has(car.id)
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600"
                }`}
              />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:bg-white"
              asChild>
              <Link href={`/cars/${car.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          {car.pricePerDay && car.pricePerDay < 50 && (
            <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600">
              Great Deal
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            {" "}
            <h3 className="font-semibold text-lg text-gray-900">
              {car.company || car.make} {car.model}
            </h3>
            <p className="text-sm text-gray-600">{car.year}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            {" "}
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{car.seats} seats</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="h-4 w-4" />
              <span>{car.fuelType}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{car.location}</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(car.pricePerDay)}
              </span>
              <span className="text-sm text-gray-600">/day</span>
            </div>

            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href={`/cars/${car.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-24" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Find Your Perfect Car
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse our extensive collection of rental cars. From economy to
          luxury, find the perfect vehicle for your journey.
        </p>
      </div>

      {/* Search Bar */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search cars by make, model, or location..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 h-12 border-0 bg-gray-50 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 border-gray-200">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-12 border-gray-200">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Dates
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium">Start Date</label>
                      <Calendar
                        mode="single"
                        selected={filters.startDate}
                        onSelect={(date) =>
                          handleFilterChange("startDate", date)
                        }
                        disabled={(date) => date < new Date()}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Date</label>
                      <Calendar
                        mode="single"
                        selected={filters.endDate}
                        onSelect={(date) => handleFilterChange("endDate", date)}
                        disabled={(date) => {
                          if (date < new Date()) return true;
                          if (filters.startDate && date < filters.startDate)
                            return true;
                          return false;
                        }}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Company"
                value={filters.company}
                onChange={(e) => handleFilterChange("company", e.target.value)}
              />

              <Input
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />

              <div className="flex gap-2">
                <Input
                  placeholder="Min Price"
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                />
                <Input
                  placeholder="Max Price"
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                />
              </div>

              <div className="flex gap-2">
                <Select
                  value={filters.fuelType}
                  onValueChange={(value) =>
                    handleFilterChange("fuelType", value)
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Fuel Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Featured Cars */}
      {featuredCars.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Cars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredCars.slice(0, 4).map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      )}

      {/* All Cars */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            All Cars (
            {totalPages > 0
              ? `Page ${currentPage} of ${totalPages}`
              : "0 results"}
            )
          </h2>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : cars.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page =
                      Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                      i;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10">
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="p-12 text-center">
            <CarIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No cars found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or clear the filters.
            </p>
            <Button onClick={resetFilters} variant="outline">
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
