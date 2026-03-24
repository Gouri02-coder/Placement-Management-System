import { __decorate } from "tslib";
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
let ApplicationFiltersComponent = class ApplicationFiltersComponent {
    applications = [];
    filtersChange = new EventEmitter();
    filters = {};
    searchTerm = '';
    statusFilter = 'all';
    jobFilter = 'all';
    branchFilter = 'all';
    minCGPA = '';
    ngOnInit() { }
    getUniqueJobs() {
        const jobs = [...new Set(this.applications.map(app => app.jobTitle))];
        return jobs;
    }
    getUniqueBranches() {
        const branches = [...new Set(this.applications.map(app => app.branch))];
        return branches;
    }
    applyFilters() {
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
        if (this.minCGPA) {
            this.filters.minCGPA = parseFloat(this.minCGPA);
        }
        this.filtersChange.emit(this.filters);
    }
    clearFilters() {
        this.searchTerm = '';
        this.statusFilter = 'all';
        this.jobFilter = 'all';
        this.branchFilter = 'all';
        this.minCGPA = '';
        this.filters = {};
        this.filtersChange.emit(this.filters);
    }
    onSearchChange() {
        // Emit search term separately if needed
        // This can be handled by parent component
    }
};
__decorate([
    Input()
], ApplicationFiltersComponent.prototype, "applications", void 0);
__decorate([
    Output()
], ApplicationFiltersComponent.prototype, "filtersChange", void 0);
ApplicationFiltersComponent = __decorate([
    Component({
        selector: 'app-application-filters',
        imports: [FormsModule],
        templateUrl: './application-filters.html',
        styleUrls: ['./application-filters.css']
    })
], ApplicationFiltersComponent);
export { ApplicationFiltersComponent };
