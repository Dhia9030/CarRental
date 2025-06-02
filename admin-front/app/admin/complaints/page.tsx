"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
const mapComplaintResponse = (complaint: any) => {
  const isClient = complaint.complainantType === "Client";

  const complainant = isClient
    ? complaint.complainantUser?.fullName
    : complaint.complainantAgency?.name;

  const against = complaint.againstAgency
    ? complaint.againstAgency.name
    : complaint.againstUser?.fullName;

  return {
    id: complaint.id,
    title: complaint.title,
    complainant: complainant ?? "N/A",
    against: against ?? "N/A",
    type: isClient ? "Client" : "Agence",
    status: complaint.status.toLowerCase(),
    priority: complaint.priority.toLowerCase(),
    createdDate: complaint.createdAt.slice(0, 10),
    category: complaint.category.toLowerCase(),
    description: complaint.description,
  };
};
const GET_COMPLAINTS = gql`
  query GetComplaints {
    complaints {
      id
      title
      complainantType
      complainantUser {
        firstName
        lastName
      }
      complainantAgency {
        username
      }
      againstUser {
        firstName
        lastName
      }
      againstAgency {
        username
      }
      status
      priority
      createdAt
      category
      description
    }
  }
`;

const columns = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }: any) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "title",
    header: "Titre",
  },
  {
    accessorKey: "user",
    header: "Utilisateur",
  },
  {
    accessorKey: "agency",
    header: "Agence",
  },
  {
    accessorKey: "category",
    header: "Catégorie",
    cell: ({ row }: any) => {
      const category = row.getValue("category");
      const categoryLabels = {
        vehicle: "Véhicule",
        payment: "Paiement",
        delivery: "Livraison",
        service: "Service",
        booking: "Réservation",
      };
      return (
        categoryLabels[category as keyof typeof categoryLabels] || category
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priorité",
    cell: ({ row }: any) => {
      const priority = row.getValue("priority");
      return (
        <Badge
          variant={
            priority === "high"
              ? "destructive"
              : priority === "medium"
              ? "default"
              : "secondary"
          }
        >
          {priority === "high" && "Haute"}
          {priority === "medium" && "Moyenne"}
          {priority === "low" && "Basse"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }: any) => {
      const status = row.getValue("status");
      return (
        <Badge
          variant={
            status === "resolved"
              ? "default"
              : status === "in_progress"
              ? "secondary"
              : "destructive"
          }
        >
          {status === "open" && "Ouverte"}
          {status === "in_progress" && "En cours"}
          {status === "resolved" && "Résolue"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdDate",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }: any) => {
      const complaint = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/complaints/${complaint.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Voir détails
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/complaints/chat/${complaint.id}`}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Ouvrir chat
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CheckCircle className="mr-2 h-4 w-4" />
              Marquer résolu
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function ComplaintsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const { loading, error, data } = useQuery(GET_COMPLAINTS);
  console.log("Complaints data:", data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const complaintsData = data.complaints.map(mapComplaintResponse);
  const filteredComplaints = complaintsData.filter((complaint: any) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || complaint.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || complaint.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des réclamations
        </h1>
        <p className="text-muted-foreground">
          Traitez et résolvez les réclamations des utilisateurs
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Total réclamations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complaintsData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ouvertes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {complaintsData.filter((c: any) => c.status === "open").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {
                complaintsData.filter((c: any) => c.status === "in_progress")
                  .length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Résolues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {
                complaintsData.filter((c: any) => c.status === "resolved")
                  .length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des réclamations</CardTitle>
          <CardDescription>
            Recherchez et filtrez les réclamations par statut et priorité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par titre ou utilisateur..."
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
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  Tous
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("open")}>
                  Ouvertes
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("in_progress")}
                >
                  En cours
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("resolved")}>
                  Résolues
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Priorité:{" "}
                  {priorityFilter === "all" ? "Toutes" : priorityFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setPriorityFilter("all")}>
                  Toutes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("high")}>
                  Haute
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>
                  Moyenne
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("low")}>
                  Basse
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <DataTable columns={columns} data={filteredComplaints} pageSize={6} />
        </CardContent>
      </Card>
    </div>
  );
}
