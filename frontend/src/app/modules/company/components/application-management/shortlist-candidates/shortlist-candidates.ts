import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../../services/application.service';
import { Application } from '../../../models/application.model';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shortlist-candidates',
  imports: [DatePipe, UpperCasePipe, CommonModule, FormsModule],
  templateUrl: './shortlist-candidates.html',
  styleUrls: ['./shortlist-candidates.css']
})
export class ShortlistCandidatesComponent implements OnInit {
  shortlistedApplications: Application[] = [];
  isLoading = false;
  searchTerm = '';
  selectedJobFilter = 'all';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadShortlistedCandidates();
  }

  private loadShortlistedCandidates(): void {
    this.isLoading = true;
    const companyId = this.getCompanyId();
    
    const filters = { status: 'shortlisted' };
    this.applicationService.getApplicationsByCompany(companyId, filters).subscribe({
      next: (applications) => {
        this.shortlistedApplications = applications;
        this.calculateTotalPages();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading shortlisted candidates:', error);
        this.isLoading = false;
      }
    });
  }

  private getCompanyId(): string {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData).companyId : '';
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredApplications.length / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
  }

  get filteredApplications(): Application[] {
    let filtered = this.shortlistedApplications;
    
    // Apply search filter
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(app => 
        app.candidateName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        app.candidateEmail.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    // Apply job filter
    if (this.selectedJobFilter !== 'all') {
      filtered = filtered.filter(app => app.jobTitle === this.selectedJobFilter);
    }
    
    return filtered;
  }

  get paginatedApplications(): Application[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredApplications.slice(startIndex, startIndex + this.itemsPerPage);
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

  removeFromShortlist(applicationId: string): void {
    if (confirm('Are you sure you want to remove this candidate from shortlist?')) {
      this.applicationService.updateApplicationStatus({
        applicationId,
        status: 'reviewed'
      }).subscribe({
        next: () => {
          this.shortlistedApplications = this.shortlistedApplications.filter(
            app => app.id !== applicationId
          );
          this.calculateTotalPages();
          alert('Candidate removed from shortlist.');
        },
        error: (error) => {
          console.error('Error updating status:', error);
          alert('Error removing candidate from shortlist.');
        }
      });
    }
  }

  hireCandidate(applicationId: string): void {
    if (confirm('Are you sure you want to mark this candidate as hired?')) {
      this.applicationService.updateApplicationStatus({
        applicationId,
        status: 'hired'
      }).subscribe({
        next: () => {
          this.shortlistedApplications = this.shortlistedApplications.filter(
            app => app.id !== applicationId
          );
          this.calculateTotalPages();
          alert('Candidate marked as hired!');
        },
        error: (error) => {
          console.error('Error updating status:', error);
          alert('Error updating candidate status.');
        }
      });
    }
  }

  viewResume(resumeUrl: string): void {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      alert('Resume not available.');
    }
  }

  // ✅ Add this method to generate avatar colors
  getAvatarColor(name: string): string {
    const colors = [
      '#667eea', '#764ba2', '#f59e0b', '#10b981', '#ef4444', 
      '#3b82f6', '#8b5cf6', '#ec489a', '#06b6d4', '#84cc16'
    ];
    
    // Generate a consistent index based on the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i);
      hash = hash & hash;
    }
    const index = Math.abs(hash) % colors.length;
    
    return colors[index];
  }

  getSkillLevel(skills: string[]): string {
    const count = skills?.length || 0;
    if (count >= 8) return 'expert';
    if (count >= 5) return 'advanced';
    if (count >= 3) return 'intermediate';
    return 'beginner';
  }

  getSkillLevelClass(skills: string[]): string {
    const level = this.getSkillLevel(skills);
    return `skill-level-${level}`;
  }

  getUniqueJobs(): string[] {
    const jobs = [...new Set(this.shortlistedApplications.map(app => app.jobTitle))];
    return jobs;
  }

  getAverageCGPA(): number {
    if (this.shortlistedApplications.length === 0) return 0;
    const total = this.shortlistedApplications.reduce((sum, app) => sum + (app.cgpa || 0), 0);
    return parseFloat((total / this.shortlistedApplications.length).toFixed(2));
  }

  getTotalCandidates(): number {
    return this.shortlistedApplications.length;
  }

  getHiringProgress(): number {
    // This would be calculated based on total positions vs hired
    return 65; // Example value - replace with actual calculation
  }

  exportToCSV(): void {
    const headers = ['Name', 'Email', 'Job Title', 'Branch', 'CGPA', 'Skills', 'Applied Date'];
    const data = this.shortlistedApplications.map(app => [
      app.candidateName,
      app.candidateEmail,
      app.jobTitle,
      app.branch,
      app.cgpa,
      app.skills?.join(', '),
      new Date(app.appliedAt).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shortlisted-candidates.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}