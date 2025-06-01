"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Bell,
  Check,
  CheckCheck,
  MoreHorizontal,
  Trash2,
  Eye,
  Users,
  Building2,
  AlertTriangle,
  MessageSquare,
  Settings,
  DollarSign,
} from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "agency_validation",
    title: "Nouvelle agence en attente",
    message: "AutoLoc Marseille demande une validation de son compte",
    timestamp: "2024-01-15T14:30:00",
    read: false,
    priority: "high",
    icon: Building2,
    color: "bg-blue-500",
    actionUrl: "/admin/agencies/validation",
  },
  {
    id: 2,
    type: "complaint",
    title: "Nouvelle réclamation",
    message: "Marie Dubois a signalé un problème avec sa réservation #BK-2024-001",
    timestamp: "2024-01-15T14:15:00",
    read: false,
    priority: "high",
    icon: AlertTriangle,
    color: "bg-red-500",
    actionUrl: "/admin/complaints/1",
  },
  {
    id: 3,
    type: "user_registration",
    title: "Nouvel utilisateur",
    message: "Jean Martin s'est inscrit et attend une validation",
    timestamp: "2024-01-15T13:45:00",
    read: false,
    priority: "medium",
    icon: Users,
    color: "bg-green-500",
    actionUrl: "/admin/users/validation",
  },
  {
    id: 4,
    type: "payment",
    title: "Paiement reçu",
    message: "Paiement de €250 reçu pour la réservation #BK-2024-002",
    timestamp: "2024-01-15T12:30:00",
    read: true,
    priority: "low",
    icon: DollarSign,
    color: "bg-green-500",
    actionUrl: "/admin/analytics",
  },
  {
    id: 5,
    type: "chat",
    title: "Nouveau message",
    message: "Sophie Laurent a envoyé un message dans le chat support",
    timestamp: "2024-01-15T11:20:00",
    read: true,
    priority: "medium",
    icon: MessageSquare,
    color: "bg-blue-500",
    actionUrl: "/admin/chat",
  },
  {
    id: 6,
    type: "system",
    title: "Mise à jour système",
    message: "La sauvegarde automatique a été effectuée avec succès",
    timestamp: "2024-01-15T03:00:00",
    read: true,
    priority: "low",
    icon: Settings,
    color: "bg-gray-500",
    actionUrl: "/admin/settings",
  },
  {
    id: 7,
    type: "agency_validation",
    title: "Agence validée",
    message: "CarRent Lyon a été validée et peut maintenant publier des véhicules",
    timestamp: "2024-01-14T16:45:00",
    read: true,
    priority: "medium",
    icon: Building2,
    color: "bg-green-500",
    actionUrl: "/admin/agencies",
  },
  {
    id: 8,
    type: "complaint",
    title: "Réclamation résolue",
    message: "La réclamation #1234 de Pierre Durand a été marquée comme résolue",
    timestamp: "2024-01-14T15:30:00",
    read: true,
    priority: "low",
    icon: AlertTriangle,
    color: "bg-green-500",
    actionUrl: "/admin/complaints",
  },
]

export default function NotificationsPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [notificationsList, setNotificationsList] = useState(notifications)

  const markAsRead = (id: number) => {
    setNotificationsList((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotificationsList((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotificationsList((prev) => prev.filter((notif) => notif.id !== id))
  }

  const getFilteredNotifications = () => {
    switch (selectedTab) {
      case "unread":
        return notificationsList.filter((n) => !n.read)
      case "high":
        return notificationsList.filter((n) => n.priority === "high")
      case "agencies":
        return notificationsList.filter((n) => n.type === "agency_validation")
      case "complaints":
        return notificationsList.filter((n) => n.type === "complaint")
      default:
        return notificationsList
    }
  }

  const unreadCount = notificationsList.filter((n) => !n.read).length
  const highPriorityCount = notificationsList.filter((n) => n.priority === "high" && !n.read).length

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `Il y a ${days} jour${days > 1 ? "s" : ""}`
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Gérez toutes vos notifications ({unreadCount} non lue{unreadCount > 1 ? "s" : ""})
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Tout marquer comme lu
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Total</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificationsList.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Non lues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Priorité haute</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highPriorityCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {
                notificationsList.filter((n) => new Date(n.timestamp).toDateString() === new Date().toDateString())
                  .length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des notifications</CardTitle>
          <CardDescription>Filtrez et gérez vos notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Toutes ({notificationsList.length})</TabsTrigger>
              <TabsTrigger value="unread">Non lues ({unreadCount})</TabsTrigger>
              <TabsTrigger value="high">Priorité haute ({highPriorityCount})</TabsTrigger>
              <TabsTrigger value="agencies">Agences</TabsTrigger>
              <TabsTrigger value="complaints">Réclamations</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-6">
              <div className="space-y-3">
                {getFilteredNotifications().length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune notification</h3>
                    <p className="mt-1 text-sm text-gray-500">Aucune notification ne correspond à ce filtre.</p>
                  </div>
                ) : (
                  getFilteredNotifications().map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start space-x-4 p-4 border rounded-lg transition-colors hover:bg-gray-50 ${
                        !notification.read ? "bg-blue-50 border-blue-200" : ""
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.color}`}>
                        <notification.icon className="h-5 w-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{notification.title}</p>
                              {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                              <Badge
                                variant={
                                  notification.priority === "high"
                                    ? "destructive"
                                    : notification.priority === "medium"
                                      ? "default"
                                      : "secondary"
                                }
                                className="text-xs"
                              >
                                {notification.priority === "high" && "Haute"}
                                {notification.priority === "medium" && "Moyenne"}
                                {notification.priority === "low" && "Basse"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-2">{formatTimestamp(notification.timestamp)}</p>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!notification.read && (
                                <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                  <Check className="mr-2 h-4 w-4" />
                                  Marquer comme lu
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir les détails
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteNotification(notification.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
