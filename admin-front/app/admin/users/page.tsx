"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, MoreHorizontal, Eye, Ban, CheckCircle } from "lucide-react"

const usersData = [
  {
    id: 1,
    name: "Marie Dubois",
    email: "marie.dubois@email.com",
    phone: "+33 6 12 34 56 78",
    status: "active",
    registrationDate: "2024-01-15",
    totalBookings: 12,
    verified: true,
  },
  {
    id: 2,
    name: "Jean Martin",
    email: "jean.martin@email.com",
    phone: "+33 6 98 76 54 32",
    status: "pending",
    registrationDate: "2024-01-14",
    totalBookings: 0,
    verified: false,
  },
  {
    id: 3,
    name: "Sophie Laurent",
    email: "sophie.laurent@email.com",
    phone: "+33 6 11 22 33 44",
    status: "active",
    registrationDate: "2024-01-10",
    totalBookings: 8,
    verified: true,
  },
  {
    id: 4,
    name: "Pierre Durand",
    email: "pierre.durand@email.com",
    phone: "+33 6 55 66 77 88",
    status: "suspended",
    registrationDate: "2024-01-08",
    totalBookings: 3,
    verified: true,
  },
  {
    id: 5,
    name: "Alice Martin",
    email: "alice.martin@email.com",
    phone: "+33 6 44 55 66 77",
    status: "active",
    registrationDate: "2024-01-12",
    totalBookings: 15,
    verified: true,
  },
  {
    id: 6,
    name: "Thomas Bernard",
    email: "thomas.bernard@email.com",
    phone: "+33 6 33 44 55 66",
    status: "pending",
    registrationDate: "2024-01-16",
    totalBookings: 0,
    verified: false,
  },
  {
    id: 7,
    name: "Emma Rousseau",
    email: "emma.rousseau@email.com",
    phone: "+33 6 22 33 44 55",
    status: "active",
    registrationDate: "2024-01-11",
    totalBookings: 7,
    verified: true,
  },
  {
    id: 8,
    name: "Lucas Petit",
    email: "lucas.petit@email.com",
    phone: "+33 6 11 22 33 44",
    status: "suspended",
    registrationDate: "2024-01-09",
    totalBookings: 2,
    verified: true,
  },
  {
    id: 9,
    name: "Camille Moreau",
    email: "camille.moreau@email.com",
    phone: "+33 6 99 88 77 66",
    status: "active",
    registrationDate: "2024-01-13",
    totalBookings: 9,
    verified: true,
  },
  {
    id: 10,
    name: "Hugo Leroy",
    email: "hugo.leroy@email.com",
    phone: "+33 6 88 77 66 55",
    status: "pending",
    registrationDate: "2024-01-17",
    totalBookings: 0,
    verified: false,
  },
  {
    id: 11,
    name: "Léa Fournier",
    email: "lea.fournier@email.com",
    phone: "+33 6 77 66 55 44",
    status: "active",
    registrationDate: "2024-01-07",
    totalBookings: 18,
    verified: true,
  },
  {
    id: 12,
    name: "Nathan Girard",
    email: "nathan.girard@email.com",
    phone: "+33 6 66 55 44 33",
    status: "active",
    registrationDate: "2024-01-06",
    totalBookings: 11,
    verified: true,
  },
]

const columns = [
  {
    accessorKey: "name",
    header: "Nom",
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
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }: any) => {
      const status = row.getValue("status")
      return (
        <Badge variant={status === "active" ? "default" : status === "pending" ? "secondary" : "destructive"}>
          {status === "active" && "Actif"}
          {status === "pending" && "En attente"}
          {status === "suspended" && "Suspendu"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "verified",
    header: "Vérifié",
    cell: ({ row }: any) => {
      const verified = row.getValue("verified")
      return verified ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <span className="text-gray-400">Non vérifié</span>
      )
    },
  },
  {
    accessorKey: "totalBookings",
    header: "Réservations",
  },
  {
    accessorKey: "registrationDate",
    header: "Date d'inscription",
  },
  {
    id: "actions",
    cell: ({ row }: any) => {
      const user = row.original
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

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h1>
        <p className="text-muted-foreground">Gérez les comptes utilisateurs et leurs validations</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {usersData.filter((u) => u.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {usersData.filter((u) => u.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Suspendus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {usersData.filter((u) => u.status === "suspended").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>Recherchez et filtrez les utilisateurs de la plateforme</CardDescription>
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
                <DropdownMenuItem onClick={() => setStatusFilter("active")}>Actifs</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>En attente</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("suspended")}>Suspendus</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <DataTable columns={columns} data={filteredUsers} pageSize={8} />
        </CardContent>
      </Card>
    </div>
  )
}
