# List Candidates ENTERPRISEADMIN and ENTERPRISESTAFF ENDPOINT

## Endpoint

```http
GET /candidates
```

## Description

List candidate profiles for the caller enterprise.

---

## Parameters

### Headers

| Name            | Type   | Required | Description                                              |
| --------------- | ------ | -------- | -------------------------------------------------------- |
| X-Enterprise-Id | string | No       | Enterprise ID (fallback if middleware context is absent) |

---

### Query Parameters

| Name     | Type    | Required | Description                        |
| -------- | ------- | -------- | ---------------------------------- | -------------------- | --------- | ----------- |
| page     | integer | No       | Page number (default: 1)           |
| limit    | integer | No       | Page size (default: 10, max: 1000) |
| sort     | string  | No       | created_at                         | first_name           | last_name | external_id |
| sort_dir | string  | No       | asc                                | desc (default: desc) |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "data": [
    {
      "createdAt": "string",
      "email": "string",
      "enterpriseId": "string",
      "externalId": "string",
      "faceReferenceUrl": "string",
      "firstName": "string",
      "id": "string",
      "isActive": true,
      "lastName": "string"
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

# Create Candidate ENTERPRISEADMIN and ENTERPRISEAUTO ENDPOINT

## Endpoint

```http
POST /candidates
```

## Description

Create one candidate profile under the caller enterprise.

---

## Parameters

### Headers

| Name            | Type   | Required | Description                                              |
| --------------- | ------ | -------- | -------------------------------------------------------- |
| X-Enterprise-Id | string | No       | Enterprise ID (fallback if middleware context is absent) |

---

### Body Parameters

**Content-Type:** `application/json`

```json
{
  "email": "string",
  "externalId": "string",
  "faceReferenceUrl": "string",
  "firstName": "string",
  "lastName": "string"
}
```

---

## Responses

### 201 Created

**Content-Type:** `application/json`

```json
{
  "data": {
    "createdAt": "string",
    "email": "string",
    "enterpriseId": "string",
    "externalId": "string",
    "faceReferenceUrl": "string",
    "firstName": "string",
    "id": "string",
    "isActive": true,
    "lastName": "string"
  }
}
```

# Bulk Upload Candidates ENTERPRISEADMIN ENDPOINT

## Endpoint

```http
POST /candidates/bulk
```

## Description

Create many candidate profiles from a CSV file (max 5MB).

The CSV should have the following columns in order:
`external_id` (required), `first_name` (required), `last_name` (required), `email` (optional), `face_reference_url` (optional).

The first row is expected to be a header and will be skipped.

---

## Parameters

### Headers

| Name            | Type   | Required | Description                                              |
| --------------- | ------ | -------- | -------------------------------------------------------- |
| X-Enterprise-Id | string | No       | Enterprise ID (fallback if middleware context is absent) |

---

### Form Data

| Name | Type | Required | Description        |
| ---- | ---- | -------- | ------------------ |
| file | file | Yes      | CSV file (max 5MB) |

---

## Responses

### 201 Created

**Content-Type:** `application/json`

```json
{
  "count": 0,
  "message": "string"
}
```

# Get Candidate ENTERPRISEADMIN and ENTERPRISESTAFF ENDPOINT

## Endpoint

```http
GET /candidates/{candidateId}
```

## Description

Get one candidate profile by ID for the caller enterprise.

---

## Parameters

### Headers

| Name            | Type   | Required | Description                                              |
| --------------- | ------ | -------- | -------------------------------------------------------- |
| X-Enterprise-Id | string | No       | Enterprise ID (fallback if middleware context is absent) |

---

### Path Parameters

| Name        | Type   | Required | Description         |
| ----------- | ------ | -------- | ------------------- |
| candidateId | string | Yes      | Candidate ID (UUID) |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "data": {
    "createdAt": "string",
    "email": "string",
    "enterpriseId": "string",
    "externalId": "string",
    "faceReferenceUrl": "string",
    "firstName": "string",
    "id": "string",
    "isActive": true,
    "lastName": "string"
  }
}
```

# Update Candidate ENTERPRISEADMIN ENDPOINT

## Endpoint

```http
PATCH /candidates/{candidateId}
```

## Description

Update candidate profile fields by ID.

---

## Parameters

### Headers

| Name            | Type   | Required | Description                                              |
| --------------- | ------ | -------- | -------------------------------------------------------- |
| X-Enterprise-Id | string | No       | Enterprise ID (fallback if middleware context is absent) |

---

### Path Parameters

| Name        | Type   | Required | Description         |
| ----------- | ------ | -------- | ------------------- |
| candidateId | string | Yes      | Candidate ID (UUID) |

---

### Body Parameters

**Content-Type:** `application/json`

```json
{
  "email": "string",
  "faceReferenceUrl": "string",
  "firstName": "string",
  "lastName": "string"
}
```

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "message": "string"
}
```

# Deactivate Candidate ENTERPRISEADMIN ENDPOINT

## Endpoint

```http
PATCH /candidates/{candidateId}/deactivate
```

## Description

Soft-deactivate a candidate profile by ID.

---

## Parameters

### Headers

| Name            | Type   | Required | Description                                              |
| --------------- | ------ | -------- | -------------------------------------------------------- |
| X-Enterprise-Id | string | No       | Enterprise ID (fallback if middleware context is absent) |

---

### Path Parameters

| Name        | Type   | Required | Description         |
| ----------- | ------ | -------- | ------------------- |
| candidateId | string | Yes      | Candidate ID (UUID) |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "message": "string"
}
```

# Get Enrollment ENTERPRISEADMIN and ENTERPRISESTAFF

## Endpoint

```http
GET /enrollments/{enrollmentId}
```

## Description

Get one enrollment by ID.

---

## Parameters

### Headers

| Name            | Type   | Required | Description                                              |
| --------------- | ------ | -------- | -------------------------------------------------------- |
| X-Enterprise-Id | string | No       | Enterprise ID (fallback if middleware context is absent) |

---

### Path Parameters

| Name         | Type   | Required | Description          |
| ------------ | ------ | -------- | -------------------- |
| enrollmentId | string | Yes      | Enrollment ID (UUID) |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "data": {
    "attemptsUsed": 0,
    "candidateId": "string",
    "createdAt": "string",
    "enterpriseId": "string",
    "examId": "string",
    "id": "string",
    "maxAttempts": 0,
    "tokenExpiresAt": "string"
  }
}
```

# Regenerate Enrollment Token ENTERPRISEADMIN

## Endpoint

```http
POST /enrollments/{enrollmentId}/regenerate-token
```

## Description

Regenerate and return a new raw token for an enrollment.

---

## Parameters

### Headers

| Name            | Type   | Required | Description                                              |
| --------------- | ------ | -------- | -------------------------------------------------------- |
| X-Enterprise-Id | string | No       | Enterprise ID (fallback if middleware context is absent) |

---

### Path Parameters

| Name         | Type   | Required | Description          |
| ------------ | ------ | -------- | -------------------- |
| enrollmentId | string | Yes      | Enrollment ID (UUID) |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "message": "string",
  "rawToken": "string"
}
```

# Reset Enrollment Attempts ENTERPRISEADMIN

## Endpoint

```http
POST /enrollments/{enrollmentId}/reset-attempts
```

## Description

Reset attempts used to zero for an enrollment.

---

## Parameters

### Headers

| Name            | Type   | Required | Description                                              |
| --------------- | ------ | -------- | -------------------------------------------------------- |
| X-Enterprise-Id | string | No       | Enterprise ID (fallback if middleware context is absent) |

---

### Path Parameters

| Name         | Type   | Required | Description          |
| ------------ | ------ | -------- | -------------------- |
| enrollmentId | string | Yes      | Enrollment ID (UUID) |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "message": "string"
}
```

# Revoke Enrollment ENTERPRISEADMIN ENDPOINT

## Endpoint

```http
PATCH /enrollments/{enrollmentId}/revoke
```

## Description

Revoke an enrollment and prevent future use.

---

## Parameters

### Headers

| Name            | Type   | Required | Description                                              |
| --------------- | ------ | -------- | -------------------------------------------------------- |
| X-Enterprise-Id | string | No       | Enterprise ID (fallback if middleware context is absent) |

---

### Path Parameters

| Name         | Type   | Required | Description          |
| ------------ | ------ | -------- | -------------------- |
| enrollmentId | string | Yes      | Enrollment ID (UUID) |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "message": "string"
}
```

# List Enrollments by Exam ENTERPRISEADMIN and ENTERPRISESTAFF

## Endpoint

```http
GET /exams/{examId}/enrollments
```

## Description

List exam enrollments for the caller enterprise.

---

## Parameters

### Headers

| Name            | Type   | Required | Description                                              |
| --------------- | ------ | -------- | -------------------------------------------------------- |
| X-Enterprise-Id | string | No       | Enterprise ID (fallback if middleware context is absent) |

---

### Path Parameters

| Name   | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| examId | string | Yes      | Exam ID (UUID) |

---

### Query Parameters

| Name     | Type    | Required | Description                        |
| -------- | ------- | -------- | ---------------------------------- | -------------------- |
| page     | integer | No       | Page number (default: 1)           |
| limit    | integer | No       | Page size (default: 10, max: 1000) |
| sort     | string  | No       | created_at                         | attempts_used        |
| sort_dir | string  | No       | asc                                | desc (default: desc) |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "data": [
    {
      "attemptsUsed": 0,
      "candidateId": "string",
      "createdAt": "string",
      "enterpriseId": "string",
      "examId": "string",
      "id": "string",
      "maxAttempts": 0,
      "tokenExpiresAt": "string"
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

# Enroll Candidates ENTERPRISEADMIN and ENTERPRISESTAFF

## Endpoint

```http
POST /exams/{examId}/enrollments
```

## Description

Create enrollments for an exam and return generated raw access tokens.

---

## Parameters

### Headers

| Name            | Type   | Required | Description                                              |
| --------------- | ------ | -------- | -------------------------------------------------------- |
| X-Enterprise-Id | string | No       | Enterprise ID (fallback if middleware context is absent) |

---

### Path Parameters

| Name   | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| examId | string | Yes      | Exam ID (UUID) |

---

### Body Parameters

**Content-Type:** `application/json`

```json
{
  "candidateIds": ["string"],
  "maxAttempts": 1,
  "tokenExpiresAt": "string"
}
```

---

## Responses

### 201 Created

**Content-Type:** `application/json`

```json
{
  "message": "string",
  "rawTokens": ["string"]
}
```

# Validate Access Token PUBLIC

## Endpoint

```http
POST /access/validate
```

## Description

Validate exam access token before session start.

---

## Parameters

### Headers

| Name            | Type   | Required | Description   |
| --------------- | ------ | -------- | ------------- |
| X-Enrollment-Id | string | Yes      | Enrollment ID |
| X-Enterprise-Id | string | Yes      | Enterprise ID |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json id="k7v4mz"
{
  "data": {
    "candidateId": "string",
    "enrollmentId": "string",
    "enterpriseId": "string",
    "examId": "string"
  }
}
```

# Resume Active Session EXAMCANDIDATE

## Endpoint

```http
GET /sessions/me/active
```

## Description

Return the active session for the authenticated candidate.

---

## Parameters

### Headers

| Name         | Type   | Required | Description  |
| ------------ | ------ | -------- | ------------ |
| X-Subject-Id | string | Yes      | Candidate ID |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "data": {
    "answers": [
      {
        "answerData": [0],
        "id": "string",
        "isFinal": true,
        "savedAt": "string",
        "sessionId": "string",
        "sessionQuestionId": "string"
      }
    ],
    "candidateId": "string",
    "cheatingScore": 0,
    "clientIp": "string",
    "createdAt": "string",
    "enrollmentId": "string",
    "enterpriseId": "string",
    "examId": "string",
    "expiresAt": "string",
    "faceRegisteredUrl": "string",
    "id": "string",
    "questions": [
      {
        "id": "string",
        "negativePoints": 0,
        "orderIndex": 0,
        "points": 0,
        "questionId": "string",
        "questionSnapshot": [0],
        "sessionId": "string"
      }
    ],
    "startedAt": "string",
    "status": "Active",
    "submission": {
      "autoSubmitted": true,
      "createdAt": "string",
      "gradingStatus": "string",
      "id": "string",
      "sessionId": "string",
      "submittedAt": "string",
      "totalScore": 0
    },
    "submittedAt": "string",
    "terminatedAt": "string",
    "terminationReason": "string",
    "userAgent": "string"
  }
}
```

---

### 401 Unauthorized

**Content-Type:** `application/json`

```json id="t6v4mz"
{
  "error": "string"
}
```

# Start Session EXAMCANDIDATE

## Endpoint

```http
POST /sessions/start
```

## Description

Create and initialize a candidate exam session.

---

## Parameters

### Headers

| Name            | Type   | Required | Description   |
| --------------- | ------ | -------- | ------------- |
| X-Enrollment-Id | string | Yes      | Enrollment ID |
| X-Enterprise-Id | string | Yes      | Enterprise ID |

---

## Responses

### 201 Created

**Content-Type:** `application/json`

```json
{
  "data": {
    "answers": [
      {
        "answerData": [0],
        "id": "string",
        "isFinal": true,
        "savedAt": "string",
        "sessionId": "string",
        "sessionQuestionId": "string"
      }
    ],
    "candidateId": "string",
    "cheatingScore": 0,
    "clientIp": "string",
    "createdAt": "string",
    "enrollmentId": "string",
    "enterpriseId": "string",
    "examId": "string",
    "expiresAt": "string",
    "faceRegisteredUrl": "string",
    "id": "string",
    "questions": [
      {
        "id": "string",
        "negativePoints": 0,
        "orderIndex": 0,
        "points": 0,
        "questionId": "string",
        "questionSnapshot": [0],
        "sessionId": "string"
      }
    ],
    "startedAt": "string",
    "status": "Active",
    "submission": {
      "autoSubmitted": true,
      "createdAt": "string",
      "gradingStatus": "string",
      "id": "string",
      "sessionId": "string",
      "submittedAt": "string",
      "totalScore": 0
    },
    "submittedAt": "string",
    "terminatedAt": "string",
    "terminationReason": "string",
    "userAgent": "string"
  }
}
```

---

### 400 Bad Request

**Content-Type:** `application/json`

```json
{
  "error": "string"
}
```

# Get Session Details EXAMCANDIDATE and ENTERPRISEADMIN

## Endpoint

```http
GET /sessions/{sessionId}
```

## Description

Get session details for a candidate/admin context.

---

## Parameters

### Headers

| Name         | Type   | Required | Description  |
| ------------ | ------ | -------- | ------------ |
| X-Subject-Id | string | Yes      | Candidate ID |

---

### Path Parameters

| Name      | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| sessionId | string | Yes      | Session ID (UUID) |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "data": {
    "answers": [
      {
        "answerData": [0],
        "id": "string",
        "isFinal": true,
        "savedAt": "string",
        "sessionId": "string",
        "sessionQuestionId": "string"
      }
    ],
    "candidateId": "string",
    "cheatingScore": 0,
    "clientIp": "string",
    "createdAt": "string",
    "enrollmentId": "string",
    "enterpriseId": "string",
    "examId": "string",
    "expiresAt": "string",
    "faceRegisteredUrl": "string",
    "id": "string",
    "questions": [
      {
        "id": "string",
        "negativePoints": 0,
        "orderIndex": 0,
        "points": 0,
        "questionId": "string",
        "questionSnapshot": [0],
        "sessionId": "string"
      }
    ],
    "startedAt": "string",
    "status": "Active",
    "submission": {
      "autoSubmitted": true,
      "createdAt": "string",
      "gradingStatus": "string",
      "id": "string",
      "sessionId": "string",
      "submittedAt": "string",
      "totalScore": 0
    },
    "submittedAt": "string",
    "terminatedAt": "string",
    "terminationReason": "string",
    "userAgent": "string"
  }
}
```

---

### 400 Bad Request

**Content-Type:** `application/json`

```json
{
  "error": "string"
}
```

# Get My Answers EXAMCANDIDATE

## Endpoint

```http
GET /sessions/{sessionId}/answers
```

## Description

Return answers saved by the authenticated candidate for a session.

---

## Parameters

### Headers

| Name         | Type   | Required | Description  |
| ------------ | ------ | -------- | ------------ |
| X-Subject-Id | string | Yes      | Candidate ID |

---

### Path Parameters

| Name      | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| sessionId | string | Yes      | Session ID (UUID) |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "data": [
    {
      "answerData": [0],
      "id": "string",
      "isFinal": true,
      "savedAt": "string",
      "sessionId": "string",
      "sessionQuestionId": "string"
    }
  ]
}
```

# Save Session Answer EXAMCANDIDATE

## Endpoint

```http
PATCH /sessions/{sessionId}/answers
```

## Description

Save or update one question answer in a session. One of the two fields in the answer data must be non null. Both fields being non null or null is not allowed.

---

## Parameters

### Headers

| Name         | Type   | Required | Description  |
| ------------ | ------ | -------- | ------------ |
| X-Subject-Id | string | Yes      | Candidate ID |

---

### Path Parameters

| Name      | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| sessionId | string | Yes      | Session ID (UUID) |

---

### Body Parameters

**Content-Type:** `application/json`

```json
{
  "answerData": {
    "selectedOptionIds": ["123e4567-e89b-12d3-a456-426614174000"],
    "text": "This is an essay answer."
  },
  "sessionQuestionId": "string"
}
```

# Expire Session ENTERPRISEADMIN and ENTERPRISEAUTO

## Endpoint

```http
POST /sessions/{sessionId}/expire
```

## Description

Force-expire a session by enterprise/admin action.

---

## Parameters

### Headers

| Name            | Type   | Required | Description   |
| --------------- | ------ | -------- | ------------- |
| X-Enterprise-Id | string | Yes      | Enterprise ID |

---

### Path Parameters

| Name      | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| sessionId | string | Yes      | Session ID (UUID) |

---

## Responses

```json
200 OK
{
  "message": "string"
}
```

# Get Session Questions EXAMCANDIDATE

## Endpoint

```http
GET /sessions/{sessionId}/questions
```

## Description

Get question snapshots for a candidate session.

---

## Parameters

### Headers

| Name         | Type   | Required | Description  |
| ------------ | ------ | -------- | ------------ |
| X-Subject-Id | string | Yes      | Candidate ID |

---

### Path Parameters

| Name      | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| sessionId | string | Yes      | Session ID (UUID) |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "data": [
    {
      "id": "string",
      "negativePoints": 0,
      "orderIndex": 0,
      "points": 0,
      "questionId": "string",
      "questionSnapshot": [0],
      "sessionId": "string"
    }
  ]
}
```

# Submit Exam Session EXAMCANDIDATE

## Endpoint

```http
POST /sessions/{sessionId}/submit
```

## Description

Submit candidate exam session and create a submission record.

---

## Parameters

### Headers

| Name         | Type   | Required | Description  |
| ------------ | ------ | -------- | ------------ |
| X-Subject-Id | string | Yes      | Candidate ID |

---

### Path Parameters

| Name      | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| sessionId | string | Yes      | Session ID (UUID) |

---

### Body Parameters

**Content-Type:** `application/json`

```json
{
  "autoSubmitted": true
}
```

---

## Responses

### 201 Created

**Content-Type:** `application/json`

```json
{
  "data": {
    "autoSubmitted": true,
    "createdAt": "string",
    "gradingStatus": "string",
    "id": "string",
    "sessionId": "string",
    "submittedAt": "string",
    "totalScore": 0
  },
  "message": "string"
}
```

# Terminate Session ENTERPRISEADMIN

## Endpoint

```http
POST /sessions/{sessionId}/terminate
```

## Description

Terminate a session on enterprise/admin action.

---

## Parameters

### Headers

| Name            | Type   | Required | Description   |
| --------------- | ------ | -------- | ------------- |
| X-Enterprise-Id | string | Yes      | Enterprise ID |

---

### Path Parameters

| Name      | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| sessionId | string | Yes      | Session ID (UUID) |

---

### Body Parameters

**Content-Type:** `application/json`

```json
{
  "reason": "string"
}
```

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "message": "string"
}
```

# List Exam Sessions ENTERPRISEADMIN

## Endpoint

```http
GET /exams/{examId}/sessions
```

## Description

List sessions for an exam. Optional query filters: status and candidateId.

---

## Parameters

### Headers

| Name            | Type   | Required | Description                                              |
| --------------- | ------ | -------- | -------------------------------------------------------- |
| X-Enterprise-Id | string | No       | Enterprise ID (fallback if middleware context is absent) |

---

### Path Parameters

| Name   | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| examId | string | Yes      | Exam ID (UUID) |

---

### Query Parameters

| Name        | Type    | Required | Description                        |
| ----------- | ------- | -------- | ---------------------------------- | -------------------- | ---------- |
| status      | string  | No       | Session status                     |
| candidateId | string  | No       | Candidate ID (UUID)                |
| page        | integer | No       | Page number (default: 1)           |
| limit       | integer | No       | Page size (default: 10, max: 1000) |
| sort        | string  | No       | created_at                         | status               | started_at |
| sort_dir    | string  | No       | asc                                | desc (default: desc) |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "data": [
    {
      "answers": [
        {
          "answerData": [0],
          "id": "string",
          "isFinal": true,
          "savedAt": "string",
          "sessionId": "string",
          "sessionQuestionId": "string"
        }
      ],
      "candidateId": "string",
      "cheatingScore": 0,
      "clientIp": "string",
      "createdAt": "string",
      "enrollmentId": "string",
      "enterpriseId": "string",
      "examId": "string",
      "expiresAt": "string",
      "faceRegisteredUrl": "string",
      "id": "string",
      "questions": [
        {
          "id": "string",
          "negativePoints": 0,
          "orderIndex": 0,
          "points": 0,
          "questionId": "string",
          "questionSnapshot": [0],
          "sessionId": "string"
        }
      ],
      "startedAt": "string",
      "status": "Active",
      "submission": {
        "autoSubmitted": true,
        "createdAt": "string",
        "gradingStatus": "string",
        "id": "string",
        "sessionId": "string",
        "submittedAt": "string",
        "totalScore": 0
      },
      "submittedAt": "string",
      "terminatedAt": "string",
      "terminationReason": "string",
      "userAgent": "string"
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

# List Exam Submissions ENTERPRISEADMIN

## Endpoint

```http
GET /exams/{examId}/submissions
```

## Description

List all submissions for an exam under the caller enterprise.

---

## Parameters

### Headers

| Name            | Type   | Required | Description                                              |
| --------------- | ------ | -------- | -------------------------------------------------------- |
| X-Enterprise-Id | string | No       | Enterprise ID (fallback if middleware context is absent) |

---

### Path Parameters

| Name   | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| examId | string | Yes      | Exam ID (UUID) |

---

### Query Parameters

| Name     | Type    | Required | Description                        |
| -------- | ------- | -------- | ---------------------------------- | -------------------- |
| page     | integer | No       | Page number (default: 1)           |
| limit    | integer | No       | Page size (default: 10, max: 1000) |
| sort     | string  | No       | created_at                         | submitted_at         |
| sort_dir | string  | No       | asc                                | desc (default: desc) |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "data": [
    {
      "autoSubmitted": true,
      "createdAt": "string",
      "gradingStatus": "string",
      "id": "string",
      "sessionId": "string",
      "submittedAt": "string",
      "totalScore": 0
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

# Get Candidate Result EXAMCANDIDATE

## Endpoint

```http
GET /sessions/{sessionId}/result
```

## Description

Return candidate result if release policy allows it.

---

## Parameters

### Headers

| Name         | Type   | Required | Description  |
| ------------ | ------ | -------- | ------------ |
| X-Subject-Id | string | Yes      | Candidate ID |

---

### Path Parameters

| Name      | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| sessionId | string | Yes      | Session ID (UUID) |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "data": {
    "autoSubmitted": true,
    "createdAt": "string",
    "gradingStatus": "string",
    "id": "string",
    "sessionId": "string",
    "submittedAt": "string",
    "totalScore": 0
  }
}
```

# Get Session Summary ENTERPRISEADMIN

## Endpoint

```http
GET /sessions/{sessionId}/summary
```

## Description

Get one session summary by session ID.

---

## Parameters

### Headers

| Name            | Type   | Required | Description                                              |
| --------------- | ------ | -------- | -------------------------------------------------------- |
| X-Enterprise-Id | string | No       | Enterprise ID (fallback if middleware context is absent) |

---

### Path Parameters

| Name      | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| sessionId | string | Yes      | Session ID (UUID) |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "data": {
    "answers": [
      {
        "answerData": [0],
        "id": "string",
        "isFinal": true,
        "savedAt": "string",
        "sessionId": "string",
        "sessionQuestionId": "string"
      }
    ],
    "candidateId": "string",
    "cheatingScore": 0,
    "clientIp": "string",
    "createdAt": "string",
    "enrollmentId": "string",
    "enterpriseId": "string",
    "examId": "string",
    "expiresAt": "string",
    "faceRegisteredUrl": "string",
    "id": "string",
    "questions": [
      {
        "id": "string",
        "negativePoints": 0,
        "orderIndex": 0,
        "points": 0,
        "questionId": "string",
        "questionSnapshot": [0],
        "sessionId": "string"
      }
    ],
    "startedAt": "string",
    "status": "Active",
    "submission": {
      "autoSubmitted": true,
      "createdAt": "string",
      "gradingStatus": "string",
      "id": "string",
      "sessionId": "string",
      "submittedAt": "string",
      "totalScore": 0
    },
    "submittedAt": "string",
    "terminatedAt": "string",
    "terminationReason": "string",
    "userAgent": "string"
  }
}
```

# Get Submission Detail ENTERPRISEADMIN

## Endpoint

```http
GET /submissions/{submissionId}
```

## Description

Get submission detail by submission ID.

---

## Parameters

### Headers

| Name            | Type   | Required | Description                                              |
| --------------- | ------ | -------- | -------------------------------------------------------- |
| X-Enterprise-Id | string | No       | Enterprise ID (fallback if middleware context is absent) |

---

### Path Parameters

| Name         | Type   | Required | Description          |
| ------------ | ------ | -------- | -------------------- |
| submissionId | string | Yes      | Submission ID (UUID) |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "data": {
    "autoSubmitted": true,
    "createdAt": "string",
    "gradingStatus": "string",
    "id": "string",
    "sessionId": "string",
    "submittedAt": "string",
    "totalScore": 0
  }
}
```
