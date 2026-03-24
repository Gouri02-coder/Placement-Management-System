import { __decorate } from "tslib";
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
let AuthService = class AuthService {
    currentUserSubject;
    currentUser;
    tokenExpirationTimer;
    router = inject(Router);
    http = inject(HttpClient);
    apiUrl = 'http://localhost:8080/api/auth';
    constructor() {
        this.currentUserSubject = new BehaviorSubject(this.getUserFromStorage());
        this.currentUser = this.currentUserSubject.asObservable();
        this.autoLogin();
    }
    /** Detect role based on email domain */
    detectRoleFromEmail(email) {
        const emailLower = email.toLowerCase();
        if (emailLower.endsWith('.edu.in')) {
            return 'student';
        }
        else if (emailLower.endsWith('.ac.in')) {
            return 'admin';
        }
        else if (emailLower.endsWith('@company.com')) {
            return 'company';
        }
        return null;
    }
    /** LOGIN - Connect to Backend API */
    /** LOGIN - Connect to Backend API */
    login(loginData) {
        return this.http.post(`${this.apiUrl}/login`, loginData).pipe(tap(response => {
            console.log('Login API Response:', response);
            this.handleAuthentication(response.user, response.token, response.refreshToken, response.expiresIn);
            // FIX: Use the response user directly instead of currentUserValue
            this.redirectToDashboardWithUser(response.user);
        }), catchError(error => {
            console.error('Login error:', error);
            return throwError(() => ({
                error: error.error?.error || 'LOGIN_FAILED',
                message: error.error?.message || 'Invalid email or password'
            }));
        }));
    }
    /** ADD THIS NEW METHOD: */
    redirectToDashboardWithUser(user) {
        console.log('Redirecting with user from response:', user);
        if (!user) {
            this.router.navigate(['/auth/login']);
            return;
        }
        const routes = {
            'student': '/student/dashboard',
            'admin': '/admin/dashboard',
            'company': '/company/dashboard',
            'placement-officer': '/placement/dashboard'
        };
        const targetRoute = routes[user.role];
        console.log(`Navigating to: ${targetRoute}`);
        this.router.navigate([targetRoute]);
    }
    /** REGISTER - Connect to Backend API */
    register(data) {
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
        return this.http.post(`${this.apiUrl}/register`, data).pipe(catchError(error => {
            console.error('Registration error:', error);
            return throwError(() => ({
                error: error.error?.error || 'REGISTRATION_FAILED',
                message: error.error?.message || 'Registration failed. Please try again.'
            }));
        }));
    }
    /** HANDLE AUTHENTICATION */
    handleAuthentication(user, token, refreshToken, expiresIn) {
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
    logout() {
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
    autoLogin() {
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
    autoLogout(expirationDuration) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
            console.log('Session expired due to inactivity');
        }, expirationDuration);
    }
    refreshToken() {
        const refreshToken = this.getStorageItem('refreshToken');
        if (!refreshToken) {
            this.logout();
            return throwError(() => new Error('No refresh token available'));
        }
        // You can implement backend refresh token call here if needed
        return throwError(() => new Error('Refresh token not implemented'));
    }
    // AUTH CHECKS
    get currentUserValue() {
        return this.currentUserSubject.value;
    }
    isAuthenticated() {
        const token = this.getStorageItem('authToken');
        const expiration = this.getStorageItem('tokenExpiration');
        return !!token && !!expiration && new Date(expiration) > new Date();
    }
    hasRole(role) {
        return this.currentUserValue?.role === role;
    }
    hasAnyRole(roles) {
        return roles.some(r => this.currentUserValue?.role === r);
    }
    // STORAGE UTILS
    setStorageItem(key, value) {
        try {
            localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        }
        catch (err) {
            console.error('Storage error:', err);
        }
    }
    getStorageItem(key) {
        try {
            return localStorage.getItem(key);
        }
        catch {
            return null;
        }
    }
    removeStorageItem(key) {
        try {
            localStorage.removeItem(key);
        }
        catch (err) {
            console.error('Storage removal error:', err);
        }
    }
    getUserFromStorage() {
        try {
            const userData = this.getStorageItem('currentUser');
            return userData ? JSON.parse(userData) : null;
        }
        catch (err) {
            console.error('Error parsing user data:', err);
            return null;
        }
    }
    /** REDIRECT TO DASHBOARD BASED ON ROLE */
    redirectToDashboard() {
        const user = this.currentUserValue;
        console.log('redirectToDashboard called - Current user:', user);
        if (!user) {
            console.log('No user found, redirecting to login');
            this.router.navigate(['/auth/login']);
            return;
        }
        const routes = {
            'student': '/student/dashboard',
            'admin': '/admin/dashboard',
            'company': '/company/dashboard',
            'placement-officer': '/placement/dashboard'
        };
        const targetRoute = routes[user.role];
        console.log(`Redirecting ${user.role} to: ${targetRoute}`);
        this.router.navigate([targetRoute]).then(success => {
            if (success) {
                console.log('Navigation successful');
            }
            else {
                console.error('Navigation failed - route might not exist');
                // Fallback: redirect to home
                this.router.navigate(['/']);
            }
        });
    }
    // Helper method to check if routes exist (for debugging)
    debugRoutes() {
        const user = this.currentUserValue;
        if (user) {
            const routes = {
                'student': '/student/dashboard',
                'admin': '/admin/dashboard',
                'company': '/company/dashboard',
                'placement-officer': '/placement/dashboard'
            };
            console.log('Available routes for debugging:', routes);
        }
    }
};
AuthService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AuthService);
export { AuthService };
