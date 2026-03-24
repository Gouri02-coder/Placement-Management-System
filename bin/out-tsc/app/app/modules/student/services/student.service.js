import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let StudentService = class StudentService {
    http;
    apiUrl = 'http://localhost:3000/api/students';
    constructor(http) {
        this.http = http;
    }
    getStudentProfile(studentId) {
        return this.http.get(`${this.apiUrl}/${studentId}`);
    }
    updateStudentProfile(studentId, profile) {
        return this.http.put(`${this.apiUrl}/${studentId}`, profile);
    }
    addEducation(studentId, education) {
        return this.http.post(`${this.apiUrl}/${studentId}/education`, education);
    }
    addProject(studentId, project) {
        return this.http.post(`${this.apiUrl}/${studentId}/projects`, project);
    }
    uploadResume(studentId, resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        return this.http.post(`${this.apiUrl}/${studentId}/resume`, formData);
    }
};
StudentService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], StudentService);
export { StudentService };
