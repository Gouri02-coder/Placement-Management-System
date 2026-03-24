import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
let ApplicationListComponent = class ApplicationListComponent {
    applicationService;
    route;
    router;
    applications = [];
    filteredApplications = [];
    isLoading = false;
    // Filters
    filters = {};
    searchTerm = '';
    statusFilter = 'all';
    jobFilter = 'all';
    branchFilter = 'all';
    minCGPAPicker = '';
    // Pagination
    currentPage = 1;
    itemsPerPage = 10;
    totalPages = 1;
    // Bulk actions
    selectedApplications = new Set();
    selectAll = false;
    constructor(applicationService, route, router) {
        this.applicationService = applicationService;
        this.route = route;
        this.router = router;
    }
    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['jobId']) {
                this.filters.jobId = params['jobId'];
                this.jobFilter = params['jobId'];
            }
            this.loadApplications();
        });
    }
    loadApplications() {
        this.isLoading = true;
        const companyId = this.getCompanyId();
        this.applicationService.getApplicationsByCompany(companyId, this.filters).subscribe({
            next: (applications) => {
                this.applications = applications || [];
                this.filteredApplications = applications || [];
                this.calculateTotalPages();
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading applications:', error);
                this.applications = [];
                this.filteredApplications = [];
                this.isLoading = false;
            }
        });
    }
    getCompanyId() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData).companyId : '';
    }
    applyFilters() {
        // Update filters object
        this.filters = {};
        if (this.jobFilter !== 'all') {
            this.filters.jobId = this.jobFilter;
        }
        if (this.statusFilter !== 'all') {
            this.filters.status = this.statusFilter;
        }
        if (this.branchFilter !== 'all') {
            this.filters.branch = this.branchFilter;
        }
        if (this.minCGPAPicker) {
            this.filters.minCGPA = parseFloat(this.minCGPAPicker);
        }
        this.loadApplications();
    }
    searchApplications() {
        if (!this.applications) {
            this.filteredApplications = [];
            return;
        }
        this.filteredApplications = this.applications.filter(application => {
            if (!application)
                return false;
            const searchLower = this.searchTerm.toLowerCase();
            const matchesSearch = application.candidateName?.toLowerCase().includes(searchLower) ||
                application.candidateEmail?.toLowerCase().includes(searchLower) ||
                application.jobTitle?.toLowerCase().includes(searchLower);
            return matchesSearch;
        });
        this.currentPage = 1;
        this.calculateTotalPages();
    }
    calculateTotalPages() {
        this.totalPages = Math.ceil((this.filteredApplications?.length || 0) / this.itemsPerPage);
    }
    get paginatedApplications() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return (this.filteredApplications || []).slice(startIndex, startIndex + this.itemsPerPage);
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
    getEndIndex() {
        const endIndex = this.currentPage * this.itemsPerPage;
        return Math.min(endIndex, this.filteredApplications?.length || 0);
    }
    // Selection methods
    toggleSelectAll() {
        if (this.selectAll) {
            this.paginatedApplications.forEach(app => {
                if (app?.id) {
                    this.selectedApplications.add(app.id);
                }
            });
        }
        else {
            this.selectedApplications.clear();
        }
    }
    toggleApplicationSelection(applicationId) {
        if (!applicationId)
            return;
        if (this.selectedApplications.has(applicationId)) {
            this.selectedApplications.delete(applicationId);
        }
        else {
            this.selectedApplications.add(applicationId);
        }
        this.updateSelectAllState();
    }
    updateSelectAllState() {
        const paginatedApps = this.paginatedApplications;
        this.selectAll = paginatedApps.length > 0 &&
            paginatedApps.every(app => app?.id && this.selectedApplications.has(app.id));
    }
    get selectedCount() {
        return this.selectedApplications.size;
    }
    // Status update methods
    updateApplicationStatus(applicationId, newStatus) {
        if (!applicationId)
            return;
        this.applicationService.updateApplicationStatus({
            applicationId,
            status: newStatus
        }).subscribe({
            next: (updatedApplication) => {
                const index = this.applications.findIndex(app => app.id === applicationId);
                if (index !== -1) {
                    this.applications[index] = updatedApplication;
                }
                this.applyFilters();
            },
            error: (error) => {
                console.error('Error updating application status:', error);
                alert('Error updating application status. Please try again.');
            }
        });
    }
    bulkUpdateStatus(newStatus) {
        if (this.selectedApplications.size === 0) {
            alert('Please select at least one application.');
            return;
        }
        if (confirm(`Are you sure you want to update ${this.selectedApplications.size} application(s) to ${newStatus}?`)) {
            const applicationIds = Array.from(this.selectedApplications);
            this.applicationService.bulkUpdateApplicationStatus(applicationIds, newStatus).subscribe({
                next: () => {
                    this.loadApplications();
                    this.selectedApplications.clear();
                    this.selectAll = false;
                    alert('Applications updated successfully!');
                },
                error: (error) => {
                    console.error('Error bulk updating applications:', error);
                    alert('Error updating applications. Please try again.');
                }
            });
        }
    }
    // Export methods
    exportToExcel() {
        const companyId = this.getCompanyId();
        this.applicationService.downloadApplicationsExcel(companyId, this.filters).subscribe({
            next: (blob) => {
                this.downloadFile(blob, 'applications.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            },
            error: (error) => {
                console.error('Error exporting to Excel:', error);
                alert('Error exporting applications. Please try again.');
            }
        });
    }
    exportToPDF() {
        const companyId = this.getCompanyId();
        this.applicationService.downloadApplicationsPDF(companyId, this.filters).subscribe({
            next: (blob) => {
                this.downloadFile(blob, 'applications.pdf', 'application/pdf');
            },
            error: (error) => {
                console.error('Error exporting to PDF:', error);
                alert('Error exporting applications. Please try again.');
            }
        });
    }
    downloadFile(blob, filename, contentType) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
    }
    // Navigation methods
    viewCandidateProfile(applicationId) {
        if (!applicationId)
            return;
        this.router.navigate(['/company/applications/candidate', applicationId]);
    }
    viewResume(application) {
        if (!application?.resumeUrl)
            return;
        window.open(application.resumeUrl, '_blank');
    }
    // Utility methods
    getStatusClass(status) {
        if (!status)
            return 'status-pending';
        switch (status) {
            case 'pending': return 'status-pending';
            case 'reviewed': return 'status-reviewed';
            case 'shortlisted': return 'status-shortlisted';
            case 'rejected': return 'status-rejected';
            case 'hired': return 'status-hired';
            default: return 'status-pending';
        }
    }
    getStatusIcon(status) {
        if (!status)
            return 'schedule';
        switch (status) {
            case 'pending': return 'schedule';
            case 'reviewed': return 'visibility';
            case 'shortlisted': return 'star';
            case 'rejected': return 'cancel';
            case 'hired': return 'check_circle';
            default: return 'schedule';
        }
    }
    getUniqueJobs() {
        if (!this.applications)
            return [];
        const jobs = [...new Set(this.applications.map(app => app?.jobTitle).filter(Boolean))];
        return jobs;
    }
    getUniqueBranches() {
        if (!this.applications)
            return [];
        const branches = [...new Set(this.applications.map(app => app?.branch).filter(Boolean))];
        return branches;
    }
    clearFilters() {
        this.searchTerm = '';
        this.statusFilter = 'all';
        this.jobFilter = 'all';
        this.branchFilter = 'all';
        this.minCGPAPicker = '';
        this.filters = {};
        this.loadApplications();
    }
};
ApplicationListComponent = __decorate([
    Component({
        selector: 'app-application-list',
        templateUrl: './application-list.html',
        styleUrls: ['./application-list.css'],
        standalone: true,
        imports: [CommonModule, FormsModule, UpperCasePipe, DatePipe]
    })
], ApplicationListComponent);
export { ApplicationListComponent };
