import { __decorate } from "tslib";
// src/app/core/services/token.service.ts
import { Injectable } from '@angular/core';
let TokenService = class TokenService {
    tokenKey = 'token';
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }
    setToken(token) {
        localStorage.setItem(this.tokenKey, token);
    }
    removeToken() {
        localStorage.removeItem(this.tokenKey);
    }
};
TokenService = __decorate([
    Injectable({
        providedIn: 'root',
    })
], TokenService);
export { TokenService };
