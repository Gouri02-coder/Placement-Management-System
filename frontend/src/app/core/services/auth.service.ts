import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

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
    private router: Router,
    private tokenService: TokenService
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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    console.log('=== LOGIN REQUEST ===');
    console.log('URL:', `${this.apiUrl}/auth/login`);
    console.log('Email:', credentials.email);
    
    return this.http.post(`${this.apiUrl}/auth/login`, credentials, { headers }).pipe(
      tap((response: any) => {
        console.log('=== LOGIN RESPONSE ===');
        console.log('Response status:', response?.status);
        console.log('Has token:', !!response?.token);
        console.log('Has user:', !!response?.user);
        
        if (response?.token) {
          console.log('Token preview:', response.token.substring(0, 50) + '...');
          console.log('Token length:', response.token.length);
          console.log('Token parts count:', response.token.split('.').length);
          console.log('Token valid JWT:', this.tokenService.isValidJwtToken(response.token));
        }
        
        if (response?.user) {
          console.log('User role:', response.user.role);
          console.log('User email:', response.user.email);
        }
        
        this.persistAuthSession(response);
      }),
      catchError((error) => {
        console.error('=== LOGIN ERROR ===');
        console.error('Status:', error.status);
        console.error('Status Text:', error.statusText);
        console.error('Message:', error.message);
        console.error('Error:', error);
        if (error.error) {
          console.error('Error body:', error.error);
        }
        return throwError(() => error);
      })
    );
  }

  register(userData: RegisterRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    console.log('=== REGISTER REQUEST ===');
    console.log('URL:', `${this.apiUrl}/auth/register`);
    console.log('Email:', userData.email);
    console.log('Role:', userData.role);

    return this.http.post(`${this.apiUrl}/auth/register`, userData, { headers }).pipe(
      tap((response: any) => {
        console.log('=== REGISTER RESPONSE ===');
        console.log('Response:', response);
      }),
      catchError((error) => {
        console.error('=== REGISTER ERROR ===');
        console.error('Error:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    console.log('=== LOGOUT ===');
    console.log('Clearing all auth data');
    
    this.tokenService.clearTokens();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');

    this.currentUserSubject.next(null);
    this.currentUserValue = null;
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    const token = this.tokenService.getToken();
    if (!token) {
      console.log('isAuthenticated: No token found');
      return false;
    }

    // Check if token is expired
    if (this.tokenService.isTokenExpired(token)) {
      console.log('isAuthenticated: Token expired');
      this.logout();
      return false;
    }

    const isAuth = this.currentUserSubject.value !== null;
    console.log('isAuthenticated:', isAuth);
    return isAuth;
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  getRefreshToken(): string | null {
    return this.tokenService.getRefreshToken();
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      console.error('No refresh token available');
      return throwError(() => new Error('No refresh token available'));
    }

    console.log('=== REFRESH TOKEN ===');
    console.log('Refresh token exists:', !!refreshToken);

    return this.http.post(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap((response: any) => {
        console.log('Refresh token response:', response);
        if (response?.token) {
          this.tokenService.setToken(response.token);
          if (response.refreshToken) {
            this.tokenService.setRefreshToken(response.refreshToken);
          }
          if (response.expiresIn) {
            const expiryTime = new Date().getTime() + response.expiresIn;
            localStorage.setItem('tokenExpiry', expiryTime.toString());
          }
          console.log('Token refreshed successfully');
        }
      }),
      catchError((error) => {
        console.error('Refresh token error:', error);
        return throwError(() => error);
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
      console.log('No user found, redirecting to login');
      this.router.navigate(['/auth/login']);
      return;
    }

    const role = user.role?.toLowerCase();
    console.log('redirectToDashboard - User role:', role);
    
    switch (role) {
      case 'admin':
        console.log('Redirecting to admin dashboard');
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'pto':
        console.log('Redirecting to PTO dashboard');
        this.router.navigate(['/pto/dashboard']);
        break;
      case 'company':
        console.log('Redirecting to company dashboard');
        this.router.navigate(['/company/dashboard']);
        break;
      case 'student':
        console.log('Redirecting to student dashboard');
        this.router.navigate(['/student/dashboard']);
        break;
      default:
        console.log('Unknown role, redirecting to home');
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

  private persistAuthSession(response: any): void {
    console.log('=== PERSIST AUTH SESSION ===');
    
    if (!response) {
      console.error('No response provided');
      return;
    }

    if (!response.status || response.status !== 'success') {
      console.error('Invalid response status:', response.status);
      return;
    }

    if (!response.token) {
      console.error('No token in response');
      console.error('Response keys:', Object.keys(response));
      return;
    }

    if (!response.user) {
      console.error('No user in response');
      return;
    }

    // Validate token format
    if (!this.tokenService.isValidJwtToken(response.token)) {
      console.error('Invalid JWT token format received from server');
      console.error('Token:', response.token);
      console.error('Token parts:', response.token?.split('.').length);
      console.error('Expected: 3 parts, Found:', response.token?.split('.').length);
      return;
    }

    // Store token
    this.tokenService.setToken(response.token);
    console.log('Token stored successfully');
    
    // Store refresh token if exists
    if (response.refreshToken) {
      this.tokenService.setRefreshToken(response.refreshToken);
      console.log('Refresh token stored');
    }

    // Process user data
    let userRole = response.user.role || '';
    userRole = userRole.toLowerCase();
    console.log('User role normalized:', userRole);

    const user: User = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
      role: userRole,
      emailVerified: response.user.emailVerified || false,
      token: response.token
    };

    // Store user data
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.currentUserValue = user;
    console.log('User data stored:', user.email, user.role);

    // Store token expiry if provided
    if (response.expiresIn) {
      const expiryTime = new Date().getTime() + response.expiresIn;
      localStorage.setItem('tokenExpiry', expiryTime.toString());
      console.log('Token expiry set:', new Date(expiryTime));
    }

    console.log('=== AUTH SESSION PERSISTED SUCCESSFULLY ===');
  }
}