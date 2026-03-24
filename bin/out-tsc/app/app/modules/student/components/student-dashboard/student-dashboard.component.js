import { __decorate } from "tslib";
// student-dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
let StudentDashboardComponent = class StudentDashboardComponent {
    studentService;
    applicationService;
    interviewService;
    jobService;
    student = null;
    applications = [];
    interviews = [];
    recommendedJobs = [];
    stats = {
        totalApplications: 0,
        pendingApplications: 0,
        interviewsScheduled: 0,
        profileCompletion: 0
    };
    constructor(studentService, applicationService, interviewService, jobService) {
        this.studentService = studentService;
        this.applicationService = applicationService;
        this.interviewService = interviewService;
        this.jobService = jobService;
    }
    ngOnInit() {
        this.loadDashboardData();
    }
    loadDashboardData() {
        const studentId = '123'; // Get from auth service
        // Load student profile
        this.studentService.getStudentProfile(studentId).subscribe({
            next: (student) => {
                this.student = student;
                this.calculateProfileCompletion();
            },
            error: (error) => {
                console.error('Error loading student profile:', error);
            }
        });
        // Load applications
        this.applicationService.getStudentApplications(studentId).subscribe({
            next: (applications) => {
                this.applications = applications.filter(app => app.status !== 'draft');
                this.calculateApplicationStats();
            },
            error: (error) => {
                console.error('Error loading applications:', error);
            }
        });
        // Load interviews
        this.interviewService.getStudentInterviews(studentId).subscribe({
            next: (interviews) => {
                this.interviews = interviews;
                this.stats.interviewsScheduled = interviews.length;
            },
            error: (error) => {
                console.error('Error loading interviews:', error);
            }
        });
        // Load recommended jobs
        // Load recommended jobs
        this.jobService.getRecommendedJobs(studentId).subscribe({
            next: (jobs) => {
                this.recommendedJobs = jobs.slice(0, 4);
            },
            error: (error) => {
                console.error('Error loading recommended jobs:', error);
            }
        });
    }
    calculateProfileCompletion() {
        if (!this.student)
            return;
        let completion = 0;
        // Personal info (25%)
        const personalInfo = this.student.personalInfo;
        if (personalInfo.firstName && personalInfo.lastName &&
            personalInfo.email && personalInfo.phone) {
            completion += 25;
        }
        // Academic info (25%)
        const academicInfo = this.student.academicInfo;
        if (academicInfo.college && academicInfo.degree &&
            academicInfo.branch && academicInfo.cgpa) {
            completion += 25;
        }
        // Skills (25%)
        if (this.student.skills && this.student.skills.length >= 3) {
            completion += 25;
        }
        // Resume (25%)
        if (this.student.resumeUrl) {
            completion += 25;
        }
        this.stats.profileCompletion = completion;
    }
    calculateApplicationStats() {
        this.stats.totalApplications = this.applications.length;
        this.stats.pendingApplications = this.applications.filter(app => app.status === 'applied' || app.status === 'under-review').length;
    }
    calculateDaysAgo(date) {
        const now = new Date();
        const appliedDate = new Date(date);
        const diffTime = Math.abs(now.getTime() - appliedDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0)
            return 'Today';
        if (diffDays === 1)
            return '1 day';
        if (diffDays < 7)
            return `${diffDays} days`;
        if (diffDays < 30)
            return `${Math.floor(diffDays / 7)} weeks`;
        return `${Math.floor(diffDays / 30)} months`;
    }
};
StudentDashboardComponent = __decorate([
    Component({
        selector: 'app-student-dashboard',
        imports: [DatePipe, CommonModule, RouterLink],
        templateUrl: './student-dashboard.component.html',
        styleUrls: ['./student-dashboard.component.css']
    })
], StudentDashboardComponent);
export { StudentDashboardComponent };
