import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let AuthGuard = class AuthGuard {
    authService;
    router;
    notificationService;
    constructor(authService, router, notificationService) {
        this.authService = authService;
        this.router = router;
        this.notificationService = notificationService;
    }
    canActivate(route, state) {
        if (this.authService.isAuthenticated()) {
            return true;
        }
        this.notificationService.warning('Authentication Required', 'Please log in to access this page.');
        this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: state.url }
        });
        return false;
    }
    canActivateChild(route, state) {
        return this.canActivate(route, state);
    }
};
AuthGuard = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AuthGuard);
export { AuthGuard };
