import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let ApplicationService = class ApplicationService {
    http;
    apiUrl = 'http://localhost:3000/api/applications';
    constructor(http) {
        this.http = http;
    }
    applyForJob(studentId, applicationData) {
        return this.http.post(this.apiUrl, applicationData);
    }
    getStudentApplications(studentId) {
        return this.http.get(`${this.apiUrl}/student/${studentId}`);
    }
    getApplicationStatus(applicationId) {
        return this.http.get(`${this.apiUrl}/${applicationId}`);
    }
    withdrawApplication(applicationId) {
        return this.http.delete(`${this.apiUrl}/${applicationId}`);
    }
};
ApplicationService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ApplicationService);
export { ApplicationService };
