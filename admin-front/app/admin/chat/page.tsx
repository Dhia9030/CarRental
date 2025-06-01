"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChatInterface } from "@/components/chat/chat-interface"
import { Search, MessageCircle } from "lucide-react"

const conversations = [
  {
    id: 1,
    user: "Marie Dubois",
    lastMessage: "Merci pour votre aide avec ma réservation",
    timestamp: "2024-01-15 14:30",
    unread: 0,
    status: "active",
    type: "support",
  },
  {
    id: 2,
    user: "Jean Martin",
    lastMessage: "J'ai un problème avec le paiement",
    timestamp: "2024-01-15 13:45",
    unread: 2,
    status: "pending",
    type: "complaint",
  },
  {
    id: 3,
    user: "AutoLoc Paris",
    lastMessage: "Nouvelle demande de validation",
    timestamp: "2024-01-15 12:20",
    unread: 1,
    status: "active",
    type: "agency",
  },
]

const currentChatMessages = [
  {
    id: 1,
    sender: "Jean Martin",
    message: "Bonjour, j'ai un problème avec le paiement de ma réservation.",
    timestamp: "2024-01-15 13:40",
    isAdmin: false,
  },
  {
    id: 2,
    sender: "Admin",
    message: "Bonjour Jean, je vais vous aider avec ce problème. Pouvez-vous me donner votre numéro de réservation ?",
    timestamp: "2024-01-15 13:42",
    isAdmin: true,
  },
  {
    id: 3,
    sender: "Jean Martin",
    message: "C'est la réservation #12345. J'ai été débité deux fois.",
    timestamp: "2024-01-15 13:45",
    isAdmin: false,
  },
]

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[1])
  const [searchTerm, setSearchTerm] = useState("")
  const [messages, setMessages] = useState(currentChatMessages)

  const filteredConversations = conversations.filter((conv) =>
    conv.user.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Centre de communication</h1>
        <p className="text-muted-foreground">Gérez toutes vos conversations avec les utilisateurs et agences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Liste des conversations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Conversations</span>
            </CardTitle>
            <CardDescription>
              {conversations.filter((c) => c.unread > 0).length} conversation(s) non lue(s)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une conversation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedConversation.id === conversation.id ? "bg-blue-50 border-blue-200" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>
                        {conversation.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{conversation.user}</p>
                        {conversation.unread > 0 && (
                          <Badge variant="destructive" className="ml-2">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400">{conversation.timestamp}</span>
                        <Badge
                          variant={conversation.type === "complaint" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {conversation.type === "support" && "Support"}
                          {conversation.type === "complaint" && "Réclamation"}
                          {conversation.type === "agency" && "Agence"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interface de chat */}
        <div className="md:col-span-2">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            title={`Conversation avec ${selectedConversation.user}`}
          />
        </div>
      </div>
    </div>
  )
}
