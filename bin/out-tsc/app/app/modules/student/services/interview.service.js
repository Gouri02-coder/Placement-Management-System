import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let InterviewService = class InterviewService {
    http;
    apiUrl = 'http://localhost:3000/api/interviews';
    constructor(http) {
        this.http = http;
    }
    getStudentInterviews(studentId) {
        return this.http.get(`${this.apiUrl}/student/${studentId}`);
    }
    getInterviewDetails(interviewId) {
        return this.http.get(`${this.apiUrl}/${interviewId}`);
    }
    getUpcomingInterviews(studentId) {
        return this.http.get(`${this.apiUrl}/student/${studentId}/upcoming`);
    }
    updateInterviewStatus(interviewId, status) {
        return this.http.patch(`${this.apiUrl}/${interviewId}/status`, { status });
    }
    submitInterviewFeedback(interviewId, feedback) {
        return this.http.post(`${this.apiUrl}/${interviewId}/feedback`, feedback);
    }
    rescheduleInterview(interviewId, newDate) {
        return this.http.patch(`${this.apiUrl}/${interviewId}/reschedule`, {
            newDate: newDate.toISOString()
        });
    }
    confirmInterviewAttendance(interviewId) {
        return this.http.patch(`${this.apiUrl}/${interviewId}/confirm`, {});
    }
    cancelInterview(interviewId, reason) {
        return this.http.patch(`${this.apiUrl}/${interviewId}/cancel`, { reason });
    }
    getInterviewPreparationMaterials(interviewId) {
        return this.http.get(`${this.apiUrl}/${interviewId}/preparation`);
    }
};
InterviewService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], InterviewService);
export { InterviewService };
