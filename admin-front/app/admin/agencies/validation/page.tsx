"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, FileText, Phone, Mail, Calendar, MapPin, Building2 } from "lucide-react"

const pendingAgencies = [
  {
    id: 1,
    name: "AutoLoc Marseille",
    email: "contact@autoloc-marseille.com",
    phone: "+33 4 91 23 45 67",
    address: "456 La Canebière, 13001 Marseille",
    registrationDate: "2024-01-15",
    siret: "12345678901234",
    documents: {
      businessLicense: "/placeholder.svg?height=200&width=300",
      insurance: "/placeholder.svg?height=200&width=300",
      kbis: "/placeholder.svg?height=200&width=300",
    },
    status: "pending",
    contactPerson: "Michel Dubois",
    website: "www.autoloc-marseille.com",
  },
  {
    id: 2,
    name: "CarRent Lyon",
    email: "info@carrent-lyon.com",
    phone: "+33 4 72 11 22 33",
    address: "789 Rue de la République, 69002 Lyon",
    registrationDate: "2024-01-14",
    siret: "98765432109876",
    documents: {
      businessLicense: "/placeholder.svg?height=200&width=300",
      insurance: "/placeholder.svg?height=200&width=300",
      kbis: "/placeholder.svg?height=200&width=300",
    },
    status: "pending",
    contactPerson: "Sophie Martin",
    website: "www.carrent-lyon.com",
  },
]

export default function AgencyValidationPage() {
  const [selectedAgency, setSelectedAgency] = useState(pendingAgencies[0])

  const handleValidate = (agencyId: number) => {
    console.log("Validating agency:", agencyId)
    // Logique de validation
  }

  const handleReject = (agencyId: number) => {
    console.log("Rejecting agency:", agencyId)
    // Logique de rejet
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Validation des agences</h1>
        <p className="text-muted-foreground">Vérifiez et validez les documents des nouvelles agences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Liste des agences en attente */}
        <Card>
          <CardHeader>
            <CardTitle>En attente de validation</CardTitle>
            <CardDescription>{pendingAgencies.length} agence(s) en attente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingAgencies.map((agency) => (
              <div
                key={agency.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAgency.id === agency.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedAgency(agency)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>
                      <Building2 className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{agency.name}</p>
                    <p className="text-sm text-gray-500">{agency.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{agency.registrationDate}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">En attente</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Détails de l'agence sélectionnée */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Détails de {selectedAgency.name}</span>
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
                          <Building2 className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{selectedAgency.name}</h3>
                        <Badge variant="secondary">Agence en attente</Badge>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{selectedAgency.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{selectedAgency.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{selectedAgency.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Inscrite le {selectedAgency.registrationDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span>SIRET: {selectedAgency.siret}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Personne de contact</h4>
                      <p className="text-sm text-gray-600">{selectedAgency.contactPerson}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Site web</h4>
                      <p className="text-sm text-blue-600">{selectedAgency.website}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Licence commerciale</span>
                      </h4>
                      <div className="border rounded-lg p-4">
                        <img
                          src={selectedAgency.documents.businessLicense || "/placeholder.svg"}
                          alt="Licence commerciale"
                          className="w-full max-w-md mx-auto rounded border"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Assurance professionnelle</span>
                      </h4>
                      <div className="border rounded-lg p-4">
                        <img
                          src={selectedAgency.documents.insurance || "/placeholder.svg"}
                          alt="Assurance professionnelle"
                          className="w-full max-w-md mx-auto rounded border"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Extrait K-bis</span>
                      </h4>
                      <div className="border rounded-lg p-4">
                        <img
                          src={selectedAgency.documents.kbis || "/placeholder.svg"}
                          alt="Extrait K-bis"
                          className="w-full max-w-md mx-auto rounded border"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex space-x-4 mt-6 pt-6 border-t">
                <Button onClick={() => handleValidate(selectedAgency.id)} className="flex-1">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Valider l'agence
                </Button>
                <Button variant="destructive" onClick={() => handleReject(selectedAgency.id)} className="flex-1">
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
