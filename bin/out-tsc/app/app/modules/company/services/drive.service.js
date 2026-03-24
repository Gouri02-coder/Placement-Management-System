import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let DriveService = class DriveService {
    http;
    apiUrl = 'http://localhost:3000/api/drives';
    constructor(http) {
        this.http = http;
    }
    getDrivesByCompany(companyId) {
        return this.http.get(`${this.apiUrl}/company/${companyId}`);
    }
    getDriveById(driveId) {
        return this.http.get(`${this.apiUrl}/${driveId}`);
    }
    createDrive(driveData) {
        return this.http.post(this.apiUrl, driveData);
    }
    updateDrive(driveId, driveData) {
        return this.http.put(`${this.apiUrl}/${driveId}`, driveData);
    }
    addDriveRound(driveId, round) {
        return this.http.post(`${this.apiUrl}/${driveId}/rounds`, round);
    }
    updateDriveRound(driveId, roundId, roundData) {
        return this.http.put(`${this.apiUrl}/${driveId}/rounds/${roundId}`, roundData);
    }
    publishRoundResults(driveId, roundId, results) {
        return this.http.post(`${this.apiUrl}/${driveId}/rounds/${roundId}/results`, { results });
    }
    uploadDriveDocument(driveId, documentFile) {
        const formData = new FormData();
        formData.append('document', documentFile);
        return this.http.post(`${this.apiUrl}/${driveId}/documents`, formData);
    }
};
DriveService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], DriveService);
export { DriveService };
