import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
let ApplicationStatusComponent = class ApplicationStatusComponent {
    applicationService;
    authService;
    router;
    applications = [];
    isLoading = true;
    errorMessage = '';
    constructor(applicationService, authService, router) {
        this.applicationService = applicationService;
        this.authService = authService;
        this.router = router;
    }
    ngOnInit() {
        this.loadMyApplications();
    }
    loadMyApplications() {
        const currentUser = this.authService.currentUserValue;
        if (!currentUser?.id) {
            this.router.navigate(['/auth/login']);
            return;
        }
        this.applicationService.getStudentApplications(currentUser.id.toString())
            .pipe(map(data => data.map(app => ({
            ...app,
            appliedDate: new Date(app.appliedDate),
            interview: app.interview ? {
                ...app.interview,
                scheduledDate: app.interview.scheduledDate ? new Date(app.interview.scheduledDate) : undefined
            } : undefined
        }))))
            .subscribe({
            next: (data) => {
                this.applications = data;
                this.isLoading = false;
            },
            error: (err) => {
                this.errorMessage = 'Failed to load applications.';
                this.isLoading = false;
            }
        });
    }
    getApplicationsByStatus(status) {
        return this.applications.filter(app => app.status.toLowerCase().includes(status.toLowerCase()));
    }
    getStatusColor(status) {
        const colors = { 'applied': '#3498db', 'shortlisted': '#27ae60', 'rejected': '#e74c3c' };
        return colors[status.toLowerCase()] || '#95a5a6';
    }
    getStatusLabel(status) {
        return status.replace('-', ' ').toUpperCase();
    }
};
ApplicationStatusComponent = __decorate([
    Component({
        selector: 'app-application-status',
        standalone: true,
        imports: [CommonModule],
        templateUrl: './application-status.component.html',
        styleUrls: ['./application-status.component.css']
    })
], ApplicationStatusComponent);
export { ApplicationStatusComponent };
