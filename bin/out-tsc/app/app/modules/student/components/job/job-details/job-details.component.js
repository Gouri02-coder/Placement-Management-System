import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
let JobDetailsComponent = class JobDetailsComponent {
    route;
    router;
    jobService;
    applicationService;
    studentService;
    authService;
    job = null;
    student = null;
    isLoading = false;
    hasApplied = false;
    skillsMatchPercentage = 0;
    studentId = '';
    constructor(route, router, jobService, applicationService, studentService, authService) {
        this.route = route;
        this.router = router;
        this.jobService = jobService;
        this.applicationService = applicationService;
        this.studentService = studentService;
        this.authService = authService;
    }
    ngOnInit() {
        this.getStudentId();
        this.loadJobDetails();
        this.loadStudentProfile();
    }
    getStudentId() {
        const currentUser = this.authService.currentUserValue;
        if (!currentUser) {
            console.error('No user logged in');
            this.router.navigate(['/auth/login']);
            return;
        }
        if (currentUser.role !== 'student') {
            console.error('User is not a student');
            this.router.navigate(['/auth/login']);
            return;
        }
        this.studentId = currentUser.id;
        console.log('Student ID:', this.studentId);
    }
    loadJobDetails() {
        const jobId = this.route.snapshot.paramMap.get('id');
        if (jobId) {
            this.isLoading = true;
            this.jobService.getJobById(Number(jobId)).subscribe({
                next: (job) => {
                    this.job = job;
                    this.isLoading = false;
                    this.checkIfApplied();
                    this.calculateSkillsMatch();
                },
                error: (error) => {
                    console.error('Error loading job details:', error);
                    this.isLoading = false;
                }
            });
        }
    }
    loadStudentProfile() {
        if (!this.studentId)
            return;
        this.studentService.getStudentProfile(this.studentId).subscribe({
            next: (student) => {
                this.student = student;
                this.calculateSkillsMatch();
            },
            error: (error) => {
                console.error('Error loading student profile:', error);
            }
        });
    }
    checkIfApplied() {
        if (!this.studentId || !this.job)
            return;
        this.applicationService.getStudentApplications(this.studentId).subscribe({
            next: (applications) => {
                this.hasApplied = applications.some(app => app.jobId === this.job?.id);
            },
            error: (error) => {
                console.error('Error checking application status:', error);
            }
        });
    }
    onApply() {
        // Check if user is authenticated and is a student
        if (!this.authService.isAuthenticated()) {
            alert('Please log in to apply for jobs.');
            this.router.navigate(['/auth/login']);
            return;
        }
        const currentUser = this.authService.currentUserValue;
        if (currentUser?.role !== 'student') {
            alert('Only students can apply for jobs.');
            return;
        }
        if (this.job && !this.hasApplied && !this.isApplicationDeadlinePassed() && this.studentId) {
            // Create the application data object that the service expects
            const applicationData = {
                jobId: this.job.id,
                studentId: this.studentId,
                resumeUrl: this.student?.resumeUrl || 'default-resume.pdf', // Provide a default or get from student profile
                coverLetter: '' // Optional: you can add a default cover letter or make it editable
            };
            // Call the service with the correct object parameter
            this.applicationService.applyForJob(parseInt(this.studentId), applicationData).subscribe({
                next: () => {
                    this.hasApplied = true;
                    alert('Application submitted successfully!');
                },
                error: (error) => {
                    console.error('Error applying for job:', error);
                    alert('Error applying for job. Please try again.');
                }
            });
        }
        else if (this.hasApplied) {
            alert('You have already applied for this job.');
        }
        else if (this.isApplicationDeadlinePassed()) {
            alert('The application deadline for this job has passed.');
        }
    }
    calculateSkillsMatch() {
        if (!this.job || !this.student)
            return;
        const jobSkills = this.job.skillsRequired;
        const studentSkills = this.student.skills;
        if (jobSkills.length === 0) {
            this.skillsMatchPercentage = 0;
            return;
        }
        const matchingSkills = jobSkills.filter(skill => studentSkills.includes(skill));
        this.skillsMatchPercentage = Math.round((matchingSkills.length / jobSkills.length) * 100);
    }
    onSaveJob() {
        if (!this.authService.isAuthenticated()) {
            alert('Please log in to save jobs.');
            this.router.navigate(['/auth/login']);
            return;
        }
        if (this.job) {
            console.log('Saving job:', this.job.id);
            // Implement save job functionality here
            alert('Job saved to your favorites!');
        }
    }
    onBack() {
        this.router.navigate(['/student/job-search']);
    }
    isApplicationDeadlinePassed() {
        if (!this.job)
            return true;
        return new Date(this.job.applicationDeadline) < new Date();
    }
    hasSkill(skill) {
        return this.student?.skills.includes(skill) || false;
    }
    isUserStudent() {
        const user = this.authService.currentUserValue;
        return user?.role === 'student';
    }
};
JobDetailsComponent = __decorate([
    Component({
        selector: 'app-job-details',
        standalone: true,
        imports: [CommonModule, DatePipe, TitleCasePipe],
        templateUrl: './job-details.component.html',
        styleUrls: ['./job-details.component.css']
    })
], JobDetailsComponent);
export { JobDetailsComponent };
