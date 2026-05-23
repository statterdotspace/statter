export const extractUsernameFromEmail = (email: string) => email.split('@')[0]?.trim();
