export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Derive a stable, deterministic userId from an email address.
 * Uses base64 encoding with URL-unsafe characters stripped so the
 * result is safe to use as a RudderStack userId across sessions.
 *
 * Must stay in sync with any server-side userId generation so that
 * identify calls from different surfaces resolve to the same profile.
 */
export function generateUserIdFromEmail(email: string): string {
  return btoa(email.toLowerCase().trim()).replace(/[=+/]/g, '');
}
