# POST /auth/login PUBLIC ENDPOINT(Open access to all users without authentication)

## Authenticate a user

Validates the provided email and password credentials and returns a JWT access token along with a refresh token.

**Note:** Only users with the following roles are permitted to authenticate via this endpoint:

- `SystemAdmin`
- `EnterpriseAdmin`
- `EnterpriseAuto`
- `EnterpriseStaff`

---

## Request

**Method:** `POST`  
**Path:** `/auth/login`  
**Content-Type:** `application/json`

### Request Body

```json
{
  "email": "admin@veritas.io",
  "password": "s3cur3P@ssw0rd"
}
```

# POST /auth/logout ALL ENDPOINTS(Requires a valid token but no specific permissions)

Revoke a refresh token

Immediately revokes the supplied refresh token so it cannot be used for future token refreshes.
This endpoint is idempotent: invalid, unknown, expired, or already-revoked tokens return `204` to prevent token enumeration.

## Parameters

| Name | Description             | Type   | Location | Required |
| ---- | ----------------------- | ------ | -------- | -------- |
| body | Refresh token to revoke | object | body     | Yes      |

**Example Value**

```json
{
  "refreshToken": "b8a54f0f0cc6d2f68dd0b457ea4bb7f814ff69ec487f474f5c6f1781b6f0a0d3"
}
```

**Parameter content type:** `application/json`

## Responses

### `204` — Token revoked — no content

**Headers**

| Name         | Description            | Type   |
| ------------ | ---------------------- | ------ |
| X-Request-ID | Request correlation ID | string |

### `400` — Missing or malformed request body

**Example Value**

```json
{
  "code": "invalid_request",
  "message": "invalid request body",
  "requestId": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}
```

**Headers**

| Name         | Description            | Type   |
| ------------ | ---------------------- | ------ |
| X-Request-ID | Request correlation ID | string |

### `500` — Internal server error

**Example Value**

```json
{
  "code": "internal_error",
  "message": "internal server error",
  "requestId": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}
```

**Headers**

| Name         | Description            | Type   |
| ------------ | ---------------------- | ------ |
| X-Request-ID | Request correlation ID | string |

# POST /auth/refresh PUBLIC ENDPOINT(Open access to all users without authentication)

## Refresh an access token

Exchanges a valid refresh token for a new JWT access token and a rotated refresh token. The old refresh token is invalidated.

## Parameters

### Request Body (required)

- Type: `object`
- Content type: `application/json`

#### Body Schema

```json
{
  "refreshToken": "string"
}
```

#### Example Request Body

```json
{
  "refreshToken": "b8a54f0f0cc6d2f68dd0b457ea4bb7f814ff69ec487f474f5c6f1781b6f0a0d3"
}
```

## Responses

- Response content type: `application/json`

### 200 - New JWT access and refresh tokens

#### Example Response

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "refreshToken": "b8a54f0f0cc6d2f68dd0b457ea4bb7f814ff69ec487f474f5c6f1781b6f0a0d3"
}
```

#### Headers

| Name         | Description            | Type   |
| ------------ | ---------------------- | ------ |
| X-Request-ID | Request correlation ID | string |

### 400 - Missing or malformed request body

#### Example Response

```json
{
  "code": "invalid_request",
  "message": "invalid request body",
  "requestId": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}
```

#### Headers

| Name         | Description            | Type   |
| ------------ | ---------------------- | ------ |
| X-Request-ID | Request correlation ID | string |

### 401 - Refresh token invalid, revoked, or expired

#### Example Response

```json
{
  "code": "invalid_credentials",
  "message": "invalid email or password",
  "requestId": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}
```

#### Headers

| Name         | Description            | Type   |
| ------------ | ---------------------- | ------ |
| X-Request-ID | Request correlation ID | string |

### 500 - Internal server error

#### Example Response

```json
{
  "code": "internal_error",
  "message": "internal server error",
  "requestId": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}
```

#### Headers

| Name         | Description            | Type   |
| ------------ | ---------------------- | ------ |
| X-Request-ID | Request correlation ID | string |
