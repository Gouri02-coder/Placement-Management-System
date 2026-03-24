import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let AdminGuard = class AdminGuard {
    authService;
    router;
    constructor(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    canActivate() {
        const user = this.authService.currentUserValue;
        if (user?.role === 'admin') {
            return true;
        }
        this.router.navigate(['/auth/login']);
        return false;
    }
};
AdminGuard = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AdminGuard);
export { AdminGuard };
