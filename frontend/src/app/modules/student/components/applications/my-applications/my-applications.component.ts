import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DemoApplication } from '../demo-applications.data';
import { JobPortalStoreService } from '../../../services/job-portal-store.service';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.css']
})
export class MyApplicationsComponent implements OnInit {
  applications: DemoApplication[] = [];
  filteredApplications: DemoApplication[] = [];
  isLoading = false;
  selectedStatus = 'all';

  readonly statusFilters = [
    { value: 'all', label: 'All Applications', helper: 'Every active application', icon: 'ALL', count: 0 },
    { value: 'applied', label: 'Applied', helper: 'Recently submitted', icon: 'AP', count: 0 },
    { value: 'under-review', label: 'Under Review', helper: 'Recruiter is reviewing', icon: 'RV', count: 0 },
    { value: 'shortlisted', label: 'Shortlisted', helper: 'Ready for next step', icon: 'SL', count: 0 },
    { value: 'selected', label: 'Selected', helper: 'Offer confirmed', icon: 'OK', count: 0 },
    { value: 'rejected', label: 'Rejected', helper: 'Closed applications', icon: 'RJ', count: 0 }
  ];

  constructor(private jobPortalStore: JobPortalStoreService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    this.applications = this.jobPortalStore.getApplicationsSnapshot();
    this.applyCurrentFilter();
    this.isLoading = false;
  }

  get totalApplications(): number {
    return this.applications.length;
  }

  get activeReviews(): number {
    return this.applications.filter(application =>
      application.status === 'applied' || application.status === 'under-review'
    ).length;
  }

  get upcomingInterviews(): number {
    return this.applications.filter(application => !!application.interviewDate).length;
  }

  get averageMatchScore(): number {
    if (this.applications.length === 0) {
      return 0;
    }

    return Math.round(
      this.applications.reduce((sum, application) => sum + application.matchScore, 0) / this.applications.length
    );
  }

  updateStatusCounts(): void {
    this.statusFilters.forEach(filter => {
      filter.count = filter.value === 'all'
        ? this.applications.length
        : this.applications.filter(application => application.status === filter.value).length;
    });
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.applyCurrentFilter();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'applied': return 'status-applied';
      case 'under-review': return 'status-review';
      case 'shortlisted': return 'status-shortlisted';
      case 'selected': return 'status-selected';
      case 'rejected': return 'status-rejected';
      default: return 'status-applied';
    }
  }

  getStatusLabel(status: DemoApplication['status']): string {
    switch (status) {
      case 'under-review': return 'Under Review';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  }

  withdrawApplication(applicationId: string): void {
    if (!confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    this.jobPortalStore.updateApplication(applicationId, { status: 'rejected', recruiterNote: 'Application withdrawn from the current recruitment cycle.' });
    this.applications = this.jobPortalStore.getApplicationsSnapshot();
    this.applyCurrentFilter();
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

  private applyCurrentFilter(): void {
    this.filteredApplications = this.selectedStatus === 'all'
      ? [...this.applications]
      : this.applications.filter(application => application.status === this.selectedStatus);

    this.updateStatusCounts();
  }
}
