import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
let StudentService = class StudentService {
    // Minimal stub service to satisfy DI and provide simple data accessors.
    getCurrentStudent() {
        return of(null);
    }
};
StudentService = __decorate([
    Injectable({ providedIn: 'root' })
], StudentService);
export { StudentService };
