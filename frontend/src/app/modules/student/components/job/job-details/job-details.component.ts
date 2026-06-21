import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobPortalJob, JobPortalStoreService } from '../../../services/job-portal-store.service';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, DatePipe, TitleCasePipe, RouterLink],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {
  job: JobPortalJob | null = null;
  hasApplied = false;
  isSaved = false;
  skillsMatchPercentage = 84;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobPortalStore: JobPortalStoreService
  ) {}

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    this.job = this.jobPortalStore.getJobById(jobId);
    if (jobId) {
      this.hasApplied = this.jobPortalStore.isJobApplied(jobId);
      this.isSaved = this.jobPortalStore.isJobSaved(jobId);
    }
  }

  onSaveJob(): void {
    if (!this.job) {
      return;
    }

    this.jobPortalStore.toggleSavedJob(this.job.id);
    this.isSaved = this.jobPortalStore.isJobSaved(this.job.id);
  }

  onBack(): void {
    void this.router.navigate(['/student/job-portals']);
  }

  isApplicationDeadlinePassed(): boolean {
    if (!this.job) {
      return true;
    }
    return new Date(this.job.applicationDeadline) < new Date();
  }
}
