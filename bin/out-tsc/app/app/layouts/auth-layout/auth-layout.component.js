import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';
let AuthLayoutComponent = class AuthLayoutComponent {
    authService;
    router;
    currentYear = new Date().getFullYear();
    backgroundClass = 'default-bg';
    constructor(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    ngOnInit() {
        // Redirect to dashboard if already authenticated
        if (this.authService.isAuthenticated()) {
            this.redirectToDashboard();
        }
        // Update background based on current route
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event) => {
            this.updateBackgroundClass(event.urlAfterRedirects);
        });
        // Initial background setup
        this.updateBackgroundClass(this.router.url);
    }
    updateBackgroundClass(url) {
        if (url.includes('/login')) {
            this.backgroundClass = 'login-bg';
        }
        else if (url.includes('/register')) {
            this.backgroundClass = 'register-bg';
        }
        else if (url.includes('/forgot-password')) {
            this.backgroundClass = 'forgot-password-bg';
        }
        else {
            this.backgroundClass = 'default-bg';
        }
    }
    redirectToDashboard() {
        this.authService.currentUser
            .pipe(take(1))
            .subscribe(user => {
            if (!user)
                return;
            switch (user.role) {
                case 'student':
                    this.router.navigate(['/student/dashboard']);
                    break;
                case 'company':
                    this.router.navigate(['/company/dashboard']);
                    break;
                case 'placement-officer':
                    this.router.navigate(['/placement/dashboard']);
                    break;
                case 'admin':
                    this.router.navigate(['/admin/dashboard']);
                    break;
                default:
                    this.router.navigate(['/']);
            }
        });
    }
    getCurrentPageTitle() {
        if (this.router.url.includes('/login')) {
            return 'Sign In to Your Account';
        }
        else if (this.router.url.includes('/register')) {
            return 'Create Your Account';
        }
        else if (this.router.url.includes('/forgot-password')) {
            return 'Reset Your Password';
        }
        else {
            return 'Placement Management System';
        }
    }
    getCurrentPageDescription() {
        if (this.router.url.includes('/login')) {
            return 'Welcome back! Please sign in to continue.';
        }
        else if (this.router.url.includes('/register')) {
            return 'Join our platform to connect with amazing opportunities.';
        }
        else if (this.router.url.includes('/forgot-password')) {
            return 'Enter your email to reset your password.';
        }
        else {
            return 'Connecting talent with opportunities';
        }
    }
};
AuthLayoutComponent = __decorate([
    Component({
        selector: 'app-auth-layout',
        standalone: true,
        imports: [CommonModule, RouterModule],
        templateUrl: './auth-layout.component.html',
        styleUrls: ['./auth-layout.component.css']
    })
], AuthLayoutComponent);
export { AuthLayoutComponent };
