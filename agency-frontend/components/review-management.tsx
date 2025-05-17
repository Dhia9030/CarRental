"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, Star, CheckCircle, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for reviews
const reviewsMockData = [
  {
    id: "1",
    renter: {
      id: "u1",
      name: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    car: {
      id: "c1",
      make: "Tesla",
      model: "Model 3",
    },
    rating: 5,
    comment:
      "Amazing car, very clean and drove perfectly! The agency was very professional and helpful throughout the rental process.",
    isRead: true,
    createdAt: new Date("2023-06-05"),
  },
  {
    id: "2",
    renter: {
      id: "u2",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    car: {
      id: "c2",
      make: "BMW",
      model: "X5",
    },
    rating: 4,
    comment: "Great SUV, perfect for our family trip. The only issue was a small delay during pickup.",
    isRead: false,
    createdAt: new Date("2023-06-08"),
  },
  {
    id: "3",
    renter: {
      id: "u3",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    car: {
      id: "c3",
      make: "Mercedes",
      model: "E-Class",
    },
    rating: 5,
    comment:
      "Luxury at its finest. Will rent again! The car was in perfect condition and the agency staff was very friendly.",
    isRead: false,
    createdAt: new Date("2023-06-10"),
  },
  {
    id: "4",
    renter: {
      id: "u4",
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    agency: {
      id: "a1",
      companyName: "Premium Motors",
    },
    rating: 5,
    comment: "Excellent service from Premium Motors! They were very accommodating and professional.",
    isRead: true,
    createdAt: new Date("2023-06-12"),
  },
  {
    id: "5",
    renter: {
      id: "u5",
      name: "David Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    car: {
      id: "c5",
      make: "Toyota",
      model: "Camry",
    },
    rating: 3,
    comment: "Car was clean but had some mechanical issues during the trip. Customer service was good though.",
    isRead: false,
    createdAt: new Date("2023-06-15"),
  },
]

export function ReviewManagement() {
  const [reviews, setReviews] = useState(reviewsMockData)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.renter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.car?.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      review.car?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "unread") return matchesSearch && !review.isRead
    if (activeTab === "car") return matchesSearch && review.car
    if (activeTab === "agency") return matchesSearch && review.agency

    return matchesSearch
  })

  const handleMarkAsRead = (id: string) => {
    setReviews(reviews.map((review) => (review.id === id ? { ...review, isRead: true } : review)))
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl">Review Management</CardTitle>
            <CardDescription>Manage customer reviews</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search reviews..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-4" onValueChange={setActiveTab}>
            <TabsList className="bg-sky-50 border border-sky-100">
              <TabsTrigger value="all">All Reviews</TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                <Badge className="ml-2 bg-sky-600">{reviews.filter((r) => !r.isRead).length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="car">Car Reviews</TabsTrigger>
              <TabsTrigger value="agency">Agency Reviews</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card key={review.id} className={!review.isRead ? "border-sky-200 bg-sky-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={review.renter.avatar || "/placeholder.svg"} alt={review.renter.name} />
                        <AvatarFallback>{review.renter.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{review.renter.name}</h4>
                          {!review.isRead && <Badge className="bg-sky-100 text-sky-800 hover:bg-sky-100">New</Badge>}
                        </div>
                        <p className="text-sm text-slate-500">
                          {review.car
                            ? `Review for ${review.car.make} ${review.car.model}`
                            : `Review for ${review.agency.companyName}`}
                        </p>
                        <div className="flex items-center mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "fill-amber-500 text-amber-500" : "text-slate-200"}`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-slate-500">{formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!review.isRead && (
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleMarkAsRead(review.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            <span>Mark as Read</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="cursor-pointer">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>Reply</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="mt-3 text-sm">{review.comment}</p>
                </CardContent>
              </Card>
            ))}

            {filteredReviews.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-900">No reviews found</h3>
                <p className="text-sm text-slate-500">
                  {searchTerm ? "Try adjusting your search terms" : "You don't have any reviews yet"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
