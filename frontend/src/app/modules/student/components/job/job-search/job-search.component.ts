import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JobPortalJob, JobPortalStoreService } from '../../../services/job-portal-store.service';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.css']
})
export class JobSearchComponent implements OnInit {
  portalForm: FormGroup;
  jobs: JobPortalJob[] = [];
  filteredJobs: JobPortalJob[] = [];
  savedJobIds = new Set<string>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private jobPortalStore: JobPortalStoreService
  ) {
    this.portalForm = this.fb.group({
      keyword: [''],
      location: [''],
      category: [''],
      jobType: [''],
      workMode: [''],
      savedOnly: [false]
    });
  }

  ngOnInit(): void {
    this.jobs = this.jobPortalStore.getJobsSnapshot();
    this.savedJobIds = new Set(this.jobPortalStore.getSavedJobIdsSnapshot());
    this.applyFilters();

    this.portalForm.valueChanges.subscribe(() => this.applyFilters());
  }

  get totalOpenings(): number {
    return this.jobs.reduce((sum, job) => sum + job.positions, 0);
  }

  get featuredCount(): number {
    return this.jobs.filter(job => job.featured).length;
  }

  get savedCount(): number {
    return this.savedJobIds.size;
  }

  get appliedCount(): number {
    return this.jobs.filter(job => this.jobPortalStore.isJobApplied(job.id)).length;
  }

  get categories(): string[] {
    return [...new Set(this.jobs.map(job => job.category))];
  }

  applyFilters(): void {
    const filters = this.portalForm.getRawValue();
    const keyword = String(filters.keyword || '').trim().toLowerCase();
    const location = String(filters.location || '').trim().toLowerCase();

    this.filteredJobs = this.jobs.filter(job => {
      const matchesKeyword = !keyword ||
        job.title.toLowerCase().includes(keyword) ||
        job.companyName.toLowerCase().includes(keyword) ||
        job.skillsRequired.some(skill => skill.toLowerCase().includes(keyword)) ||
        job.summaryPoints.some(point => point.toLowerCase().includes(keyword));
      const matchesLocation = !location || job.location.toLowerCase().includes(location);
      const matchesCategory = !filters.category || job.category === filters.category;
      const matchesType = !filters.jobType || job.type === filters.jobType;
      const matchesWorkMode = !filters.workMode || job.workMode === filters.workMode;
      const matchesSaved = !filters.savedOnly || this.savedJobIds.has(job.id);

      return matchesKeyword && matchesLocation && matchesCategory && matchesType && matchesWorkMode && matchesSaved;
    });
  }

  clearFilters(): void {
    this.portalForm.reset({
      keyword: '',
      location: '',
      category: '',
      jobType: '',
      workMode: '',
      savedOnly: false
    });
    this.applyFilters();
  }

  toggleSave(jobId: string): void {
    this.jobPortalStore.toggleSavedJob(jobId);
    this.savedJobIds = new Set(this.jobPortalStore.getSavedJobIdsSnapshot());
    this.applyFilters();
  }

  isSaved(jobId: string): boolean {
    return this.savedJobIds.has(jobId);
  }

  isApplied(jobId: string): boolean {
    return this.jobPortalStore.isJobApplied(jobId);
  }

  browseAllJobs(): void {
    this.clearFilters();
    void this.router.navigate(['/student/job-portals']);
  }
}
