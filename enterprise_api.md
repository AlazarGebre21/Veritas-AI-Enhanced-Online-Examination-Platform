# GET /enterprises SYSTEMADMIN Endpoint

## List enterprises

List enterprises with optional status and search filters.

## Parameters

### Query Parameters

| Name                | Type    | Description                                         |
| ------------------- | ------- | --------------------------------------------------- |
| status              | string  | Enterprise status                                   |
| subscription_status | string  | Subscription status                                 |
| search              | string  | Search by slug or display name                      |
| page                | integer | Page number                                         |
| limit               | integer | Page size                                           |
| sort                | string  | Sort field (display_name, slug, status, created_at) |
| sort_dir            | string  | Sort direction (asc, desc)                          |

## Responses

- Response content type: `application/json`

### 200 - Enterprises list retrieved successfully

#### Example Response

```json
{
  "data": [
    {
      "addressLine1": "string",
      "addressLine2": "string",
      "approvedAt": "string",
      "city": "string",
      "contactEmail": "string",
      "contactPhone": "string",
      "country": "string",
      "createdAt": "string",
      "createdBy": "string",
      "currentPeriodEnd": "string",
      "currentPeriodStart": "string",
      "customDomain": "string",
      "deletedAt": "string",
      "displayName": "string",
      "id": "string",
      "legalName": "string",
      "logoURL": "string",
      "ownerAccountID": "string",
      "primaryColor": "string",
      "retentionUntil": "string",
      "secondaryColor": "string",
      "settings": {
        "additionalProp1": "string",
        "additionalProp2": "string",
        "additionalProp3": "string"
      },
      "slug": "string",
      "status": "PendingApproval",
      "subscriptionPlanID": "string",
      "subscriptionStatus": "Trial",
      "suspendedAt": "string",
      "updatedAt": "string",
      "updatedBy": "string"
    }
  ],
  "metadata": {
    "current_page": 0,
    "has_next": true,
    "has_previous": true,
    "page_size": 0,
    "total_elements": 0,
    "total_pages": 0
  }
}
```

### 500 - Internal Server Error

#### Example Response

```json
{
  "error": "string"
}
```

# POST /enterprises PUBLIC Endpoint(Open access to all users without authentication.)

## Register enterprise

Register a new enterprise with an owner account.

## Parameters

### Request Body (required)

- Type: `object`
- Content type: `application/json`

#### Body Schema

```json
{
  "contactEmail": "string",
  "displayName": "string",
  "legalName": "string",
  "ownerEmail": "string",
  "ownerPassword": "stringst",
  "slug": "string"
}
```

#### Example Request Body

```json
{
  "contactEmail": "string",
  "displayName": "string",
  "legalName": "string",
  "ownerEmail": "string",
  "ownerPassword": "stringst",
  "slug": "string"
}
```

## Responses

- Response content type: `application/json`

### 201 - Created

#### Example Response

```json
{
  "addressLine1": "string",
  "addressLine2": "string",
  "approvedAt": "string",
  "city": "string",
  "contactEmail": "string",
  "contactPhone": "string",
  "country": "string",
  "createdAt": "string",
  "createdBy": "string",
  "currentPeriodEnd": "string",
  "currentPeriodStart": "string",
  "customDomain": "string",
  "deletedAt": "string",
  "displayName": "string",
  "id": "string",
  "legalName": "string",
  "logoURL": "string",
  "ownerAccountID": "string",
  "primaryColor": "string",
  "retentionUntil": "string",
  "secondaryColor": "string",
  "settings": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "slug": "string",
  "status": "PendingApproval",
  "subscriptionPlanID": "string",
  "subscriptionStatus": "Trial",
  "suspendedAt": "string",
  "updatedAt": "string",
  "updatedBy": "string"
}
```

### 400 - Bad Request

#### Example Response

```json
{
  "error": "string"
}
```

### 409 - Conflict

#### Example Response

```json
{
  "error": "string"
}
```

### 500 - Internal Server Error

#### Example Response

```json
{
  "error": "string"
}
```

# GET /enterprises/me ENTERPRISEADMIN Endpoint

## Get my enterprise

Retrieves the enterprise inferred from the `X-Enterprise-ID` header.

---

## Parameters

| Name            | Type   | Required | Location | Description                 |
| --------------- | ------ | -------: | -------- | --------------------------- |
| X-Enterprise-ID | string |      Yes | header   | Caller enterprise ID (UUID) |

---

## Responses

**Response Content-Type:** `application/json`

---

### `200 OK`

```json
{
  "addressLine1": "string",
  "addressLine2": "string",
  "approvedAt": "string",
  "city": "string",
  "contactEmail": "string",
  "contactPhone": "string",
  "country": "string",
  "createdAt": "string",
  "createdBy": "string",
  "currentPeriodEnd": "string",
  "currentPeriodStart": "string",
  "customDomain": "string",
  "deletedAt": "string",
  "displayName": "string",
  "id": "string",
  "legalName": "string",
  "logoURL": "string",
  "ownerAccountID": "string",
  "primaryColor": "string",
  "retentionUntil": "string",
  "secondaryColor": "string",
  "settings": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "slug": "string",
  "status": "PendingApproval",
  "subscriptionPlanID": "string",
  "subscriptionStatus": "Trial",
  "suspendedAt": "string",
  "updatedAt": "string",
  "updatedBy": "string"
}
```

---

### `400 Bad Request`

```json
{
  "error": "string"
}
```

---

### `404 Not Found`

```json
{
  "error": "string"
}
```

---

### `500 Internal Server Error`

```json
{
  "error": "string"
}
```

```

```

# GET /enterprises/slug/{slug} ALL(Requires a valid token but no specific permissions.)

## Get enterprise by slug

Resolves enterprise details using a slug.

---

## Parameters

| Name | Type   | Required | Location | Description     |
| ---- | ------ | -------: | -------- | --------------- |
| slug | string |      Yes | path     | Enterprise slug |

---

## Responses

**Response Content-Type:** `application/json`

---

### `200 OK`

```json
{
  "addressLine1": "string",
  "addressLine2": "string",
  "approvedAt": "string",
  "city": "string",
  "contactEmail": "string",
  "contactPhone": "string",
  "country": "string",
  "createdAt": "string",
  "createdBy": "string",
  "currentPeriodEnd": "string",
  "currentPeriodStart": "string",
  "customDomain": "string",
  "deletedAt": "string",
  "displayName": "string",
  "id": "string",
  "legalName": "string",
  "logoURL": "string",
  "ownerAccountID": "string",
  "primaryColor": "string",
  "retentionUntil": "string",
  "secondaryColor": "string",
  "settings": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "slug": "string",
  "status": "PendingApproval",
  "subscriptionPlanID": "string",
  "subscriptionStatus": "Trial",
  "suspendedAt": "string",
  "updatedAt": "string",
  "updatedBy": "string"
}
```

---

### `404 Not Found`

```json
{
  "error": "string"
}
```

---

### `500 Internal Server Error`

```json
{
  "error": "string"
}
```

# GET /enterprises/{enterpriseId} SYSTEMADMIN AND ENTERPRISEADMIN Endpoint

## Get enterprise

Retrieves enterprise details by enterprise ID.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |

---

## Responses

**Response Content-Type:** `application/json`

---

### `200 OK`

```json
{
  "addressLine1": "string",
  "addressLine2": "string",
  "approvedAt": "string",
  "city": "string",
  "contactEmail": "string",
  "contactPhone": "string",
  "country": "string",
  "createdAt": "string",
  "createdBy": "string",
  "currentPeriodEnd": "string",
  "currentPeriodStart": "string",
  "customDomain": "string",
  "deletedAt": "string",
  "displayName": "string",
  "id": "string",
  "legalName": "string",
  "logoURL": "string",
  "ownerAccountID": "string",
  "primaryColor": "string",
  "retentionUntil": "string",
  "secondaryColor": "string",
  "settings": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "slug": "string",
  "status": "PendingApproval",
  "subscriptionPlanID": "string",
  "subscriptionStatus": "Trial",
  "suspendedAt": "string",
  "updatedAt": "string",
  "updatedBy": "string"
}
```

---

### `400 Bad Request`

```json
{
  "error": "string"
}
```

---

### `404 Not Found`

```json
{
  "error": "string"
}
```

---

### `500 Internal Server Error`

```json
{
  "error": "string"
}
```

# DELETE /enterprises/{enterpriseId} SYSTEMADMIN Endpoint

## Delete enterprise

Soft-deletes an enterprise and starts the retention period.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |
| X-User-ID    | string |       No | header   | Actor user ID (UUID) |

---

## Responses

**Response Content-Type:** `application/json`

---

### `204 No Content`

```json
"string"
```

---

### `400 Bad Request`

```json id="9xqkdl"
{
  "error": "string"
}
```

---

### `500 Internal Server Error`

```json id="w4q5a1"
{
  "error": "string"
}
```

# PATCH /enterprises/{enterpriseId} ENTERPRISEADMIN Endpoint

## Update enterprise

Updates enterprise profile fields.

---

## Parameters

| Name         | Type   | Required | Location | Description              |
| ------------ | ------ | -------: | -------- | ------------------------ |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID)     |
| body         | object |      Yes | body     | Enterprise patch payload |

---

## Request Body

**Content-Type:** `application/json`

```json
{
  "addressLine1": "string",
  "addressLine2": "string",
  "approvedAt": "string",
  "city": "string",
  "contactEmail": "string",
  "contactPhone": "string",
  "country": "string",
  "createdAt": "string",
  "createdBy": "string",
  "currentPeriodEnd": "string",
  "currentPeriodStart": "string",
  "customDomain": "string",
  "deletedAt": "string",
  "displayName": "string",
  "id": "string",
  "legalName": "string",
  "logoURL": "string",
  "ownerAccountID": "string",
  "primaryColor": "string",
  "retentionUntil": "string",
  "secondaryColor": "string",
  "settings": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "slug": "string",
  "status": "PendingApproval",
  "subscriptionPlanID": "string",
  "subscriptionStatus": "Trial",
  "suspendedAt": "string",
  "updatedAt": "string",
  "updatedBy": "string"
}
```

---

## Responses

**Response Content-Type:** `application/json`

---

### `204 No Content`

```json
"string"
```

---

### `400 Bad Request`

```json
{
  "error": "string"
}
```

---

### `404 Not Found`

```json
{
  "error": "string"
}
```

---

### `500 Internal Server Error`

```json
{
  "error": "string"
}
```

# GET /enterprises/{enterpriseId}/audit-logs SYSTEMADMIN AND ENTERPRISEADMIN Endpoint

## Get audit logs

Lists paginated audit logs for enterprise actions.

---

## Parameters

| Name         | Type    | Required | Location | Description                                      |
| ------------ | ------- | -------: | -------- | ------------------------------------------------ |
| enterpriseId | string  |      Yes | path     | Enterprise ID (UUID)                             |
| page         | integer |       No | query    | Page number                                      |
| limit        | integer |       No | query    | Page size                                        |
| sort         | string  |       No | query    | Sort field (`event`, `actor_role`, `created_at`) |
| sort_dir     | string  |       No | query    | Sort direction (`asc`, `desc`)                   |

---

## Responses

**Response Content-Type:** `application/json`

---

### `200 OK`

```json
{
  "data": [
    {
      "actor_id": "string",
      "actor_role": "string",
      "created_at": "string",
      "enterprise_id": "string",
      "event": "enterprise.created",
      "id": "string",
      "metadata": {
        "additionalProp1": "string",
        "additionalProp2": "string",
        "additionalProp3": "string"
      }
    }
  ],
  "metadata": {
    "current_page": 0,
    "has_next": true,
    "has_previous": true,
    "page_size": 0,
    "total_elements": 0,
    "total_pages": 0
  }
}
```

---

### `400 Bad Request`

```json
{
  "error": "string"
}
```

---

### `403 Forbidden`

```json
{
  "error": "string"
}
```

---

### `404 Not Found`

```json
{
  "error": "string"
}
```

---

### `409 Conflict`

```json
{
  "error": "string"
}
```

---

### `500 Internal Server Error`

```json
{
  "error": "string"
}
```

# PATCH /enterprises/{enterpriseId}/branding ENTERPRISEADMIN Endpoint

## Update branding

Updates logo and brand color values.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |
| X-User-ID    | string |       No | header   | Actor user ID (UUID) |
| body         | object |      Yes | body     | Branding patch       |

---

## Request Body

**Content-Type:** `application/json`

```json
{
  "logo_url": "string",
  "primary_color": "string",
  "secondary_color": "string"
}
```

---

## Responses

**Response Content-Type:** `application/json`

---

### `204 No Content`

```json
"string"
```

---

### `400 Bad Request`

```json
{
  "error": "string"
}
```

---

### `403 Forbidden`

```json
{
  "error": "string"
}
```

---

### `404 Not Found`

```json
{
  "error": "string"
}
```

---

### `409 Conflict`

```json
{
  "error": "string"
}
```

---

### `422 Unprocessable Entity`

```json
{
  "error": "string"
}
```

---

### `500 Internal Server Error`

```json "
{
  "error": "string"
}
```

# DELETE /enterprises/{enterpriseId}/permanent SYSTEMADMIN Endpoint

## Hard delete enterprise

Permanently deletes enterprise data.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |
| X-User-ID    | string |       No | header   | Actor user ID (UUID) |

---

## Responses

**Response Content-Type:** `application/json`

---

### `204 No Content`

```json
"string"
```

---

### `400 Bad Request`

```json
{
  "error": "string"
}
```

---

### `403 Forbidden`

```json
{
  "error": "string"
}
```

---

### `404 Not Found`

```json
{
  "error": "string"
}
```

---

### `409 Conflict`

```json
{
  "error": "string"
}
```

---

### `500 Internal Server Error`

```json
{
  "error": "string"
}
```

# POST /enterprises/{enterpriseId}/reactivate SYSTEMADMIN Endpoint

## Reactivate enterprise

Reactivates an enterprise from a suspended state.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |
| X-User-ID    | string |       No | header   | Actor user ID (UUID) |

---

## Responses

**Response Content-Type:** `application/json`

---

### `204 No Content`

```json
"string"
```

---

### `400 Bad Request`

```json
{
  "error": "string"
}
```

---

### `403 Forbidden`

```json
{
  "error": "string"
}
```

---

### `404 Not Found`

```json
{
  "error": "string"
}
```

---

### `409 Conflict`

```json
{
  "error": "string"
}
```

---

### `500 Internal Server Error`

```json
{
  "error": "string"
}
```

# POST /enterprises/{enterpriseId}/restore SYSTEMADMIN Endpoint

## Restore enterprise

Restores a soft-deleted enterprise.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |
| X-User-ID    | string |       No | header   | Actor user ID (UUID) |

---

## Responses

**Response Content-Type:** `application/json`

---

### `204 No Content`

```json
"string"
```

---

### `400 Bad Request`

```json
{
  "error": "string"
}
```

---

### `403 Forbidden`

```json
{
  "error": "string"
}
```

---

### `404 Not Found`

```json
{
  "error": "string"
}
```

---

### `409 Conflict`

```json
{
  "error": "string"
}
```

---

### `500 Internal Server Error`

```json
{
  "error": "string"
}
```

# PATCH /enterprises/{enterpriseId}/settings ENTERPRISEADMIN Endpoint

## Update settings

Merges (patches) the enterprise settings object.

---

## Parameters

| Name         | Type   | Required | Location | Description           |
| ------------ | ------ | -------: | -------- | --------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID)  |
| X-User-ID    | string |       No | header   | Actor user ID (UUID)  |
| body         | object |      Yes | body     | Settings patch object |

---

## Request Body

**Content-Type:** `application/json`

```json
{}
```

---

## Responses

**Response Content-Type:** `application/json`

---

### `204 No Content`

```json
"string"
```

---

### `400 Bad Request`

```json
{
  "error": "string"
}
```

---

### `403 Forbidden`

```json
{
  "error": "string"
}
```

---

### `404 Not Found`

```json
{
  "error": "string"
}
```

---

### `409 Conflict`

```json
{
  "error": "string"
}
```

---

### `422 Unprocessable Entity`

```json
{
  "error": "string"
}
```

---

### `500 Internal Server Error`

```json
{
  "error": "string"
}
```

# GET /enterprises/{enterpriseId}/status SYSTEMADMIN AND ENTERPRISEADMIN Endpoint

## Get enterprise status

Returns lifecycle and subscription status information for an enterprise.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |

---

## Responses

**Response Content-Type:** `application/json`

---

### `200 OK`

```json
{
  "approved_at": "string",
  "current_period_end": "string",
  "deleted_at": "string",
  "enterprise_id": "string",
  "retention_until": "string",
  "status": "PendingApproval",
  "subscription_status": "Trial",
  "suspended_at": "string"
}
```

---

### `400 Bad Request`

```json
{
  "error": "string"
}
```

---

### `403 Forbidden`

```json
{
  "error": "string"
}
```

---

### `404 Not Found`

```json
{
  "error": "string"
}
```

---

### `409 Conflict`

```json
{
  "error": "string"
}
```

---

### `500 Internal Server Error`

```json
{
  "error": "string"
}
```

# GET /enterprises/{enterpriseId}/summary

## Get enterprise summary

Returns a compact operational summary for an enterprise.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |

---

## Responses

**Response Content-Type:** `application/json`

---

### `200 OK`

```json
{
  "active_exam_count": 0,
  "active_session_count": 0,
  "display_name": "string",
  "enterprise_id": "string",
  "status": "PendingApproval",
  "subscription_expiry": "string",
  "subscription_status": "Trial",
  "user_count": 0
}
```

# POST /enterprises/{enterpriseId}/suspend SYSTEMADMIN Endpoint

## Suspend enterprise

Suspends an active enterprise.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |
| X-User-ID    | string |       No | header   | Actor user ID (UUID) |

---

## Responses

**Response Content-Type:** `application/json`

---

### `204 No Content`

```json
"string"
```

# POST /enterprises/{enterpriseId}/validate-domain

## Validate custom domain

Validates TXT/CNAME DNS records for an enterprise custom domain.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |
| X-User-ID    | string |       No | header   | Actor user ID (UUID) |

---

## Responses

**Response Content-Type:** `application/json`

---

### `200 OK`

```json
{
  "cname_found": true,
  "details": "string",
  "domain": "string",
  "txt_record_found": true,
  "valid": true
}
```

# GET /enterprises/{enterpriseId}/subscription SYSTEMADMIN AND ENTERPRISEADMIN Endpoint

## Get subscription info

Returns enterprise subscription details only.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |

---

## Responses

**Response Content-Type:** `application/json`

---

### `200 OK`

```json
{
  "current_period_end": "string",
  "current_period_start": "string",
  "enterprise_id": "string",
  "subscription_plan_id": "string",
  "subscription_status": "Trial"
}
```

# POST /enterprises/{enterpriseId}/subscription SYSTEMADMIN ENDPOINT

## Update subscription

Updates enterprise subscription plan, status, and billing period fields.

---

## Parameters

| Name         | Type   | Required | Location | Description                 |
| ------------ | ------ | -------: | -------- | --------------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID)        |
| X-User-ID    | string |       No | header   | Actor user ID (UUID)        |
| body         | object |      Yes | body     | Subscription update payload |

---

## Request Body

**Content-Type:** `application/json`

```json
{
  "period_end": "string",
  "period_start": "string",
  "subscription_plan_id": "string",
  "subscription_status": "Trial"
}
```

# POST /enterprises/{enterpriseId}/subscription/cancel

## Cancel subscription

Cancels the current enterprise subscription.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |
| X-User-ID    | string |       No | header   | Actor user ID (UUID) |

---

## Responses

**Response Content-Type:** `application/json`

---

### `204 No Content`

```json
"string"
```

# POST /enterprises/{enterpriseId}/subscription/cancel SYSTEMADMIN ENDPOINT

## Cancel subscription

Cancels the current enterprise subscription.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |
| X-User-ID    | string |       No | header   | Actor user ID (UUID) |

---

## Responses

**Response Content-Type:** `application/json`

---

### `204 No Content`

```json
"string"
```

# POST /enterprises/{enterpriseId}/subscription/renew

## Renew subscription

Renews the current enterprise subscription period.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |
| X-User-ID    | string |       No | header   | Actor user ID (UUID) |

---

## Responses

**Response Content-Type:** `application/json`

---

### `204 No Content`

```json
"string"
```

# POST /enterprises/{enterpriseId}/suspend-payment SYSTEMADMIN ENDPOINT

## Suspend for payment

Suspends an enterprise subscription due to payment failure.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |
| X-User-ID    | string |       No | header   | Actor user ID (UUID) |

---

## Responses

**Response Content-Type:** `application/json`

---

### `204 No Content`

```json
"string"
```

# GET /enterprises/{enterpriseId}/users ENTERPRISEADMIN ENDPOINT

## List enterprise users

Returns a paginated list of users belonging to a specific enterprise.

---

## Parameters

| Name         | Type    | Required | Location | Description                                                           |
| ------------ | ------- | -------: | -------- | --------------------------------------------------------------------- |
| enterpriseId | string  |      Yes | path     | Enterprise ID (UUID)                                                  |
| page         | integer |       No | query    | Page number                                                           |
| limit        | integer |       No | query    | Page size                                                             |
| sort         | string  |       No | query    | Sort field (`email`, `first_name`, `last_name`, `role`, `created_at`) |
| sort_dir     | string  |       No | query    | Sort direction (`asc`, `desc`)                                        |

---

## Responses

**Response Content-Type:** `application/json`

---

### `200 OK`

```json
{
  "data": [
    {
      "createdAt": "string",
      "email": "string",
      "emailVerified": true,
      "emailVerifiedAt": "string",
      "enterpriseID": "string",
      "failedLoginAttempts": 0,
      "firstName": "string",
      "honorific": "string",
      "id": "string",
      "isActive": true,
      "isDeleted": true,
      "lastLoginAt": "string",
      "lastLoginIP": "string",
      "lastName": "string",
      "lastUserAgent": "string",
      "lockedUntil": "string",
      "mustChangePassword": true,
      "passwordChangedAt": "string",
      "passwordHash": "string",
      "phone": "string",
      "role": "SystemAdmin",
      "updatedAt": "string"
    }
  ],
  "metadata": {
    "current_page": 0,
    "has_next": true,
    "has_previous": true,
    "page_size": 0,
    "total_elements": 0,
    "total_pages": 0
  }
}
```

# POST /enterprises/{enterpriseId}/users ENTERPRISEADMIN ENDPOINT

## Create enterprise user

Creates a user account scoped to an enterprise.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |
| X-User-ID    | string |       No | header   | Actor user ID (UUID) |
| body         | object |      Yes | body     | Create user payload  |

---

## Request Body

**Content-Type:** `application/json`

```json
{
  "email": "string",
  "first_name": "string",
  "honorific": "string",
  "last_name": "string",
  "password": "stringst",
  "phone": "string",
  "role": "SystemAdmin"
}
```

---

## Responses

**Response Content-Type:** `application/json`

---

### `201 Created`

```json
{
  "createdAt": "string",
  "email": "string",
  "emailVerified": true,
  "emailVerifiedAt": "string",
  "enterpriseID": "string",
  "failedLoginAttempts": 0,
  "firstName": "string",
  "honorific": "string",
  "id": "string",
  "isActive": true,
  "isDeleted": true,
  "lastLoginAt": "string",
  "lastLoginIP": "string",
  "lastName": "string",
  "lastUserAgent": "string",
  "lockedUntil": "string",
  "mustChangePassword": true,
  "passwordChangedAt": "string",
  "passwordHash": "string",
  "phone": "string",
  "role": "SystemAdmin",
  "updatedAt": "string"
}
```

# GET /enterprises/{enterpriseId}/users/{userId} ENTERPRISEADMIN ENDPOINT

## Get enterprise user

Retrieves a specific user by user ID within an enterprise.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |
| userId       | string |      Yes | path     | User ID (UUID)       |

---

## Responses

**Response Content-Type:** `application/json`

---

### `200 OK`

```json
{
  "createdAt": "string",
  "email": "string",
  "emailVerified": true,
  "emailVerifiedAt": "string",
  "enterpriseID": "string",
  "failedLoginAttempts": 0,
  "firstName": "string",
  "honorific": "string",
  "id": "string",
  "isActive": true,
  "isDeleted": true,
  "lastLoginAt": "string",
  "lastLoginIP": "string",
  "lastName": "string",
  "lastUserAgent": "string",
  "lockedUntil": "string",
  "mustChangePassword": true,
  "passwordChangedAt": "string",
  "passwordHash": "string",
  "phone": "string",
  "role": "SystemAdmin",
  "updatedAt": "string"
}
```

# PATCH /enterprises/{enterpriseId}/users/{userId} ENTERPRISEADMIN ENDPOINT

## Update enterprise user

Updates profile and role fields for an enterprise user.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |
| userId       | string |      Yes | path     | User ID (UUID)       |
| X-User-ID    | string |       No | header   | Actor user ID (UUID) |
| body         | object |      Yes | body     | Update user payload  |

---

## Request Body

**Content-Type:** `application/json`

```json
{
  "first_name": "string",
  "honorific": "string",
  "last_name": "string",
  "phone": "string",
  "role": "SystemAdmin"
}
```

---

## Responses

**Response Content-Type:** `application/json`

---

### `204 No Content`

```json
"string"
```

# PATCH /enterprises/{enterpriseId}/users/{userId}/deactivate ENTERPRISEADMIN ENDPOINT

## Deactivate enterprise user

Deactivates a user account without permanent deletion.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |
| userId       | string |      Yes | path     | User ID (UUID)       |
| X-User-ID    | string |       No | header   | Actor user ID (UUID) |

---

## Responses

**Response Content-Type:** `application/json`

---

### `204 No Content`

```json
"string"
```

# POST /enterprises/{enterpriseId}/users/{userId}/reset-password ENTERPRISEADMIN ENDPOINT

## Reset user password

Resets a user password and returns a temporary password for secure handoff.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |
| userId       | string |      Yes | path     | User ID (UUID)       |
| X-User-ID    | string |       No | header   | Actor user ID (UUID) |

---

## Responses

**Response Content-Type:** `application/json`

---

### `200 OK`

```json
{
  "temporary_password": "string"
}
```

# GET /health

## Health check

Returns a simple JSON indicating the service is alive.

---

## Parameters

This endpoint has **no parameters**.

---

## Responses

**Response Content-Type:** `application/json`

---

### `200 OK` — Service is healthy

```json
{
  "additionalProp1": "string",
  "additionalProp2": "string",
  "additionalProp3": "string"
}
```
