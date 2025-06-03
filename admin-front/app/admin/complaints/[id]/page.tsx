"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  AlertTriangle,
  User,
  Building2,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

import { gql, useQuery, useMutation } from "@apollo/client";

const GET_COMPLAINT_DETAILS = gql`
  query findOneComplaint($id: Int!) {
    complaint(id: $id) {
      id
      title
      complainantType
      status
      priority
      category
      createdAt
      updatedAt

      complainantUser {
        id
        firstName
        lastName
        email
      }

      complainantAgency {
        id
        username
        email
      }

      againstUser {
        id
        firstName
        lastName
        email
      }

      againstAgency {
        id
        username
        email
      }

      booking {
        id
        cost
      }
    }
  }
`;

const UPDATE_COMPLAINT_STATUS = gql`
  mutation updateComplaintStatus($id: Int!, $status: String!) {
    updateComplaintStatus(id: $id, status: $status) {
      id
      status
      updatedAt
    }
  }
`;

const UPDATE_COMPLAINT_PRIORITY = gql`
  mutation updateComplaintPriority($id: Int!, $priority: String!) {
    updateComplaintPriority(id: $id, priority: $priority) {
      id
      priority
      updatedAt
    }
  }
`;

// Mapping function based on your provided logic
const mapComplaintResponse = (complaint: any) => {
  const isClient = complaint.complainantType === "Client";
  const complainant = isClient
    ? complaint.complainantUser?.firstName +
      " " +
      complaint.complainantUser?.lastName
    : complaint.complainantAgency?.username;
  const against = complaint.againstAgency
    ? complaint.againstAgency.username
    : complaint.againstUser?.firstName + " " + complaint.againstUser?.lastName;

  return {
    id: complaint.id,
    title: complaint.title,
    complainant: complainant ?? "N/A",
    against: against ?? "N/A",
    type: complaint.complainantType,
    status: complaint.status.toLowerCase(),
    priority: complaint.priority.toLowerCase(),
    createdDate: complaint.createdAt.slice(0, 10),
    category: complaint.category.toLowerCase(),
  };
};

export default function ComplaintDetailPage() {
  // Get the complaint ID from the URL
  const params = useParams<{ id: string }>();

  const complaintId = params.id ? parseInt(params.id, 10) : null;

  const { loading, error, data } = useQuery(GET_COMPLAINT_DETAILS, {
    variables: { id: complaintId }, // Now sending a number
    skip: !complaintId || isNaN(complaintId), // Skip if ID is invalid
    onError: (error) => {
      console.error("GraphQL Error:", error);
      console.error("Variables sent:", { id: complaintId });
    },
  });
  console.log("GraphQL Query Result:", { loading, error, data });
  //const complaintDetails = data.complaint;
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const [updateStatus, { loading: statusLoading }] = useMutation(
    UPDATE_COMPLAINT_STATUS,
    {
      onCompleted: (data) => {
        console.log("Status updated successfully:", data);
      },
      onError: (error) => {
        console.error("Error updating status:", error);
        setStatus(data?.complaint?.status || "");
      },
      refetchQueries: [
        {
          query: GET_COMPLAINT_DETAILS,
          variables: { id: complaintId },
        },
      ],
    }
  );

  const [updatePriority, { loading: priorityLoading }] = useMutation(
    UPDATE_COMPLAINT_PRIORITY,
    {
      onCompleted: (data) => {
        console.log("Priority updated successfully:", data);
      },
      onError: (error) => {
        console.error("Error updating priority:", error);
        setPriority(data?.complaint?.priority || "");
      },
      refetchQueries: [
        {
          query: GET_COMPLAINT_DETAILS,
          variables: { id: complaintId },
        },
      ],
    }
  );

  useEffect(() => {
    if (data?.complaint) {
      setStatus(data.complaint.status);
      setPriority(data.complaint.priority);
    }
  }, [data]);

  // Show detailed error information
  if (!complaintId) return <p>ID de réclamation non trouvé dans l'URL</p>;
  if (loading) return <p>Chargement des données...</p>;
  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <h2 className="text-lg font-bold text-red-700 mb-2">
          Erreur lors du chargement
        </h2>
        <p className="mb-2">Message: {error.message}</p>
        {error.graphQLErrors?.map((err, i) => (
          <p key={i} className="text-sm text-red-600">
            GraphQL: {err.message}
          </p>
        ))}
        {error.networkError && (
          <p className="text-sm text-red-600">
            Réseau: {error.networkError.message}
          </p>
        )}
        <div className="mt-4">
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }
  if (!data?.complaint) return <p>Réclamation non trouvée</p>;

  const complaintDetails = data.complaint;
  console.log("Complaint Details from GraphQL:", complaintDetails);
  const mappedComplaint = mapComplaintResponse(complaintDetails);
  console.log("Complaint Details:", complaintDetails);
  console.log("Mapped Complaint:", mappedComplaint);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    console.log("Changing status to:", newStatus);

    try {
      await updateStatus({
        variables: {
          id: complaintId,
          status: newStatus,
        },
      });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    setPriority(newPriority);
    console.log("Changing priority to:", newPriority);

    try {
      await updatePriority({
        variables: {
          id: complaintId,
          priority: newPriority,
        },
      });
    } catch (error) {
      console.error("Failed to update priority:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ouverte":
        return "destructive";
      case "en cours":
        return "default";
      case "résolue":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Haute":
        return "destructive";
      case "Moyenne":
        return "default";
      case "Basse":
        return "secondary";
      default:
        return "secondary";
    }
  };
  /*setStatus(complaintDetails.status);
  setPriority(complaintDetails.priority);*/
  // Determine if complainant is client or agency
  const isComplainantClient = complaintDetails.complainantType === "Client";
  console.log(status);
  console.log(priority);
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/complaints">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux réclamations
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Réclamation #{complaintDetails.id}
          </h1>
          <p className="text-muted-foreground">{complaintDetails.title}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Informations principales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Informations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Statut</Label>
                <Select
                  value={status}
                  onValueChange={handleStatusChange}
                  disabled={statusLoading}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ouverte">Ouverte</SelectItem>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Résolue">Résolue</SelectItem>
                  </SelectContent>
                </Select>
                {statusLoading && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Mise à jour en cours...
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Priorité</Label>
                <Select
                  value={priority}
                  onValueChange={handlePriorityChange}
                  disabled={priorityLoading}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basse">Basse</SelectItem>
                    <SelectItem value="Moyenne">Moyenne</SelectItem>
                    <SelectItem value="Haute">Haute</SelectItem>
                  </SelectContent>
                </Select>
                {priorityLoading && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Mise à jour en cours...
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Catégorie:</span>
                <Badge variant="outline">
                  {complaintDetails.category === "vehicle" && "Véhicule"}
                  {complaintDetails.category === "payment" && "Paiement"}
                  {complaintDetails.category === "service" && "Service"}
                  {!["vehicle", "payment", "service"].includes(
                    complaintDetails.category
                  ) && complaintDetails.category}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Type de plaignant:</span>
                <Badge variant="secondary">
                  {isComplainantClient ? "Client" : "Agence"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Créée le:</span>
                <span className="text-sm">
                  {new Date(complaintDetails.createdAt).toLocaleDateString(
                    "fr-FR"
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mise à jour:</span>
                <span className="text-sm">
                  {new Date(complaintDetails.updatedAt).toLocaleDateString(
                    "fr-FR"
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Détails de la réclamation */}
        <div className="md:col-span-2">
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList>
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="parties">Parties impliquées</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Réservation concernée</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        ID Réservation:
                      </span>
                      <span className="text-sm">
                        {complaintDetails.booking?.id || "Non spécifiée"}
                      </span>
                    </div>
                    {complaintDetails.booking?.cost && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Coût:</span>
                        <span className="text-sm font-semibold">
                          €{complaintDetails.booking.cost}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parties" className="space-y-4">
              {/* Complainant Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {isComplainantClient ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Building2 className="h-5 w-5" />
                    )}
                    <span>
                      Plaignant ({isComplainantClient ? "Client" : "Agence"})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isComplainantClient && complaintDetails.complainantUser ? (
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {complaintDetails.complainantUser.firstName?.[0]}
                          {complaintDetails.complainantUser.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">
                          {complaintDetails.complainantUser.firstName}{" "}
                          {complaintDetails.complainantUser.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {complaintDetails.complainantUser.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ID: {complaintDetails.complainantUser.id}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Voir profil
                      </Button>
                    </div>
                  ) : complaintDetails.complainantAgency ? (
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          <Building2 className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">
                          {complaintDetails.complainantAgency.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {complaintDetails.complainantAgency.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ID: {complaintDetails.complainantAgency.id}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Voir agence
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Informations du plaignant non disponibles
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Against Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {complaintDetails.againstAgency ? (
                      <Building2 className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                    <span>
                      Partie mise en cause (
                      {complaintDetails.againstAgency
                        ? "Agence"
                        : "Utilisateur"}
                      )
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {complaintDetails.againstAgency ? (
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          <Building2 className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">
                          {complaintDetails.againstAgency.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {complaintDetails.againstAgency.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ID: {complaintDetails.againstAgency.id}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Voir agence
                      </Button>
                    </div>
                  ) : complaintDetails.againstUser ? (
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {complaintDetails.againstUser.firstName?.[0]}
                          {complaintDetails.againstUser.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">
                          {complaintDetails.againstUser.firstName}{" "}
                          {complaintDetails.againstUser.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {complaintDetails.againstUser.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ID: {complaintDetails.againstUser.id}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Voir profil
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Informations de la partie mise en cause non disponibles
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
