import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpperCasePipe, DatePipe } from '@angular/common';
let CandidateProfileComponent = class CandidateProfileComponent {
    router;
    application = null; // Initialize as null
    isLoading = false;
    constructor(router) {
        this.router = router;
    }
    // Safe methods that handle null application
    getStatusClass(status) {
        if (!status)
            return 'status-unknown';
        return `status-${status.toLowerCase()}`;
    }
    getStatusIcon(status) {
        if (!status)
            return 'help';
        const statusIcons = {
            pending: 'schedule',
            reviewed: 'visibility',
            shortlisted: 'star',
            rejected: 'cancel',
            hired: 'check_circle'
        };
        return statusIcons[status.toLowerCase()] || 'help';
    }
    updateStatus(newStatus) {
        if (this.application) {
            this.application.status = newStatus;
            // Add your API call here to update status
        }
    }
    goBack() {
        this.router.navigate(['/company/applications']);
    }
    viewResume() {
        if (this.application?.resumeUrl) {
            // Implement view resume logic
            window.open(this.application.resumeUrl, '_blank');
        }
    }
    downloadResume() {
        if (this.application?.resumeUrl) {
            // Implement download resume logic
            const link = document.createElement('a');
            link.href = this.application.resumeUrl;
            link.download = 'resume.pdf';
            link.click();
        }
    }
};
CandidateProfileComponent = __decorate([
    Component({
        selector: 'app-candidate-profile',
        templateUrl: './candidate-profile.html',
        standalone: true,
        imports: [CommonModule, UpperCasePipe, DatePipe]
    })
], CandidateProfileComponent);
export { CandidateProfileComponent };
