import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobPortalJob, JobPortalStoreService } from '../../../services/job-portal-store.service';

@Component({
  selector: 'app-apply-job',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './apply-job.component.html',
  styleUrls: ['./apply-job.component.css']
})
export class ApplyJobComponent implements OnInit {
  job: JobPortalJob | null = null;
  isSubmitting = false;
  hasAlreadyApplied = false;

  application = {
    resumeUrl: 'https://example.com/resume/riya-sharma-latest.pdf',
    coverLetter: '',
    availability: 'Available within 30 days',
    expectedSalary: '',
    portfolioUrl: '',
    githubUrl: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jobPortalStore: JobPortalStoreService
  ) {}

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('jobId');
    this.job = this.jobPortalStore.getJobById(jobId);
    this.hasAlreadyApplied = jobId ? this.jobPortalStore.isJobApplied(jobId) : false;
    if (this.job) {
      this.application.coverLetter = `I am excited to apply for the ${this.job.title} role at ${this.job.companyName}. My projects and learning path align well with the requirements of this opportunity.`;
    }
  }

  onSubmit(): void {
    if (!this.job || this.hasAlreadyApplied) {
      return;
    }

    this.isSubmitting = true;
    const created = this.jobPortalStore.createApplication(this.job.id, this.application);
    this.isSubmitting = false;

    if (created) {
      alert('Application submitted successfully!');
      void this.router.navigate(['/student/applications']);
    } else {
      alert('You have already applied for this job.');
    }
  }

  onCancel(): void {
    void this.router.navigate(['/student/job-portals']);
  }

  getCompensationRange(): string {
    if (!this.job) {
      return '';
    }

    return `INR ${this.job.salary.min / 1000}k - ${this.job.salary.max / 1000}k`;
  }

  getDeadlineMessage(): string {
    if (!this.job) {
      return '';
    }

    const now = new Date();
    const deadline = new Date(this.job.applicationDeadline);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Deadline closed';
    }

    if (diffDays === 0) {
      return 'Deadline today';
    }

    if (diffDays === 1) {
      return '1 day left to apply';
    }

    return `${diffDays} days left to apply`;
  }
}
