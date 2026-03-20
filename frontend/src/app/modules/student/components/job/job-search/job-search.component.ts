import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { JobService } from '../../../services/job.service';
import { Job } from '../../../models/job.model';
import { CommonModule, SlicePipe } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-job-search',
  imports: [CommonModule,ReactiveFormsModule,RouterLink,SlicePipe],
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.css']
})
export class JobSearchComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  searchForm: FormGroup;
  isLoading = false;
  searchQuery = '';

  constructor(
    private jobService: JobService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      keyword: [''],
      location: [''],
      jobType: [''],
      experience: ['']
    });
  }

  ngOnInit(): void {
    this.loadJobs();
    this.searchForm.valueChanges.subscribe(() => {
      this.filterJobs();
    });
  }

  loadJobs(): void {
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

  filterJobs(): void {
    const filters = this.searchForm.value;
    this.filteredJobs = this.jobs.filter(job => {
      const matchesKeyword = !filters.keyword || 
        job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.companyName.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.skillsRequired.some(skill => 
          skill.toLowerCase().includes(filters.keyword.toLowerCase())
        );

      const matchesLocation = !filters.location || 
        job.location.toLowerCase().includes(filters.location.toLowerCase());

      const matchesType = !filters.jobType || job.type === filters.jobType;

      return matchesKeyword && matchesLocation && matchesType;
    });
  }

  onSearch(): void {
    this.filterJobs();
  }

  onClearFilters(): void {
    this.searchForm.reset();
    this.filteredJobs = this.jobs;
  }

  getJobTypeClass(jobType: string): string {
    switch (jobType) {
      case 'full-time': return 'full-time';
      case 'part-time': return 'part-time';
      case 'internship': return 'internship';
      default: return '';
    }
  }
}