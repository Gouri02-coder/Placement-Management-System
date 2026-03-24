import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
let ApplyJobComponent = class ApplyJobComponent {
    router;
    route;
    jobService;
    applicationService;
    authService;
    // Using the Job model we synced with the backend
    job = {
        id: '',
        title: '',
        companyName: '',
        description: '',
        requirements: '',
        salary: 0,
        location: '',
        jobType: 'full-time',
        applyDeadline: new Date()
    };
    application = {
        resume: '',
        coverLetter: '',
        availability: 'immediately',
        expectedSalary: '',
        additionalInfo: ''
    };
    resumes = [
        'Resume_2024_Technical.pdf',
        'Resume_2024_General.pdf'
    ];
    isSubmitting = false;
    constructor(router, route, jobService, applicationService, authService) {
        this.router = router;
        this.route = route;
        this.jobService = jobService;
        this.applicationService = applicationService;
        this.authService = authService;
    }
    ngOnInit() {
        const jobId = this.route.snapshot.paramMap.get('id');
        this.loadJobDetails(jobId);
    }
    loadJobDetails(jobId) {
        if (jobId) {
            // Fetch REAL job details from the Spring Boot API
            this.jobService.getJobById(Number(jobId)).subscribe({
                next: (data) => {
                    this.job = data;
                },
                error: (err) => {
                    console.error('Error fetching job details', err);
                    alert('Failed to load job details.');
                }
            });
        }
    }
    onSubmit() {
        if (!this.application.resume) {
            alert('Please select a resume to apply.');
            return;
        }
        if (!this.job || !this.job.id)
            return;
        // 1. Get the currently logged-in student
        const currentUser = this.authService.currentUserValue;
        if (!currentUser || !currentUser.id) {
            alert('Session expired. Please log in again.');
            this.router.navigate(['/auth/login']);
            return;
        }
        this.isSubmitting = true;
        const studentId = Number(currentUser.id);
        // 2. Send the real application to the backend
        this.applicationService.applyForJob(studentId, this.job.id).subscribe({
            next: (res) => {
                alert('Application submitted successfully!');
                this.isSubmitting = false;
                // Keeping your original redirect path
                this.router.navigate(['/student/applications']);
            },
            error: (err) => {
                // Handle backend errors (e.g., "You have already applied for this job.")
                const errorMsg = typeof err.error === 'string' ? err.error : 'Failed to submit application.';
                alert(errorMsg);
                this.isSubmitting = false;
            }
        });
    }
    onCancel() {
        this.router.navigate(['/student/placement-drives']);
    }
    canApply() {
        if (!this.job || !this.job.applyDeadline)
            return false;
        // Ensure we are comparing actual Date objects
        return new Date() < new Date(this.job.applyDeadline);
    }
};
ApplyJobComponent = __decorate([
    Component({
        selector: 'app-apply-job',
        standalone: true,
        imports: [CommonModule, FormsModule],
        templateUrl: './apply-job.component.html',
        styleUrls: ['./apply-job.component.css']
    })
], ApplyJobComponent);
export { ApplyJobComponent };
