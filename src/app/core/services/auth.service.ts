import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin' | 'company';
  avatar?: string;
  isEmailVerified?: boolean;
  createdAt?: Date;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'student' | 'company';
  // Student fields
  department?: string;
  course?: string;
  year?: number;
  cgpa?: number;
  // Company fields
  companyName?: string;
  industry?: string;
  website?: string;
  companySize?: string;
  address?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenExpirationTimer: any;
  private router = inject(Router);
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
    this.autoLogin();
  }

  /** Detect role based on email domain */
  private detectRoleFromEmail(email: string): 'student' | 'admin' | 'company' | null {
    const emailLower = email.toLowerCase();
    
    if (emailLower.endsWith('.edu.in')) {
      return 'student';
    } else if (emailLower.endsWith('.ac.in')) {
      return 'admin';
    } else if (emailLower.endsWith('@company.com')) { 
      return 'company';
    }
    
    return null;
  }

  /** LOGIN - Connect to Backend API */
  /** LOGIN - Connect to Backend API */
login(loginData: LoginRequest): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData).pipe(
    tap(response => {
      console.log('Login API Response:', response);
      this.handleAuthentication(
        response.user,
        response.token,
        response.refreshToken,
        response.expiresIn
      );
      // FIX: Use the response user directly instead of currentUserValue
      this.redirectToDashboardWithUser(response.user);
    }),
    catchError(error => {
      console.error('Login error:', error);
      return throwError(() => ({
        error: error.error?.error || 'LOGIN_FAILED',
        message: error.error?.message || 'Invalid email or password'
      }));
    })
  );
}

/** ADD THIS NEW METHOD: */
private redirectToDashboardWithUser(user: User): void {
  console.log('Redirecting with user from response:', user);
  
  if (!user) { 
    this.router.navigate(['/auth/login']); 
    return; 
  }
  
  const routes: Record<User['role'], string> = {
    'student': '/student/dashboard',
    'admin': '/admin/dashboard',
    'company': '/company/dashboard'
  };
  
  const targetRoute = routes[user.role];
  console.log(`Navigating to: ${targetRoute}`);
  
  this.router.navigate([targetRoute]);
}


  /** REGISTER - Connect to Backend API */
  register(data: RegisterRequest): Observable<{ message: string }> {
    // Validate email domain for registration
    const detectedRole = this.detectRoleFromEmail(data.email);
    
    if (!detectedRole) {
      return throwError(() => ({
        error: 'INVALID_EMAIL_DOMAIN',
        message: 'Please use a valid educational or company email address.'
      }));
    }

    // Ensure the detected role matches the requested role
    if (detectedRole !== data.role) {
      return throwError(() => ({
        error: 'ROLE_MISMATCH',
        message: 'Email domain does not match the selected role.'
      }));
    }

    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, data).pipe(
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => ({
          error: error.error?.error || 'REGISTRATION_FAILED',
          message: error.error?.message || 'Registration failed. Please try again.'
        }));
      })
    );
  }

  /** HANDLE AUTHENTICATION */
  private handleAuthentication(user: User, token: string, refreshToken: string, expiresIn: number): void {
    console.log('Handling authentication for user:', user);
    
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

    this.setStorageItem('currentUser', user);
    this.setStorageItem('authToken', token);
    this.setStorageItem('refreshToken', refreshToken);
    this.setStorageItem('tokenExpiration', expirationDate.toISOString());

    this.currentUserSubject.next(user);
    this.autoLogout(expiresIn * 1000);
    
    // Debug: Verify storage
    console.log('User stored in localStorage:', this.getUserFromStorage());
    console.log('Token stored:', !!this.getStorageItem('authToken'));
  }

  logout(): void {
    console.log('Logging out user');
    
    this.removeStorageItem('currentUser');
    this.removeStorageItem('authToken');
    this.removeStorageItem('refreshToken');
    this.removeStorageItem('tokenExpiration');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }

    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  autoLogin(): void {
    const userData = this.getUserFromStorage();
    const token = this.getStorageItem('authToken');
    const expirationDate = this.getStorageItem('tokenExpiration');

    if (!userData || !token || !expirationDate) {
      console.log('AutoLogin: No user data found');
      return;
    }

    const expiration = new Date(expirationDate);
    if (expiration <= new Date()) {
      console.log('AutoLogin: Token expired');
      this.logout();
      return;
    }

    const expiresIn = expiration.getTime() - new Date().getTime();
    this.autoLogout(expiresIn);
    this.currentUserSubject.next(userData);
    console.log('AutoLogin: User restored', userData);
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      console.log('Session expired due to inactivity');
    }, expirationDuration);
  }

  refreshToken(): Observable<string> {
    const refreshToken = this.getStorageItem('refreshToken');
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }
    
    // You can implement backend refresh token call here if needed
    return throwError(() => new Error('Refresh token not implemented'));
  }

  // AUTH CHECKS
  get currentUserValue(): User | null { 
    return this.currentUserSubject.value; 
  }
  
  isAuthenticated(): boolean { 
    const token = this.getStorageItem('authToken');
    const expiration = this.getStorageItem('tokenExpiration');
    return !!token && !!expiration && new Date(expiration) > new Date();
  }
  
  hasRole(role: User['role']): boolean { 
    return this.currentUserValue?.role === role; 
  }
  
  hasAnyRole(roles: User['role'][]): boolean { 
    return roles.some(r => this.currentUserValue?.role === r); 
  }

  // STORAGE UTILS
  private setStorageItem(key: string, value: any): void {
    try { 
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value)); 
    } catch (err) { 
      console.error('Storage error:', err); 
    }
  }
  
  private getStorageItem(key: string): string | null { 
    try { 
      return localStorage.getItem(key); 
    } catch { 
      return null; 
    }
  }
  
  private removeStorageItem(key: string): void { 
    try { 
      localStorage.removeItem(key); 
    } catch (err) {
      console.error('Storage removal error:', err);
    } 
  }
  
  private getUserFromStorage(): User | null {
    try {
      const userData = this.getStorageItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch (err) { 
      console.error('Error parsing user data:', err);
      return null; 
    }
  }

  /** REDIRECT TO DASHBOARD BASED ON ROLE */
  redirectToDashboard(): void {
    const user = this.currentUserValue;
    console.log('redirectToDashboard called - Current user:', user);
    
    if (!user) { 
      console.log('No user found, redirecting to login');
      this.router.navigate(['/auth/login']); 
      return; 
    }
    
    const routes: Record<User['role'], string> = {
      'student': '/student/dashboard',
      'admin': '/admin/dashboard',
      'company': '/company/dashboard'
    };
    
    const targetRoute = routes[user.role];
    console.log(`Redirecting ${user.role} to: ${targetRoute}`);
    
    this.router.navigate([targetRoute]).then(success => {
      if (success) {
        console.log('Navigation successful');
      } else {
        console.error('Navigation failed - route might not exist');
        // Fallback: redirect to home
        this.router.navigate(['/']);
      }
    });
  }

  // Helper method to check if routes exist (for debugging)
  debugRoutes(): void {
    const user = this.currentUserValue;
    if (user) {
      const routes: Record<User['role'], string> = {
        'student': '/student/dashboard',
        'admin': '/admin/dashboard',
        'company': '/company/dashboard'
      };
      console.log('Available routes for debugging:', routes);
    }
  }
}