import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  setToken(token: string): void {
    if (!token) {
      console.error('Attempted to set null/undefined token');
      return;
    }
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    if (!token) {
      console.error('Attempted to set null/undefined refresh token');
      return;
    }
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // Decode JWT token to get payload
  decodeToken(token: string): any {
    if (!token) {
      console.error('Token is null or undefined');
      return null;
    }
    
    try {
      // Split the token into parts
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid token format: token does not have 3 parts');
        return null;
      }
      
      // Decode the payload (second part)
      const payload = parts[1];
      const decodedPayload = atob(payload);
      const parsedPayload = JSON.parse(decodedPayload);
      
      console.log('Decoded token payload:', parsedPayload);
      return parsedPayload;
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  }

  // Get specific claim from token
  getClaimFromToken(token: string, claim: string): any {
    const decoded = this.decodeToken(token);
    if (decoded) {
      return decoded[claim];
    }
    return null;
  }

  isValidJwtToken(token: string): boolean {
    if (!token) {
      console.error('Token is null or undefined');
      return false;
    }
    
    // Check if token has 3 parts (header, payload, signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Token does not have 3 parts, found:', parts.length);
      return false;
    }
    
    // Check if payload is valid base64
    try {
      const payload = JSON.parse(atob(parts[1]));
      console.log('Token payload:', payload);
      console.log('Token expiration:', new Date(payload.exp * 1000));
      return true;
    } catch (e) {
      console.error('Failed to parse token payload:', e);
      return false;
    }
  }

  isTokenExpired(token: string): boolean {
    if (!token) return true;
    
    try {
      const decoded = this.decodeToken(token);
      if (!decoded) return true;
      
      const expiration = decoded.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const isExpired = now >= expiration;
      
      if (isExpired) {
        console.log('Token expired at:', new Date(expiration));
        console.log('Current time:', new Date(now));
      }
      
      return isExpired;
    } catch (e) {
      console.error('Failed to check token expiration:', e);
      return true;
    }
  }

  getUserRoleFromToken(token: string): string | null {
    try {
      const decoded = this.decodeToken(token);
      if (decoded) {
        const role = decoded.role || null;
        console.log('Extracted role from token:', role);
        return role;
      }
      return null;
    } catch (e) {
      console.error('Failed to extract role from token:', e);
      return null;
    }
  }

  getUserEmailFromToken(token: string): string | null {
    try {
      const decoded = this.decodeToken(token);
      if (decoded) {
        return decoded.sub || decoded.username || null;
      }
      return null;
    } catch (e) {
      console.error('Failed to extract email from token:', e);
      return null;
    }
  }

  getUserIdFromToken(token: string): string | null {
    try {
      const decoded = this.decodeToken(token);
      if (decoded) {
        return decoded.userId || decoded.id || null;
      }
      return null;
    } catch (e) {
      console.error('Failed to extract user ID from token:', e);
      return null;
    }
  }

  // Get token expiration time
  getTokenExpiration(token: string): Date | null {
    try {
      const decoded = this.decodeToken(token);
      if (decoded && decoded.exp) {
        return new Date(decoded.exp * 1000);
      }
      return null;
    } catch (e) {
      console.error('Failed to get token expiration:', e);
      return null;
    }
  }

  // Check if token is about to expire (within the next minutes)
  isTokenExpiringSoon(token: string, minutes: number = 5): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) return true;
      
      const expirationTime = decoded.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;
      const minutesUntilExpiry = timeUntilExpiry / (1000 * 60);
      
      return minutesUntilExpiry <= minutes;
    } catch (e) {
      console.error('Failed to check if token is expiring soon:', e);
      return true;
    }
  }

  // Get all claims from token
  getAllClaims(token: string): any {
    return this.decodeToken(token);
  }
}