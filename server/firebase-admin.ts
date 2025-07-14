// Simple client-side authentication for development
// In production, you would use Firebase Admin SDK to verify tokens
export async function verifyFirebaseToken(token: string) {
  try {
    // For development, we'll extract basic info from the token
    // In production, use Firebase Admin SDK to verify the token
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    // For development, we'll trust the client and extract basic info
    const payload = JSON.parse(atob(parts[1]));
    return { 
      uid: payload.user_id || payload.sub || 'dev-user', 
      email: payload.email || 'dev@example.com' 
    };
  } catch (error) {
    throw new Error('Invalid authentication token');
  }
}