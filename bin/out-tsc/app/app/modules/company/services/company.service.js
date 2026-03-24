import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let CompanyService = class CompanyService {
    http;
    apiUrl = 'http://localhost:3000/api/companies';
    constructor(http) {
        this.http = http;
    }
    getCompanyProfile(companyId) {
        return this.http.get(`${this.apiUrl}/${companyId}`);
    }
    updateCompanyProfile(companyId, profile) {
        return this.http.put(`${this.apiUrl}/${companyId}`, profile);
    }
    getCompanyStats(companyId) {
        return this.http.get(`${this.apiUrl}/${companyId}/stats`);
    }
    uploadLogo(companyId, logoFile) {
        const formData = new FormData();
        formData.append('logo', logoFile);
        return this.http.post(`${this.apiUrl}/${companyId}/logo`, formData);
    }
    getVerificationStatus(companyId) {
        return this.http.get(`${this.apiUrl}/${companyId}/verification`);
    }
};
CompanyService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CompanyService);
export { CompanyService };
