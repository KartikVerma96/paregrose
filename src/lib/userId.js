/**
 * Helper function to convert user ID to integer
 * Handles cases where session.user.id might be a string (from OAuth providers)
 * Validates that the ID is within safe integer range for MySQL INT
 * @param {string|number} userId - User ID from session
 * @returns {number|null} - Integer user ID or null if invalid
 */
export function parseUserId(userId) {
  if (!userId) return null;
  
  let numId;
  
  if (typeof userId === 'number') {
    numId = userId;
  } else if (typeof userId === 'string') {
    // Check if string represents a number that's too large for safe parsing
    // MySQL INT max: 2,147,483,647
    // JavaScript MAX_SAFE_INTEGER: 9,007,199,254,740,991
    // But we want to ensure it fits in MySQL INT
    const MAX_MYSQL_INT = 2147483647;
    
    // If string is too long, it's likely a Google OAuth ID (shouldn't happen if NextAuth is configured correctly)
    if (userId.length > 10) {
      console.warn("User ID string is too long, likely an OAuth provider ID:", userId);
      return null;
    }
    
    numId = parseInt(userId, 10);
    if (isNaN(numId)) {
      return null;
    }
  } else {
    return null;
  }
  
  // Validate it's within MySQL INT range and is a safe integer
  if (numId <= 0 || numId > Number.MAX_SAFE_INTEGER) {
    console.warn("User ID out of safe range:", numId);
    return null;
  }
  
  // Ensure it fits in MySQL INT (though database might use BIGINT)
  // We'll allow up to MAX_SAFE_INTEGER but warn if it exceeds MySQL INT
  if (numId > 2147483647) {
    console.warn("User ID exceeds MySQL INT max, ensure database uses BIGINT:", numId);
  }
  
  return numId;
}

/**
 * Validates and converts user ID, throws error if invalid
 * @param {string|number} userId - User ID from session
 * @returns {number} - Integer user ID
 * @throws {Error} - If user ID is invalid
 */
export function requireUserId(userId) {
  const parsed = parseUserId(userId);
  if (parsed === null) {
    throw new Error('Invalid user ID');
  }
  return parsed;
}
