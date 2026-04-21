/**
 * Normalizes API error responses into a consistent message string.
 *
 * Auth service returns: { code, message, requestId }
 * All other services return: { error }
 *
 * @param {unknown} error - The caught error (typically an AxiosError)
 * @param {string} [fallback="An unexpected error occurred"] - Default message
 * @returns {string}
 */
export function normalizeError(error, fallback = "An unexpected error occurred") {
  if (!error) return fallback;

  const data = error?.response?.data;
  if (!data) {
    return error?.message ?? fallback;
  }

  // Auth service envelope: { code, message, requestId }
  if (typeof data.message === "string") return data.message;

  // All other services: { error }
  if (typeof data.error === "string") return data.error;

  return fallback;
}
