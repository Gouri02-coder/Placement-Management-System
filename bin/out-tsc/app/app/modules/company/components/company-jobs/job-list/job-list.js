import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
let JobListComponent = class JobListComponent {
    jobService;
    router;
    jobs = [];
    filteredJobs = [];
    isLoading = false;
    searchTerm = '';
    statusFilter = 'all';
    typeFilter = 'all';
    // Pagination
    currentPage = 1;
    itemsPerPage = 8;
    totalPages = 1;
    constructor(jobService, router) {
        this.jobService = jobService;
        this.router = router;
    }
    ngOnInit() {
        this.loadJobs();
    }
    loadJobs() {
        this.isLoading = true;
        const companyId = this.getCompanyId();
        this.jobService.getJobsByCompany(companyId).subscribe({
            next: (jobs) => {
                this.jobs = jobs;
                this.filteredJobs = jobs;
                this.calculateTotalPages();
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading jobs:', error);
                this.isLoading = false;
            }
        });
    }
    getCompanyId() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData).companyId : '';
    }
    applyFilters() {
        this.filteredJobs = this.jobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                job.description.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesStatus = this.statusFilter === 'all' || job.status === this.statusFilter;
            const matchesType = this.typeFilter === 'all' || job.type === this.typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        });
        this.currentPage = 1;
        this.calculateTotalPages();
    }
    calculateTotalPages() {
        this.totalPages = Math.ceil(this.filteredJobs.length / this.itemsPerPage);
    }
    get paginatedJobs() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredJobs.slice(startIndex, startIndex + this.itemsPerPage);
    }
    changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }
    getPages() {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    }
    createJob() {
        this.router.navigate(['/company/jobs/create']);
    }
    editJob(jobId) {
        this.router.navigate(['/company/jobs/edit', jobId]);
    }
    viewApplications(jobId) {
        this.router.navigate(['/company/applications'], { queryParams: { jobId } });
    }
    closeJob(jobId) {
        if (confirm('Are you sure you want to close this job? This will stop receiving new applications.')) {
            this.jobService.closeJob(jobId).subscribe({
                next: (updatedJob) => {
                    const index = this.jobs.findIndex(j => j.id === jobId);
                    if (index !== -1) {
                        this.jobs[index] = updatedJob;
                    }
                    this.applyFilters();
                    alert('Job closed successfully!');
                },
                error: (error) => {
                    console.error('Error closing job:', error);
                    alert('Error closing job. Please try again.');
                }
            });
        }
    }
    extendDeadline(jobId) {
        const newDeadline = prompt('Enter new deadline (YYYY-MM-DD):');
        if (newDeadline) {
            const deadlineDate = new Date(newDeadline);
            this.jobService.extendDeadline(jobId, deadlineDate).subscribe({
                next: (updatedJob) => {
                    const index = this.jobs.findIndex(j => j.id === jobId);
                    if (index !== -1) {
                        this.jobs[index] = updatedJob;
                    }
                    this.applyFilters();
                    alert('Deadline extended successfully!');
                },
                error: (error) => {
                    console.error('Error extending deadline:', error);
                    alert('Error extending deadline. Please try again.');
                }
            });
        }
    }
    getStatusClass(status) {
        switch (status) {
            case 'active': return 'status-active';
            case 'draft': return 'status-draft';
            case 'closed': return 'status-closed';
            case 'expired': return 'status-expired';
            default: return 'status-draft';
        }
    }
    getTypeIcon(type) {
        switch (type) {
            case 'fulltime': return 'work';
            case 'parttime': return 'schedule';
            case 'internship': return 'school';
            default: return 'work';
        }
    }
    getLocationIcon(location) {
        switch (location) {
            case 'remote': return 'home';
            case 'hybrid': return 'sync';
            case 'onsite': return 'business';
            default: return 'location_on';
        }
    }
    isJobExpired(job) {
        return new Date(job.applicationDeadline) < new Date() && job.status === 'active';
    }
};
JobListComponent = __decorate([
    Component({
        selector: 'app-job-list',
        imports: [FormsModule, CommonModule],
        templateUrl: './job-list.html',
        styleUrls: ['./job-list.css']
    })
], JobListComponent);
export { JobListComponent };
