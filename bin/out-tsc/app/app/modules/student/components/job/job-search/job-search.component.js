import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
let JobSearchComponent = class JobSearchComponent {
    jobService;
    fb;
    jobs = [];
    filteredJobs = [];
    searchForm;
    isLoading = false;
    searchQuery = '';
    constructor(jobService, fb) {
        this.jobService = jobService;
        this.fb = fb;
        this.searchForm = this.fb.group({
            keyword: [''],
            location: [''],
            jobType: [''],
            experience: ['']
        });
    }
    ngOnInit() {
        this.loadJobs();
        this.searchForm.valueChanges.subscribe(() => {
            this.filterJobs();
        });
    }
    loadJobs() {
        this.isLoading = true;
        this.jobService.getAllJobs().subscribe({
            next: (jobs) => {
                this.jobs = jobs;
                this.filteredJobs = jobs;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading jobs:', error);
                this.isLoading = false;
            }
        });
    }
    filterJobs() {
        const filters = this.searchForm.value;
        this.filteredJobs = this.jobs.filter(job => {
            const matchesKeyword = !filters.keyword ||
                job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
                job.companyName.toLowerCase().includes(filters.keyword.toLowerCase()) ||
                job.skillsRequired.some(skill => skill.toLowerCase().includes(filters.keyword.toLowerCase()));
            const matchesLocation = !filters.location ||
                job.location.toLowerCase().includes(filters.location.toLowerCase());
            const matchesType = !filters.jobType || job.type === filters.jobType;
            return matchesKeyword && matchesLocation && matchesType;
        });
    }
    onSearch() {
        this.filterJobs();
    }
    onClearFilters() {
        this.searchForm.reset();
        this.filteredJobs = this.jobs;
    }
    getJobTypeClass(jobType) {
        switch (jobType) {
            case 'full-time': return 'full-time';
            case 'part-time': return 'part-time';
            case 'internship': return 'internship';
            default: return '';
        }
    }
};
JobSearchComponent = __decorate([
    Component({
        selector: 'app-job-search',
        imports: [CommonModule, ReactiveFormsModule, RouterLink, SlicePipe],
        templateUrl: './job-search.component.html',
        styleUrls: ['./job-search.component.css']
    })
], JobSearchComponent);
export { JobSearchComponent };
