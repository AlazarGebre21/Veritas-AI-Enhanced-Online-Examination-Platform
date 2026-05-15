# POST `/face/verify` EXAMCANDIDATE ENDPOINT

## Verify Face

Periodic identity verification for candidates.

Fetches the face reference from candidate-service, runs DeepFace comparison, logs any anomalies (`face_not_detected`, `multiple_faces`, `identity_mismatch`), and publishes `proctoring.identity.verified` to Kafka.

---

## Request

### Endpoint

```http
POST /face/verify
```

### Parameters

No parameters.

---

## Request Body

**Content-Type:** `application/json`

### Example

```json
{
  "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "image_b64": "string"
}
```

### Schema

| Field        | Type          | Description                  |
| ------------ | ------------- | ---------------------------- |
| `session_id` | string (UUID) | Candidate session identifier |
| `image_b64`  | string        | Base64 encoded face image    |

---

## Responses

### `200 OK`

Successful Response

**Content-Type:** `application/json`

#### Example

```json
{
  "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "is_match": true,
  "confidence": 0,
  "face_count": 0
}
```

#### Response Schema

| Field        | Type          | Description                                            |
| ------------ | ------------- | ------------------------------------------------------ |
| `session_id` | string (UUID) | Session identifier                                     |
| `is_match`   | boolean       | Indicates whether the face matches the reference image |
| `confidence` | number        | Confidence score from face verification                |
| `face_count` | integer       | Number of detected faces in the image                  |

# POST `/proctoring/events` EXAMCANDIDATE ENDPOINT

## Ingest Event

Ingest a single behavioral event from the candidate's browser.

Computes severity, persists the event, recomputes cheating score, and publishes `proctoring.event.detected` and `proctoring.cheating_score.updated`.

---

## Request

### Endpoint

```http
POST /proctoring/events
```

### Parameters

No parameters.

---

## Request Body

**Content-Type:** `application/json`

### Example

```json
{
  "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "event_type": "tab_switch",(other event types - "mouse_inactive","face_not_detected","multiple_faces","identity_mismatch","copy_paste_attempt","fullscreen_exit","periodic_face_ok",)
  "occurred_at": "2026-05-15T08:42:32.405Z",
  "metadata": {}
}
```

### Schema

| Field         | Type                       | Description                          |
| ------------- | -------------------------- | ------------------------------------ |
| `session_id`  | string (UUID)              | Candidate session identifier         |
| `event_type`  | string                     | Type of behavioral event detected    |
| `occurred_at` | string (ISO 8601 datetime) | Timestamp when the event occurred    |
| `metadata`    | object                     | Additional event-related information |

---

## Responses

### `201 Created`

Successful Response

**Content-Type:** `application/json`

#### Example

```json
"string"
```

#### Response Schema

| Type   | Description                                              |
| ------ | -------------------------------------------------------- |
| string | Identifier or confirmation message for the created event |

# GET `/proctoring/sessions/{session_id}/events` ENTERPRISEADMIN ENDPOINT

## List Events

List all proctoring events for a session (admin view). Returns events in chronological order.

---

## Request

### Endpoint

```http
GET /proctoring/sessions/{session_id}/events
```

### Path Parameters

| Name         | Type          | Required | Description        |
| ------------ | ------------- | -------- | ------------------ |
| `session_id` | string (UUID) | Yes      | Session identifier |

---

## Responses

### `200 OK`

Successful Response

**Content-Type:** `application/json`

### Response Schema

```json
{
  "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "events": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "candidate_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "enterprise_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "event_type": "tab_switch",
      "severity": "medium",
      "metadata": {},
      "occurred_at": "2026-05-15T08:42:32.405Z",
      "created_at": "2026-05-15T08:42:32.405Z"
    }
  ],
  "total": 1
}
```

---

## Response Fields

### Root Object

| Field        | Type          | Description               |
| ------------ | ------------- | ------------------------- |
| `session_id` | string (UUID) | Session identifier        |
| `events`     | array<object> | List of proctoring events |
| `total`      | integer       | Total number of events    |

---

### Event Object

| Field           | Type               | Description                         |
| --------------- | ------------------ | ----------------------------------- |
| `id`            | string (UUID)      | Event identifier                    |
| `session_id`    | string (UUID)      | Session identifier                  |
| `candidate_id`  | string (UUID)      | Candidate identifier                |
| `enterprise_id` | string (UUID)      | Enterprise identifier               |
| `event_type`    | string             | Type of detected event              |
| `severity`      | string             | Severity level of the event         |
| `metadata`      | object             | Additional event information        |
| `occurred_at`   | string (date-time) | Timestamp when the event occurred   |
| `created_at`    | string (date-time) | Timestamp when the event was stored |

---

## Event Types

```text
"tab_switch", "mouse_inactive", "face_not_detected", "multiple_faces", "identity_mismatch", "copy_paste_attempt", "fullscreen_exit", "periodic_face_ok"
```

---

## Severity Levels

```text
"low", "medium", "high", "critical"
```

# GET `/proctoring/sessions/{session_id}/score` ENTERPRISEADMIN ENDPOINT

## Get Score

Return the current cheating probability score for a session (admin view).

Returns `404 Not Found` if no events have been recorded yet for this session.

---

## Request

### Endpoint

```http
GET /proctoring/sessions/{session_id}/score
```

### Path Parameters

| Name         | Type          | Required | Description        |
| ------------ | ------------- | -------- | ------------------ |
| `session_id` | string (UUID) | Yes      | Session identifier |

---

## Responses

### `200 OK`

Successful Response

**Content-Type:** `application/json`

### Example

```json
{
  "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "cheating_score": 0,
  "event_count": 0,
  "last_computed_at": "2026-05-15T08:49:18.558Z"
}
```

---

## Response Fields

| Field              | Type               | Description                                         |
| ------------------ | ------------------ | --------------------------------------------------- |
| `session_id`       | string (UUID)      | Session identifier                                  |
| `cheating_score`   | number             | Current cheating probability score                  |
| `event_count`      | integer            | Total number of recorded events                     |
| `last_computed_at` | string (date-time) | Timestamp when the cheating score was last computed |
