"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { ChatInterface } from "@/components/chat/chat-interface"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"

const complaintDetails = {
  id: 1,
  title: "Véhicule non conforme à la description",
  user: "Marie Dubois",
  agency: "AutoLoc Paris",
  status: "open",
  priority: "high",
  createdDate: "2024-01-15",
  category: "vehicle",
  description:
    "Le véhicule reçu ne correspondait pas à la description. La voiture était sale et avait des rayures non mentionnées.",
}

const chatMessages = [
  {
    id: 1,
    sender: "Marie Dubois",
    message: "Bonjour, je souhaite signaler un problème avec ma réservation.",
    timestamp: "2024-01-15 10:30",
    isAdmin: false,
  },
  {
    id: 2,
    sender: "Admin",
    message:
      "Bonjour Marie, je suis désolé d'apprendre que vous avez rencontré un problème. Pouvez-vous me donner plus de détails ?",
    timestamp: "2024-01-15 10:35",
    isAdmin: true,
  },
  {
    id: 3,
    sender: "Marie Dubois",
    message:
      "Le véhicule que j'ai reçu était sale et avait plusieurs rayures qui n'étaient pas mentionnées dans l'annonce.",
    timestamp: "2024-01-15 10:40",
    isAdmin: false,
  },
]

export default function ComplaintChatPage() {
  const params = useParams()
  const [messages, setMessages] = useState(chatMessages)

  const handleSendMessage = (message: string) => {
    const newMessage = {
      id: messages.length + 1,
      sender: "Admin",
      message,
      timestamp: new Date().toLocaleString("fr-FR"),
      isAdmin: true,
    }
    setMessages([...messages, newMessage])
  }

  const handleResolveComplaint = () => {
    console.log("Resolving complaint:", params.complaintId)
    // Logique pour marquer la réclamation comme résolue
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
          <h1 className="text-3xl font-bold tracking-tight">Chat - Réclamation #{complaintDetails.id}</h1>
          <p className="text-muted-foreground">Communication avec {complaintDetails.user}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Détails de la réclamation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Détails de la réclamation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">{complaintDetails.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{complaintDetails.description}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>MD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{complaintDetails.user}</p>
                  <p className="text-xs text-muted-foreground">Utilisateur</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Statut:</span>
                <Badge
                  variant={
                    complaintDetails.status === "resolved"
                      ? "default"
                      : complaintDetails.status === "in_progress"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {complaintDetails.status === "open" && "Ouverte"}
                  {complaintDetails.status === "in_progress" && "En cours"}
                  {complaintDetails.status === "resolved" && "Résolue"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Priorité:</span>
                <Badge
                  variant={
                    complaintDetails.priority === "high"
                      ? "destructive"
                      : complaintDetails.priority === "medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {complaintDetails.priority === "high" && "Haute"}
                  {complaintDetails.priority === "medium" && "Moyenne"}
                  {complaintDetails.priority === "low" && "Basse"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Agence:</span>
                <span className="text-sm font-medium">{complaintDetails.agency}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Date:</span>
                <span className="text-sm">{complaintDetails.createdDate}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={handleResolveComplaint} className="w-full">
                <CheckCircle className="mr-2 h-4 w-4" />
                Marquer comme résolue
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Interface de chat */}
        <div className="md:col-span-2">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            title="Conversation avec l'utilisateur"
          />
        </div>
      </div>
    </div>
  )
}
