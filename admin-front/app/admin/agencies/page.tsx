"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, MoreHorizontal, Eye, Ban, CheckCircle, Building2 } from "lucide-react"

const agenciesData = [
  {
    id: 1,
    name: "AutoLoc Paris",
    email: "contact@autoloc-paris.com",
    phone: "+33 1 42 34 56 78",
    address: "123 Rue de Rivoli, 75001 Paris",
    status: "active",
    registrationDate: "2024-01-10",
    totalVehicles: 45,
    totalBookings: 234,
    verified: true,
  },
  {
    id: 2,
    name: "CarRent Marseille",
    email: "info@carrent-marseille.com",
    phone: "+33 4 91 23 45 67",
    address: "456 La Canebière, 13001 Marseille",
    status: "pending",
    registrationDate: "2024-01-15",
    totalVehicles: 0,
    totalBookings: 0,
    verified: false,
  },
  {
    id: 3,
    name: "Lyon Auto Services",
    email: "contact@lyon-auto.com",
    phone: "+33 4 72 11 22 33",
    address: "789 Rue de la République, 69002 Lyon",
    status: "active",
    registrationDate: "2024-01-05",
    totalVehicles: 28,
    totalBookings: 156,
    verified: true,
  },
  {
    id: 4,
    name: "Nice Car Rental",
    email: "info@nice-car.com",
    phone: "+33 4 93 12 34 56",
    address: "321 Promenade des Anglais, 06000 Nice",
    status: "active",
    registrationDate: "2024-01-08",
    totalVehicles: 32,
    totalBookings: 189,
    verified: true,
  },
  {
    id: 5,
    name: "Bordeaux Motors",
    email: "contact@bordeaux-motors.com",
    phone: "+33 5 56 78 90 12",
    address: "654 Cours de l'Intendance, 33000 Bordeaux",
    status: "suspended",
    registrationDate: "2024-01-12",
    totalVehicles: 15,
    totalBookings: 67,
    verified: true,
  },
  {
    id: 6,
    name: "Toulouse Drive",
    email: "info@toulouse-drive.com",
    phone: "+33 5 61 23 45 67",
    address: "987 Rue de Metz, 31000 Toulouse",
    status: "pending",
    registrationDate: "2024-01-16",
    totalVehicles: 0,
    totalBookings: 0,
    verified: false,
  },
  {
    id: 7,
    name: "Strasbourg Auto",
    email: "contact@strasbourg-auto.com",
    phone: "+33 3 88 12 34 56",
    address: "147 Grande Rue, 67000 Strasbourg",
    status: "active",
    registrationDate: "2024-01-07",
    totalVehicles: 22,
    totalBookings: 134,
    verified: true,
  },
  {
    id: 8,
    name: "Nantes Location",
    email: "info@nantes-location.com",
    phone: "+33 2 40 56 78 90",
    address: "258 Rue de la Fosse, 44000 Nantes",
    status: "active",
    registrationDate: "2024-01-09",
    totalVehicles: 38,
    totalBookings: 201,
    verified: true,
  },
]

const columns = [
  {
    accessorKey: "name",
    header: "Nom de l'agence",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
  },
  {
    accessorKey: "address",
    header: "Adresse",
    cell: ({ row }: any) => {
      const address = row.getValue("address")
      return <span className="text-sm">{address}</span>
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }: any) => {
      const status = row.getValue("status")
      return (
        <Badge variant={status === "active" ? "default" : status === "pending" ? "secondary" : "destructive"}>
          {status === "active" && "Active"}
          {status === "pending" && "En attente"}
          {status === "suspended" && "Suspendue"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "totalVehicles",
    header: "Véhicules",
  },
  {
    accessorKey: "totalBookings",
    header: "Réservations",
  },
  {
    id: "actions",
    cell: ({ row }: any) => {
      const agency = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Voir détails
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CheckCircle className="mr-2 h-4 w-4" />
              Valider
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Ban className="mr-2 h-4 w-4" />
              Suspendre
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function AgenciesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredAgencies = agenciesData.filter((agency) => {
    const matchesSearch =
      agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || agency.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des agences</h1>
        <p className="text-muted-foreground">Gérez les agences partenaires et leurs validations</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Total agences</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agenciesData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {agenciesData.filter((a) => a.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {agenciesData.filter((a) => a.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total véhicules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {agenciesData.reduce((sum, a) => sum + a.totalVehicles, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des agences</CardTitle>
          <CardDescription>Recherchez et filtrez les agences partenaires</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Statut: {statusFilter === "all" ? "Tous" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>Tous</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("active")}>Actives</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>En attente</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("suspended")}>Suspendues</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <DataTable columns={columns} data={filteredAgencies} pageSize={6} />
        </CardContent>
      </Card>
    </div>
  )
}
