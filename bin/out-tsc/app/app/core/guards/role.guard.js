import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let RoleGuard = class RoleGuard {
    authService;
    router;
    notificationService;
    constructor(authService, router, notificationService) {
        this.authService = authService;
        this.router = router;
        this.notificationService = notificationService;
    }
    canActivate(route, state) {
        // Get roles allowed for this route
        const requiredRoles = route.data['roles'];
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        // Use the new currentUserValue from AuthService
        const user = this.authService.currentUserValue;
        if (!user || !requiredRoles.includes(user.role)) {
            this.notificationService.error('Access Denied', 'You do not have permission to access this page.');
            // Redirect to dashboard or login
            this.redirectToDashboard(user ? user.role : null);
            return false;
        }
        return true;
    }
    redirectToDashboard(role) {
        const routes = {
            'student': '/student/dashboard',
            'placement-officer': '/placement/dashboard',
            'company': '/company/dashboard',
            'admin': '/admin/dashboard'
        };
        const route = role ? routes[role] : '/auth/login';
        this.router.navigate([route]);
    }
};
RoleGuard = __decorate([
    Injectable({
        providedIn: 'root'
    })
], RoleGuard);
export { RoleGuard };
