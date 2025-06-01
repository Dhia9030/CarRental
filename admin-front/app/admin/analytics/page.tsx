"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { Users, Car, DollarSign, Calendar } from "lucide-react"

const monthlyData = [
  { month: "Jan", users: 186, bookings: 145, revenue: 12400 },
  { month: "Fév", users: 305, bookings: 234, revenue: 18600 },
  { month: "Mar", users: 237, bookings: 189, revenue: 15200 },
  { month: "Avr", users: 273, bookings: 210, revenue: 16800 },
  { month: "Mai", users: 209, bookings: 167, revenue: 13900 },
  { month: "Jun", users: 214, bookings: 178, revenue: 14200 },
]

const categoryData = [
  { name: "Économique", value: 35, color: "#8884d8" },
  { name: "Compact", value: 28, color: "#82ca9d" },
  { name: "SUV", value: 22, color: "#ffc658" },
  { name: "Luxe", value: 15, color: "#ff7300" },
]

const agencyPerformance = [
  { name: "AutoLoc Paris", bookings: 234, revenue: 18600, rating: 4.8 },
  { name: "CarRent Marseille", bookings: 189, revenue: 15200, rating: 4.6 },
  { name: "Lyon Auto Services", bookings: 156, revenue: 12400, rating: 4.7 },
  { name: "Nice Car Rental", bookings: 134, revenue: 10800, rating: 4.5 },
]

const chartConfig = {
  users: { label: "Utilisateurs", color: "hsl(var(--chart-1))" },
  bookings: { label: "Réservations", color: "hsl(var(--chart-2))" },
  revenue: { label: "Revenus", color: "hsl(var(--chart-3))" },
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analyses avancées</h1>
        <p className="text-muted-foreground">Tableaux de bord et métriques détaillées de votre plateforme</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€91,100</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> vs mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,123</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> vs mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,424</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15.3%</span> vs mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'occupation</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> vs mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="agencies">Agences</TabsTrigger>
          <TabsTrigger value="vehicles">Véhicules</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Évolution mensuelle</CardTitle>
                <CardDescription>Utilisateurs, réservations et revenus sur 6 mois</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={2} />
                      <Line type="monotone" dataKey="bookings" stroke="var(--color-bookings)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par catégorie</CardTitle>
                <CardDescription>Types de véhicules les plus demandés</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenus mensuels</CardTitle>
              <CardDescription>Évolution des revenus sur les 6 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agencies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance des agences</CardTitle>
              <CardDescription>Classement des agences par nombre de réservations et revenus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agencyPerformance.map((agency, index) => (
                  <div key={agency.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{agency.name}</p>
                        <p className="text-sm text-muted-foreground">Note: {agency.rating}/5</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{agency.bookings} réservations</p>
                      <p className="text-sm text-muted-foreground">€{agency.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Véhicules les plus demandés</CardTitle>
                <CardDescription>Top 5 des modèles les plus réservés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Renault Clio", "Peugeot 208", "Volkswagen Golf", "BMW X3", "Mercedes Classe A"].map(
                    (car, index) => (
                      <div key={car} className="flex items-center justify-between">
                        <span className="text-sm">{car}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${100 - index * 15}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground">{100 - index * 15}%</span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disponibilité par catégorie</CardTitle>
                <CardDescription>Taux d'occupation des différentes catégories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryData.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <span className="text-sm">{category.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${category.value * 2}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground">{category.value * 2}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Nouveaux utilisateurs</CardTitle>
                <CardDescription>Ce mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+23%</span> vs mois dernier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Utilisateurs actifs</CardTitle>
                <CardDescription>30 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> vs période précédente
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Taux de rétention</CardTitle>
                <CardDescription>Utilisateurs récurrents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68.5%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+5.2%</span> vs mois dernier
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
