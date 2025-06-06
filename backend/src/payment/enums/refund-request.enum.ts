export enum RefundRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PROCESSED = "PROCESSED",
}

export enum RefundRequestType {
  FULL_REFUND = "FULL_REFUND",
  PARTIAL_REFUND = "PARTIAL_REFUND",
  DEPOSIT_RELEASE = "DEPOSIT_RELEASE",
  CANCELLATION_REFUND = "CANCELLATION_REFUND",
}
