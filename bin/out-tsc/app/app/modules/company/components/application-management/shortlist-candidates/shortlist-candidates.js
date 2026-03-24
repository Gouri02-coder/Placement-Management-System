import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
let ShortlistCandidatesComponent = class ShortlistCandidatesComponent {
    applicationService;
    shortlistedApplications = [];
    isLoading = false;
    constructor(applicationService) {
        this.applicationService = applicationService;
    }
    ngOnInit() {
        this.loadShortlistedCandidates();
    }
    loadShortlistedCandidates() {
        this.isLoading = true;
        const companyId = this.getCompanyId();
        const filters = { status: 'shortlisted' };
        this.applicationService.getApplicationsByCompany(companyId, filters).subscribe({
            next: (applications) => {
                this.shortlistedApplications = applications;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading shortlisted candidates:', error);
                this.isLoading = false;
            }
        });
    }
    getCompanyId() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData).companyId : '';
    }
    removeFromShortlist(applicationId) {
        if (confirm('Are you sure you want to remove this candidate from shortlist?')) {
            this.applicationService.updateApplicationStatus({
                applicationId,
                status: 'reviewed'
            }).subscribe({
                next: () => {
                    this.shortlistedApplications = this.shortlistedApplications.filter(app => app.id !== applicationId);
                    alert('Candidate removed from shortlist.');
                },
                error: (error) => {
                    console.error('Error updating status:', error);
                    alert('Error removing candidate from shortlist.');
                }
            });
        }
    }
    hireCandidate(applicationId) {
        if (confirm('Are you sure you want to mark this candidate as hired?')) {
            this.applicationService.updateApplicationStatus({
                applicationId,
                status: 'hired'
            }).subscribe({
                next: () => {
                    this.shortlistedApplications = this.shortlistedApplications.filter(app => app.id !== applicationId);
                    alert('Candidate marked as hired!');
                },
                error: (error) => {
                    console.error('Error updating status:', error);
                    alert('Error updating candidate status.');
                }
            });
        }
    }
    viewResume(resumeUrl) {
        window.open(resumeUrl, '_blank');
    }
    getSkillLevel(skills) {
        const count = skills.length;
        if (count >= 8)
            return 'expert';
        if (count >= 5)
            return 'advanced';
        if (count >= 3)
            return 'intermediate';
        return 'beginner';
    }
    getSkillLevelClass(skills) {
        const level = this.getSkillLevel(skills);
        return `skill-level-${level}`;
    }
    getUniqueJobs() {
        const jobs = [...new Set(this.shortlistedApplications.map(app => app.jobTitle))];
        return jobs;
    }
    getAverageCGPA() {
        if (this.shortlistedApplications.length === 0)
            return 0;
        const total = this.shortlistedApplications.reduce((sum, app) => sum + app.cgpa, 0);
        return total / this.shortlistedApplications.length;
    }
};
ShortlistCandidatesComponent = __decorate([
    Component({
        selector: 'app-shortlist-candidates',
        imports: [DatePipe, UpperCasePipe, CommonModule],
        templateUrl: './shortlist-candidates.html',
        styleUrls: ['./shortlist-candidates.css']
    })
], ShortlistCandidatesComponent);
export { ShortlistCandidatesComponent };
