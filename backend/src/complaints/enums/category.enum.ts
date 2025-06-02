// Enum des catégories de réclamations
export enum ComplaintCategory {
  // Réclamations communes
  VEHICLE_CONDITION = "vehicle_condition",
  PAYMENT_ISSUE = "payment_issue",
  SERVICE_QUALITY = "service_quality",
  BOOKING_PROBLEM = "booking_problem",
  COMMUNICATION = "communication",

  // Réclamations spécifiques clients
  DELIVERY_DELAY = "delivery_delay",
  VEHICLE_NOT_AVAILABLE = "vehicle_not_available",
  OVERCHARGING = "overcharging",
  INSURANCE_ISSUE = "insurance_issue",

  // Réclamations spécifiques agences
  VEHICLE_DAMAGE = "vehicle_damage",
  LATE_RETURN = "late_return",
  PAYMENT_DELAY = "payment_delay",
  CONTRACT_VIOLATION = "contract_violation",
  INAPPROPRIATE_BEHAVIOR = "inappropriate_behavior",
  CLEANING_REQUIRED = "cleaning_required",
}
