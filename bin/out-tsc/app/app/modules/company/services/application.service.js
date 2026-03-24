import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
let ApplicationService = class ApplicationService {
    http;
    apiUrl = 'http://localhost:3000/api/applications';
    constructor(http) {
        this.http = http;
    }
    getApplicationsByCompany(companyId, filters) {
        let params = new HttpParams();
        if (filters) {
            Object.keys(filters).forEach(key => {
                const value = filters[key];
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value)) {
                        value.forEach(item => params = params.append(key, item.toString()));
                    }
                    else {
                        params = params.set(key, value.toString());
                    }
                }
            });
        }
        return this.http.get(`${this.apiUrl}/company/${companyId}`, { params });
    }
    getApplicationsByJob(jobId) {
        return this.http.get(`${this.apiUrl}/job/${jobId}`);
    }
    getApplicationById(applicationId) {
        return this.http.get(`${this.apiUrl}/${applicationId}`);
    }
    updateApplicationStatus(update) {
        return this.http.patch(`${this.apiUrl}/${update.applicationId}/status`, {
            status: update.status,
            notes: update.notes
        });
    }
    bulkUpdateApplicationStatus(applicationIds, status) {
        return this.http.post(`${this.apiUrl}/bulk-status`, { applicationIds, status });
    }
    downloadApplicationsExcel(companyId, filters) {
        let params = new HttpParams();
        if (filters) {
            Object.keys(filters).forEach(key => {
                const value = filters[key];
                if (value !== undefined && value !== null) {
                    params = params.set(key, value.toString());
                }
            });
        }
        return this.http.get(`${this.apiUrl}/company/${companyId}/export/excel`, {
            params,
            responseType: 'blob'
        });
    }
    downloadApplicationsPDF(companyId, filters) {
        let params = new HttpParams();
        if (filters) {
            Object.keys(filters).forEach(key => {
                const value = filters[key];
                if (value !== undefined && value !== null) {
                    params = params.set(key, value.toString());
                }
            });
        }
        return this.http.get(`${this.apiUrl}/company/${companyId}/export/pdf`, {
            params,
            responseType: 'blob'
        });
    }
};
ApplicationService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ApplicationService);
export { ApplicationService };
