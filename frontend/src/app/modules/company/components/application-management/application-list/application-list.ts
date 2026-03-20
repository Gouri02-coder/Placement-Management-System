import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../../../services/application.service';
import { Application, ApplicationFilter } from '../../../models/application.model';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.html',
  styleUrls: ['./application-list.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, UpperCasePipe, DatePipe]
})
export class ApplicationListComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  isLoading = false;
  
  // Filters
  filters: ApplicationFilter = {};
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
  selectedApplications: Set<string> = new Set();
  selectAll = false;

  constructor(
    private applicationService: ApplicationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['jobId']) {
        this.filters.jobId = params['jobId'];
        this.jobFilter = params['jobId'];
      }
      this.loadApplications();
    });
  }

  private loadApplications(): void {
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

  private getCompanyId(): string {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData).companyId : '';
  }

  applyFilters(): void {
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

  searchApplications(): void {
    if (!this.applications) {
      this.filteredApplications = [];
      return;
    }

    this.filteredApplications = this.applications.filter(application => {
      if (!application) return false;
      
      const searchLower = this.searchTerm.toLowerCase();
      const matchesSearch = 
        application.candidateName?.toLowerCase().includes(searchLower) ||
        application.candidateEmail?.toLowerCase().includes(searchLower) ||
        application.jobTitle?.toLowerCase().includes(searchLower);
      return matchesSearch;
    });
    
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  private calculateTotalPages(): void {
    this.totalPages = Math.ceil((this.filteredApplications?.length || 0) / this.itemsPerPage);
  }

  get paginatedApplications(): Application[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return (this.filteredApplications || []).slice(startIndex, startIndex + this.itemsPerPage);
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

  getEndIndex(): number {
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.filteredApplications?.length || 0);
  }

  // Selection methods
  toggleSelectAll(): void {
    if (this.selectAll) {
      this.paginatedApplications.forEach(app => {
        if (app?.id) {
          this.selectedApplications.add(app.id);
        }
      });
    } else {
      this.selectedApplications.clear();
    }
  }

  toggleApplicationSelection(applicationId: string | undefined): void {
    if (!applicationId) return;
    
    if (this.selectedApplications.has(applicationId)) {
      this.selectedApplications.delete(applicationId);
    } else {
      this.selectedApplications.add(applicationId);
    }
    
    this.updateSelectAllState();
  }

  private updateSelectAllState(): void {
    const paginatedApps = this.paginatedApplications;
    this.selectAll = paginatedApps.length > 0 && 
                    paginatedApps.every(app => app?.id && this.selectedApplications.has(app.id));
  }

  get selectedCount(): number {
    return this.selectedApplications.size;
  }

  // Status update methods
  updateApplicationStatus(applicationId: string | undefined, newStatus: string): void {
    if (!applicationId) return;

    this.applicationService.updateApplicationStatus({
      applicationId,
      status: newStatus as any
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

  bulkUpdateStatus(newStatus: string): void {
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
  exportToExcel(): void {
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

  exportToPDF(): void {
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

  private downloadFile(blob: Blob, filename: string, contentType: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Navigation methods
  viewCandidateProfile(applicationId: string | undefined): void {
    if (!applicationId) return;
    this.router.navigate(['/company/applications/candidate', applicationId]);
  }

  viewResume(application: Application | undefined): void {
    if (!application?.resumeUrl) return;
    window.open(application.resumeUrl, '_blank');
  }

  // Utility methods
  getStatusClass(status: string | undefined): string {
    if (!status) return 'status-pending';
    
    switch (status) {
      case 'pending': return 'status-pending';
      case 'reviewed': return 'status-reviewed';
      case 'shortlisted': return 'status-shortlisted';
      case 'rejected': return 'status-rejected';
      case 'hired': return 'status-hired';
      default: return 'status-pending';
    }
  }

  getStatusIcon(status: string | undefined): string {
    if (!status) return 'schedule';
    
    switch (status) {
      case 'pending': return 'schedule';
      case 'reviewed': return 'visibility';
      case 'shortlisted': return 'star';
      case 'rejected': return 'cancel';
      case 'hired': return 'check_circle';
      default: return 'schedule';
    }
  }

  getUniqueJobs(): string[] {
    if (!this.applications) return [];
    const jobs = [...new Set(this.applications.map(app => app?.jobTitle).filter(Boolean))];
    return jobs as string[];
  }

  getUniqueBranches(): string[] {
    if (!this.applications) return [];
    const branches = [...new Set(this.applications.map(app => app?.branch).filter(Boolean))];
    return branches as string[];
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.jobFilter = 'all';
    this.branchFilter = 'all';
    this.minCGPAPicker = '';
    this.filters = {};
    this.loadApplications();
  }
}