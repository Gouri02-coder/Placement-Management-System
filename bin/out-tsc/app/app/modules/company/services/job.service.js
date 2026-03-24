import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let JobService = class JobService {
    http;
    apiUrl = 'http://localhost:3000/api/jobs';
    constructor(http) {
        this.http = http;
    }
    getJobsByCompany(companyId) {
        return this.http.get(`${this.apiUrl}/company/${companyId}`);
    }
    getJobById(jobId) {
        return this.http.get(`${this.apiUrl}/${jobId}`);
    }
    createJob(jobData) {
        return this.http.post(this.apiUrl, jobData);
    }
    updateJob(jobId, jobData) {
        return this.http.put(`${this.apiUrl}/${jobId}`, jobData);
    }
    deleteJob(jobId) {
        return this.http.delete(`${this.apiUrl}/${jobId}`);
    }
    closeJob(jobId) {
        return this.http.patch(`${this.apiUrl}/${jobId}/close`, {});
    }
    extendDeadline(jobId, newDeadline) {
        return this.http.patch(`${this.apiUrl}/${jobId}/deadline`, { newDeadline });
    }
};
JobService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], JobService);
export { JobService };
