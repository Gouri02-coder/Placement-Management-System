import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
// Provide a local fallback environment if the project's environments file is missing.
// This avoids "Cannot find module '../../../environments/environment'" during compile.
// Replace the apiUrl value below with your real API base URL or restore the original import if the environments file is available.
const environment = {
    apiUrl: 'http://localhost:8080/'
};
let ApiService = class ApiService {
    http;
    baseUrl = environment.apiUrl;
    constructor(http) {
        this.http = http;
    }
    getHeaders() {
        const token = localStorage.getItem('access_token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }
    getFormDataHeaders() {
        const token = localStorage.getItem('access_token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }
    // GET request
    get(endpoint, params) {
        const options = {
            headers: this.getHeaders(),
            params: new HttpParams({ fromObject: params })
        };
        return this.http.get(`${this.baseUrl}${endpoint}`, options);
    }
    // POST request
    post(endpoint, data) {
        return this.http.post(`${this.baseUrl}${endpoint}`, data, {
            headers: this.getHeaders()
        });
    }
    // PUT request
    put(endpoint, data) {
        return this.http.put(`${this.baseUrl}${endpoint}`, data, {
            headers: this.getHeaders()
        });
    }
    // DELETE request
    delete(endpoint) {
        return this.http.delete(`${this.baseUrl}${endpoint}`, {
            headers: this.getHeaders()
        });
    }
    // PATCH request
    patch(endpoint, data) {
        return this.http.patch(`${this.baseUrl}${endpoint}`, data, {
            headers: this.getHeaders()
        });
    }
    // File upload
    upload(endpoint, formData) {
        return this.http.post(`${this.baseUrl}${endpoint}`, formData, {
            headers: this.getFormDataHeaders()
        });
    }
    // Download file
    download(endpoint) {
        return this.http.get(`${this.baseUrl}${endpoint}`, {
            headers: this.getHeaders(),
            responseType: 'blob'
        });
    }
};
ApiService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ApiService);
export { ApiService };
