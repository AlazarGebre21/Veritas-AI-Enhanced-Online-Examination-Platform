# Veritas Frontend: Full Implementation Plan

## Overview

**Stack**: React 19 + Vite 6 (JavaScript, no TypeScript) — confirmed by project documentation.  
**Styling**: TailwindCSS 4 (Notion-inspired design system from `DESIGN.md`)  
**State**: Zustand 5 (client-only) + TanStack React Query 5 (all server data)  
**Language**: JavaScript with JSDoc on API functions, data models, and complex utilities  

The architecture is **role-based**: pages and feature modules are organized by the 4 user roles defined in the system, sharing a common `lib/`, `components/`, and `stores/` layer.

---

## Decisions Confirmed

| Decision | Choice | Reason |
|---|---|---|
| Framework | React + Vite (SPA) | Project doc: "SEO irrelevant, dashboard-heavy, critical real-time video handling" |
| Language | JavaScript (no TS) | User request; JSDoc on key APIs/models for IntelliSense |
| Architecture | Role-based modules | Clear separation: SystemAdmin / EnterpriseAdmin / EnterpriseStaff / Candidate |
| Auth (Staff/Admin) | JWT via `/auth/login` — email+password | Roles: SystemAdmin, EnterpriseAdmin, EnterpriseAuto, EnterpriseStaff |
| Auth (Candidate) | Token-based via `/access/validate` + `/sessions/start` | No JWT — raw enrollment token sent in **request body**, not headers |

---

## 1. Complete Project Structure

```
src/
├── app/
│   ├── App.jsx                  # Root app, providers wrapper
│   ├── router.jsx               # React Router 7 route definitions
│   └── providers.jsx            # QueryClientProvider, Toaster, AuthProvider
│
├── config/
│   ├── env.js                   # import.meta.env wrappers
│   ├── constants.js             # USER_ROLES, EXAM_STATUS, QUESTION_TYPES, etc.
│   └── routes.js                # ROUTES constant (all path strings)
│
├── lib/
│   ├── api/
│   │   ├── client.js            # Axios instance + JWT interceptor + 401 refresh
│   │   ├── queryKeys.js         # Query key factory (all domains)
│   │   ├── auth.api.js          # POST /auth/login, /auth/logout, /auth/refresh
│   │   ├── enterprise.api.js    # /enterprises/* endpoints
│   │   ├── user.api.js          # /enterprises/{id}/users/* endpoints
│   │   ├── exam.api.js          # /exams/*, /questions/* endpoints
│   │   ├── candidate.api.js     # /candidates/*, /enrollments/* endpoints
│   │   ├── session.api.js       # /sessions/*, /access/* endpoints
│   │   └── payment.api.js       # /invoices/*, /payments/*, /subscriptions/* endpoints
│   ├── hooks/
│   │   ├── useDebounce.js
│   │   ├── usePagination.js
│   │   └── useMediaQuery.js
│   └── utils/
│       ├── cn.js                # clsx + tailwind-merge helper
│       ├── date.js              # Date formatting utilities
│       ├── jwt.js               # jwtDecode wrapper
│       ├── download.js          # CSV/PDF download helpers
│       └── errorNormalizer.js   # Handle both auth & other service error envelopes
│
├── stores/
│   ├── authStore.js             # JWT tokens, decoded user (id, role, enterpriseId)
│   ├── uiStore.js               # Sidebar state, theme, modals
│   └── examSessionStore.js      # Candidate in-progress session state
│
├── roles/                       # ← ROLE-BASED MODULES
│   ├── system-admin/
│   │   ├── pages/
│   │   │   ├── SystemAdminDashboardPage.jsx
│   │   │   ├── EnterprisesPage.jsx
│   │   │   ├── EnterpriseDetailPage.jsx     # Approve/suspend/delete/restore
│   │   │   ├── SubscriptionPlansPage.jsx    # CRUD plans
│   │   │   └── SystemAuditLogPage.jsx
│   │   ├── components/
│   │   │   ├── EnterpriseTable.jsx
│   │   │   ├── PendingApprovalsPanel.jsx
│   │   │   ├── EnterpriseStatusBadge.jsx
│   │   │   ├── SubscriptionPlanCard.jsx
│   │   │   ├── SubscriptionPlanForm.jsx
│   │   │   └── SystemStatsWidget.jsx
│   │   ├── hooks/
│   │   │   ├── useEnterprises.js
│   │   │   ├── useEnterprise.js
│   │   │   ├── useApproveEnterprise.js
│   │   │   ├── useSuspendEnterprise.js
│   │   │   ├── useReactivateEnterprise.js
│   │   │   ├── useDeleteEnterprise.js
│   │   │   ├── useRestoreEnterprise.js
│   │   │   ├── useSubscriptionPlans.js
│   │   │   └── useUpdateEnterpriseSubscription.js
│   │   └── index.js
│   │
│   ├── enterprise-admin/
│   │   ├── pages/
│   │   │   ├── EnterpriseDashboardPage.jsx
│   │   │   ├── StaffManagementPage.jsx
│   │   │   ├── CandidatesPage.jsx
│   │   │   ├── ExamsPage.jsx
│   │   │   ├── ExamCreatePage.jsx           # Multi-step wizard
│   │   │   ├── ExamDetailPage.jsx           # View + manage
│   │   │   ├── ExamMonitoringPage.jsx        # Live sessions for one exam
│   │   │   ├── QuestionsPage.jsx            # Question bank
│   │   │   ├── QuestionDetailPage.jsx
│   │   │   ├── ResultsPage.jsx              # Exam submissions
│   │   │   ├── BillingPage.jsx
│   │   │   └── EnterpriseSettingsPage.jsx
│   │   ├── components/
│   │   │   ├── ExamWizard/
│   │   │   │   ├── ExamWizard.jsx           # Stepper shell
│   │   │   │   ├── StepBasicInfo.jsx        # title, duration, passing score, negative marking
│   │   │   │   ├── StepQuestions.jsx        # Add/remove/reorder questions
│   │   │   │   ├── StepRandomization.jsx    # Add rules (topic + difficulty + count)
│   │   │   │   ├── StepSchedule.jsx         # startTime + endTime
│   │   │   │   └── StepEnrollment.jsx       # Select candidates + generate tokens
│   │   │   ├── ExamCard.jsx
│   │   │   ├── ExamStatusLifecycle.jsx      # Draft→Scheduled→Active→Closed→Archived
│   │   │   ├── QuestionEditor.jsx           # Create/edit MCQ, T/F, ShortAnswer, Essay
│   │   │   ├── QuestionFilterBar.jsx
│   │   │   ├── CandidateTable.jsx
│   │   │   ├── BulkCsvUploadPanel.jsx
│   │   │   ├── EnrollmentTokenList.jsx
│   │   │   ├── StaffTable.jsx
│   │   │   ├── LiveSessionGrid.jsx          # Real-time candidate session cards
│   │   │   ├── SessionRow.jsx
│   │   │   ├── SubmissionsTable.jsx
│   │   │   └── BillingPanel.jsx
│   │   ├── hooks/
│   │   │   ├── useExams.js
│   │   │   ├── useExam.js
│   │   │   ├── useCreateExam.js
│   │   │   ├── useUpdateExam.js
│   │   │   ├── useDeleteExam.js
│   │   │   ├── useCloneExam.js
│   │   │   ├── usePublishExam.js
│   │   │   ├── useCloseExam.js
│   │   │   ├── useScheduleExam.js
│   │   │   ├── useExamQuestions.js
│   │   │   ├── useAddQuestionsToExam.js
│   │   │   ├── useRemoveQuestionFromExam.js
│   │   │   ├── useRandomizationRules.js
│   │   │   ├── useAddRandomizationRule.js
│   │   │   ├── useDeleteRandomizationRule.js
│   │   │   ├── useQuestions.js
│   │   │   ├── useQuestion.js
│   │   │   ├── useCreateQuestion.js
│   │   │   ├── useUpdateQuestion.js
│   │   │   ├── useDeleteQuestion.js
│   │   │   ├── useCandidates.js
│   │   │   ├── useCandidate.js
│   │   │   ├── useCreateCandidate.js
│   │   │   ├── useBulkUploadCandidates.js
│   │   │   ├── useDeactivateCandidate.js
│   │   │   ├── useEnrollCandidates.js
│   │   │   ├── useEnrollments.js
│   │   │   ├── useRevokeEnrollment.js
│   │   │   ├── useRegenerateToken.js
│   │   │   ├── useExamSessions.js
│   │   │   ├── useExamSubmissions.js
│   │   │   ├── useTerminateSession.js
│   │   │   ├── useStaff.js
│   │   │   ├── useCreateUser.js
│   │   │   ├── useBilling.js
│   │   │   ├── usePaymentHistory.js
│   │   │   ├── useUpgradeSubscription.js
│   │   │   └── useEnterpriseSettings.js
│   │   └── index.js
│   │
│   ├── enterprise-staff/
│   │   ├── pages/
│   │   │   ├── StaffDashboardPage.jsx
│   │   │   ├── StaffExamsPage.jsx           # List & view exams (read + limited actions)
│   │   │   ├── StaffExamDetailPage.jsx
│   │   │   ├── StaffQuestionsPage.jsx       # Create/edit questions (Staff can too)
│   │   │   ├── StaffMonitoringPage.jsx      # Live session monitoring
│   │   │   └── StaffResultsPage.jsx
│   │   ├── components/
│   │   │   ├── StaffExamCard.jsx
│   │   │   └── StaffReportView.jsx
│   │   ├── hooks/
│   │   │   ├── useStaffExams.js             # Re-uses exam.api but limited filter
│   │   │   └── useStaffResults.js
│   │   └── index.js
│   │
│   └── candidate/
│       ├── pages/
│       │   ├── CandidateAccessPage.jsx      # Token entry field
│       │   ├── ExamSessionPage.jsx          # Fullscreen proctored exam
│       │   └── CandidateResultsPage.jsx     # Score + submission status
│       ├── components/
│       │   ├── TokenEntryForm.jsx
│       │   ├── FaceVerificationStep.jsx     # Webcam capture before start
│       │   ├── ExamTimer.jsx                # Server-synced countdown
│       │   ├── QuestionNavigation.jsx       # Jump-to-question panel
│       │   ├── QuestionRenderer.jsx         # MCQ / True-False / Short / Essay
│       │   ├── AnswerOptionList.jsx
│       │   ├── ProctoringMonitor.jsx        # Tab-switch, mouse, webcam hooks
│       │   ├── OfflineBanner.jsx            # Shows when connection lost
│       │   └── CertificateView.jsx          # Post-exam certificate display
│       ├── hooks/
│       │   ├── useValidateToken.js          # POST /access/validate
│       │   ├── useStartSession.js           # POST /sessions/start
│       │   ├── useResumeSession.js          # GET /sessions/me/active
│       │   ├── useSessionQuestions.js       # GET /sessions/{id}/questions
│       │   ├── useSaveAnswer.js             # PATCH /sessions/{id}/answers
│       │   ├── useSubmitExam.js             # POST /sessions/{id}/submit
│       │   ├── useAnswerQueue.js            # IndexedDB offline queue (idb)
│       │   ├── useCandidateResult.js        # GET /sessions/{id}/result
│       │   └── useProctoring.js            # Tab-switch, visibility, mouse tracking
│       └── index.js
│
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Textarea.jsx
│   │   ├── Badge.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Drawer.jsx
│   │   ├── Skeleton.jsx
│   │   ├── Spinner.jsx
│   │   ├── Avatar.jsx
│   │   ├── Tooltip.jsx
│   │   └── Pagination.jsx
│   ├── layout/
│   │   ├── DashboardLayout.jsx              # Sidebar + Topbar shell
│   │   ├── PublicLayout.jsx                 # Centered card for login/register
│   │   ├── ExamLayout.jsx                   # Fullscreen, no nav
│   │   ├── Sidebar.jsx                      # Role-aware nav links
│   │   └── Topbar.jsx                       # User menu, notifications
│   └── shared/
│       ├── DataTable.jsx
│       ├── ConfirmDialog.jsx
│       ├── FileUpload.jsx
│       ├── ErrorBoundary.jsx
│       ├── EmptyState.jsx
│       ├── ProtectedRoute.jsx               # Checks JWT auth
│       └── RoleGuard.jsx                    # Checks user.role
│
└── styles/
    ├── globals.css                          # Tailwind directives + CSS vars from DESIGN.md
    └── fonts.css                            # NotionInter font face declarations
```

---

## 2. API Service Modules (Exact Endpoints from Specs)

### `lib/api/auth.api.js`

```js
/**
 * @typedef {Object} LoginPayload
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} AuthTokens
 * @property {string} accessToken
 * @property {string} refreshToken
 * @property {number} expiresIn
 */

export const authApi = {
  /** @param {LoginPayload} payload @returns {Promise<AuthTokens>} */
  login: async (payload) => { /* POST /auth/login */ },

  /** @param {{ refreshToken: string }} payload @returns {Promise<AuthTokens>} */
  refresh: async (payload) => { /* POST /auth/refresh */ },

  /** @param {{ refreshToken: string }} payload @returns {Promise<void>} */
  logout: async (payload) => { /* POST /auth/logout → 204 */ },
};
```

### `lib/api/enterprise.api.js`

Endpoints covered:
- `GET /enterprises` — SystemAdmin only — list with filter (status, subscription_status, search, page, limit, sort)
- `POST /enterprises` — PUBLIC — register new enterprise
- `GET /enterprises/me` — EnterpriseAdmin — get own enterprise
- `GET /enterprises/slug/{slug}` — ALL (token required) — resolve by slug
- `GET /enterprises/{id}` — SystemAdmin + EnterpriseAdmin
- `PATCH /enterprises/{id}` — EnterpriseAdmin — update profile
- `DELETE /enterprises/{id}` — SystemAdmin — soft delete (90-day retention)
- `DELETE /enterprises/{id}/permanent` — SystemAdmin — hard delete
- `POST /enterprises/{id}/suspend` — SystemAdmin
- `POST /enterprises/{id}/reactivate` — SystemAdmin
- `POST /enterprises/{id}/restore` — SystemAdmin
- `POST /enterprises/{id}/suspend-payment` — SystemAdmin
- `PATCH /enterprises/{id}/branding` — EnterpriseAdmin — `{ logo_url, primary_color, secondary_color }`
- `PATCH /enterprises/{id}/settings` — EnterpriseAdmin — merge settings object
- `GET /enterprises/{id}/status` — SystemAdmin + EnterpriseAdmin — lifecycle + subscription status
- `GET /enterprises/{id}/summary` — EnterpriseAdmin — `active_exam_count, active_session_count, user_count`
- `GET /enterprises/{id}/subscription` — SystemAdmin + EnterpriseAdmin
- `POST /enterprises/{id}/subscription` — SystemAdmin — update plan/status/period
- `POST /enterprises/{id}/subscription/cancel` — SystemAdmin
- `POST /enterprises/{id}/subscription/renew` — SystemAdmin
- `GET /enterprises/{id}/audit-logs` — SystemAdmin + EnterpriseAdmin — paginated
- `GET /enterprises/{id}/users` — EnterpriseAdmin — list staff accounts
- `POST /enterprises/{id}/validate-domain` — EnterpriseAdmin

### `lib/api/exam.api.js`

Endpoints covered:
- `GET /exams` — EnterpriseAdmin — paginated list
- `POST /exams` — EnterpriseAdmin — create (title, description, durationMinutes, maxParticipants, negativeMarking, passingScorePercent, settings, templateSourceId)
- `GET /exams/{id}` — EnterpriseAdmin
- `PATCH /exams/{id}` — EnterpriseAdmin — update fields
- `DELETE /exams/{id}` — EnterpriseAdmin
- `POST /exams/{id}/clone` — EnterpriseAdmin — `{ title }` → returns new exam
- `POST /exams/{id}/publish` — EnterpriseAdmin
- `POST /exams/{id}/close` — EnterpriseAdmin
- `POST /exams/{id}/schedule` — EnterpriseAdmin — `{ startTime, endTime }`
- `GET /exams/{id}/questions` — EnterpriseAdmin — paginated, `with_correct_answer` param
- `POST /exams/{id}/questions` — EnterpriseAdmin — bulk attach `[{ questionId, orderIndex, pointsOverride }]`
- `PATCH /exams/{id}/questions/{qId}` — EnterpriseAdmin — update mapping
- `DELETE /exams/{id}/questions/{qId}` — EnterpriseAdmin
- `POST /exams/{id}/rules` — EnterpriseAdmin — add randomization rule `{ topic, difficulty, questionCount }`
- `PATCH /exams/{id}/rules/{ruleId}` — EnterpriseAdmin
- `DELETE /exams/{id}/rules/{ruleId}` — EnterpriseAdmin
- `GET /questions` — EnterpriseAdmin + EnterpriseStaff — filtered list
- `POST /questions` — EnterpriseAdmin + EnterpriseStaff — create question
- `GET /questions/{id}` — read single
- `PATCH /questions/{id}` — update
- `DELETE /questions/{id}` — delete

### `lib/api/candidate.api.js`

Endpoints covered:
- `GET /candidates` — EnterpriseAdmin + EnterpriseStaff
- `POST /candidates` — EnterpriseAdmin + EnterpriseAuto — `{ email, externalId, faceReferenceUrl, firstName, lastName }`
- `POST /candidates/bulk` — EnterpriseAdmin — CSV multipart upload (max 5MB)
- `GET /candidates/{id}` — EnterpriseAdmin + EnterpriseStaff
- `PATCH /candidates/{id}` — EnterpriseAdmin
- `PATCH /candidates/{id}/deactivate` — EnterpriseAdmin
- `GET /enrollments/{id}` — EnterpriseAdmin + EnterpriseStaff
- `POST /enrollments/{id}/regenerate-token` — EnterpriseAdmin
- `POST /enrollments/{id}/reset-attempts` — EnterpriseAdmin
- `PATCH /enrollments/{id}/revoke` — EnterpriseAdmin
- `GET /exams/{examId}/enrollments` — EnterpriseAdmin + EnterpriseStaff
- `POST /exams/{examId}/enrollments` — EnterpriseAdmin + EnterpriseStaff — `{ candidateIds[], maxAttempts, tokenExpiresAt }`

### `lib/api/session.api.js`

> [!NOTE]
> The API spec documents candidate session headers (`X-Enrollment-Id`, `X-Enterprise-Id`, `X-Subject-Id`) as internal gateway routing hints. Since CORS only allows `Authorization`, `Content-Type`, and `X-Request-ID`, the frontend **must not** send these custom headers. Enrollment/enterprise/subject context is passed in the **request body** or resolved by the backend from the JWT/session token.

Endpoints covered:
- `POST /access/validate` — PUBLIC — body: `{ token, enterpriseId }` — validate raw enrollment token
- `GET /sessions/me/active` — ExamCandidate — bearer token identifies candidate — resume active session
- `POST /sessions/start` — ExamCandidate — body: `{ enrollmentId, enterpriseId }` — start session
- `GET /sessions/{id}` — ExamCandidate + EnterpriseAdmin — identity from JWT
- `GET /sessions/{id}/questions` — ExamCandidate — question snapshots
- `GET /sessions/{id}/answers` — ExamCandidate — saved answers
- `PATCH /sessions/{id}/answers` — ExamCandidate — save/update one answer `{ sessionQuestionId, answerData: { selectedOptionIds[], text } }`
- `POST /sessions/{id}/submit` — ExamCandidate — `{ autoSubmitted: bool }`
- `GET /sessions/{id}/result` — ExamCandidate — result if release policy allows
- `GET /sessions/{id}/summary` — EnterpriseAdmin
- `POST /sessions/{id}/terminate` — EnterpriseAdmin — `{ reason }`
- `POST /sessions/{id}/expire` — EnterpriseAdmin + EnterpriseAuto
- `GET /exams/{examId}/sessions` — EnterpriseAdmin — list sessions with filters
- `GET /exams/{examId}/submissions` — EnterpriseAdmin — list submissions

### `lib/api/payment.api.js`

Endpoints covered:
- `GET /invoices/{invoiceId}` — EnterpriseAdmin — invoice detail
- `GET /payments/history?enterpriseId=` — EnterpriseAdmin — payment history list
- `GET /subscriptions/plans` — PUBLIC — all available plans
- `POST /subscriptions/{enterpriseId}/upgrade` — EnterpriseAdmin — `{ plan_id }` → returns `{ checkout_url }`
- `POST /webhooks/stripe` — PUBLIC — Stripe webhook handler (backend only, no frontend call needed)

---

## 3. Data Models (JSDoc from API Schemas)

### Enterprise Model
```js
/**
 * @typedef {Object} Enterprise
 * @property {string} id
 * @property {string} displayName
 * @property {string} legalName
 * @property {string} slug
 * @property {string} contactEmail
 * @property {string} contactPhone
 * @property {string} logoURL
 * @property {string} primaryColor
 * @property {string} secondaryColor
 * @property {'PendingApproval'|'Active'|'Suspended'|'Deleted'} status
 * @property {'Trial'|'Active'|'PastDue'|'Cancelled'|'Expired'} subscriptionStatus
 * @property {string} subscriptionPlanID
 * @property {string} currentPeriodStart
 * @property {string} currentPeriodEnd
 * @property {string} approvedAt
 * @property {string} suspendedAt
 * @property {string} deletedAt
 * @property {string} retentionUntil
 * @property {string} createdAt
 * @property {string} updatedAt
 */
```

### User Model
```js
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {'SystemAdmin'|'EnterpriseAdmin'|'EnterpriseStaff'|'EnterpriseAuto'} role
 * @property {string} enterpriseID
 * @property {boolean} isActive
 * @property {string} lastLoginAt
 * @property {string} createdAt
 */
```

### Exam Model
```js
/**
 * @typedef {Object} Exam
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} durationMinutes
 * @property {number} passingScorePercent
 * @property {number} maxParticipants
 * @property {boolean} negativeMarking
 * @property {'Draft'|'Scheduled'|'Active'|'Closed'|'Archived'} status
 * @property {string} scheduledStart
 * @property {string} scheduledEnd
 * @property {string} enterpriseId
 * @property {string} templateSourceId
 * @property {ExamQuestion[]} questions
 * @property {RandomizationRule[]} randomizationRules
 * @property {Record<string,any>} settings
 * @property {string} createdAt
 * @property {string} updatedAt
 */
```

### Question Model
```js
/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {'MCQ'|'TrueFalse'|'ShortAnswer'|'Essay'} type
 * @property {'Easy'|'Medium'|'Hard'} difficulty
 * @property {string} topic
 * @property {number} points
 * @property {number} negativePoints
 * @property {string} mediaUrl
 * @property {boolean} isActive
 * @property {QuestionOption[]} options
 * @property {string} enterpriseId
 * @property {string} createdAt
 * @property {string} updatedAt
 */
```

### Candidate Model
```js
/**
 * @typedef {Object} Candidate
 * @property {string} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} externalId
 * @property {string} enterpriseId
 * @property {string} faceReferenceUrl
 * @property {boolean} isActive
 * @property {string} createdAt
 */
```

### ExamSession Model
```js
/**
 * @typedef {Object} ExamSession
 * @property {string} id
 * @property {string} examId
 * @property {string} candidateId
 * @property {string} enrollmentId
 * @property {string} enterpriseId
 * @property {'Active'|'Submitted'|'Expired'|'Terminated'} status
 * @property {number} cheatingScore
 * @property {string} startedAt
 * @property {string} expiresAt
 * @property {string} submittedAt
 * @property {string} terminatedAt
 * @property {string} terminationReason
 * @property {string} faceRegisteredUrl
 * @property {SessionQuestion[]} questions
 * @property {SessionAnswer[]} answers
 * @property {Submission} submission
 */
```

### API Pagination Envelope
```js
/**
 * @template T
 * @typedef {Object} PaginatedResponse
 * @property {T[]} data
 * @property {{ current_page: number, has_next: boolean, has_previous: boolean, page_size: number, total_elements: number, total_pages: number }} metadata
 */
```

### Error Envelopes
- Auth service errors: `{ code: string, message: string, requestId: string }`
- All other services: `{ error: string }`

Both are normalized in `lib/utils/errorNormalizer.js`.

---

## 4. Zustand Stores

### `stores/authStore.js`
```js
// Persisted to localStorage as "veritas-auth"
// State: { accessToken, refreshToken, user: { id, email, role, enterpriseId, firstName, lastName } }
// Actions: setTokens(access, refresh), clearAuth()
// Computed: isTokenExpired()
```
- `user.role` drives `RoleGuard` and `Sidebar` nav visibility

### `stores/uiStore.js`  
```js
// State: { sidebarOpen, activePage, toast queue (handled by Sonner) }
// Actions: toggleSidebar, setActivePage
```

### `stores/examSessionStore.js`
```js
// Client-only in-progress exam state for candidate
// State: { sessionId, examId, currentQuestionIndex, localAnswers: Map<sessionQuestionId, answerData> }
// Actions: setSession, setAnswer, clearSession
// NOT server data — React Query owns the actual session from API
```

---

## 5. Axios Client + Token Strategy

### CORS Constraint (Critical)

The backend **CORS configuration** only permits these browser-sent headers:
```
CORS_ALLOWED_HEADERS = Authorization, Content-Type, X-Request-ID
```

This means the frontend **must NOT** inject `X-Enterprise-ID`, `X-User-ID`, `X-Enrollment-Id`, `X-Enterprise-Id`, or `X-Subject-Id` as request headers. The backend resolves all of these from:
- **JWT claims** — `enterpriseId` and `userId` are decoded server-side from the `Authorization: Bearer <token>` header
- **Request body** — enrollment/enterprise context for candidate token-auth flows is passed in the JSON body

### `lib/api/client.js` — Staff/Admin Axios Instance

**Request interceptor injects ONLY:**
```
Authorization: Bearer <accessToken>     // From authStore.accessToken
Content-Type: application/json          // Standard JSON header
```

**❌ DO NOT inject:**
```
// CORS will block these — backend resolves from JWT
X-Enterprise-ID: ...   ← FORBIDDEN
X-User-ID: ...         ← FORBIDDEN
X-Enrollment-Id: ...   ← FORBIDDEN
X-Enterprise-Id: ...   ← FORBIDDEN
X-Subject-Id: ...      ← FORBIDDEN
```

**Response interceptor handles 401:**
1. Queue concurrent requests
2. Call `POST /auth/refresh` with stored `refreshToken`
3. On success → update authStore, retry queued requests
4. On failure → `authStore.clearAuth()` → redirect to `/login`

### `lib/api/candidateClient.js` — Candidate (Token Auth) Axios Instance

Candidates authenticate with a raw enrollment token, not a JWT. The token is stored in `examSessionStore` and sent as a Bearer token:
```
Authorization: Bearer <rawEnrollmentToken>   // From examSessionStore.rawToken
Content-Type: application/json
```

Enrollment and enterprise context is passed in the **request body**, not headers:
```js
// ✅ Correct — body-based context
await candidateClient.post('/access/validate', {
  token: rawToken,
  enterpriseId: enterpriseId,
});

await candidateClient.post('/sessions/start', {
  enrollmentId: enrollmentId,
  enterpriseId: enterpriseId,
});

// ❌ WRONG — these headers are blocked by CORS
// headers: { 'X-Enrollment-Id': enrollmentId }
```

---

## 6. Routing Tree

```
<PublicLayout>
  /login                          — LoginPage
  /register                       — RegisterEnterprisePage

<DashboardLayout>
  <ProtectedRoute>
    <RoleGuard roles={["SystemAdmin"]}>
      /admin                      — SystemAdminDashboardPage
      /admin/enterprises          — EnterprisesPage
      /admin/enterprises/:id      — EnterpriseDetailPage
      /admin/subscriptions        — SubscriptionPlansPage
      /admin/audit-log            — SystemAuditLogPage

    <RoleGuard roles={["EnterpriseAdmin"]}>
      /dashboard                  — EnterpriseDashboardPage
      /staff                      — StaffManagementPage
      /candidates                 — CandidatesPage
      /questions                  — QuestionsPage
      /questions/:id              — QuestionDetailPage
      /exams                      — ExamsPage
      /exams/new                  — ExamCreatePage
      /exams/:id                  — ExamDetailPage
      /exams/:id/monitor          — ExamMonitoringPage
      /results                    — ResultsPage (all exams)
      /billing                    — BillingPage
      /settings                   — EnterpriseSettingsPage

    <RoleGuard roles={["EnterpriseStaff"]}>
      /staff-portal               — StaffDashboardPage
      /staff-portal/exams         — StaffExamsPage
      /staff-portal/exams/:id     — StaffExamDetailPage
      /staff-portal/questions     — StaffQuestionsPage
      /staff-portal/monitor       — StaffMonitoringPage
      /staff-portal/results       — StaffResultsPage

<ExamLayout>  (no JWT — token auth only)
  /exam                           — CandidateAccessPage (token entry)
  /exam/session/:id               — ExamSessionPage (fullscreen)
  /exam/result/:sessionId         — CandidateResultsPage
```

---

## 7. Query Key Factory (`lib/api/queryKeys.js`)

```js
export const queryKeys = {
  enterprises: {
    all: ['enterprises'],
    list: (params) => ['enterprises', 'list', params],
    detail: (id) => ['enterprises', id],
    status: (id) => ['enterprises', id, 'status'],
    summary: (id) => ['enterprises', id, 'summary'],
    subscription: (id) => ['enterprises', id, 'subscription'],
    auditLogs: (id, params) => ['enterprises', id, 'audit-logs', params],
    users: (id, params) => ['enterprises', id, 'users', params],
  },
  exams: {
    all: ['exams'],
    list: (params) => ['exams', 'list', params],
    detail: (id) => ['exams', id],
    questions: (examId, params) => ['exams', examId, 'questions', params],
    sessions: (examId, params) => ['exams', examId, 'sessions', params],
    submissions: (examId, params) => ['exams', examId, 'submissions', params],
    enrollments: (examId, params) => ['exams', examId, 'enrollments', params],
  },
  questions: {
    all: ['questions'],
    list: (params) => ['questions', 'list', params],
    detail: (id) => ['questions', id],
  },
  candidates: {
    all: ['candidates'],
    list: (params) => ['candidates', 'list', params],
    detail: (id) => ['candidates', id],
  },
  sessions: {
    active: ['sessions', 'me', 'active'],
    detail: (id) => ['sessions', id],
    questions: (id) => ['sessions', id, 'questions'],
    answers: (id) => ['sessions', id, 'answers'],
    result: (id) => ['sessions', id, 'result'],
    summary: (id) => ['sessions', id, 'summary'],
  },
  payments: {
    plans: ['subscriptions', 'plans'],
    history: (enterpriseId) => ['payments', 'history', enterpriseId],
    invoice: (id) => ['invoices', id],
  },
};
```

---

## 8. Design System Summary (from DESIGN.md)

### Colors
| Token | Value | Usage |
|---|---|---|
| Notion Blue | `#0075de` | Primary CTA, links — only saturated color |
| Active Blue | `#005bab` | Button hover/pressed |
| Pure White | `#ffffff` | Page bg, card bg |
| Warm White | `#f6f5f4` | Alternate section bg |
| Warm Dark | `#31302e` | Dark surfaces |
| Near-Black | `rgba(0,0,0,0.95)` | Heading + body text |
| Warm Gray 500 | `#615d59` | Secondary text |
| Warm Gray 300 | `#a39e98` | Placeholder, disabled |
| Badge BG | `#f2f9ff` | Pill badge background |
| Badge Text | `#097fe8` | Pill badge text |
| Teal | `#2a9d99` | Success states |
| Orange | `#dd5b00` | Warning states |

### Shadows
- **Card shadow**: 4-layer stack, max opacity 0.04
- **Deep shadow**: 5-layer stack, max opacity 0.05
- **Whisper border**: `1px solid rgba(0,0,0,0.1)` — ONLY border weight allowed

### Typography
- Font: NotionInter (modified Inter) — load from `styles/fonts.css`
- Sizes: 64px→400px display; 16px body; 15px nav/button; 12px badge
- Letter-spacing: `-2.125px` at 64px → `normal` at 16px
- Weights: 400 (body), 500 (UI), 600 (emphasis), 700 (headings)

### Components
- **Buttons**: 4px radius, `8px 16px` padding, `active:scale-[0.9]`
- **Cards**: 12px radius, whisper border, 4-layer shadow
- **Inputs**: 4px radius, `#ddd` border, 6px padding, blue focus ring
- **Badges**: 9999px pill radius, `#f2f9ff` bg, `#097fe8` text, 12px font

---

## 9. TypeScript → JavaScript Conversion Map

| TypeScript was | JavaScript replacement |
|---|---|
| `*.tsx` → `*.jsx` | `*.jsx` |
| `*.ts` → `*.js` | `*.js` |
| `interface ExamTableProps { }` | JSDoc `@typedef` or `@param` |
| `type UserRole = "SystemAdmin" \| ...` | `const USER_ROLES = { SYSTEM_ADMIN: "SystemAdmin", ... }` |
| `create<AuthState>()()` | `create()()` |
| `Promise<PaginatedResponse<Exam>>` | Removed — plain JSDoc `@returns` |
| `as const` on arrays | `.freeze([...])` or remove |
| `tailwind.config.ts` | `tailwind.config.js` |
| `vite.config.ts` | `vite.config.js` |
| `tsconfig.json` | Removed — use `jsconfig.json` for path aliases only |
| `npx tsc --noEmit` | `npx eslint src/` |
| `prettier --check "**/*.{ts,tsx}"` | `prettier --check "**/*.{js,jsx,css}"` |
| `import.meta.env` types | Remove `/// <reference types="vite/client" />` |
| Zod schemas | Stay — Zod works in JS, just remove type inference usage |

**JSDoc applied to:**
- All API service functions (`authApi`, `examApi`, etc.)
- All data model shapes (`@typedef`: Enterprise, User, Exam, Question, Candidate, ExamSession)
- Complex utility functions (`errorNormalizer`, `jwtDecode wrapper`, answer queue logic)

---

## 10. AGENTS.md Changes

The updated `AGENTS.md` will:
1. **Remove all TypeScript references** — no `.ts/.tsx`, no `interface`, no generics, no `strict: true`
2. **Update Tech Stack** — confirm React 19 (JavaScript), Vite 6
3. **Replace Project Structure** — old `features/` + `types/` → new `roles/`
4. **Rewrite all code examples** — `.tsx` → `.jsx`, remove TypeScript syntax
5. **Update commands** — remove `npx tsc --noEmit`, update prettier glob
6. **Update Code Style section** — replace TypeScript section with JSDoc policy
7. **Update Boundaries (Never Do)** — remove TypeScript-specific rules, add JS equivalents
8. **Update API Integration section** — remove `X-Enterprise-ID` and `X-User-ID` from "Required Headers" — backend resolves these from JWT
9. **Add CORS rule to Never Do** — never inject `X-Enterprise-ID`, `X-User-ID`, `X-Enrollment-Id`, `X-Enterprise-Id`, or `X-Subject-Id` as request headers

---

## 11. Build Phases

### Phase 1 — `AGENTS.md` Rewrite (this task)
Update `AGENTS.md` with:
- Role-based folder structure
- JavaScript (no TypeScript)
- JSDoc policy
- Updated code examples

### Phase 2 — Project Scaffold
```bash
npm create vite@latest ./ -- --template react
npm install react-router-dom @tanstack/react-query zustand axios react-hook-form zod sonner lucide-react recharts idb jwt-decode clsx tailwind-merge
```
Create: `vite.config.js`, `jsconfig.json` (path aliases), `tailwind.config.js`, base folder structure.

### Phase 3 — Foundation
- `styles/globals.css` — all CSS vars from DESIGN.md
- `styles/fonts.css` — NotionInter font face
- `lib/api/client.js` — Axios + interceptors
- `stores/authStore.js` — Zustand persist
- `components/ui/` — Button, Input, Card, Badge, Modal, Skeleton
- `components/layout/` — DashboardLayout, PublicLayout, ExamLayout
- `components/shared/` — ProtectedRoute, RoleGuard, ErrorBoundary

### Phase 4 — Role Modules (one role at a time)
1. Auth pages (Login, Register)
2. SystemAdmin module
3. EnterpriseAdmin module (largest — exam wizard, monitoring)
4. EnterpriseStaff module
5. Candidate module (offline queue, proctoring, fullscreen)

### Phase 5 — Integration & Polish
- React Query DevTools
- Error boundaries per role module
- Loading skeleton across all pages
- Toast notifications for all mutations
- Empty state UI for all lists
- Lazy-load all page components at route level

---

## Verification Plan

### AGENTS.md rewrite
- All code examples are valid JavaScript — no angle brackets, no generics, no type annotations
- File extensions are `.js` / `.jsx` throughout
- Role-based folder tree matches this plan exactly

### Phase 2+ scaffold
- `npm run dev` starts successfully on localhost:5173
- `npm run lint` passes with no errors
- Routing renders correct page per role
- `RoleGuard` correctly redirects unauthorized roles
- Candidate token flow: validate → start → exam → submit end-to-end
- Offline queue: disconnect → answer → reconnect → auto-sync

---

> [!NOTE]
> This plan is derived exclusively from the actual API spec files (`auth_api.md`, `enterprise_api.md`, `exam_api.md`, `candidate_api.md`, `payment_api.md`), the design system (`DESIGN.md`), and the project requirements (`veritas_doc_text.txt`, `veritas_req.md`). No endpoints were invented — every API call maps to a real documented endpoint.
