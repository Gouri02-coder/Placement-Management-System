import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
let LoginComponent = class LoginComponent {
    fb;
    authService;
    router;
    isLoading = false;
    loginForm;
    constructor(fb, authService, router) {
        this.fb = fb;
        this.authService = authService;
        this.router = router;
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }
    onLogin() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            const { email, password } = this.loginForm.value;
            const loginRequest = { email, password };
            this.authService.login(loginRequest).subscribe({
                next: (response) => {
                    this.isLoading = false;
                    if (response.user) {
                        // The role is automatically detected and user is redirected to appropriate dashboard
                        console.log('Login successful, user role:', response.user.role);
                        this.authService.redirectToDashboard();
                    }
                },
                error: (error) => {
                    console.error('Login error:', error);
                    alert(error.message || 'Login failed! Please check your credentials.');
                    this.isLoading = false;
                }
            });
        }
    }
    goToRegister() {
        this.router.navigate(['/auth/register']);
    }
};
LoginComponent = __decorate([
    Component({
        selector: 'app-login',
        imports: [ReactiveFormsModule, CommonModule],
        templateUrl: './login.component.html',
        styleUrls: ['./login.component.css']
    })
], LoginComponent);
export { LoginComponent };
