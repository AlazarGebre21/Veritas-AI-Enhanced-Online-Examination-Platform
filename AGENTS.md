# Veritas Frontend Agent

You are a senior frontend engineer building the **Veritas AI-Enhanced Online Assessment and Monitoring System** — an enterprise-grade, multi-tenant exam platform for Ethiopian enterprises and institutions.

> **Language: JavaScript only.** This project does NOT use TypeScript. All files use `.js` or `.jsx` extensions. Never introduce `.ts`, `.tsx`, `interface`, generics, or type annotations.

---

## Commands

```bash
# Development
npm run dev                                      # Start Vite dev server (localhost:5173)
npm run build                                    # Production build (Vite bundle)
npm run preview                                  # Preview production build locally

# Quality
npm run lint                                     # ESLint check
npm run lint -- --fix                            # ESLint auto-fix
npx prettier --check "src/**/*.{js,jsx,css}"     # Format check
npx prettier --write "src/**/*.{js,jsx,css}"     # Format fix

# Testing
npm test                                         # Run Vitest unit tests
npm run test:coverage                            # Run tests with coverage report
```

---

# WARNING: API Contract Enforcement

- Do **NOT** invent, infer, or guess API endpoints.
- Do **NOT** assume request/response schemas or parameters.
- **ONLY** use endpoints explicitly defined in the provided API specification files.
- If any endpoint, parameter, or payload field is unclear or missing, **STOP and ask for clarification**.

---

## Tech Stack

| Tool                  | Version | Purpose                                    |
| --------------------- | ------- | ------------------------------------------ |
| React                 | 19      | UI framework (JavaScript, no TypeScript)   |
| Vite                  | 6       | Build tool, dev server, ES module bundler  |
| TailwindCSS           | 4       | Styling — Notion-inspired design system    |
| Zustand               | 5       | Client-only state (auth, UI, exam session) |
| TanStack React Query  | 5       | All server-fetched data                    |
| React Router          | 7       | Routing, nested layouts, role guards       |
| React Hook Form       | 7       | Form state management                      |
| Zod                   | 3       | Form validation schemas                    |
| Axios                 | 1.x     | HTTP client with JWT interceptor           |
| Lucide React          | latest  | Icons                                      |
| Recharts              | 2       | Charts and analytics                       |
| Sonner                | 2       | Toast notifications                        |
| idb                   | 8       | IndexedDB for offline exam answer queuing  |
| jwt-decode            | latest  | Decode JWT claims without verification     |
| clsx + tailwind-merge | latest  | `cn()` className composition helper        |

---

## Project Structure

```
src/
├── app/
│   ├── App.jsx                  # Root app, providers wrapper
│   ├── router.jsx               # React Router 7 route definitions
│   └── providers.jsx            # QueryClientProvider, Toaster, AuthProvider
│
├── config/
│   ├── env.js                   # import.meta.env wrappers (VITE_API_BASE_URL etc.)
│   ├── constants.js             # USER_ROLES, EXAM_STATUS, QUESTION_TYPES, etc.
│   └── routes.js                # ROUTES constant (all path strings in one place)
│
├── lib/
│   ├── api/
│   │   ├── client.js            # Axios instance + JWT interceptor + 401 refresh
│   │   ├── candidateClient.js   # Separate Axios instance for candidate token auth
│   │   ├── queryKeys.js         # Query key factory for all domains
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
│       └── errorNormalizer.js   # Normalize auth { code, message } and other { error } envelopes
│
├── stores/
│   ├── authStore.js             # JWT tokens + decoded user (id, role, enterpriseId)
│   ├── uiStore.js               # Sidebar state, active page
│   └── examSessionStore.js      # Candidate in-progress session (rawToken, sessionId, etc.)
│
├── roles/                       # ← Role-based modules (replaces features/)
│   │
│   ├── system-admin/            # SystemAdmin role module
│   │   ├── pages/
│   │   │   ├── SystemAdminDashboardPage.jsx
│   │   │   ├── EnterprisesPage.jsx
│   │   │   ├── EnterpriseDetailPage.jsx     # Approve / suspend / delete / restore
│   │   │   ├── SubscriptionPlansPage.jsx
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
│   ├── enterprise-admin/        # EnterpriseAdmin role module
│   │   ├── pages/
│   │   │   ├── EnterpriseDashboardPage.jsx
│   │   │   ├── StaffManagementPage.jsx
│   │   │   ├── CandidatesPage.jsx
│   │   │   ├── ExamsPage.jsx
│   │   │   ├── ExamCreatePage.jsx           # Multi-step wizard
│   │   │   ├── ExamDetailPage.jsx
│   │   │   ├── ExamMonitoringPage.jsx       # Live sessions for one exam
│   │   │   ├── QuestionsPage.jsx            # Question bank
│   │   │   ├── QuestionDetailPage.jsx
│   │   │   ├── ResultsPage.jsx
│   │   │   ├── BillingPage.jsx
│   │   │   └── EnterpriseSettingsPage.jsx
│   │   ├── components/
│   │   │   ├── ExamWizard/
│   │   │   │   ├── ExamWizard.jsx
│   │   │   │   ├── StepBasicInfo.jsx
│   │   │   │   ├── StepQuestions.jsx
│   │   │   │   ├── StepRandomization.jsx
│   │   │   │   ├── StepSchedule.jsx
│   │   │   │   └── StepEnrollment.jsx
│   │   │   ├── ExamCard.jsx
│   │   │   ├── ExamStatusLifecycle.jsx
│   │   │   ├── QuestionEditor.jsx
│   │   │   ├── QuestionFilterBar.jsx
│   │   │   ├── CandidateTable.jsx
│   │   │   ├── BulkCsvUploadPanel.jsx
│   │   │   ├── EnrollmentTokenList.jsx
│   │   │   ├── StaffTable.jsx
│   │   │   ├── LiveSessionGrid.jsx
│   │   │   ├── SessionRow.jsx
│   │   │   ├── SubmissionsTable.jsx
│   │   │   └── BillingPanel.jsx
│   │   ├── hooks/               # (useExams, useCreateExam, useCandidates, ... — see impl. plan)
│   │   └── index.js
│   │
│   ├── enterprise-staff/        # EnterpriseStaff role module
│   │   ├── pages/
│   │   │   ├── StaffDashboardPage.jsx
│   │   │   ├── StaffExamsPage.jsx
│   │   │   ├── StaffExamDetailPage.jsx
│   │   │   ├── StaffQuestionsPage.jsx
│   │   │   ├── StaffMonitoringPage.jsx
│   │   │   └── StaffResultsPage.jsx
│   │   ├── components/
│   │   │   ├── StaffExamCard.jsx
│   │   │   └── StaffReportView.jsx
│   │   ├── hooks/
│   │   │   ├── useStaffExams.js
│   │   │   └── useStaffResults.js
│   │   └── index.js
│   │
│   └── candidate/               # Candidate role module (token auth, no JWT)
│       ├── pages/
│       │   ├── CandidateAccessPage.jsx      # Token entry form
│       │   ├── ExamSessionPage.jsx          # Fullscreen proctored exam
│       │   └── CandidateResultsPage.jsx
│       ├── components/
│       │   ├── TokenEntryForm.jsx
│       │   ├── FaceVerificationStep.jsx
│       │   ├── ExamTimer.jsx
│       │   ├── QuestionNavigation.jsx
│       │   ├── QuestionRenderer.jsx         # MCQ / T-F / Short / Essay
│       │   ├── AnswerOptionList.jsx
│       │   ├── ProctoringMonitor.jsx
│       │   ├── OfflineBanner.jsx
│       │   └── CertificateView.jsx
│       ├── hooks/
│       │   ├── useValidateToken.js
│       │   ├── useStartSession.js
│       │   ├── useResumeSession.js
│       │   ├── useSessionQuestions.js
│       │   ├── useSaveAnswer.js
│       │   ├── useSubmitExam.js
│       │   ├── useAnswerQueue.js            # IndexedDB offline queue
│       │   ├── useCandidateResult.js
│       │   └── useProctoring.js
│       └── index.js
│
├── components/
│   ├── ui/                      # Design system primitives
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
│   │   ├── DashboardLayout.jsx  # Sidebar + Topbar shell
│   │   ├── PublicLayout.jsx     # Centered card (login, register)
│   │   ├── ExamLayout.jsx       # Fullscreen, no nav
│   │   ├── Sidebar.jsx          # Role-aware nav links
│   │   └── Topbar.jsx
│   └── shared/
│       ├── DataTable.jsx
│       ├── ConfirmDialog.jsx
│       ├── FileUpload.jsx
│       ├── ErrorBoundary.jsx
│       ├── EmptyState.jsx
│       ├── ProtectedRoute.jsx   # Checks JWT auth
│       └── RoleGuard.jsx        # Checks user.role
│
└── styles/
    ├── globals.css              # Tailwind directives + all CSS custom properties
    └── fonts.css                # NotionInter @font-face declarations
```

---

## Architecture Rules

### Separation of Concerns

Every role module follows this strict layering. **Never break it:**

```
pages/       → Fetch data via hooks, pass to components. No API calls here.
hooks/       → Wrap React Query (useQuery/useMutation). No Axios calls here.
components/  → Receive data via props. No hooks that fetch data. No API calls.
lib/api/     → Axios service functions. The ONLY place that calls the HTTP client.
stores/      → Client-only global state. Never store server-fetched data here.
```

**Wrong — component fetching its own data:**

```jsx
// ❌ NEVER do this
function ExamTable() {
  const { data } = useQuery({
    queryKey: ["exams"],
    queryFn: () => axios.get("/exams"),
  });
  return <table>...</table>;
}
```

**Right — page fetches via hook, passes to component:**

```jsx
// ✅ Correct pattern

// lib/api/exam.api.js
export const examApi = {
  /**
   * @param {{ page: number, limit: number, sort?: string }} params
   * @returns {Promise<import('./types').PaginatedResponse<import('./types').Exam>>}
   */
  listExams: async (params) => {
    const { data } = await apiClient.get("/exams", { params });
    return data;
  },
};

// roles/enterprise-admin/hooks/useExams.js
export function useExams(params) {
  return useQuery({
    queryKey: queryKeys.exams.list(params),
    queryFn: () => examApi.listExams(params),
    placeholderData: keepPreviousData,
  });
}

// roles/enterprise-admin/pages/ExamsPage.jsx
function ExamsPage() {
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const { data, isLoading } = useExams(params);
  return <ExamTable exams={data?.data ?? []} loading={isLoading} />;
}

// roles/enterprise-admin/components/ExamTable.jsx
function ExamTable({ exams, loading }) {
  // Pure presentation — no data fetching
}
```

---

### State Management Rules

**Zustand** is for client-only state. **React Query** owns all server data.

```js
// ✅ authStore.js — tokens persist across refreshes, needed by Axios interceptors
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

const useAuthStore = create()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      /** @type {{ id: string, email: string, role: string, enterpriseId: string, firstName: string, lastName: string } | null} */
      user: null,

      /** @param {string} access @param {string} refresh */
      setTokens: (access, refresh) => {
        const decoded = jwtDecode(access);
        set({ accessToken: access, refreshToken: refresh, user: decoded });
      },

      clearAuth: () =>
        set({ accessToken: null, refreshToken: null, user: null }),

      isTokenExpired: () => {
        // check decoded.exp against Date.now() / 1000
      },
    }),
    { name: "veritas-auth" },
  ),
);
```

```js
// ❌ NEVER put server data in Zustand
const useBadStore = create((set) => ({
  exams: [], // This belongs in React Query
  isLoading: false, // React Query handles this
  fetchExams: async () => {
    /* Use useQuery instead */
  },
}));
```

---

### Mutation Pattern

Every mutation **invalidates** the relevant query cache and **shows a toast**:

```js
// roles/enterprise-admin/hooks/useCreateExam.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { examApi } from "@/lib/api/exam.api";
import { queryKeys } from "@/lib/api/queryKeys";

export function useCreateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: examApi.createExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exams.all });
      toast.success("Exam created successfully");
    },
    onError: (error) => {
      const message = error.response?.data?.error || "Failed to create exam";
      toast.error(message);
    },
  });
}
```

---

### API Service Pattern

All HTTP calls live in `lib/api/`. Use JSDoc for request and response shapes. No raw Axios anywhere else.

```js
// lib/api/exam.api.js
import { apiClient } from "./client";

export const examApi = {
  /**
   * @param {{ page?: number, limit?: number, sort?: string, sort_dir?: string }} params
   * @returns {Promise<{ data: Exam[], metadata: PaginationMeta }>}
   */
  listExams: async (params) => {
    const { data } = await apiClient.get("/exams", { params });
    return data;
  },

  /**
   * @param {{ title: string, description?: string, durationMinutes: number, passingScorePercent: number, negativeMarking: boolean, maxParticipants?: number, settings?: object, templateSourceId?: string }} payload
   * @returns {Promise<Exam>}
   */
  createExam: async (payload) => {
    const { data } = await apiClient.post("/exams", payload);
    return data;
  },

  /** @param {string} examId @returns {Promise<void>} */
  publishExam: async (examId) => {
    await apiClient.post(`/exams/${examId}/publish`);
  },
};
```

---

### Query Key Factory

All query keys go through `lib/api/queryKeys.js`. **Never hardcode query key arrays** in hooks or components:

```js
// lib/api/queryKeys.js
export const queryKeys = {
  enterprises: {
    all: ["enterprises"],
    list: (params) => ["enterprises", "list", params],
    detail: (id) => ["enterprises", id],
    status: (id) => ["enterprises", id, "status"],
    summary: (id) => ["enterprises", id, "summary"],
    subscription: (id) => ["enterprises", id, "subscription"],
    auditLogs: (id, params) => ["enterprises", id, "audit-logs", params],
    users: (id, params) => ["enterprises", id, "users", params],
  },
  exams: {
    all: ["exams"],
    list: (params) => ["exams", "list", params],
    detail: (id) => ["exams", id],
    questions: (examId, params) => ["exams", examId, "questions", params],
    sessions: (examId, params) => ["exams", examId, "sessions", params],
    submissions: (examId, params) => ["exams", examId, "submissions", params],
    enrollments: (examId, params) => ["exams", examId, "enrollments", params],
  },
  questions: {
    all: ["questions"],
    list: (params) => ["questions", "list", params],
    detail: (id) => ["questions", id],
  },
  candidates: {
    all: ["candidates"],
    list: (params) => ["candidates", "list", params],
    detail: (id) => ["candidates", id],
  },
  sessions: {
    active: ["sessions", "me", "active"],
    detail: (id) => ["sessions", id],
    questions: (id) => ["sessions", id, "questions"],
    answers: (id) => ["sessions", id, "answers"],
    result: (id) => ["sessions", id, "result"],
    summary: (id) => ["sessions", id, "summary"],
  },
  payments: {
    plans: ["subscriptions", "plans"],
    history: (enterpriseId) => ["payments", "history", enterpriseId],
    invoice: (id) => ["invoices", id],
  },
};
```

---

## API Integration

### 5 Backend Microservices

All behind a single API gateway at `VITE_API_BASE_URL`:

| Service    | Path Prefix                                                   | Purpose                                                |
| ---------- | ------------------------------------------------------------- | ------------------------------------------------------ |
| Auth       | `/auth/*`                                                     | JWT login, refresh, logout                             |
| Enterprise | `/enterprises/*`                                              | Enterprise CRUD, users, branding, audit, subscriptions |
| Candidate  | `/candidates/*`, `/access/*`, `/enrollments/*`, `/sessions/*` | Candidates, enrollments, exam sessions                 |
| Exam       | `/exams/*`, `/questions/*`                                    | Exam authoring, question bank, scheduling              |
| Payment    | `/invoices/*`, `/payments/*`, `/subscriptions/*`              | Plans, checkout, invoices                              |

---

### CORS Constraint — CRITICAL

The backend CORS policy **only** allows these headers from the browser:

```
CORS_ALLOWED_HEADERS = Authorization, Content-Type, X-Request-ID
```

**The frontend must NOT inject any other custom headers.** The backend resolves enterprise and user identity from the JWT token server-side.

```js
// ✅ lib/api/client.js — ONLY inject these
// Authorization: Bearer <accessToken>   ← from authStore.accessToken
// Content-Type: application/json        ← Axios default

// ❌ NEVER inject these — CORS will block the preflight and the request will fail
// X-Enterprise-ID  ← backend reads from JWT claims
// X-User-ID        ← backend reads from JWT claims
// X-Enrollment-Id  ← pass in request body instead
// X-Enterprise-Id  ← pass in request body instead
// X-Subject-Id     ← backend reads from candidate JWT/token
```

---

### Admin/Staff Axios Client (`lib/api/client.js`)

```js
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Inject Authorization header
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Handle 401: refresh token, retry queue, or logout
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // ... queue requests, call /auth/refresh, retry or clearAuth + redirect
  },
);
```

---

### Candidate Axios Client (`lib/api/candidateClient.js`)

Candidates authenticate with a **raw enrollment token**, not a JWT. Identity context is passed in the **request body**, not headers.

```js
import axios from "axios";
import { useExamSessionStore } from "@/stores/examSessionStore";

export const candidateClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

candidateClient.interceptors.request.use((config) => {
  const { rawToken } = useExamSessionStore.getState();
  if (rawToken) {
    config.headers.Authorization = `Bearer ${rawToken}`;
  }
  return config;
});
```

**Candidate endpoint body patterns:**

```js
// ✅ Correct — context in body
await candidateClient.post("/access/validate", {
  token: rawToken,
  enterpriseId: enterpriseId,
});

await candidateClient.post("/sessions/start", {
  enrollmentId: enrollmentId,
  enterpriseId: enterpriseId,
});

// ❌ WRONG — these headers are blocked by CORS
// config.headers["X-Enrollment-Id"] = enrollmentId;
```

---

### Token Refresh

The Axios response interceptor on `apiClient` handles 401 automatically. It queues concurrent requests while refreshing. If refresh fails, it calls `authStore.clearAuth()` and redirects to `/login`. **Do not manually handle 401 in feature code.**

---

### User Roles

```js
// config/constants.js
export const USER_ROLES = {
  SYSTEM_ADMIN: "SystemAdmin",
  ENTERPRISE_ADMIN: "EnterpriseAdmin",
  ENTERPRISE_STAFF: "EnterpriseStaff",
  ENTERPRISE_AUTO: "EnterpriseAuto",
};
// Candidates authenticate via raw enrollment tokens — not JWT, separate flow
```

---

### Pagination Envelope

All paginated endpoints return:

```js
/**
 * @template T
 * @typedef {Object} PaginatedResponse
 * @property {T[]} data
 * @property {{ current_page: number, has_next: boolean, has_previous: boolean, page_size: number, total_elements: number, total_pages: number }} metadata
 */
```

---

### Error Envelopes

- Auth service: `{ code: string, message: string, requestId: string }`
- All other services: `{ error: string }`

Both normalized in `lib/utils/errorNormalizer.js`. Never access `error.response.data` directly in feature hooks — use the normalizer.

---

## Routing

3 layout tiers with nested routes:

```
PublicLayout     → /login, /register                          (no auth)
ExamLayout       → /exam, /exam/session/:id, /exam/result/:id (candidate token auth, fullscreen)
DashboardLayout  → all /admin/*, /dashboard/*, /staff-portal/* (JWT auth + role guards)
```

Route protection via:

- `<ProtectedRoute />` — checks that `authStore.accessToken` is present and not expired
- `<RoleGuard roles={["SystemAdmin"]} />` — checks `authStore.user.role`

```
DashboardLayout + ProtectedRoute
  RoleGuard ["SystemAdmin"]
    /admin                         SystemAdminDashboardPage
    /admin/enterprises             EnterprisesPage
    /admin/enterprises/:id         EnterpriseDetailPage
    /admin/subscriptions           SubscriptionPlansPage
    /admin/audit-log               SystemAuditLogPage

  RoleGuard ["EnterpriseAdmin"]
    /dashboard                     EnterpriseDashboardPage
    /staff                         StaffManagementPage
    /candidates                    CandidatesPage
    /questions                     QuestionsPage
    /questions/:id                 QuestionDetailPage
    /exams                         ExamsPage
    /exams/new                     ExamCreatePage
    /exams/:id                     ExamDetailPage
    /exams/:id/monitor             ExamMonitoringPage
    /results                       ResultsPage
    /billing                       BillingPage
    /settings                      EnterpriseSettingsPage

  RoleGuard ["EnterpriseStaff"]
    /staff-portal                  StaffDashboardPage
    /staff-portal/exams            StaffExamsPage
    /staff-portal/exams/:id        StaffExamDetailPage
    /staff-portal/questions        StaffQuestionsPage
    /staff-portal/monitor          StaffMonitoringPage
    /staff-portal/results          StaffResultsPage

ExamLayout (no JWT — token auth)
  /exam                            CandidateAccessPage
  /exam/session/:id                ExamSessionPage
  /exam/result/:sessionId          CandidateResultsPage

PublicLayout
  /login                           LoginPage
  /register                        RegisterEnterprisePage
```

---

## Design System (`DESIGN.md`)

Follow `DESIGN.md` exactly. Key tokens:

```
Notion Blue:      #0075de   (primary CTA — the ONLY saturated color in core UI)
Active Blue:      #005bab   (button hover/pressed)
Pure White:       #ffffff   (page bg, card bg)
Warm White:       #f6f5f4   (alternate section bg — warm, yellow undertone)
Warm Dark:        #31302e   (dark surfaces)
Near-Black Text:  rgba(0,0,0,0.95)  (NOT pure black)
Warm Gray 500:    #615d59   (secondary text)
Warm Gray 300:    #a39e98   (placeholder, disabled)
Badge BG:         #f2f9ff   (pill badge background)
Badge Text:       #097fe8   (pill badge text)
Whisper Border:   1px solid rgba(0,0,0,0.1)  (NEVER heavier)
Card Shadow:      4-layer stack, max opacity 0.04
Deep Shadow:      5-layer stack, max opacity 0.05
```

- If a variable is already defined in global.css, use it instead of defining it again.
- for example The class `text-[rgba(0,0,0,0.95)]` can be written as `text-notion-black`
- for example The class `border-[rgba(0,0,0,0.1)]` can be written as `border-whisper`

### CSS Custom Properties

If a token is already defined as a CSS variable in `globals.css`, **use the variable — do not redefine it with a raw value.**

```jsx
// ✅ Use the custom property class
<p className="text-notion-black border-whisper" />

// ❌ Don't repeat the raw value inline
<p className="text-[rgba(0,0,0,0.95)] border-[rgba(0,0,0,0.1)]" />
```

**Typography rules:**

- Font: NotionInter (modified Inter) — declared in `styles/fonts.css`
- Letter-spacing scales negatively with font size: `-2.125px` at 64px → `normal` at 16px
- Four weights: 400 (body), 500 (UI), 600 (emphasis), 700 (headings)
- Body: 16px, Nav/Button: 15px, Badge: 12px with `+0.125px` tracking

**Component rules:**

- Buttons: 4px radius, `8px 16px` padding, `active:scale-[0.9]`, primary is Notion Blue
- Cards: 12px radius, whisper border, 4-layer card shadow
- Inputs: 4px radius, `#ddd` border, 6px padding, blue focus ring
- Badges: 9999px pill radius, `#f2f9ff` bg, `#097fe8` text, 12px 600-weight font

---

## Code Style

### JavaScript + JSDoc

This project is **JavaScript only**. Use JSDoc for type hints on key functions and data models — not TypeScript syntax.

**Apply JSDoc to:**

- All API service functions in `lib/api/`
- All data model shapes (Enterprise, User, Exam, Question, Candidate, ExamSession)
- Complex utility functions (errorNormalizer, jwt wrapper, answer queue)

```js
// ✅ JSDoc for data models
/**
 * @typedef {Object} Exam
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} durationMinutes
 * @property {number} passingScorePercent
 * @property {boolean} negativeMarking
 * @property {'Draft'|'Scheduled'|'Active'|'Closed'|'Archived'} status
 * @property {string} scheduledStart
 * @property {string} scheduledEnd
 * @property {string} enterpriseId
 * @property {string} createdAt
 * @property {string} updatedAt
 */

// ✅ JSDoc for API functions
/**
 * @param {string} examId
 * @returns {Promise<Exam>}
 */
export async function getExam(examId) {
  const { data } = await apiClient.get(`/exams/${examId}`);
  return data;
}

// ❌ Never use TypeScript syntax
// export async function getExam(examId: string): Promise<Exam> { ... }
// interface ExamTableProps { exams: Exam[]; loading: boolean; }
```

### Constants (no `type` or `as const`)

```js
// ✅ JavaScript constants
export const USER_ROLES = Object.freeze({
  SYSTEM_ADMIN: "SystemAdmin",
  ENTERPRISE_ADMIN: "EnterpriseAdmin",
  ENTERPRISE_STAFF: "EnterpriseStaff",
  ENTERPRISE_AUTO: "EnterpriseAuto",
});

export const EXAM_STATUS = Object.freeze({
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  ACTIVE: "Active",
  CLOSED: "Closed",
  ARCHIVED: "Archived",
});

// ❌ Never use TypeScript enums or literal types
// type UserRole = "SystemAdmin" | "EnterpriseAdmin";
// const ROLES = { ... } as const;
```

### Component Conventions

```jsx
// File: PascalCase.jsx for components, camelCase.js for hooks/utils
// Hook naming: use[Entity][Action] — useExams, useCreateExam, useExamSessions
// Props documented with JSDoc @param

/**
 * @param {{ exams: Exam[], loading: boolean, onSelect: (id: string) => void }} props
 */
export function ExamTable({ exams, loading, onSelect }) {
  // ...
}
```

### Imports

- Use `@/` path alias for all imports (maps to `src/`)
- Barrel exports via `index.js` in each role module
- Group imports: React → third-party → `@/lib` → `@/components` → `@/roles` → relative

### CSS

- Use Tailwind utility classes exclusively. No inline `style={{}}` except for truly dynamic values (e.g., progress bar width from a variable).
- Compose repeated patterns using the `cn()` helper (`clsx` + `tailwind-merge`).
- Custom tokens go in `globals.css` as CSS custom properties — NOT redefined in component code.
- No arbitrary Tailwind values for tokens that already have CSS variable classes.

```jsx
import { cn } from "@/lib/utils/cn";

/**
 * @param {{ variant?: 'primary'|'secondary'|'ghost', className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>} props
 */
function Button({ variant = "primary", className, ...props }) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-[4px] text-[15px] font-semibold transition-all active:scale-[0.9]",
        variant === "primary" && "bg-[#0075de] text-white hover:bg-[#005bab]",
        variant === "secondary" &&
          "bg-black/5 text-notion-black hover:scale-[1.05]",
        variant === "ghost" &&
          "bg-transparent text-notion-black underline-offset-4 hover:underline",
        className,
      )}
      {...props}
    />
  );
}
```

---

## Boundaries

### ✅ Always Do

- If a variable is already defined in global.css, use it instead of defining it again.
- for example The class `text-[rgba(0,0,0,0.95)]` can be written as `text-notion-black`
- for example The class `border-[rgba(0,0,0,0.1)]` can be written as `border-whisper`
- Follow the role module structure: `pages/`, `components/`, `hooks/`, `index.js`
- Add JSDoc `@param` / `@returns` / `@typedef` to all API functions and data models
- Invalidate relevant query keys after every mutation
- Show loading skeletons while data is fetching (never blank screens)
- Show toast notifications after every mutation (both success and error)
- Provide empty state UI for all list views
- Use `ErrorBoundary` per role module to prevent cascading failures
- Wrap every React Query call in a custom hook — never use `useQuery` raw in a component
- Use Notion design tokens from `DESIGN.md` — warm neutrals, whisper borders, Notion Blue
- Lazy-load all page components at the route level (`React.lazy` + `Suspense`)
- Use CSS variable classes (e.g. `text-notion-black`) not raw arbitrary values

### ⚠️ Ask First

- Adding new Zustand stores (there should be exactly 3: `authStore`, `uiStore`, `examSessionStore`)
- Introducing new npm dependencies
- Changing the `apiClient` or `candidateClient` interceptor logic
- Modifying shared `components/ui/` primitives (they affect the entire app)
- Creating new route layouts beyond the existing 3 (`PublicLayout`, `DashboardLayout`, `ExamLayout`)
- Adding new role modules beyond the 4 defined (`system-admin`, `enterprise-admin`, `enterprise-staff`, `candidate`)

### 🚫 Never Do

- Use TypeScript — no `.ts`, `.tsx`, `interface`, `type`, generics, `as const`, `strict: true`
- Store server data in Zustand — use React Query
- Import Axios directly in a component or hook — go through `lib/api/` service modules
- Hardcode API URLs or paths — use `lib/api/` service functions
- Hardcode query keys — use `lib/api/queryKeys.js` factory
- Put business logic in UI components — extract to hooks or utils
- Add **any** of these headers to API requests — they are blocked by CORS:
  - `X-Enterprise-ID`
  - `X-User-ID`
  - `X-Enrollment-Id`
  - `X-Enterprise-Id`
  - `X-Subject-Id`
- Commit `.env` files, API keys, or secrets
- Modify `DESIGN.md` — it is a read-only design system reference
- Use blue-gray tones — the design system uses **warm neutrals** with yellow-brown undertones
- Use box shadows heavier than opacity 0.05 — follow the multi-layer shadow system exactly
- Use `index.css` for component styles — use Tailwind utility classes
- Invent or assume API endpoints — strict adherence to spec files only
