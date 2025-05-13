"use client"

import { CarDetails } from "@/components/car-details"

export default function CarDetailsPage({ params }: { params: { id: string } }) {
  return <CarDetails id={params.id} />
}
