import { __decorate } from "tslib";
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
let JobService = class JobService {
    http = inject(HttpClient);
    apiUrl = `${environment.apiUrl}/jobs`;
    getRecommendedJobs(studentId) {
        return this.http.get(`${this.apiUrl}/recommended/${studentId}`);
    }
    getAllJobs() {
        return this.http.get(this.apiUrl);
    }
    getActiveJobs() {
        return this.http.get(`${this.apiUrl}/active`);
    }
    getJobById(jobId) {
        return this.http.get(`${this.apiUrl}/${jobId}`);
    }
    getEligibleJobs(cgpa, department) {
        let params = new HttpParams()
            .set('cgpa', cgpa.toString())
            .set('department', department);
        return this.http.get(`${this.apiUrl}/eligible`, { params });
    }
    searchJobsByCompany(companyName) {
        let params = new HttpParams().set('companyName', companyName);
        return this.http.get(`${this.apiUrl}/search`, { params });
    }
    getJobsByLocation(location) {
        return this.http.get(`${this.apiUrl}/location/${location}`);
    }
};
JobService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], JobService);
export { JobService };
