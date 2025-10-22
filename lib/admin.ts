/**
 * Admin utility functions
 */

/**
 * Check if an email is an admin email
 * Admin emails are configured via ADMIN_EMAILS environment variable
 * Format: comma-separated list (e.g., "admin1@example.com,admin2@example.com")
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
  return adminEmails.includes(email)
}

/**
 * Get list of admin emails
 */
export function getAdminEmails(): string[] {
  return process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
}
