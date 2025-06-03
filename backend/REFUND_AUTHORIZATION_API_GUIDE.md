# Refund Authorization System API Guide

## Overview

The refund authorization system implements a secure, role-based workflow where clients must request refunds through agencies rather than processing them directly. This prevents unauthorized refunds and ensures proper oversight.

## Key Features

- **Request-Based System**: Clients submit refund requests that require agency approval
- **Role-Based Access Control**: Different endpoints for clients, agencies, and administrators
- **Multiple Refund Types**: Support for full refunds, partial refunds, deposit releases, and cancellation refunds
- **Status Tracking**: Complete audit trail from request to processing
- **Security**: JWT authentication and agency ownership validation

## API Endpoints

### Client Endpoints

#### 1. Create Refund Request

**POST** `/refund-requests`

Creates a new refund request that requires agency approval.

**Headers:**

```
Authorization: Bearer <client_jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "paymentId": 123,
  "requestedAmount": 50.0,
  "type": "PARTIAL_REFUND",
  "reason": "Car had mechanical issues during rental"
}
```

**Refund Types:**

- `FULL_REFUND`: Complete refund of payment
- `PARTIAL_REFUND`: Partial amount refund
- `DEPOSIT_RELEASE`: Security deposit release
- `CANCELLATION_REFUND`: Refund due to booking cancellation

**Response:**

```json
{
  "id": 1,
  "paymentId": 123,
  "bookingId": 456,
  "requestedByUserId": 789,
  "requestedAmount": 50.0,
  "type": "PARTIAL_REFUND",
  "reason": "Car had mechanical issues during rental",
  "status": "PENDING",
  "createdAt": "2025-06-03T10:30:00Z",
  "updatedAt": "2025-06-03T10:30:00Z"
}
```

#### 2. Get My Refund Requests

**GET** `/refund-requests/my-requests`

Retrieves all refund requests submitted by the authenticated client.

**Headers:**

```
Authorization: Bearer <client_jwt_token>
```

**Response:**

```json
[
  {
    "id": 1,
    "paymentId": 123,
    "bookingId": 456,
    "requestedAmount": 50.0,
    "type": "PARTIAL_REFUND",
    "reason": "Car had mechanical issues during rental",
    "status": "PENDING",
    "createdAt": "2025-06-03T10:30:00Z",
    "payment": {
      "id": 123,
      "totalAmount": 100.0,
      "booking": {
        "id": 456,
        "startDate": "2025-06-01",
        "endDate": "2025-06-05"
      }
    }
  }
]
```

### Agency Endpoints

#### 3. Get Agency Refund Requests

**GET** `/refund-requests/agency`

Retrieves all pending refund requests for the agency's bookings.

**Headers:**

```
Authorization: Bearer <agency_jwt_token>
```

**Query Parameters:**

- `status` (optional): Filter by status (`PENDING`, `APPROVED`, `REJECTED`, `PROCESSED`)
- `limit` (optional): Number of results per page (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:**

```json
[
  {
    "id": 1,
    "paymentId": 123,
    "bookingId": 456,
    "requestedByUserId": 789,
    "requestedAmount": 50.0,
    "type": "PARTIAL_REFUND",
    "reason": "Car had mechanical issues during rental",
    "status": "PENDING",
    "createdAt": "2025-06-03T10:30:00Z",
    "payment": {
      "id": 123,
      "totalAmount": 100.0,
      "booking": {
        "id": 456,
        "startDate": "2025-06-01",
        "endDate": "2025-06-05",
        "client": {
          "id": 789,
          "firstName": "John",
          "lastName": "Doe",
          "email": "john.doe@example.com"
        }
      }
    }
  }
]
```

#### 4. Approve Refund Request

**POST** `/refund-requests/:id/approve`

Approves a refund request and initiates the refund process.

**Headers:**

```
Authorization: Bearer <agency_jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "agencyNotes": "Approved due to valid mechanical issues reported. Refund processed for inconvenience."
}
```

**Response:**

```json
{
  "id": 1,
  "status": "APPROVED",
  "reviewedByAgencyId": 2,
  "agencyNotes": "Approved due to valid mechanical issues reported. Refund processed for inconvenience.",
  "reviewedAt": "2025-06-03T14:30:00Z",
  "processedAt": "2025-06-03T14:30:15Z"
}
```

#### 5. Reject Refund Request

**POST** `/refund-requests/:id/reject`

Rejects a refund request with a reason.

**Headers:**

```
Authorization: Bearer <agency_jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "rejectionReason": "No evidence of mechanical issues found. Car inspection shows normal wear only."
}
```

**Response:**

```json
{
  "id": 1,
  "status": "REJECTED",
  "reviewedByAgencyId": 2,
  "rejectionReason": "No evidence of mechanical issues found. Car inspection shows normal wear only.",
  "reviewedAt": "2025-06-03T14:30:00Z"
}
```

### Admin Endpoints

#### 6. Get All Refund Requests (Admin Only)

**GET** `/refund-requests/admin/all`

Administrative endpoint to view all refund requests across all agencies.

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**Query Parameters:**

- `status` (optional): Filter by status
- `agencyId` (optional): Filter by specific agency
- `limit` (optional): Number of results per page
- `offset` (optional): Pagination offset

**Response:**

```json
[
  {
    "id": 1,
    "paymentId": 123,
    "bookingId": 456,
    "requestedByUserId": 789,
    "requestedAmount": 50.0,
    "type": "PARTIAL_REFUND",
    "status": "APPROVED",
    "createdAt": "2025-06-03T10:30:00Z",
    "reviewedAt": "2025-06-03T14:30:00Z",
    "processedAt": "2025-06-03T14:30:15Z",
    "payment": {
      "booking": {
        "agency": {
          "id": 2,
          "name": "Premium Car Rentals",
          "email": "contact@premiumcars.com"
        },
        "client": {
          "id": 789,
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    }
  }
]
```

#### 7. Get Specific Refund Request

**GET** `/refund-requests/:id`

Retrieves details of a specific refund request (accessible by request owner, agency, or admin).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "id": 1,
  "paymentId": 123,
  "bookingId": 456,
  "requestedByUserId": 789,
  "requestedAmount": 50.0,
  "type": "PARTIAL_REFUND",
  "reason": "Car had mechanical issues during rental",
  "status": "APPROVED",
  "reviewedByAgencyId": 2,
  "agencyNotes": "Approved due to valid mechanical issues reported.",
  "reviewedAt": "2025-06-03T14:30:00Z",
  "processedAt": "2025-06-03T14:30:15Z",
  "createdAt": "2025-06-03T10:30:00Z",
  "updatedAt": "2025-06-03T14:30:15Z",
  "payment": {
    "id": 123,
    "totalAmount": 100.0,
    "stripePaymentIntentId": "pi_1234567890",
    "booking": {
      "id": 456,
      "startDate": "2025-06-01",
      "endDate": "2025-06-05",
      "agency": {
        "id": 2,
        "name": "Premium Car Rentals"
      },
      "client": {
        "id": 789,
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  }
}
```

## Status Workflow

The refund request follows this status workflow:

1. **PENDING**: Initial status when client creates request
2. **APPROVED**: Agency approves the request and refund is processed
3. **REJECTED**: Agency rejects the request with reason
4. **PROCESSED**: Refund has been successfully processed (automatic after approval)

## Error Responses

### Common Error Codes

**400 Bad Request**

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

**401 Unauthorized**

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**403 Forbidden**

```json
{
  "statusCode": 403,
  "message": "You can only request refunds for your own bookings",
  "error": "Forbidden"
}
```

**404 Not Found**

```json
{
  "statusCode": 404,
  "message": "Refund request not found",
  "error": "Not Found"
}
```

### Validation Errors

**Invalid Refund Amount**

```json
{
  "statusCode": 400,
  "message": "Requested amount cannot exceed the payment total",
  "error": "Bad Request"
}
```

**Already Reviewed**

```json
{
  "statusCode": 400,
  "message": "This refund request has already been reviewed",
  "error": "Bad Request"
}
```

## Integration Examples

### Frontend Integration (React/Next.js)

```typescript
// Create refund request
const createRefundRequest = async (refundData: RefundRequestData) => {
  try {
    const response = await fetch("/api/refund-requests", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(refundData),
    });

    if (!response.ok) {
      throw new Error("Failed to create refund request");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating refund request:", error);
    throw error;
  }
};

// Agency approval
const approveRefundRequest = async (requestId: number, notes: string) => {
  try {
    const response = await fetch(`/api/refund-requests/${requestId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${agencyToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agencyNotes: notes }),
    });

    if (!response.ok) {
      throw new Error("Failed to approve refund request");
    }

    return await response.json();
  } catch (error) {
    console.error("Error approving refund request:", error);
    throw error;
  }
};
```

### Mobile Integration (React Native)

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

const RefundService = {
  async getMyRefundRequests() {
    const token = await AsyncStorage.getItem("authToken");

    const response = await fetch(
      `${API_BASE_URL}/refund-requests/my-requests`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch refund requests");
    }

    return response.json();
  },

  async createRefundRequest(requestData: RefundRequestData) {
    const token = await AsyncStorage.getItem("authToken");

    const response = await fetch(`${API_BASE_URL}/refund-requests`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error("Failed to create refund request");
    }

    return response.json();
  },
};
```

## Security Considerations

1. **JWT Authentication**: All endpoints require valid JWT tokens
2. **Role-Based Access**: Endpoints are restricted by user roles
3. **Ownership Validation**: Users can only access their own requests/bookings
4. **Agency Validation**: Agencies can only manage requests for their bookings
5. **Amount Validation**: Refund amounts cannot exceed original payment
6. **Status Protection**: Prevents multiple reviews of the same request

## Testing with Postman

Import the following collection to test the refund authorization system:

1. Set up environment variables:

   - `baseUrl`: http://localhost:3000
   - `clientToken`: Your client JWT token
   - `agencyToken`: Your agency JWT token
   - `adminToken`: Your admin JWT token

2. Test the complete workflow:
   - Create a payment and booking first
   - Submit a refund request as a client
   - Review the request as an agency
   - Check the final status

## Migration from Direct Refunds

If you're migrating from the previous direct refund system:

1. **Update Frontend Code**: Replace direct refund calls with refund request creation
2. **Agency Dashboard**: Add refund request management interface
3. **Notifications**: Implement notifications for new requests and status updates
4. **Historical Data**: Existing refunds remain in the payment table
5. **Gradual Rollout**: Both systems can coexist during transition period

## Future Enhancements

- **Email Notifications**: Automatic emails for request status changes
- **Deadline Tracking**: SLA monitoring for request response times
- **Batch Processing**: Bulk approval/rejection capabilities
- **Advanced Reporting**: Analytics on refund patterns and agency performance
- **Integration Webhooks**: Real-time notifications to external systems
