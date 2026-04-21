/**
 * @fileoverview Type-safe wrappers for import.meta.env values.
 * All env vars must be prefixed with VITE_ to be exposed to the browser.
 */

export const env = Object.freeze({
  /** Base URL for the API gateway (e.g. http://localhost:8080) */
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? "",

  /** Current environment */
  MODE: import.meta.env.MODE,

  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
});
