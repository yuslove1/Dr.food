// In-memory + localStorage-backed access token store. The refresh token itself
// lives in an httpOnly cookie set by the backend and is never touched here.
const STORAGE_KEY = "drfoods_access_token";

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  if (typeof window === "undefined") return null;
  accessToken = window.localStorage.getItem(STORAGE_KEY);
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
