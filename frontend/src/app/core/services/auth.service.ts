import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  emailVerified: boolean;
  token?: string;
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
  role: string;
  department?: string;
  course?: string;
  year?: number;
  cgpa?: number;
  parentEmail?: string;
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
  private apiUrl = 'http://localhost:8080/api';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  public currentUserValue: User | null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentUserValue = this.currentUserSubject.value;

    this.currentUser.subscribe((user) => {
      this.currentUserValue = user;
    });
  }

  public get currentUserValueGetter(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<any> {
    const demoResponse = this.getDemoLoginResponse(credentials);
    if (demoResponse) {
      this.persistAuthSession(demoResponse);
      return of(demoResponse);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/auth/login`, credentials, { headers }).pipe(
      tap((response: any) => {
        this.persistAuthSession(response);
      }),
      catchError((error) => {
        if (this.isDemoAdminCredentials(credentials)) {
          const fallbackDemoResponse = this.getDemoLoginResponse(credentials);
          if (fallbackDemoResponse) {
            this.persistAuthSession(fallbackDemoResponse);
            return of(fallbackDemoResponse);
          }
        }

        return throwError(() => error);
      })
    );
  }

  register(userData: RegisterRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/auth/register`, userData, { headers });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');

    this.currentUserSubject.next(null);
    this.currentUserValue = null;
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    if (this.currentUserSubject.value && this.getToken()) {
      return true;
    }

    const token = this.getToken();
    if (!token) {
      return false;
    }

    const expiry = localStorage.getItem('tokenExpiry');
    if (expiry) {
      return new Date().getTime() < parseInt(expiry, 10);
    }

    return true;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap((response: any) => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
          if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
          }
          if (response.expiresIn) {
            const expiryTime = new Date().getTime() + response.expiresIn;
            localStorage.setItem('tokenExpiry', expiryTime.toString());
          }
        }
      })
    );
  }

  getUser(): any {
    const userStr = localStorage.getItem('currentUser') || localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  redirectToDashboard(): void {
    const user = this.getUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const role = user.role?.toLowerCase();
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'pto':
        this.router.navigate(['/placement']);
        break;
      case 'company':
        this.router.navigate(['/company']);
        break;
      case 'student':
        this.router.navigate(['/student']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole?.toLowerCase() === role.toLowerCase();
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isStudent(): boolean {
    return this.hasRole('student');
  }

  isCompany(): boolean {
    return this.hasRole('company');
  }

  isPTO(): boolean {
    return this.hasRole('pto');
  }

  private getDemoLoginResponse(credentials: LoginRequest): any | null {
    if (!this.isDemoAdminCredentials(credentials)) {
      return null;
    }

    return {
      status: 'success',
      message: 'Demo admin login successful.',
      token: 'demo-admin-token',
      refreshToken: 'demo-admin-refresh-token',
      expiresIn: 24 * 60 * 60 * 1000,
      user: {
        id: 'demo-admin',
        email: 'admin@campus.ac.in',
        name: 'Demo Admin',
        role: 'ADMIN',
        emailVerified: true
      }
    };
  }

  private isDemoAdminCredentials(credentials: LoginRequest): boolean {
    return (
      credentials.email?.trim().toLowerCase() === 'admin@campus.ac.in' &&
      credentials.password === 'Admin@123'
    );
  }

  private persistAuthSession(response: any): void {
    if (!(response && response.status === 'success' && response.token && response.user)) {
      return;
    }

    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken ?? '');

    let userRole = response.user.role || '';
    if (userRole.toUpperCase() === 'PTO') {
      userRole = 'pto';
    } else {
      userRole = userRole.toLowerCase();
    }

    const user: User = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
      role: userRole,
      emailVerified: response.user.emailVerified || false,
      token: response.token
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.currentUserValue = user;

    if (response.expiresIn) {
      const expiryTime = new Date().getTime() + response.expiresIn;
      localStorage.setItem('tokenExpiry', expiryTime.toString());
    }
  }
}
