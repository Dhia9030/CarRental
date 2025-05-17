"use client"

import { useApi } from "@/providers/api-provider"
import { Star } from "lucide-react"

interface CarReviewsProps {
  carId: string
}

/**
 * CarReviews Component
 *
 * This component displays reviews for a specific car.
 * It shows the reviewer name, rating, date, and comment.
 *
 * @param {string} carId - ID of the car to show reviews for
 */
export function CarReviews({ carId }: CarReviewsProps) {
  const { reviews, isLoadingReviews } = useApi()

  // Filter reviews for this car
  const carReviews = reviews.filter((review) => review.carId === carId)

  /**
   * Format a date string to a readable format
   *
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date string
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoadingReviews) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {carReviews.length > 0 ? (
        carReviews.map((review) => (
          <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-medium">{review.renterName}</h4>
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-amber-500" : "text-slate-200"}`} />
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-1">{formatDate(review.createdAt)}</p>
            <p className="text-sm">{review.comment}</p>
          </div>
        ))
      ) : (
        <p className="text-slate-500">No reviews yet for this car.</p>
      )}
    </div>
  )
}
