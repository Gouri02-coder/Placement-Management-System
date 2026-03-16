import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
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
  // Student fields
  department?: string;
  course?: string;
  year?: number;
  cgpa?: number;
  parentEmail?: string;
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
  private apiUrl = 'http://localhost:8080/api';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  
  // For compatibility with existing code
  public currentUserValue: User | null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Initialize from localStorage
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentUserValue = this.currentUserSubject.value;
    
    // Subscribe to update currentUserValue whenever subject changes
    this.currentUser.subscribe(user => {
      this.currentUserValue = user;
    });
  }

  /**
   * Get the current user value (synchronous)
   */
  public get currentUserValueGetter(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Login method
   */
  login(credentials: LoginRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post(`${this.apiUrl}/auth/login`, credentials, { headers }).pipe(
      tap((response: any) => {
        console.log('Login response:', response);
        if (response && response.status === 'success' && response.token) {
          // Store token
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          
          // Get the role from backend (comes as "PTO", "STUDENT", "COMPANY", "ADMIN")
          let userRole = response.user.role || '';
          
          // IMPORTANT: Map backend role to frontend expected role based on your folder structure
          // Your PTO module is at path '/placement' and uses role 'pto' in routes
          if (userRole.toUpperCase() === 'PTO') {
            userRole = 'pto';  // Match what your pto.route.ts expects
          } else {
            userRole = userRole.toLowerCase(); // Convert others to lowercase
          }
          
          console.log('Mapped user role:', userRole);
          
          // Create user object
          const user: User = {
            id: response.user.id,
            email: response.user.email,
            name: response.user.name,
            role: userRole,  // Now 'pto' for PTO users
            emailVerified: response.user.emailVerified || false,
            token: response.token
          };
          
          // Store user
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('user', JSON.stringify(user)); // For compatibility
          
          // Update BehaviorSubject
          this.currentUserSubject.next(user);
          this.currentUserValue = user;
          
          // Set token expiry
          if (response.expiresIn) {
            const expiryTime = new Date().getTime() + response.expiresIn;
            localStorage.setItem('tokenExpiry', expiryTime.toString());
          }
        }
      })
    );
  }

  /**
   * Register method
   */
  register(userData: RegisterRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post(`${this.apiUrl}/auth/register`, userData, { headers });
  }

  /**
   * Logout method
   */
  logout(): void {
    // Remove all stored data
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    
    // Update BehaviorSubject
    this.currentUserSubject.next(null);
    this.currentUserValue = null;
    
    // Navigate to login
    this.router.navigate(['/auth/login']);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired
    const expiry = localStorage.getItem('tokenExpiry');
    if (expiry) {
      return new Date().getTime() < parseInt(expiry);
    }
    
    return true;
  }

  /**
   * Get token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Refresh token method
   */
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    
    return this.http.post(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap((response: any) => {
        if (response && response.token) {
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

  /**
   * Get user from localStorage (compatibility method)
   */
  getUser(): any {
    const userStr = localStorage.getItem('currentUser') || localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  }

  /**
   * Get user role
   */
  getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  /**
   * Redirect to dashboard based on role - MATCHING YOUR FOLDER STRUCTURE
   */
  redirectToDashboard(): void {
    const user = this.getUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const role = user.role?.toLowerCase();
    console.log('Redirecting based on role:', role);
    
    // Match your folder structure exactly
    switch(role) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'pto':  // Your PTO module uses 'pto' role and '/placement' path
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

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole?.toLowerCase() === role.toLowerCase();
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  /**
   * Check if user is student
   */
  isStudent(): boolean {
    return this.hasRole('student');
  }

  /**
   * Check if user is company
   */
  isCompany(): boolean {
    return this.hasRole('company');
  }

  /**
   * Check if user is PTO
   */
  isPTO(): boolean {
    return this.hasRole('pto');  // Now checking for 'pto' not 'placement-officer'
  }
}