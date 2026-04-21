# GET /exams ENTERPRISEADMIN ENDPOINT

## List exams

Returns a paginated list of exams with sorting and filtering support for the caller enterprise.

---

## Parameters

| Name            | Type    | Required | Location | Description                                                                                             |
| --------------- | ------- | -------: | -------- | ------------------------------------------------------------------------------------------------------- |
| X-Enterprise-ID | string  |      Yes | header   | Enterprise ID (UUID)                                                                                    |
| page            | integer |       No | query    | Page number (default: 1)                                                                                |
| limit           | integer |       No | query    | Number of items per page (default: 10, max: 1000)                                                       |
| sort            | string  |       No | query    | Sort field (`created_at`, `updated_at`, `title`, `duration_minutes`, `passing_score_percent`, `status`) |
| sort_dir        | string  |       No | query    | Sort direction (`asc` or `desc`, default: `desc`)                                                       |

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
      "createdBy": "string",
      "description": "string",
      "durationMinutes": 0,
      "enterpriseId": "string",
      "id": "string",
      "maxParticipants": 0,
      "negativeMarking": true,
      "passingScorePercent": 0,
      "questions": [
        {
          "examId": "string",
          "id": "string",
          "orderIndex": 0,
          "pointsOverride": 0,
          "question": {
            "content": "string",
            "createdAt": "string",
            "createdBy": "string",
            "difficulty": "Easy",
            "enterpriseId": "string",
            "id": "string",
            "isActive": true,
            "mediaUrl": "string",
            "metadata": {
              "additionalProp1": "string",
              "additionalProp2": "string",
              "additionalProp3": "string"
            },
            "negativePoints": 0,
            "options": [
              {
                "content": "string",
                "id": "string",
                "isCorrect": true,
                "questionId": "string"
              }
            ],
            "points": 0,
            "title": "string",
            "topic": "string",
            "type": "MCQ",
            "updatedAt": "string"
          },
          "questionId": "string"
        }
      ],
      "randomizationRules": [
        {
          "difficulty": "Easy",
          "examId": "string",
          "id": "string",
          "questionCount": 0,
          "topic": "string"
        }
      ],
      "scheduledEnd": "string",
      "scheduledStart": "string",
      "settings": {
        "additionalProp1": "string",
        "additionalProp2": "string",
        "additionalProp3": "string"
      },
      "status": "Draft",
      "templateSourceId": "string",
      "title": "string",
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

# POST /exams ENTERPRISEADMIN ENDPOINT

## Create exam

Creates a new exam under the caller enterprise.

---

## Parameters

| Name            | Type   | Required | Location | Description          |
| --------------- | ------ | -------: | -------- | -------------------- |
| X-Enterprise-ID | string |      Yes | header   | Enterprise ID (UUID) |
| X-User-ID       | string |      Yes | header   | Actor user ID (UUID) |
| body            | object |      Yes | body     | Exam payload         |

---

## Request Body

**Content-Type:** `application/json`

```json
{
  "description": "string",
  "durationMinutes": 0,
  "maxParticipants": 0,
  "negativeMarking": true,
  "passingScorePercent": 0,
  "settings": {
    "additionalProp1": {}
  },
  "templateSourceId": "string",
  "title": "string"
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
  "createdBy": "string",
  "description": "string",
  "durationMinutes": 0,
  "enterpriseId": "string",
  "id": "string",
  "maxParticipants": 0,
  "negativeMarking": true,
  "passingScorePercent": 0,
  "questions": [
    {
      "examId": "string",
      "id": "string",
      "orderIndex": 0,
      "pointsOverride": 0,
      "question": {
        "content": "string",
        "createdAt": "string",
        "createdBy": "string",
        "difficulty": "Easy",
        "enterpriseId": "string",
        "id": "string",
        "isActive": true,
        "mediaUrl": "string",
        "metadata": {
          "additionalProp1": "string",
          "additionalProp2": "string",
          "additionalProp3": "string"
        },
        "negativePoints": 0,
        "options": [
          {
            "content": "string",
            "id": "string",
            "isCorrect": true,
            "questionId": "string"
          }
        ],
        "points": 0,
        "title": "string",
        "topic": "string",
        "type": "MCQ",
        "updatedAt": "string"
      },
      "questionId": "string"
    }
  ],
  "randomizationRules": [
    {
      "difficulty": "Easy",
      "examId": "string",
      "id": "string",
      "questionCount": 0,
      "topic": "string"
    }
  ],
  "scheduledEnd": "string",
  "scheduledStart": "string",
  "settings": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "status": "Draft",
  "templateSourceId": "string",
  "title": "string",
  "updatedAt": "string"
}
```

---

### `400 Bad Request`

```json
{
  "error": "string"
}
```

# GET /exams/{examId} ENTERPRISEADMIN ENDPOINT

## Description

Get one exam for the caller enterprise.

---

## Parameters

### Headers

| Name            | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| X-Enterprise-ID | string | Yes      | Enterprise ID (UUID) |

---

### Path Parameters

| Name   | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| examId | string | Yes      | Exam ID (UUID) |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

#### Example Response

```json
{
  "createdAt": "string",
  "createdBy": "string",
  "description": "string",
  "durationMinutes": 0,
  "enterpriseId": "string",
  "id": "string",
  "maxParticipants": 0,
  "negativeMarking": true,
  "passingScorePercent": 0,
  "questions": [
    {
      "examId": "string",
      "id": "string",
      "orderIndex": 0,
      "pointsOverride": 0,
      "question": {
        "content": "string",
        "createdAt": "string",
        "createdBy": "string",
        "difficulty": "Easy",
        "enterpriseId": "string",
        "id": "string",
        "isActive": true,
        "mediaUrl": "string",
        "metadata": {
          "additionalProp1": "string",
          "additionalProp2": "string",
          "additionalProp3": "string"
        },
        "negativePoints": 0,
        "options": [
          {
            "content": "string",
            "id": "string",
            "isCorrect": true,
            "questionId": "string"
          }
        ],
        "points": 0,
        "title": "string",
        "topic": "string",
        "type": "MCQ",
        "updatedAt": "string"
      },
      "questionId": "string"
    }
  ],
  "randomizationRules": [
    {
      "difficulty": "Easy",
      "examId": "string",
      "id": "string",
      "questionCount": 0,
      "topic": "string"
    }
  ],
  "scheduledEnd": "string",
  "scheduledStart": "string",
  "settings": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "status": "Draft",
  "templateSourceId": "string",
  "title": "string",
  "updatedAt": "string"
}
```

---

### 400 Bad Request

#### Example Response

```json
{
  "error": "string"
}
```

````markdown
# Delete Exam

## Endpoint

```http
DELETE /exams/{examId}
```
````

## Description

Delete one exam by ID.

---

## Parameters

### Headers

| Name            | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| X-Enterprise-ID | string | Yes      | Enterprise ID (UUID) |

---

### Path Parameters

| Name   | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| examId | string | Yes      | Exam ID (UUID) |

---

## Responses

### 204 No Content

**Content-Type:** `application/json`

#### Example Response

```json
"string"
```

# Delete Exam ENTERPRISEADMIN ENDPOINT

## Endpoint

```http
DELETE /exams/{examId}
```

## Description

Delete one exam by ID.

---

## Parameters

### Headers

| Name            | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| X-Enterprise-ID | string | Yes      | Enterprise ID (UUID) |

---

### Path Parameters

| Name   | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| examId | string | Yes      | Exam ID (UUID) |

---

## Responses

### 204 No Content

**Content-Type:** `application/json`

#### Example Response

```json
"string"
```

# Update Exam ENTERPRISEADMIN ENDPOINT

## Endpoint

```http
PATCH /exams/{examId}
```

## Description

Update exam fields by ID.

---

## Parameters

### Headers

| Name            | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| X-Enterprise-ID | string | Yes      | Enterprise ID (UUID) |
| X-User-ID       | string | Yes      | Actor user ID (UUID) |

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
  "description": "string",
  "durationMinutes": 0,
  "maxParticipants": 0,
  "negativeMarking": true,
  "passingScorePercent": 0,
  "settings": {
    "additionalProp1": {}
  },
  "title": "string"
}
```

---

## Responses

### 204 No Content

**Content-Type:** `application/json`

```json
"string"
```

# Clone Exam ENTERPRISEADMIN ENDPOINT

## Endpoint

```http
POST /exams/{examId}/clone
```

## Description

Clone exam content into a new exam with provided title.

---

## Parameters

### Headers

| Name            | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| X-Enterprise-ID | string | Yes      | Enterprise ID (UUID) |
| X-User-ID       | string | Yes      | Actor user ID (UUID) |

---

### Path Parameters

| Name   | Type   | Required | Description           |
| ------ | ------ | -------- | --------------------- |
| examId | string | Yes      | Source Exam ID (UUID) |

---

### Body Parameters

**Content-Type:** `application/json`

```json
{
  "title": "string"
}
```

---

## Responses

### 201 Created

**Content-Type:** `application/json`

```json
{
  "createdAt": "string",
  "createdBy": "string",
  "description": "string",
  "durationMinutes": 0,
  "enterpriseId": "string",
  "id": "string",
  "maxParticipants": 0,
  "negativeMarking": true,
  "passingScorePercent": 0,
  "questions": [
    {
      "examId": "string",
      "id": "string",
      "orderIndex": 0,
      "pointsOverride": 0,
      "question": {
        "content": "string",
        "createdAt": "string",
        "createdBy": "string",
        "difficulty": "Easy",
        "enterpriseId": "string",
        "id": "string",
        "isActive": true,
        "mediaUrl": "string",
        "metadata": {
          "additionalProp1": "string",
          "additionalProp2": "string",
          "additionalProp3": "string"
        },
        "negativePoints": 0,
        "options": [
          {
            "content": "string",
            "id": "string",
            "isCorrect": true,
            "questionId": "string"
          }
        ],
        "points": 0,
        "title": "string",
        "topic": "string",
        "type": "MCQ",
        "updatedAt": "string"
      },
      "questionId": "string"
    }
  ],
  "randomizationRules": [
    {
      "difficulty": "Easy",
      "examId": "string",
      "id": "string",
      "questionCount": 0,
      "topic": "string"
    }
  ],
  "scheduledEnd": "string",
  "scheduledStart": "string",
  "settings": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "status": "Draft",
  "templateSourceId": "string",
  "title": "string",
  "updatedAt": "string"
}
```

---

### 400 Bad Request

**Example Response**

```json
{
  "error": "string"
}
```

# Close Exam ENTERPRISEADMIN ENDPOINT

## Endpoint

```http
POST /exams/{examId}/close
```

## Description

Close an active exam.

---

## Parameters

### Headers

| Name            | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| X-Enterprise-ID | string | Yes      | Enterprise ID (UUID) |

---

### Path Parameters

| Name   | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| examId | string | Yes      | Exam ID (UUID) |

---

## Responses

### 204 No Content

**Content-Type:** `application/json`

```json
"string"
```

# Publish Exam ENTERPRISEADMIN ENDPOINT

## Endpoint

```http
POST /exams/{examId}/publish
```

## Description

Publish exam after validation checks.

---

## Parameters

### Headers

| Name            | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| X-Enterprise-ID | string | Yes      | Enterprise ID (UUID) |

---

### Path Parameters

| Name   | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| examId | string | Yes      | Exam ID (UUID) |

---

## Responses

### 204 No Content

**Content-Type:** `application/json`

```json
"string"
```

# Get Exam Questions ENTERPRISEADMIN ENDPOINT

## Endpoint

```http
GET /exams/{examId}/questions
```

## Description

Get question mappings for one exam.

---

## Parameters

### Headers

| Name            | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| X-Enterprise-ID | string | Yes      | Enterprise ID (UUID) |

---

### Path Parameters

| Name   | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| examId | string | Yes      | Exam ID (UUID) |

---

### Query Parameters

| Name                | Type    | Required | Description                               |
| ------------------- | ------- | -------- | ----------------------------------------- |
| page                | integer | No       | Page number (default: 1)                  |
| limit               | integer | No       | Items per page (default: 10, max: 1000)   |
| sort                | string  | No       | Sort field (order_index, points_override) |
| sort_dir            | string  | No       | Sort direction (asc or desc)              |
| with_correct_answer | boolean | No       | Include answers and metadata              |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "data": [
    {
      "examId": "string",
      "id": "string",
      "orderIndex": 0,
      "pointsOverride": 0,
      "question": {
        "content": "string",
        "createdAt": "string",
        "createdBy": "string",
        "difficulty": "Easy",
        "enterpriseId": "string",
        "id": "string",
        "isActive": true,
        "mediaUrl": "string",
        "metadata": {
          "additionalProp1": "string",
          "additionalProp2": "string",
          "additionalProp3": "string"
        },
        "negativePoints": 0,
        "options": [
          {
            "content": "string",
            "id": "string",
            "isCorrect": true,
            "questionId": "string"
          }
        ],
        "points": 0,
        "title": "string",
        "topic": "string",
        "type": "MCQ",
        "updatedAt": "string"
      },
      "questionId": "string"
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

# Add Questions to Exam ENTERPRISEADMIN ENDPOINT

## Endpoint

```http
POST /exams/{examId}/questions
```

## Description

Attach multiple questions to an exam with optional override points and order indices.

---

## Parameters

### Headers

| Name            | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| X-Enterprise-ID | string | Yes      | Enterprise ID (UUID) |

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
  "questions": [
    {
      "orderIndex": 0,
      "pointsOverride": 0,
      "questionId": "string"
    }
  ]
}
```

---

## Responses

### 201 Created

**Content-Type:** `application/json`

```json
[
  {
    "examId": "string",
    "id": "string",
    "orderIndex": 0,
    "pointsOverride": 0,
    "question": {
      "content": "string",
      "createdAt": "string",
      "createdBy": "string",
      "difficulty": "Easy",
      "enterpriseId": "string",
      "id": "string",
      "isActive": true,
      "mediaUrl": "string",
      "metadata": {
        "additionalProp1": "string",
        "additionalProp2": "string",
        "additionalProp3": "string"
      },
      "negativePoints": 0,
      "options": [
        {
          "content": "string",
          "id": "string",
          "isCorrect": true,
          "questionId": "string"
        }
      ],
      "points": 0,
      "title": "string",
      "topic": "string",
      "type": "MCQ",
      "updatedAt": "string"
    },
    "questionId": "string"
  }
]
```

---

### 400 Bad Request

**Example Response**

```json
{
  "error": "string"
}
```

# Remove Question from Exam ENTERPRISEADMIN ENDPOINT

## Endpoint

```http
DELETE /exams/{examId}/questions/{questionId}
```

## Description

Remove one question mapping from exam.

---

## Parameters

### Headers

| Name            | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| X-Enterprise-ID | string | Yes      | Enterprise ID (UUID) |

---

### Path Parameters

| Name       | Type   | Required | Description        |
| ---------- | ------ | -------- | ------------------ |
| examId     | string | Yes      | Exam ID (UUID)     |
| questionId | string | Yes      | Question ID (UUID) |

---

## Responses

### 204 No Content

**Content-Type:** `application/json`

```json
"string"
```

# Update Exam Question Mapping ENTERPRISEADMIN ENDPOINT

## Endpoint

```http
PATCH /exams/{examId}/questions/{questionId}
```

## Description

Update points override or order index for an exam question mapping.

---

## Parameters

### Headers

| Name            | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| X-Enterprise-ID | string | Yes      | Enterprise ID (UUID) |

---

### Path Parameters

| Name       | Type   | Required | Description        |
| ---------- | ------ | -------- | ------------------ |
| examId     | string | Yes      | Exam ID (UUID)     |
| questionId | string | Yes      | Question ID (UUID) |

---

### Body Parameters

**Content-Type:** `application/json`

```json
{
  "orderIndex": 0,
  "pointsOverride": 0
}
```

---

## Responses

### 204 No Content

**Content-Type:** `application/json`

```json
"string"
```

# Add Randomization Rule ENTERPRISEADMIN ENDPOINT

## Endpoint

```http
POST /exams/{examId}/rules
```

## Description

Add rule for selecting random questions by topic/difficulty.

---

## Parameters

### Headers

| Name            | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| X-Enterprise-ID | string | Yes      | Enterprise ID (UUID) |

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
  "difficulty": "Easy",
  "questionCount": 0,
  "topic": "string"
}
```

---

## Responses

### 201 Created

**Content-Type:** `application/json`

```json
{
  "difficulty": "Easy",
  "examId": "string",
  "id": "string",
  "questionCount": 0,
  "topic": "string"
}
```

# Delete Randomization Rule ENTERPRISEADMIN ENDPOINT

## Endpoint

```http
DELETE /exams/{examId}/rules/{ruleId}
```

## Description

Delete one randomization rule from an exam.

---

## Parameters

### Headers

| Name            | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| X-Enterprise-ID | string | Yes      | Enterprise ID (UUID) |

---

### Path Parameters

| Name   | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| examId | string | Yes      | Exam ID (UUID) |
| ruleId | string | Yes      | Rule ID (UUID) |

---

## Responses

### 204 No Content

**Content-Type:** `application/json`

```json
"string"
```

# Update Randomization Rule ENTERPRISEADMIN ENDPOINT

## Endpoint

```http
PATCH /exams/{examId}/rules/{ruleId}
```

## Description

Update topic, difficulty, or question count for a randomization rule.

---

## Parameters

### Headers

| Name            | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| X-Enterprise-ID | string | Yes      | Enterprise ID (UUID) |

---

### Path Parameters

| Name   | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| examId | string | Yes      | Exam ID (UUID) |
| ruleId | string | Yes      | Rule ID (UUID) |

---

### Body Parameters

**Content-Type:** `application/json`

```json
{
  "difficulty": "Easy",
  "questionCount": 0,
  "topic": "string"
}
```

---

## Responses

### 204 No Content

**Content-Type:** `application/json`

```json
"string"
```

# Schedule Exam ENTERPRISEADMIN ENDPOINT

## Endpoint

```http
POST /exams/{examId}/schedule
```

## Description

Set start and end times for an exam.

---

## Parameters

### Headers

| Name            | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| X-Enterprise-ID | string | Yes      | Enterprise ID (UUID) |
| X-User-ID       | string | Yes      | Actor user ID (UUID) |

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
  "endTime": "2026-03-01T12:00:00Z",
  "startTime": "2026-03-01T10:00:00Z"
}
```

---

## Responses

### 204 No Content

**Content-Type:** `application/json`

```json
"string"
```

# List Questions ENTERPRISEADMIN and ENTERPRISESTAFF ENDPOINT

## Endpoint

```http
GET /questions
```

## Description

List questions with sorting and filtering support for the caller enterprise.

---

## Parameters

### Headers

| Name            | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| X-Enterprise-ID | string | Yes      | Enterprise ID (UUID) |

---

### Query Parameters

| Name                | Type    | Required | Description                                                          |
| ------------------- | ------- | -------- | -------------------------------------------------------------------- |
| page                | integer | No       | Page number (default: 1)                                             |
| limit               | integer | No       | Items per page (default: 10, max: 1000)                              |
| sort                | string  | No       | Sort field (created_at, updated_at, title, difficulty, type, points) |
| sort_dir            | string  | No       | Sort direction (asc or desc)                                         |
| with_correct_answer | boolean | No       | Include answers and metadata                                         |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "data": [
    {
      "content": "string",
      "createdAt": "string",
      "createdBy": "string",
      "difficulty": "Easy",
      "enterpriseId": "string",
      "id": "string",
      "isActive": true,
      "mediaUrl": "string",
      "metadata": {
        "additionalProp1": "string",
        "additionalProp2": "string",
        "additionalProp3": "string"
      },
      "negativePoints": 0,
      "options": [
        {
          "content": "string",
          "id": "string",
          "isCorrect": true,
          "questionId": "string"
        }
      ],
      "points": 0,
      "title": "string",
      "topic": "string",
      "type": "MCQ",
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

---

### 401 Unauthorized

**Content-Type:** `application/json`

```json
{
  "error": "string"
}
```

# Create Question ENTERPRISEADMIN and ENTERPRISESTAFF ENDPOINT

## Endpoint

```http
POST /questions
```

## Description

Create one question under the caller enterprise.

---

## Parameters

### Headers

| Name            | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| X-Enterprise-ID | string | Yes      | Enterprise ID (UUID) |
| X-User-ID       | string | Yes      | Actor user ID (UUID) |

---

### Body Parameters

**Content-Type:** `application/json`

```json
{
  "content": "string",
  "difficulty": "Easy",
  "isActive": true,
  "mediaUrl": "string",
  "metadata": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "negativePoints": 0,
  "options": [
    {
      "content": "string",
      "isCorrect": true
    }
  ],
  "points": 0,
  "title": "string",
  "topic": "string",
  "type": "MCQ"
}
```

---

## Responses

### 201 Created

**Content-Type:** `application/json`

```json
{
  "content": "string",
  "createdAt": "string",
  "createdBy": "string",
  "difficulty": "Easy",
  "enterpriseId": "string",
  "id": "string",
  "isActive": true,
  "mediaUrl": "string",
  "metadata": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "negativePoints": 0,
  "options": [
    {
      "content": "string",
      "id": "string",
      "isCorrect": true,
      "questionId": "string"
    }
  ],
  "points": 0,
  "title": "string",
  "topic": "string",
  "type": "MCQ",
  "updatedAt": "string"
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

# Get Question ENTERPRISEADMIN and ENTERPRISESTAFF ENDPOINT

## Endpoint

```http
GET /questions/{questionId}
```

## Description

Get a question by ID for the caller enterprise.

---

## Parameters

### Headers

| Name            | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| X-Enterprise-ID | string | Yes      | Enterprise ID (UUID) |

---

### Path Parameters

| Name       | Type   | Required | Description        |
| ---------- | ------ | -------- | ------------------ |
| questionId | string | Yes      | Question ID (UUID) |

---

### Query Parameters

| Name                | Type    | Required | Description                                   |
| ------------------- | ------- | -------- | --------------------------------------------- |
| with_correct_answer | boolean | No       | Include answers and metadata (default: false) |

---

## Responses

### 200 OK

**Content-Type:** `application/json`

```json
{
  "content": "string",
  "createdAt": "string",
  "createdBy": "string",
  "difficulty": "Easy",
  "enterpriseId": "string",
  "id": "string",
  "isActive": true,
  "mediaUrl": "string",
  "metadata": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "negativePoints": 0,
  "options": [
    {
      "content": "string",
      "id": "string",
      "isCorrect": true,
      "questionId": "string"
    }
  ],
  "points": 0,
  "title": "string",
  "topic": "string",
  "type": "MCQ",
  "updatedAt": "string"
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

# Delete Question ENTERPRISEADMIN and ENTERPRISESTAFF ENDPOINT

## Endpoint

```http
DELETE /questions/{questionId}
```

## Description

Delete one question from the caller enterprise.

---

## Parameters

### Headers

| Name            | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| X-Enterprise-ID | string | Yes      | Enterprise ID (UUID) |

---

### Path Parameters

| Name       | Type   | Required | Description        |
| ---------- | ------ | -------- | ------------------ |
| questionId | string | Yes      | Question ID (UUID) |

---

## Responses

### 204 No Content

**Content-Type:** `application/json`

```json
"string"
```

# Update Question ENTERPRISEADMIN and ENTERPRISESTAFF ENDPOINT

## Endpoint

```http
PATCH /questions/{questionId}
```

## Description

Update question fields by ID.

---

## Parameters

### Headers

| Name            | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| X-Enterprise-ID | string | Yes      | Enterprise ID (UUID) |
| X-User-ID       | string | Yes      | Actor user ID (UUID) |

---

### Path Parameters

| Name       | Type   | Required | Description        |
| ---------- | ------ | -------- | ------------------ |
| questionId | string | Yes      | Question ID (UUID) |

---

### Body Parameters

**Content-Type:** `application/json`

```json
{
  "content": "string",
  "difficulty": "Easy",
  "isActive": true,
  "mediaUrl": "string",
  "metadata": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "negativePoints": 0,
  "options": [
    {
      "content": "string",
      "isCorrect": true
    }
  ],
  "points": 0,
  "title": "string",
  "topic": "string",
  "type": "MCQ"
}
```

---

## Responses

### 204 No Content

**Content-Type:** `application/json`

```json
"string"
```
