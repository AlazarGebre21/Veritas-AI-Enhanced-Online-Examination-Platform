/**
 * Format a date string or Date object into a localized display string.
 * @param {string|Date|null|undefined} value
 * @param {Intl.DateTimeFormatOptions} [options]
 * @returns {string}
 */
export function formatDate(value, options = { dateStyle: "medium" }) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("en-ET", options).format(new Date(value));
  } catch {
    return String(value);
  }
}

/**
 * Format a date-time string.
 * @param {string|Date|null|undefined} value
 * @returns {string}
 */
export function formatDateTime(value) {
  return formatDate(value, { dateStyle: "medium", timeStyle: "short" });
}

/**
 * Format seconds into mm:ss string.
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatDuration(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
