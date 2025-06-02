"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Search,
  Filter,
  Car,
  Calendar,
  Edit3,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import {
  getUserReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserBookings,
} from "@/lib/api";
import { Review, Booking } from "@/types/api";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [eligibleBookings, setEligibleBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reviewsResponse, bookingsResponse] = await Promise.all([
        getUserReviews(),
        getUserBookings(),
      ]);

      setReviews(reviewsResponse.data);

      // Filter bookings that are completed and don't have reviews yet
      const completedBookings = bookingsResponse.data.filter(
        (booking: Booking) =>
          booking.status === "Completed" &&
          !reviewsResponse.data.some(
            (review: Review) => review.bookingId === booking.id
          )
      );
      setEligibleBookings(completedBookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.car?.make + " " + review.car?.model)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesRating =
      ratingFilter === "all" || review.rating.toString() === ratingFilter;

    return matchesSearch && matchesRating;
  });

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review");
    }
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={
              interactive && onRatingChange
                ? () => onRatingChange(star)
                : undefined
            }
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
        {eligibleBookings.length > 0 && (
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Edit3 className="h-4 w-4 mr-2" />
                Write Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
                <DialogDescription>
                  Share your experience with other travelers
                </DialogDescription>
              </DialogHeader>
              <CreateReviewForm
                bookings={eligibleBookings}
                onSuccess={() => {
                  setIsCreateDialogOpen(false);
                  loadData();
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="my-reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-reviews">
            My Reviews ({filteredReviews.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending Reviews ({eligibleBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-reviews" className="space-y-4">
          {filteredReviews.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No reviews found
                </h3>
                <p className="text-gray-500 mb-4">
                  {reviews.length === 0
                    ? "You haven't written any reviews yet."
                    : "No reviews match your search criteria."}
                </p>
                {eligibleBookings.length > 0 && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    Write Your First Review
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onEdit={(review) => {
                    setSelectedReview(review);
                    setIsEditDialogOpen(true);
                  }}
                  onDelete={handleDeleteReview}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {eligibleBookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No pending reviews
                </h3>
                <p className="text-gray-500">
                  Complete a booking to leave a review for the car.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {eligibleBookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Car className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {booking.car?.make} {booking.car?.model}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Completed on{" "}
                            {format(new Date(booking.endDate), "MMM dd, yyyy")}
                          </p>
                          <p className="text-sm text-gray-600">
                            ${booking.totalPrice.toFixed(2)} total
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setIsCreateDialogOpen(true)}
                        size="sm">
                        <Star className="h-4 w-4 mr-2" />
                        Write Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Review Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
            <DialogDescription>Update your review</DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <EditReviewForm
              review={selectedReview}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setSelectedReview(null);
                loadData();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ReviewCardProps {
  review: Review;
  onEdit: (review: Review) => void;
  onDelete: (reviewId: string) => void;
}

function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Car Image */}
          <div className="lg:w-32 h-24 bg-gray-200 rounded-lg overflow-hidden">
            {review.car?.images?.[0] ? (
              <img
                src={review.car.images[0]}
                alt={`${review.car.make} ${review.car.model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* Review Content */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {review.car?.make} {review.car?.model}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(review.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(review)}>
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(review.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="text-gray-700">{review.comment}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CreateReviewFormProps {
  bookings: Booking[];
  onSuccess: () => void;
}

function CreateReviewForm({ bookings, onSuccess }: CreateReviewFormProps) {
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedBooking = bookings.find((b) => b.id === selectedBookingId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || rating === 0 || !comment.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await createReview({
        bookingId: selectedBookingId,
        carId: selectedBooking!.carId,
        rating,
        comment: comment.trim(),
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (
    rating: number,
    onRatingChange: (rating: number) => void
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer transition-colors ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 hover:text-yellow-400"
            }`}
            onClick={() => onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Select Booking</label>
        <Select value={selectedBookingId} onValueChange={setSelectedBookingId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a completed booking" />
          </SelectTrigger>
          <SelectContent>
            {bookings.map((booking) => (
              <SelectItem key={booking.id} value={booking.id}>
                {booking.car?.make} {booking.car?.model} -
                {format(new Date(booking.endDate), "MMM dd, yyyy")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Rating</label>
        {renderStars(rating, setRating)}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Comment</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this car..."
          rows={4}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  );
}

interface EditReviewFormProps {
  review: Review;
  onSuccess: () => void;
}

function EditReviewForm({ review, onSuccess }: EditReviewFormProps) {
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) {
      setError("Please provide both rating and comment");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await updateReview(review.id, {
        rating,
        comment: comment.trim(),
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (
    rating: number,
    onRatingChange: (rating: number) => void
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer transition-colors ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 hover:text-yellow-400"
            }`}
            onClick={() => onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">
          {review.car?.make} {review.car?.model}
        </h4>
        <p className="text-sm text-gray-500">
          Originally reviewed on{" "}
          {format(new Date(review.createdAt), "MMM dd, yyyy")}
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Rating</label>
        {renderStars(rating, setRating)}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Comment</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this car..."
          rows={4}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Updating..." : "Update Review"}
        </Button>
      </div>
    </form>
  );
}
