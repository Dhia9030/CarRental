"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Upload } from "lucide-react"

export default function ProfilePage() {
  const handleSaveProfile = () => {
    console.log("Saving profile...")
    // Logique de sauvegarde du profil
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil administrateur</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles et préférences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Informations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" />
                <AvatarFallback className="text-lg">AD</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Changer la photo
              </Button>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">Nom</p>
                <p className="text-sm text-muted-foreground">Administrateur Principal</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">admin@carrent.com</p>
              </div>
              <div>
                <p className="text-sm font-medium">Rôle</p>
                <Badge variant="default">Super Admin</Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Dernière connexion</p>
                <p className="text-sm text-muted-foreground">Aujourd'hui à 09:30</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">Prénom</Label>
                  <Input id="first-name" defaultValue="Admin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Nom</Label>
                  <Input id="last-name" defaultValue="Principal" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="admin@carrent.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" defaultValue="+33 1 23 45 67 89" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <Input id="timezone" defaultValue="Europe/Paris" />
              </div>
              <Button onClick={handleSaveProfile}>Sauvegarder les modifications</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
