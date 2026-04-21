# GET /invoices/{invoiceId} ENTERPRISEADMIN ENDPOINT

## Get invoice

Fetches a single invoice by invoice ID.

---

## Parameters

| Name      | Type   | Required | Location | Description       |
| --------- | ------ | -------: | -------- | ----------------- |
| invoiceId | string |      Yes | path     | Invoice ID (UUID) |

---

## Responses

**Response Content-Type:** `application/json`

---

### `200 OK`

```json
{
  "amount_due": 0,
  "amount_paid": 0,
  "amount_remaining": 0,
  "created_at": "string",
  "currency": "ETB",
  "due_date": "string",
  "enterprise_id": "string",
  "hosted_invoice_url": "string",
  "id": "string",
  "invoice_pdf_url": "string",
  "number": "string",
  "paid_at": "string",
  "status": "Draft",
  "subscription_id": "string",
  "updated_at": "string"
}
```

# GET /payments/history ENTERPRISEADMIN ENDPOINT

## List payment history

Returns payment history for the specified enterprise.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | query    | Enterprise ID (UUID) |

---

## Responses

**Response Content-Type:** `application/json`

---

### `200 OK`

```json
[
  {
    "amount": 0,
    "created_at": "string",
    "currency": "ETB",
    "enterprise_id": "string",
    "id": "string",
    "invoice_id": "string",
    "payment_method_type": "string",
    "provider": "string",
    "provider_error_code": "string",
    "provider_error_message": "string",
    "provider_payment_id": "string",
    "status": "Pending"
  }
]
```

# GET /subscriptions/plans PUBLIC ENDPOINT

## List subscription plans

Returns all available subscription plans.

---

## Parameters

This endpoint has **no parameters**.

---

## Responses

**Response Content-Type:** `application/json`

---

### `200 OK`

```json
[
  {
    "billing_cycle": "monthly",
    "created_at": "string",
    "currency": "ETB",
    "description": "string",
    "features": {
      "additionalProp1": "string",
      "additionalProp2": "string",
      "additionalProp3": "string"
    },
    "id": "string",
    "is_active": true,
    "name": "string",
    "price": 0,
    "slug": "string",
    "stripe_price_id": "string",
    "updated_at": "string"
  }
]
```

# POST /subscriptions/{enterpriseId}/upgrade ENTERPRISEADMIN ENDPOINT

## Upgrade enterprise subscription

Creates a provider checkout session for upgrading an enterprise subscription plan.

---

## Parameters

| Name         | Type   | Required | Location | Description          |
| ------------ | ------ | -------: | -------- | -------------------- |
| enterpriseId | string |      Yes | path     | Enterprise ID (UUID) |
| body         | object |      Yes | body     | Upgrade request      |

---

## Request Body

**Content-Type:** `application/json`

```json
{
  "plan_id": "string"
}
```

---

## Responses

**Response Content-Type:** `application/json`

---

### `200 OK`

```json
{
  "checkout_url": "string"
}
```

# POST /webhooks/stripe PUBLIC ENDPOINT

## Handle Stripe webhook

Validates and processes Stripe webhook event payload.

---

## Parameters

| Name             | Type   | Required | Location | Description              |
| ---------------- | ------ | -------: | -------- | ------------------------ |
| Stripe-Signature | string |      Yes | header   | Stripe webhook signature |
| payload          | string |      Yes | body     | Raw webhook payload      |

---

## Request Body

**Content-Type:** `application/json`

```json
"string"
```

---

## Responses

**Response Content-Type:** `application/json`

---

### `200 OK`

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
