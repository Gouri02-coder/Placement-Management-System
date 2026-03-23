import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { ApplicationFilter } from '../../../models/application.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-application-filters',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './application-filters.html',
  styleUrls: ['./application-filters.css']
})
export class ApplicationFiltersComponent implements OnInit {
  @Input() applications: any[] = [];
  @Output() filtersChange = new EventEmitter<ApplicationFilter>();
  @Output() searchChange = new EventEmitter<string>();

  filters: ApplicationFilter = {};
  
  searchTerm = '';
  statusFilter = 'all';
  jobFilter = 'all';
  branchFilter = 'all';
  minCGPA = '';

  // Status options for dropdown
  statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'hired', label: 'Hired' }
  ];

  constructor() {}

  ngOnInit(): void {}

  getUniqueJobs(): string[] {
    if (!this.applications || this.applications.length === 0) {
      return [];
    }
    const jobs = [...new Set(this.applications.map(app => app.jobTitle).filter(Boolean))];
    return jobs;
  }

  getUniqueBranches(): string[] {
    if (!this.applications || this.applications.length === 0) {
      return [];
    }
    const branches = [...new Set(this.applications.map(app => app.branch).filter(Boolean))];
    return branches;
  }

  applyFilters(): void {
    this.filters = {};

    // Add job filter if not 'all'
    if (this.jobFilter && this.jobFilter !== 'all') {
      this.filters.jobId = this.jobFilter;
    }
    
    // Add status filter if not 'all'
    if (this.statusFilter && this.statusFilter !== 'all') {
      this.filters.status = this.statusFilter;
    }
    
    // Add branch filter if not 'all'
    if (this.branchFilter && this.branchFilter !== 'all') {
      this.filters.branch = this.branchFilter;
    }
    
    // Add CGPA filter if provided
    if (this.minCGPA && !isNaN(parseFloat(this.minCGPA))) {
      this.filters.minCGPA = parseFloat(this.minCGPA);
    }

    // Emit the filters
    this.filtersChange.emit(this.filters);
    
    // Also emit search term for text search
    if (this.searchTerm) {
      this.searchChange.emit(this.searchTerm);
    } else {
      this.searchChange.emit('');
    }
  }

  clearFilters(): void {
    // Reset all filter values
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.jobFilter = 'all';
    this.branchFilter = 'all';
    this.minCGPA = '';
    this.filters = {};
    
    // Emit empty filters and empty search
    this.filtersChange.emit(this.filters);
    this.searchChange.emit('');
  }

  onSearchChange(): void {
    // Debounce search to avoid too many emissions
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.applyFilters();
    }, 300);
  }

  private searchTimeout: any;

  // Helper method to check if any filters are active
  hasActiveFilters(): boolean {
    return this.statusFilter !== 'all' || 
           this.jobFilter !== 'all' || 
           this.branchFilter !== 'all' || 
           this.minCGPA !== '' || 
           this.searchTerm !== '';
  }

  // Get count of active filters
  getActiveFiltersCount(): number {
    let count = 0;
    if (this.statusFilter !== 'all') count++;
    if (this.jobFilter !== 'all') count++;
    if (this.branchFilter !== 'all') count++;
    if (this.minCGPA) count++;
    if (this.searchTerm) count++;
    return count;
  }

  // Format CGPA display
  getCGPAValue(): string {
    if (!this.minCGPA) return '';
    return parseFloat(this.minCGPA).toFixed(1);
  }

  // Reset individual filter
  resetFilter(filterName: string): void {
    switch (filterName) {
      case 'status':
        this.statusFilter = 'all';
        break;
      case 'job':
        this.jobFilter = 'all';
        break;
      case 'branch':
        this.branchFilter = 'all';
        break;
      case 'cgpa':
        this.minCGPA = '';
        break;
      case 'search':
        this.searchTerm = '';
        break;
    }
    this.applyFilters();
  }
}