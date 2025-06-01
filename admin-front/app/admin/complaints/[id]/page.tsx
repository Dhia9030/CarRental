"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, AlertTriangle, User, Building2, MessageSquare, Clock } from "lucide-react"
import Link from "next/link"

const complaintDetails = {
  id: 1,
  title: "Véhicule non conforme à la description",
  description:
    "Le véhicule reçu ne correspondait pas à la description. La voiture était sale et avait des rayures non mentionnées dans l'annonce. De plus, le kilométrage était différent de celui annoncé.",
  user: {
    id: 123,
    name: "Marie Dubois",
    email: "marie.dubois@email.com",
    phone: "+33 6 12 34 56 78",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  agency: {
    id: 456,
    name: "AutoLoc Paris",
    email: "contact@autoloc-paris.com",
    phone: "+33 1 42 34 56 78",
  },
  booking: {
    id: "BK-2024-001",
    vehicle: "Renault Clio",
    startDate: "2024-01-10",
    endDate: "2024-01-15",
    totalAmount: 250,
  },
  status: "open",
  priority: "high",
  category: "vehicle",
  createdDate: "2024-01-15T10:30:00",
  updatedDate: "2024-01-15T14:20:00",
  assignedTo: "Admin Principal",
  attachments: [
    { id: 1, name: "photo_rayures.jpg", url: "/placeholder.svg?height=200&width=300" },
    { id: 2, name: "photo_interieur.jpg", url: "/placeholder.svg?height=200&width=300" },
  ],
  timeline: [
    {
      id: 1,
      action: "Réclamation créée",
      user: "Marie Dubois",
      timestamp: "2024-01-15T10:30:00",
      details: "Réclamation initiale soumise",
    },
    {
      id: 2,
      action: "Statut changé",
      user: "Admin Principal",
      timestamp: "2024-01-15T11:00:00",
      details: "Statut changé de 'nouveau' à 'ouvert'",
    },
    {
      id: 3,
      action: "Priorité mise à jour",
      user: "Admin Principal",
      timestamp: "2024-01-15T14:20:00",
      details: "Priorité changée à 'haute'",
    },
  ],
}

export default function ComplaintDetailPage() {
  const params = useParams()
  const [status, setStatus] = useState(complaintDetails.status)
  const [priority, setPriority] = useState(complaintDetails.priority)
  const [adminNotes, setAdminNotes] = useState("")

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    console.log("Changing status to:", newStatus)
    // Logique pour changer le statut
  }

  const handlePriorityChange = (newPriority: string) => {
    setPriority(newPriority)
    console.log("Changing priority to:", newPriority)
    // Logique pour changer la priorité
  }

  const handleSaveNotes = () => {
    console.log("Saving admin notes:", adminNotes)
    // Logique pour sauvegarder les notes
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "destructive"
      case "in_progress":
        return "default"
      case "resolved":
        return "secondary"
      case "closed":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Réclamation #{complaintDetails.id}</h1>
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
                <span className="text-sm">{new Date(complaintDetails.createdDate).toLocaleDateString("fr-FR")}</span>
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
              <TabsTrigger value="timeline">Historique</TabsTrigger>
              <TabsTrigger value="notes">Notes admin</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Description de la réclamation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{complaintDetails.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Réservation concernée</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">ID Réservation:</span>
                      <span className="text-sm">{complaintDetails.booking.id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Véhicule:</span>
                      <span className="text-sm">{complaintDetails.booking.vehicle}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Période:</span>
                      <span className="text-sm">
                        {complaintDetails.booking.startDate} - {complaintDetails.booking.endDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Montant:</span>
                      <span className="text-sm font-semibold">€{complaintDetails.booking.totalAmount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {complaintDetails.attachments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Pièces jointes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {complaintDetails.attachments.map((attachment) => (
                        <div key={attachment.id} className="border rounded-lg p-4">
                          <img
                            src={attachment.url || "/placeholder.svg"}
                            alt={attachment.name}
                            className="w-full rounded border mb-2"
                          />
                          <p className="text-sm font-medium">{attachment.name}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
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
                      <AvatarImage src={complaintDetails.user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {complaintDetails.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{complaintDetails.user.name}</p>
                      <p className="text-sm text-muted-foreground">{complaintDetails.user.email}</p>
                      <p className="text-sm text-muted-foreground">{complaintDetails.user.phone}</p>
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
                      <p className="font-medium">{complaintDetails.agency.name}</p>
                      <p className="text-sm text-muted-foreground">{complaintDetails.agency.email}</p>
                      <p className="text-sm text-muted-foreground">{complaintDetails.agency.phone}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Voir agence
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Historique des actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complaintDetails.timeline.map((event) => (
                      <div key={event.id} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{event.action}</p>
                            <span className="text-sm text-muted-foreground">
                              {new Date(event.timestamp).toLocaleString("fr-FR")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">Par {event.user}</p>
                          <p className="text-sm">{event.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notes administrateur</CardTitle>
                  <CardDescription>Notes internes visibles uniquement par les administrateurs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-notes">Ajouter une note</Label>
                    <Textarea
                      id="admin-notes"
                      placeholder="Tapez vos notes ici..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button onClick={handleSaveNotes}>Sauvegarder la note</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
