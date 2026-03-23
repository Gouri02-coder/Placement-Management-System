import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { ApplicationFilter } from '../../../models/application.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-application-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './application-filters.html',
  styleUrls: ['./application-filters.css']
})
export class ApplicationFiltersComponent implements OnInit {
  @Input() applications: any[] = [];
  @Output() filtersChange = new EventEmitter<ApplicationFilter>();

  filters: ApplicationFilter = {};
  
  searchTerm = '';
  statusFilter = 'all';
  jobFilter = 'all';
  branchFilter = 'all';
  minCGPA = '';

  ngOnInit(): void {}

  getUniqueJobs(): string[] {
    const jobs = [...new Set(this.applications.map(app => app.jobTitle))];
    return jobs;
  }

  getUniqueBranches(): string[] {
    const branches = [...new Set(this.applications.map(app => app.branch))];
    return branches;
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
    
    if (this.minCGPA) {
      this.filters.minCGPA = parseFloat(this.minCGPA);
    }

    this.filtersChange.emit(this.filters);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.jobFilter = 'all';
    this.branchFilter = 'all';
    this.minCGPA = '';
    this.filters = {};
    this.filtersChange.emit(this.filters);
  }

  onSearchChange(): void {
    // Emit search term separately if needed
    // This can be handled by parent component
  }
}
