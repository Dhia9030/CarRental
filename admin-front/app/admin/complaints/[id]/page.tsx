"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Clock,
} from "lucide-react";
import Link from "next/link";

import { gql, useQuery } from "@apollo/client";

export default function ComplaintDetailPage() {
  const params = useParams();
  const [status, setStatus] = useState(complaintDetails.status);
  const [priority, setPriority] = useState(complaintDetails.priority);
  const [adminNotes, setAdminNotes] = useState("");

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    console.log("Changing status to:", newStatus);
    // Logique pour changer le statut
  };

  const handlePriorityChange = (newPriority: string) => {
    setPriority(newPriority);
    console.log("Changing priority to:", newPriority);
    // Logique pour changer la priorité
  };

  const handleSaveNotes = () => {
    console.log("Saving admin notes:", adminNotes);
    // Logique pour sauvegarder les notes
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "destructive";
      case "in_progress":
        return "default";
      case "resolved":
        return "secondary";
      case "closed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

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
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Ouverte</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="resolved">Résolue</SelectItem>
                    <SelectItem value="closed">Fermée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Priorité</Label>
                <Select value={priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Catégorie:</span>
                <Badge variant="outline">
                  {complaintDetails.category === "vehicle" && "Véhicule"}
                  {complaintDetails.category === "payment" && "Paiement"}
                  {complaintDetails.category === "service" && "Service"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Assigné à:</span>
                <span className="text-sm">{complaintDetails.assignedTo}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Créée le:</span>
                <span className="text-sm">
                  {new Date(complaintDetails.createdDate).toLocaleDateString(
                    "fr-FR"
                  )}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button asChild className="w-full mb-2">
                <Link href={`/admin/complaints/chat/${complaintDetails.id}`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Ouvrir le chat
                </Link>
              </Button>
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
                        {complaintDetails.booking.id}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Véhicule:</span>
                      <span className="text-sm">
                        {complaintDetails.booking.vehicle}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Période:</span>
                      <span className="text-sm">
                        {complaintDetails.booking.startDate} -{" "}
                        {complaintDetails.booking.endDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Montant:</span>
                      <span className="text-sm font-semibold">
                        €{complaintDetails.booking.totalAmount}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parties" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Utilisateur</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={complaintDetails.user.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {complaintDetails.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">
                        {complaintDetails.user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {complaintDetails.user.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {complaintDetails.user.phone}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Voir profil
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Agence</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        <Building2 className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">
                        {complaintDetails.agency.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {complaintDetails.agency.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {complaintDetails.agency.phone}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Voir agence
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
