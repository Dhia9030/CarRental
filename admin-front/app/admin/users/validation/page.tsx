"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, FileText, Phone, Mail, Calendar } from "lucide-react"

const pendingUsers = [
  {
    id: 1,
    name: "Jean Martin",
    email: "jean.martin@email.com",
    phone: "+33 6 98 76 54 32",
    registrationDate: "2024-01-14",
    documents: {
      idCard: "/placeholder.svg?height=200&width=300",
      drivingLicense: "/placeholder.svg?height=200&width=300",
    },
    status: "pending",
  },
  {
    id: 2,
    name: "Alice Rousseau",
    email: "alice.rousseau@email.com",
    phone: "+33 6 77 88 99 00",
    registrationDate: "2024-01-13",
    documents: {
      idCard: "/placeholder.svg?height=200&width=300",
      drivingLicense: "/placeholder.svg?height=200&width=300",
    },
    status: "pending",
  },
]

export default function UserValidationPage() {
  const [selectedUser, setSelectedUser] = useState(pendingUsers[0])

  const handleValidate = (userId: number) => {
    console.log("Validating user:", userId)
    // Logique de validation
  }

  const handleReject = (userId: number) => {
    console.log("Rejecting user:", userId)
    // Logique de rejet
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Validation des utilisateurs</h1>
        <p className="text-muted-foreground">Vérifiez et validez les documents des nouveaux utilisateurs</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Liste des utilisateurs en attente */}
        <Card>
          <CardHeader>
            <CardTitle>En attente de validation</CardTitle>
            <CardDescription>{pendingUsers.length} utilisateur(s) en attente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingUsers.map((user) => (
              <div
                key={user.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedUser.id === user.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{user.registrationDate}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">En attente</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Détails de l'utilisateur sélectionné */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Détails de {selectedUser.name}</span>
              </CardTitle>
              <CardDescription>Vérifiez les informations et documents fournis</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Informations</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="/placeholder.svg?height=64&width=64" />
                        <AvatarFallback className="text-lg">
                          {selectedUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                        <Badge variant="secondary">Utilisateur en attente</Badge>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{selectedUser.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Inscrit le {selectedUser.registrationDate}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Carte d'identité</span>
                      </h4>
                      <div className="border rounded-lg p-4">
                        <img
                          src={selectedUser.documents.idCard || "/placeholder.svg"}
                          alt="Carte d'identité"
                          className="w-full max-w-md mx-auto rounded border"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Permis de conduire</span>
                      </h4>
                      <div className="border rounded-lg p-4">
                        <img
                          src={selectedUser.documents.drivingLicense || "/placeholder.svg"}
                          alt="Permis de conduire"
                          className="w-full max-w-md mx-auto rounded border"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex space-x-4 mt-6 pt-6 border-t">
                <Button onClick={() => handleValidate(selectedUser.id)} className="flex-1">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Valider l'utilisateur
                </Button>
                <Button variant="destructive" onClick={() => handleReject(selectedUser.id)} className="flex-1">
                  <XCircle className="mr-2 h-4 w-4" />
                  Rejeter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
