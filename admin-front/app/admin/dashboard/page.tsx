"use client"

import { StatsCard } from "@/components/ui/stats-card"
import { Chart } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Building2, Car, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock, Eye } from "lucide-react"

const statsData = [
  {
    title: "Utilisateurs actifs",
    value: "2,847",
    change: "+12%",
    trend: "up" as const,
    icon: Users,
  },
  {
    title: "Agences partenaires",
    value: "156",
    change: "+8%",
    trend: "up" as const,
    icon: Building2,
  },
  {
    title: "Véhicules disponibles",
    value: "1,234",
    change: "+5%",
    trend: "up" as const,
    icon: Car,
  },
  {
    title: "Revenus du mois",
    value: "€45,678",
    change: "+15%",
    trend: "up" as const,
    icon: DollarSign,
  },
]

const recentActivities = [
  {
    id: 1,
    type: "user_registration",
    message: "Nouvel utilisateur inscrit: Marie Dubois",
    time: "Il y a 5 minutes",
    status: "success",
  },
  {
    id: 2,
    type: "agency_validation",
    message: 'Agence "AutoLoc Paris" en attente de validation',
    time: "Il y a 15 minutes",
    status: "pending",
  },
  {
    id: 3,
    type: "complaint",
    message: "Nouvelle réclamation #1234",
    time: "Il y a 30 minutes",
    status: "warning",
  },
  {
    id: 4,
    type: "booking",
    message: "Réservation confirmée pour BMW X3",
    time: "Il y a 1 heure",
    status: "success",
  },
]

const pendingValidations = [
  { id: 1, type: "Agence", name: "AutoLoc Marseille", date: "2024-01-15" },
  { id: 2, type: "Utilisateur", name: "Jean Martin", date: "2024-01-14" },
  { id: 3, type: "Agence", name: "CarRent Lyon", date: "2024-01-14" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre plateforme de location</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Chart */}
        <div className="lg:col-span-2">
          <Chart />
        </div>

        {/* Pending Validations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Validations en attente</span>
            </CardTitle>
            <CardDescription>Éléments nécessitant votre attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingValidations.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Activités récentes</span>
          </CardTitle>
          <CardDescription>Dernières actions sur la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {activity.status === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {activity.status === "pending" && <Clock className="h-5 w-5 text-yellow-500" />}
                  {activity.status === "warning" && <AlertTriangle className="h-5 w-5 text-red-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge
                  variant={
                    activity.status === "success"
                      ? "default"
                      : activity.status === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {activity.status === "success" && "Succès"}
                  {activity.status === "pending" && "En attente"}
                  {activity.status === "warning" && "Attention"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
