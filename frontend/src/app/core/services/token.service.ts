import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenKey = 'token';
  private refreshTokenKey = 'refreshToken';

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    console.log('TokenService.getToken() - Token from localStorage:', !!token);
    if (token) {
      console.log('Token preview:', token.substring(0, 30) + '...');
      console.log('Token length:', token.length);
      console.log('Token parts count:', token.split('.').length);
    }
    return token;
  }

  setToken(token: string): void {
    console.log('TokenService.setToken() called');
    console.log('Token to store preview:', token.substring(0, 30) + '...');
    console.log('Token parts count:', token.split('.').length);
    
    if (token && this.isValidJwtToken(token)) {
      localStorage.setItem(this.tokenKey, token);
      console.log('Token stored successfully');
    } else {
      console.error('Attempted to store invalid JWT token');
      console.error('Token value:', token);
      console.error('Token parts:', token?.split('.').length);
    }
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  clearTokens(): void {
    console.log('Clearing tokens');
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  isValidJwtToken(token: string): boolean {
    if (!token) return false;
    const parts = token.split('.');
    const isValid = parts.length === 3;
    if (!isValid) {
      console.error('Invalid JWT token format. Parts count:', parts.length);
    }
    return isValid;
  }

  decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Cannot decode invalid token');
        return null;
      }
      const payload = parts[1];
      let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      switch (base64.length % 4) {
        case 0: break;
        case 2: base64 += '=='; break;
        case 3: base64 += '='; break;
      }
      return JSON.parse(atob(base64));
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    const expirationDate = new Date(decoded.exp * 1000);
    return expirationDate < new Date();
  }
}