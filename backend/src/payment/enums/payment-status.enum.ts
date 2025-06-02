export enum PaymentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded",
  CANCELLED = "cancelled",
}

export enum PaymentType {
  BOOKING_PAYMENT = "booking_payment",
  SECURITY_DEPOSIT = "security_deposit",
  DAMAGE_FEE = "damage_fee",
  LATE_FEE = "late_fee",
  CANCELLATION_FEE = "cancellation_fee",
}

export enum TransactionType {
  CHARGE = "charge",
  REFUND = "refund",
  DISPUTE = "dispute",
  AUTHORIZATION = "authorization",
  CAPTURE = "capture",
}
