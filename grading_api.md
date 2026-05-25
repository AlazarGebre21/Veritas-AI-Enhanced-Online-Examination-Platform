# GET `/grading/results` ENTERPRISEADMIN ENDPOINT AND ENTERPRISESTAFF ENDPOINT

## List Graded Students

Get a paginated list of examinees and their overall grades.  
Access restricted to admins of the specific enterprise.

---

## Parameters

| Name      | Type                      | Location | Description                 | Default | Constraints         |
| --------- | ------------------------- | -------- | --------------------------- | ------- | ------------------- |
| `exam_id` | `string \| null` (`uuid`) | Query    | Filter results by exam ID   | —       | —                   |
| `limit`   | `integer`                 | Query    | Number of items to retrieve | `10`    | `1 <= limit <= 100` |
| `offset`  | `integer`                 | Query    | Offset for pagination       | `0`     | `offset >= 0`       |

---

## Responses

### `200` Successful Response

**Media Type:** `application/json`

### Example Response

```json
{
  "results": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "exam_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "candidate_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "enrollment_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "total_max_points": 0,
      "total_awarded_points": 0,
      "percentage": 0,
      "status": "string",
      "graded_by": "string",
      "is_tampered": true,
      "version": 0,
      "created_at": "2026-05-23T03:04:39.653Z",
      "updated_at": "2026-05-23T03:04:39.653Z"
    }
  ],
  "total": 0,
  "limit": 0,
  "offset": 0
}
```

# GET `/grading/results/{session_id}` ENTERPRISEADMIN ENDPOINT AND ENTERPRISESTAFF ENDPOINT

## Get Grade Detail

Get the detailed grading breakdown for an exam session.  
Verifies data integrity and enforces multi-tenant boundaries.

---

## Parameters

| Name         | Type              | Location | Description     | Required |
| ------------ | ----------------- | -------- | --------------- | -------- |
| `session_id` | `string` (`uuid`) | Path     | Exam session ID | Yes      |

---

## Responses

### `200` Successful Response

**Media Type:** `application/json`

### Example Response

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "exam_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "candidate_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "enrollment_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "total_max_points": 0,
  "total_awarded_points": 0,
  "percentage": 0,
  "status": "string",
  "graded_by": "string",
  "is_tampered": true,
  "version": 0,
  "created_at": "2026-05-23T03:11:13.738Z",
  "updated_at": "2026-05-23T03:11:13.738Z",
  "question_results": [
    {
      "question_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "session_question_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "question_type": "string",
      "title": "string",
      "max_points": 0,
      "awarded_points": 0,
      "status": "string"
    }
  ]
}
```

# POST `/grading/results/{session_id}/override` ENTERPRISEADMIN ENDPOINT

## Override Grade

Manually override a student's final grade.  
Computes a new cryptographic checksum and writes to an append-only audit trail.

---

## Parameters

| Name         | Type              | Location | Description     | Required |
| ------------ | ----------------- | -------- | --------------- | -------- |
| `session_id` | `string` (`uuid`) | Path     | Exam session ID | Yes      |

---

## Request Body

**Media Type:** `application/json`

### Example Request

```json
{
  "new_score": 0,
  "reason": "string"
}
```

---

## Responses

### `200` Successful Response

**Media Type:** `application/json`

### Example Response

```json
{
  "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "previous_score": 0,
  "new_score": 0,
  "new_percentage": 0,
  "status": "string",
  "message": "Grade manually overridden successfully."
}
```

# GET `/grading/results/{session_id}/logs` ENTERPRISEADMIN ENDPOINT

## Get Audit Logs

Get the immutable audit history / edit logs for an exam session's grade.

---

## Parameters

| Name         | Type              | Location | Description     | Required |
| ------------ | ----------------- | -------- | --------------- | -------- |
| `session_id` | `string` (`uuid`) | Path     | Exam session ID | Yes      |

---

## Responses

### `200` Successful Response

**Media Type:** `application/json`

### Example Response

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "action": "string",
    "actor_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "actor_role": "string",
    "old_values": {
      "additionalProp1": {}
    },
    "new_values": {
      "additionalProp1": {}
    },
    "changed_fields": ["string"],
    "ip_address": "string",
    "reason": "string",
    "created_at": "2026-05-23T03:20:38.203Z"
  }
]
```

# GET `/grading/results/{session_id}/status` ENTERPRISEADMIN AND ENTERPRISESTAFF ENDPOINT

## Get Grading Status

Lightweight status check — poll this endpoint after exam submission.

Returns the current `GradingStatus` for the session.

---

## Possible Status Values

| Status     | Description                                         |
| ---------- | --------------------------------------------------- |
| `pending`  | Grading worker received the event and is processing |
| `graded`   | Automated grading is complete                       |
| `reviewed` | A human manually overrode the score                 |
| `disputed` | The result is under dispute                         |
| `404`      | No grading record exists (event not yet received)   |

---

## Parameters

| Name         | Type            | Location | Required | Description |
| ------------ | --------------- | -------- | -------- | ----------- |
| `session_id` | `string($uuid)` | Path     | Yes      | Session ID  |

---

## Request

```http
GET /grading/results/{session_id}/status     j
```

---

## Responses

### `200 OK`

Successful Response

#### Content-Type

```http
application/json
```

---

## Example Response

```json
{
  "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "status": "pending",
  "graded_by": "string",
  "percentage": 0,
  "updated_at": "2026-05-25T10:47:54.893Z"
}
```

---

## Response Fields

| Field        | Type               | Description                            |
| ------------ | ------------------ | -------------------------------------- |
| `session_id` | `string(uuid)`     | Unique exam session identifier         |
| `status`     | `string`           | Current grading status                 |
| `graded_by`  | `string`           | Identifier of grader or grading system |
| `percentage` | `number`           | Calculated exam percentage             |
| `updated_at` | `string(datetime)` | Timestamp of last grading update       |

```

```
