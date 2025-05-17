import { BookingDetails } from "@/components/booking-details-page"

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
  return <BookingDetails id={params.id} />
}
