import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './job-list.html',
  styleUrls: ['./job-list.css']
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  isLoading = false;
  searchTerm = '';
  statusFilter = 'all';
  typeFilter = 'all';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 1;

  constructor(
    private jobService: JobService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  private loadJobs(): void {
    this.isLoading = true;
    const companyId = this.getCompanyId();
    
    this.jobService.getJobsByCompany(companyId).subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.filteredJobs = [...jobs];
        this.calculateTotalPages();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.isLoading = false;
      }
    });
  }

  private getCompanyId(): string {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData).companyId : '';
  }

  applyFilters(): void {
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

  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredJobs.length / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
  }

  get paginatedJobs(): Job[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredJobs.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPages(): number[] {
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

  createJob(): void {
    this.router.navigate(['/company/jobs/create']);
  }

  editJob(jobId: string): void {
    this.router.navigate(['/company/jobs/edit', jobId]);
  }

  viewApplications(jobId: string): void {
    this.router.navigate(['/company/applications'], { queryParams: { jobId } });
  }

  closeJob(jobId: string): void {
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

  extendDeadline(jobId: string): void {
    const newDeadline = prompt('Enter new deadline (YYYY-MM-DD):');
    if (newDeadline) {
      const deadlineDate = new Date(newDeadline);
      if (isNaN(deadlineDate.getTime())) {
        alert('Invalid date format. Please use YYYY-MM-DD format.');
        return;
      }
      
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

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'draft': return 'status-draft';
      case 'closed': return 'status-closed';
      case 'expired': return 'status-expired';
      default: return 'status-draft';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'fulltime': return 'work';
      case 'parttime': return 'schedule';
      case 'internship': return 'school';
      default: return 'work';
    }
  }

  getLocationIcon(location: string): string {
    switch (location) {
      case 'remote': return 'home';
      case 'hybrid': return 'sync';
      case 'onsite': return 'business';
      default: return 'location_on';
    }
  }

  isJobExpired(job: Job): boolean {
    return new Date(job.applicationDeadline) < new Date() && job.status === 'active';
  }
}

// job.model.ts
export interface Eligibility {
  branches: string[];
  minCGPA: number;
  yearOfPassing: number[];
  requiredSkills: string[];
  additionalRequirements?: string;
}

export interface Salary {
  min: number;
  max: number;
  currency: string;
  type: 'fixed' | 'range';
}

export interface Job {
  id: string;
  companyId: string;  // Required - links job to company
  title: string;
  description: string;
  category: string;  // Required - job category (e.g., 'Engineering', 'Sales', 'Marketing')
  status: 'active' | 'draft' | 'closed' | 'expired';
  type: 'fulltime' | 'parttime' | 'internship';
  location: 'remote' | 'hybrid' | 'onsite';
  applicationDeadline: Date;
  createdAt: Date;
  updatedAt: Date;
  applicationsCount: number;
  eligibility: Eligibility;
  salary?: Salary;
  stipend?: number;
  // Optional fields you might have
  experience?: string;
  vacancies?: number;
}