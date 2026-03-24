import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
let AnalyticsService = class AnalyticsService {
    http;
    apiUrl = 'http://localhost:3000/api/analytics';
    constructor(http) {
        this.http = http;
    }
    getCompanyAnalytics(companyId, period) {
        let params = new HttpParams();
        if (period) {
            params = params.set('period', period);
        }
        return this.http.get(`${this.apiUrl}/company/${companyId}`, { params });
    }
    getJobAnalytics(jobId) {
        return this.http.get(`${this.apiUrl}/job/${jobId}`);
    }
    generateReport(request) {
        return this.http.post(`${this.apiUrl}/reports`, request, {
            responseType: 'blob'
        });
    }
    getDriveAnalytics(driveId) {
        return this.http.get(`${this.apiUrl}/drive/${driveId}`);
    }
};
AnalyticsService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AnalyticsService);
export { AnalyticsService };
