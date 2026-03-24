import { __decorate } from "tslib";
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
let ApplicationService = class ApplicationService {
    http = inject(HttpClient);
    apiUrl = `${environment.apiUrl}/applications`;
    // Matches backend: POST /api/applications/apply?studentId=1&jobId=2
    applyForJob(studentId, jobId) {
        const params = new HttpParams()
            .set('studentId', studentId.toString())
            .set('jobId', jobId.toString());
        // Sending null for the body because we are using RequestParams
        return this.http.post(`${this.apiUrl}/apply`, null, { params });
    }
    getStudentApplications(studentId) {
        return this.http.get(`${this.apiUrl}/student/${studentId}`);
    }
    getJobApplications(jobId) {
        return this.http.get(`${this.apiUrl}/job/${jobId}`);
    }
};
ApplicationService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ApplicationService);
export { ApplicationService };
