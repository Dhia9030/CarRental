"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Globe } from "lucide-react"

export default function SettingsPage() {
  const handleSaveSettings = () => {
    console.log("Saving settings...")
    // Logique de sauvegarde
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres système</h1>
        <p className="text-muted-foreground">Configurez les paramètres généraux de votre plateforme</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Informations générales</span>
            </CardTitle>
            <CardDescription>Paramètres de base de la plateforme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform-name">Nom de la plateforme</Label>
              <Input id="platform-name" defaultValue="CarRent Platform" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform-description">Description</Label>
              <Textarea
                id="platform-description"
                defaultValue="Plateforme de location de voitures entre particuliers et agences"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email de contact</Label>
              <Input id="contact-email" type="email" defaultValue="contact@carrent.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-phone">Téléphone support</Label>
              <Input id="support-phone" defaultValue="+33 1 23 45 67 89" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Paramètres régionaux</span>
            </CardTitle>
            <CardDescription>Configuration de la localisation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-language">Langue par défaut</Label>
              <Select defaultValue="fr">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-currency">Devise par défaut</Label>
              <Select defaultValue="eur">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eur">Euro (€)</SelectItem>
                  <SelectItem value="usd">Dollar ($)</SelectItem>
                  <SelectItem value="tnd">Dinar Tunisien (TND)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Select defaultValue="europe/paris">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="europe/paris">Europe/Paris</SelectItem>
                  <SelectItem value="europe/london">Europe/London</SelectItem>
                  <SelectItem value="africa/tunis">Africa/Tunis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Sauvegarder les paramètres</Button>
      </div>
    </div>
  )
}
