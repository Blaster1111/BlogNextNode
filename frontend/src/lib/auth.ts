import {jwtDecode} from 'jwt-decode';

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function decodeToken(token: string) {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    if (Date.now() >= exp * 1000) {
      return true;
    }
    return false;
  } catch {
    return true;
  }
}
