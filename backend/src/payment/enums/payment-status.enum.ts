export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING", 
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
  CANCELLED = "CANCELLED",
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
