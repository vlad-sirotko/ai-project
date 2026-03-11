export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  role: string;
  preferredTargetLanguage: string | null;
}
