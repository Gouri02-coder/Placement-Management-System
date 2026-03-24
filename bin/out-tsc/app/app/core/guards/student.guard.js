import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let StudentGuard = class StudentGuard {
    authService;
    router;
    constructor(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    canActivate() {
        const user = this.authService.currentUserValue; // ✅ use the getter
        if (user?.role === 'student') {
            return true;
        }
        this.router.navigate(['/auth/login']);
        return false;
    }
};
StudentGuard = __decorate([
    Injectable({
        providedIn: 'root'
    })
], StudentGuard);
export { StudentGuard };
