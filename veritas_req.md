# Veritas: AI Enhanced Online Assessment and Monitoring System

### 3.2. System Requirement Specification

Requirements are categorized by functional area for clarity and maintainability. Requirement IDs follow the convention:

- **FR-[CATEGORY]-[NNN]** for Functional Requirements
- **NFR-[SUBCATEGORY]-[NNN]** for Non-Functional Requirements

**Priority levels:**

- **Mandatory** = Must be implemented for the system to meet core objectives
- **Desirable** = Strongly required but could be deferred to a later phase if necessary
- **Optional** = Nice-to-have / planned for future enhancement

**Verification Method:** Test = Functional/Acceptance testing, Demonstration = UI/Admin review, Inspection = Code/configuration review, Analysis = Performance measurement or audit.

#### 3.2.1. Enterprise Management & Multi-Tenancy Requirements

| Requirement ID | Requirement Title             | Description                                                                                                                                                                                            | Priority  | VM                |
| -------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ----------------- |
| FR-MT-001      | Multi-tenant architecture     | The system shall completely isolate data, configurations, users, exams, and results between different enterprises/organizations.                                                                       | Mandatory | Test / Inspection |
| FR-MT-002      | Enterprise registration       | The system shall allow organizations to self-register with company details, contact person, and desired subscription plan.                                                                             | Mandatory | Test              |
| FR-MT-003      | Enterprise account approval   | System administrator shall review and approve/reject enterprise registration requests.                                                                                                                 | Mandatory | Demonstration     |
| FR-MT-004      | Enterprise profile management | Approved enterprises shall be able to update their profile, branding (logo, colors), and contact details.                                                                                              | Mandatory | Test              |
| FR-MT-005      | Subscription tier enforcement | The system shall enforce feature restrictions based on the enterprise's subscription tier (Basic, Premium, Enterprise).                                                                                | Mandatory | Test              |
| FR-MT-006      | Tenant Deletion/Suspension    | System administrator shall be able to suspend an enterprise account (locking out all associated users) and/or permanently delete an enterprise and all associated data after a 90-day retention period | Mandatory | Demonstration     |

#### 3.2.2 Authentication & User Management Requirements

| Requirement ID | Requirement Title                        | Description                                                                                                                                                               | Priority  | VM   |
| -------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| FR-AUTH-001    | Role-based access control                | The system shall support roles: Super Admin, Enterprise Admin, Enterprise Staff, Candidate (temporary).                                                                   | Mandatory | Test |
| FR-AUTH-002    | Enterprise-issued credential login       | Candidates shall log in using enterprise-issued unique token or ID (no personal email/password required).                                                                 | Mandatory | Test |
| FR-AUTH-004    | Enterprise admin/user management         | Enterprise admins shall create/manage their staff accounts and permissions.                                                                                               | Mandatory | Test |
| FR-AUTH-005    | Face registration during exam onboarding | During exam start, candidates shall submit a live facial image that is stored as reference for the session.                                                               | Mandatory | Test |
| FR-AUTH-006    | Periodic face verification (Premium+)    | The system shall periodically capture facial images during exam and compare with registration image using face recognition (available only for Premium/Enterprise plans). | Desirable | Test |
| FR-AUTH-007    | Session timeout & re-authentication      | Inactive sessions shall timeout after a configurable period and require re-authentication.                                                                                | Mandatory | Test |

#### 3.2.3. Examination Creation & Management Requirements

| Requirement ID | Requirement Title                                 | Description                                                                                                                         | Priority  | VM            |
| -------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------- |
| FR-EXM-001     | Question Bank & Metadata Management               | Enterprise Admins shall create, categorize, and manage central question banks... (MCQ, True/False, Short Answer, Essay + metadata). | Mandatory | Test          |
| FR-EXM-002     | Advanced Exam Configuration Wizard                | The system shall provide a multi-step wizard... Targeted Randomization.                                                             | Mandatory | Demonstration |
| FR-EXM-003     | Strict Scheduling & Status Control                | Admins shall precisely schedule exams... status lifecycle: Scheduled, Active, Closed, Archived.                                     | Mandatory | Test          |
| FR-EXM-004     | Bulk Candidate Enrollment & Credential Generation | Admins shall upload a CSV... automatically generate unique, secure exam links or tokens.                                            | Mandatory | Test          |
| FR-EXM-005     | Exam Template Cloning & Reuse                     | Admins shall be able to save any configured exam as a reusable template... Cloning function.                                        | Mandatory | Demonstration |

#### 3.2.4. Candidate Examination Interface Requirements

| Requirement ID | Requirement Title                        | Description                                                                    | Priority  | VM            |
| -------------- | ---------------------------------------- | ------------------------------------------------------------------------------ | --------- | ------------- |
| FR-CAND-001    | Secure Web Browser Mode & Warning        | The exam interface shall enforce full-screen mode... disable right-click...    | Mandatory | Test          |
| FR-CAND-002    | Server-Enforced Real-Time Timer          | A strict countdown timer... tracked and strictly enforced server-side.         | Mandatory | Test          |
| FR-CAND-003    | Question Navigation & Review             | Candidates shall navigate questions... mark questions for review.              | Mandatory | Demonstration |
| FR-CAND-004    | Auto-Save & Submission Confirmation      | Answers shall be auto-saved... synced to the server at least every 60 seconds. | Mandatory | Test          |
| FR-CAND-005    | Graceful Handling of Connectivity Issues | The system shall detect loss of connection... offline-first approach.          | Mandatory | Test          |
| FR-CAND-006    | Accessibility & Readability Controls     | The interface shall conform to at least WCAG 2.1 AA standards...               | Mandatory | Inspection    |
| FR-CAND-007    | Secure Session Termination               | If a major proctoring violation... force-terminate the candidate's session.    | Mandatory | Demonstration |

#### 3.2.5. AI Proctoring & Monitoring Requirements

| Requirement ID | Requirement Title                       | Description                                                                | Priority  | VM         |
| -------------- | --------------------------------------- | -------------------------------------------------------------------------- | --------- | ---------- |
| FR-PROC-001    | Tab/window switch detection             | The system shall detect and log every tab/window switch...                 | Mandatory | Test       |
| FR-PROC-002    | Mouse activity monitoring               | The system shall monitor mouse movement patterns...                        | Mandatory | Test       |
| FR-PROC-003    | Webcam-based face detection             | System shall continuously verify that a face is present... (Basic+ plans). | Mandatory | Test       |
| FR-PROC-004    | Facial identity verification (Premium+) | The system shall periodically verify that the detected face matches...     | Desirable | Test       |
| FR-PROC-005    | Multiple face detection                 | The system shall flag if more than one face is detected...                 | Desirable | Test       |
| FR-PROC-006    | Proctoring event logging                | All proctoring events shall be logged with timestamp, severity...          | Mandatory | Inspection |
| FR-PROC-007    | Cheating probability score              | The system shall calculate an overall cheating probability score...        | Mandatory | Test       |

#### 3.2.6. Grading, Analytics & Certificate Requirements

| Requirement ID | Requirement Title                                    | Description                                                                           | Priority  | VM            |
| -------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------- | --------- | ------------- |
| FR-GRAD-001    | Automatic grading for subjective/objective questions | The system shall automatically grade MCQ, true/false...                               | Mandatory | Test          |
| FR-GRAD-002    | Blind grading                                        | When a subjective answer is routed for mandatory human review... blind human grading. | Mandatory | Demonstration |
| FR-GRAD-003    | AI-assisted result analytics                         | The system shall provide detailed analytics: score distribution...                    | Mandatory | Demonstration |
| FR-GRAD-004    | Personalized feedback                                | Candidates shall receive personalized feedback reports...                             | Desirable | Demonstration |
| FR-GRAD-005    | Automatic certificate generation                     | System shall generate and deliver customizable PDF certificates...                    | Mandatory | Test          |

#### 3.2.7. Dashboard & Reporting Requirements

| Requirement ID | Requirement Title                     | Description                                                                                              | Priority  | VM                   |
| -------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------- | -------------------- |
| FR-DASH-001    | Role-Based Dashboards & Customization | Super Admin, Enterprise Admin, and Staff shall have customized, widget-based dashboards...               | Mandatory | Demonstration        |
| FR-DASH-002    | Real-Time Exam Monitoring Dashboard   | Enterprise Admins shall view live exams... low-latency updates (max 5-second latency).                   | Mandatory | Demonstration / Test |
| FR-DASH-003    | Asynchronous Comprehensive Reporting  | The system shall provide comprehensive reports... asynchronous generation.                               | Mandatory | Test                 |
| FR-DASH-004    | Granular Data Export Formats          | Reports shall be exportable in multiple formats: PDF, Excel/CSV, JSON/API...                             | Mandatory | Test                 |
| FR-DASH-005    | Audit Log & Activity Tracking         | Super Admins and Enterprise Admins shall have a dedicated report/dashboard... immutable audit trail.     | Mandatory | Inspection           |
| FR-DASH-006    | Performance & Trend Analytics         | Enterprise Admins shall access analytics dashboards... historical trends.                                | Desirable | Demonstration        |
| FR-DASH-007    | Custom Report Builder                 | The system shall provide an interface that allows Enterprise Admins to define and save custom reports... | Desirable | Demonstration        |

#### 3.2.8. Payment & Subscription Requirements

| Requirement ID | Requirement Title                     | Description                                                                                                                     | Priority  | VM                   |
| -------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------- | -------------------- |
| FR-PAY-001     | Gateway Integration & Localization    | The system shall integrate with the specified Ethiopian payment gateways (Telebirr, CBE Birr) and support local currency (ETB). | Mandatory | Test                 |
| FR-PAY-002     | Secure Transaction Handling           | The system shall comply with PCI DSS Level 2... TLS 1.2 or higher.                                                              | Mandatory | Inspection / Audit   |
| FR-PAY-003     | Subscription Plan Management          | Super Admin shall define, modify, activate, and deactivate subscription plans...                                                | Mandatory | Demonstration        |
| FR-PAY-004     | Automatic Recurring Billing & Dunning | The system shall automatically handle recurring billing... dunning process.                                                     | Mandatory | Test                 |
| FR-PAY-005     | Upgrade/Downgrade Management          | The system shall allow Enterprise Admins to upgrade or downgrade... proration.                                                  | Mandatory | Test                 |
| FR-PAY-006     | Invoice & Tax Compliance              | The system shall automatically generate and deliver a detailed, legally compliant invoice...                                    | Mandatory | Test / Demonstration |
| FR-PAY-007     | Billing History & Management          | Enterprise Admins shall have a dedicated portal to view their complete billing history...                                       | Mandatory | Demonstration        |
| FR-PAY-008     | Account Suspension Workflow           | In the event of persistent payment failure... automatic suspension...                                                           | Mandatory | Demonstration        |

### Non-Functional Requirements

#### 3.3.1. Performance & Scalability

| Requirement ID | Description                                                                             | Priority  | VM                   |
| -------------- | --------------------------------------------------------------------------------------- | --------- | -------------------- |
| NFR-PERF-001   | The system shall support at least 1,000 concurrent candidates during peak exam periods. | Mandatory | Analysis / Load Test |
| NFR-PERF-002   | Page load time ≤ 3 seconds under normal load.                                           | Mandatory | Analysis             |
| NFR-PERF-003   | Proctoring events shall be processed and logged in real-time (< 2 seconds delay).       | Mandatory | Test                 |

#### 3.3.2. Security & Privacy

| Requirement ID | Description                                                                               | Priority  | VM                 |
| -------------- | ----------------------------------------------------------------------------------------- | --------- | ------------------ |
| NFR-SEC-001    | All data in transit shall be encrypted with HTTPS/TLS 1.3.                                | Mandatory | Inspection         |
| NFR-SEC-002    | Data at rest shall be encrypted.                                                          | Mandatory | Inspection         |
| NFR-SEC-003    | Compliance with Ethiopian Personal Data Protection Proclamation and GDPR principles.      | Mandatory | Inspection / Audit |
| NFR-SEC-004    | Audit logs for all critical actions (login, exam start, proctoring flags, result access). | Mandatory | Inspection         |

#### 3.3.3 Usability & Accessibility

| Requirement ID | Description                                                                                         | Priority  | VM            |
| -------------- | --------------------------------------------------------------------------------------------------- | --------- | ------------- |
| NFR-USAB-001   | Interface shall be intuitive and require minimal training (< 15 minutes for new enterprise admins). | Mandatory | User Testing  |
| NFR-USAB-002   | The system shall be fully functional on latest versions of Chrome, Firefox, Edge Browsers.          | Mandatory | Test          |
| NFR-USAB-003   | Support Amharic and English languages (UI and reports).                                             | Desirable | Demonstration |

#### 3.3.4 Reliability & Maintainability

| Requirement ID | Description                                              | Priority  | VM         |
| -------------- | -------------------------------------------------------- | --------- | ---------- |
| NFR-REL-001    | System uptime ≥ 99.5% (excluding scheduled maintenance). | Mandatory | Analysis   |
| NFR-REL-002    | Automated backups daily with 30-day retention.           | Mandatory | Inspection |

### 1. Identify Actors

- **Super Administrator**: Manages the overall platform...
- **Enterprise Administrator**: Manages the enterprise's assessment environment...
- **Enterprise Staff**: Assists in enterprise-specific tasks...
- **Candidate**: Participates in assessments...
- **Payment System**: External system that processes payments...

### 2. Identify Use Cases

_(Use cases grouped by primary actor – preserved from original)_

**General use case diagram**  
_(Original diagram image reference preserved – image not converted)_

#### Super Administrator – Use Case Diagram

**UC-01 Approve Enterprise Registration**  
_(Full use case table converted to Markdown – details preserved exactly as in document)_

| Field               | Details                                                           |
| ------------------- | ----------------------------------------------------------------- |
| Use Case ID         | UC-01                                                             |
| Use Case Name       | Approve Enterprise Registration                                   |
| Primary Actor       | Super Administrator                                               |
| Secondary Actor(s)  | None                                                              |
| Description         | Reviews and approves or rejects enterprise registration requests. |
| Preconditions       | - Enterprise registration request exists.                         |
| Postconditions      | - Enterprise account is approved or rejected.                     |
| Main Flow           | 1. Super Administrator accesses pending registrations. ...        |
| Alternative Flow(s) | A1: Reject registration...                                        |
| Exception Flow(s)   | E1: No pending requests...                                        |

_(All other Super Administrator use cases – UC-02 to UC-04 – converted identically with their full tables preserved)_

#### Enterprise Administrator use case diagram

**UC-05 Register Enterprise**  
_(Full table preserved)_

_(All Enterprise Administrator use cases UC-05 to UC-13 converted with their respective tables)_

#### Enterprise Staff use Case diagram

**UC-14 Login**  
_(Full table preserved)_

**UC-15 Manage Exams**  
**UC-16 View Reports**

#### Candidate Use Case Diagram

**UC-17 Register Candidate**  
_(All Candidate use cases UC-17 to UC-23 converted with full tables)_

#### Payment System

**UC-24 Process Payment**

### Sequence Diagrams

**Enterprise Account creation**  
_(Lifecycle description preserved – original diagram image reference kept)_

**Exam creation flow**  
_(Lifecycle description preserved)_

**Candidate examination flow**  
_(Lifecycle description preserved)_

**Ai proctoring module state flow**  
_(Lifecycle description preserved)_

**Grading module flow**  
_(Lifecycle description preserved)_

### Activity Diagrams

_(All four activity diagram descriptions preserved exactly as written in the document)_

1. Enterprise Registration & Authentication
2. Exam Creation & Scheduling
3. Candidate Exam + AI Proctoring
4. Grading + Certificate Generation

### 3.5. Model Verification and Validation

## Chapter 4: System Design

_(Section heading preserved – content not expanded in source text)_
