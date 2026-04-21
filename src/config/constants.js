/**
 * @fileoverview Application-wide constants.
 * Use these instead of raw string literals anywhere in the codebase.
 */

/** @type {{ SYSTEM_ADMIN: string, ENTERPRISE_ADMIN: string, ENTERPRISE_STAFF: string, ENTERPRISE_AUTO: string }} */
export const USER_ROLES = Object.freeze({
  SYSTEM_ADMIN: "SystemAdmin",
  ENTERPRISE_ADMIN: "EnterpriseAdmin",
  ENTERPRISE_STAFF: "EnterpriseStaff",
  ENTERPRISE_AUTO: "EnterpriseAuto",
});

/** @type {{ DRAFT: string, SCHEDULED: string, ACTIVE: string, CLOSED: string, ARCHIVED: string }} */
export const EXAM_STATUS = Object.freeze({
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  ACTIVE: "Active",
  CLOSED: "Closed",
  ARCHIVED: "Archived",
});

/** @type {{ MCQ: string, TRUE_FALSE: string, SHORT_ANSWER: string, ESSAY: string }} */
export const QUESTION_TYPES = Object.freeze({
  MCQ: "MCQ",
  TRUE_FALSE: "TrueFalse",
  SHORT_ANSWER: "ShortAnswer",
  ESSAY: "Essay",
});

/** @type {{ EASY: string, MEDIUM: string, HARD: string }} */
export const DIFFICULTY = Object.freeze({
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
});

/** @type {{ TRIAL: string, ACTIVE: string, PAST_DUE: string, CANCELLED: string, EXPIRED: string }} */
export const SUBSCRIPTION_STATUS = Object.freeze({
  TRIAL: "Trial",
  ACTIVE: "Active",
  PAST_DUE: "PastDue",
  CANCELLED: "Cancelled",
  EXPIRED: "Expired",
});

/** @type {{ PENDING_APPROVAL: string, ACTIVE: string, SUSPENDED: string, DELETED: string }} */
export const ENTERPRISE_STATUS = Object.freeze({
  PENDING_APPROVAL: "PendingApproval",
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
  DELETED: "Deleted",
});

/** @type {{ ACTIVE: string, SUBMITTED: string, EXPIRED: string, TERMINATED: string }} */
export const SESSION_STATUS = Object.freeze({
  ACTIVE: "Active",
  SUBMITTED: "Submitted",
  EXPIRED: "Expired",
  TERMINATED: "Terminated",
});

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 1000;
export const CSV_MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
