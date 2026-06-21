import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Application, ApplicationFilter } from '../../../models/application.model';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

const STATIC_APPLICATIONS: Application[] = [
  {
    id: 'app_001',
    jobId: 'drive_frontend_01',
    jobTitle: 'Frontend Developer',
    studentId: 'stud_001',
    candidateName: 'Aarav Mehta',
    candidateEmail: 'aarav.mehta@example.com',
    candidatePhone: '+91 9876543210',
    branch: 'Computer Science',
    cgpa: 8.7,
    yearOfPassing: 2026,
    skills: ['Angular', 'TypeScript', 'RxJS', 'Tailwind CSS'],
    resumeUrl: 'https://example.com/resumes/aarav-mehta.pdf',
    coverLetter: 'Excited to contribute to scalable frontend systems and design-led product teams.',
    status: 'pending',
    appliedAt: new Date('2026-03-18T10:30:00'),
    updatedAt: new Date('2026-03-18T10:30:00')
  },
  {
    id: 'app_002',
    jobId: 'drive_frontend_01',
    jobTitle: 'Frontend Developer',
    studentId: 'stud_002',
    candidateName: 'Diya Nair',
    candidateEmail: 'diya.nair@example.com',
    candidatePhone: '+91 9876543211',
    branch: 'Information Technology',
    cgpa: 9.1,
    yearOfPassing: 2026,
    skills: ['Angular', 'Figma', 'JavaScript', 'SCSS'],
    resumeUrl: 'https://example.com/resumes/diya-nair.pdf',
    status: 'reviewed',
    appliedAt: new Date('2026-03-17T14:20:00'),
    updatedAt: new Date('2026-03-19T09:00:00')
  },
  {
    id: 'app_003',
    jobId: 'drive_backend_01',
    jobTitle: 'Backend Engineer',
    studentId: 'stud_003',
    candidateName: 'Rohan Kapoor',
    candidateEmail: 'rohan.kapoor@example.com',
    candidatePhone: '+91 9876543212',
    branch: 'Computer Science',
    cgpa: 8.4,
    yearOfPassing: 2025,
    skills: ['Java', 'Spring Boot', 'SQL', 'REST APIs'],
    resumeUrl: 'https://example.com/resumes/rohan-kapoor.pdf',
    status: 'shortlisted',
    appliedAt: new Date('2026-03-14T11:45:00'),
    updatedAt: new Date('2026-03-20T12:10:00')
  },
  {
    id: 'app_004',
    jobId: 'drive_backend_01',
    jobTitle: 'Backend Engineer',
    studentId: 'stud_004',
    candidateName: 'Sneha Iyer',
    candidateEmail: 'sneha.iyer@example.com',
    candidatePhone: '+91 9876543213',
    branch: 'Data Science',
    cgpa: 8.9,
    yearOfPassing: 2026,
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    resumeUrl: 'https://example.com/resumes/sneha-iyer.pdf',
    status: 'pending',
    appliedAt: new Date('2026-03-20T09:10:00'),
    updatedAt: new Date('2026-03-20T09:10:00')
  },
  {
    id: 'app_005',
    jobId: 'drive_data_01',
    jobTitle: 'Data Analyst',
    studentId: 'stud_005',
    candidateName: 'Karthik Raman',
    candidateEmail: 'karthik.raman@example.com',
    candidatePhone: '+91 9876543214',
    branch: 'Electronics & Communication',
    cgpa: 7.9,
    yearOfPassing: 2026,
    skills: ['SQL', 'Power BI', 'Excel', 'Python'],
    resumeUrl: 'https://example.com/resumes/karthik-raman.pdf',
    status: 'reviewed',
    appliedAt: new Date('2026-03-16T16:40:00'),
    updatedAt: new Date('2026-03-21T08:25:00')
  },
  {
    id: 'app_006',
    jobId: 'drive_devops_01',
    jobTitle: 'Cloud Support Associate',
    studentId: 'stud_006',
    candidateName: 'Nisha Verma',
    candidateEmail: 'nisha.verma@example.com',
    candidatePhone: '+91 9876543215',
    branch: 'Information Technology',
    cgpa: 8.2,
    yearOfPassing: 2025,
    skills: ['AWS', 'Linux', 'Networking', 'CI/CD'],
    resumeUrl: 'https://example.com/resumes/nisha-verma.pdf',
    status: 'hired',
    appliedAt: new Date('2026-03-11T13:15:00'),
    updatedAt: new Date('2026-03-22T17:45:00')
  },
  {
    id: 'app_007',
    jobId: 'drive_ops_01',
    jobTitle: 'Operations Analyst',
    studentId: 'stud_007',
    candidateName: 'Pranav Shah',
    candidateEmail: 'pranav.shah@example.com',
    candidatePhone: '+91 9876543216',
    branch: 'Mechanical Engineering',
    cgpa: 7.6,
    yearOfPassing: 2026,
    skills: ['Excel', 'Operations', 'Reporting', 'Communication'],
    resumeUrl: 'https://example.com/resumes/pranav-shah.pdf',
    status: 'rejected',
    appliedAt: new Date('2026-03-12T15:50:00'),
    updatedAt: new Date('2026-03-19T11:05:00')
  },
  {
    id: 'app_008',
    jobId: 'drive_uiux_01',
    jobTitle: 'UI Engineer',
    studentId: 'stud_008',
    candidateName: 'Ishita Sen',
    candidateEmail: 'ishita.sen@example.com',
    candidatePhone: '+91 9876543217',
    branch: 'Computer Science',
    cgpa: 9.3,
    yearOfPassing: 2026,
    skills: ['HTML', 'CSS', 'Angular', 'Design Systems'],
    resumeUrl: 'https://example.com/resumes/ishita-sen.pdf',
    status: 'shortlisted',
    appliedAt: new Date('2026-03-23T10:05:00'),
    updatedAt: new Date('2026-03-24T14:30:00')
  }
];

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.html',
  styleUrls: ['./application-list.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, UpperCasePipe, DatePipe]
})
export class ApplicationListComponent implements OnInit {
  private readonly allApplications: Application[] = STATIC_APPLICATIONS.map(application => ({
    ...application,
    skills: [...application.skills]
  }));

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
    this.getCompanyId();
    this.applications = this.allApplications.map(application => ({
      ...application,
      skills: [...application.skills]
    }));
    this.refreshFilteredApplications();
    this.isLoading = false;
  }

  private getCompanyId(): string {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData).companyId : '';
  }

  applyFilters(): void {
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

    this.currentPage = 1;
    this.refreshFilteredApplications();
  }

  searchApplications(): void {
    this.currentPage = 1;
    this.refreshFilteredApplications();
  }

  private calculateTotalPages(): void {
    this.totalPages = Math.ceil((this.filteredApplications?.length || 0) / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
  }

  get paginatedApplications(): Application[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return (this.filteredApplications || []).slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.filteredApplications?.length || 0);
  }

  // Selection methods
  toggleSelectAll(): void {
    if (this.selectAll) {
      this.selectedApplications.clear();
      this.selectAll = false;
    } else {
      this.paginatedApplications.forEach(app => {
        if (app?.id) {
          this.selectedApplications.add(app.id);
        }
      });
      this.selectAll = true;
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
    const validApps = paginatedApps.filter(app => app?.id);
    this.selectAll = validApps.length > 0 && 
                    validApps.every(app => app?.id && this.selectedApplications.has(app.id));
  }

  get selectedCount(): number {
    return this.selectedApplications.size;
  }

  // Status update methods
  updateApplicationStatus(applicationId: string | undefined, newStatus: string): void {
    if (!applicationId) return;
    const application = this.allApplications.find(app => app.id === applicationId);
    if (!application) return;

    application.status = newStatus as Application['status'];
    application.updatedAt = new Date();
    this.selectedApplications.delete(applicationId);
    this.refreshFilteredApplications();
  }

  bulkUpdateStatus(newStatus: string): void {
    if (this.selectedApplications.size === 0) {
      alert('Please select at least one application.');
      return;
    }

    if (confirm(`Are you sure you want to update ${this.selectedApplications.size} application(s) to ${newStatus.toUpperCase()}?`)) {
      Array.from(this.selectedApplications).forEach(applicationId => {
        const application = this.allApplications.find(app => app.id === applicationId);
        if (application) {
          application.status = newStatus as Application['status'];
          application.updatedAt = new Date();
        }
      });

      this.selectedApplications.clear();
      this.selectAll = false;
      this.refreshFilteredApplications();
      alert('Applications updated successfully!');
    }
  }

  // Export methods
  exportToExcel(): void {
    const headers = ['Candidate', 'Email', 'Phone', 'Job', 'Branch', 'CGPA', 'Status', 'Applied On'];
    const rows = this.filteredApplications.map(application => ([
      application.candidateName,
      application.candidateEmail,
      application.candidatePhone,
      application.jobTitle,
      application.branch,
      application.cgpa.toFixed(2),
      application.status,
      application.appliedAt.toISOString().split('T')[0]
    ]));

    const csvContent = [headers, ...rows]
      .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    this.downloadFile(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }), `applications_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  }

  exportToPDF(): void {
    const reportContent = this.filteredApplications.map(application =>
      [
        `Candidate: ${application.candidateName}`,
        `Job: ${application.jobTitle}`,
        `Branch: ${application.branch}`,
        `CGPA: ${application.cgpa.toFixed(2)}`,
        `Status: ${application.status.toUpperCase()}`,
        `Applied: ${application.appliedAt.toDateString()}`
      ].join('\n')
    ).join('\n\n');

    this.downloadFile(new Blob([reportContent], { type: 'text/plain;charset=utf-8;' }), `applications_report_${new Date().toISOString().split('T')[0]}.txt`, 'text/plain');
  }

  private downloadFile(blob: Blob, filename: string, contentType: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Navigation methods
  viewCandidateProfile(applicationId: string | undefined): void {
    if (!applicationId) return;
    this.router.navigate(['/company/applications/candidate', applicationId]);
  }

  viewResume(application: Application | undefined): void {
    if (!application?.resumeUrl) {
      alert('Resume not available.');
      return;
    }
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
    this.currentPage = 1;
    this.refreshFilteredApplications();
  }

  private refreshFilteredApplications(): void {
    const minimumCgpa = this.minCGPAPicker ? parseFloat(this.minCGPAPicker) : null;
    const searchLower = this.searchTerm.trim().toLowerCase();

    this.filteredApplications = this.applications.filter(application => {
      if (!application) {
        return false;
      }

      const matchesJob = this.jobFilter === 'all' ||
        application.jobTitle === this.jobFilter ||
        application.jobId === this.jobFilter;
      const matchesStatus = this.statusFilter === 'all' || application.status === this.statusFilter;
      const matchesBranch = this.branchFilter === 'all' || application.branch === this.branchFilter;
      const matchesCgpa = minimumCgpa === null || application.cgpa >= minimumCgpa;
      const matchesSearch = !searchLower ||
        application.candidateName.toLowerCase().includes(searchLower) ||
        application.candidateEmail.toLowerCase().includes(searchLower) ||
        application.jobTitle.toLowerCase().includes(searchLower);

      return matchesJob && matchesStatus && matchesBranch && matchesCgpa && matchesSearch;
    });

    this.pruneSelection();
    this.calculateTotalPages();
    this.updateSelectAllState();
  }

  private pruneSelection(): void {
    const validIds = new Set(this.applications.map(application => application.id));
    this.selectedApplications.forEach(applicationId => {
      if (!validIds.has(applicationId)) {
        this.selectedApplications.delete(applicationId);
      }
    });
  }
}
