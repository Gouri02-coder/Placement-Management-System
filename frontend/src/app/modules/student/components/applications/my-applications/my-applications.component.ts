import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../../services/application.service';
import { JobApplication } from '../../../models/job.model';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-applications',
  imports: [CommonModule,DatePipe,RouterLink],
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.css']
})
export class MyApplicationsComponent implements OnInit {
  applications: JobApplication[] = [];
  filteredApplications: JobApplication[] = [];
  isLoading = false;
  selectedStatus = 'all';

  statusFilters = [
    { value: 'all', label: 'All Applications', count: 0 },
    { value: 'applied', label: 'Applied', count: 0 },
    { value: 'under-review', label: 'Under Review', count: 0 },
    { value: 'shortlisted', label: 'Shortlisted', count: 0 },
    { value: 'rejected', label: 'Rejected', count: 0 },
    { value: 'selected', label: 'Selected', count: 0 }
  ];

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    const studentId = '123'; // Get from auth service
    this.applicationService.getStudentApplications(studentId).subscribe({
      next: (applications) => {
        this.applications = applications.filter(app => app.status !== 'draft') as JobApplication[];
        this.filteredApplications = this.applications;
        this.updateStatusCounts();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.isLoading = false;
      }
    });
  }

  updateStatusCounts(): void {
    this.statusFilters.forEach(filter => {
      if (filter.value === 'all') {
        filter.count = this.applications.length;
      } else {
        filter.count = this.applications.filter(app => app.status === filter.value).length;
      }
    });
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    if (status === 'all') {
      this.filteredApplications = this.applications;
    } else {
      this.filteredApplications = this.applications.filter(app => app.status === status);
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'applied': return 'status-applied';
      case 'under-review': return 'status-review';
      case 'shortlisted': return 'status-shortlisted';
      case 'selected': return 'status-selected';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'applied': return 'fas fa-paper-plane';
      case 'under-review': return 'fas fa-search';
      case 'shortlisted': return 'fas fa-list';
      case 'selected': return 'fas fa-check-circle';
      case 'rejected': return 'fas fa-times-circle';
      default: return 'fas fa-file-alt';
    }
  }

  withdrawApplication(applicationId: string): void {
    if (confirm('Are you sure you want to withdraw this application?')) {
      this.applicationService.withdrawApplication(applicationId).subscribe({
        next: () => {
          this.applications = this.applications.filter(app => app.id !== applicationId);
          this.filteredApplications = this.filteredApplications.filter(app => app.id !== applicationId);
          this.updateStatusCounts();
        },
        error: (error) => {
          console.error('Error withdrawing application:', error);
        }
      });
    }
  }

  getDaysSinceApplied(date: Date): string {
    const appliedDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - appliedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }
}