import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let CompanyGuard = class CompanyGuard {
    authService;
    router;
    constructor(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    canActivate() {
        const user = this.authService.currentUserValue; // Assuming currentUserValue is a synchronous getter
        if (user?.role === 'company') {
            return true;
        }
        this.router.navigate(['/auth/login']);
        return false;
    }
};
CompanyGuard = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CompanyGuard);
export { CompanyGuard };
