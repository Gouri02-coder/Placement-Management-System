import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// Add the services we created earlier
import { JobService } from '../../../services/job.service';
import { ApplicationService } from '../../../services/application.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { Job } from '../../../../../core/models/job.model'; 

@Component({
  selector: 'app-apply-job',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apply-job.component.html',
  styleUrls: ['./apply-job.component.css']
})
export class ApplyJobComponent implements OnInit {
  // Using the Job model we synced with the backend
  job: Job | any = {
    id: '',
    title: '',
    companyName: '',
    description: '',
    requirements: '',
    salary: 0,
    location: '',
    jobType: 'full-time',
    applyDeadline: new Date()
  };

  application = {
    resume: '',
    coverLetter: '',
    availability: 'immediately',
    expectedSalary: '',
    additionalInfo: ''
  };

  resumes = [
    'Resume_2024_Technical.pdf',
    'Resume_2024_General.pdf'
  ];

  isSubmitting = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jobService: JobService,
    private applicationService: ApplicationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    this.loadJobDetails(jobId);
  }

  loadJobDetails(jobId: string | null): void {
    if (jobId) {
      // Fetch REAL job details from the Spring Boot API
      this.jobService.getJobById(Number(jobId)).subscribe({
        next: (data) => {
          this.job = data;
        },
        error: (err) => {
          console.error('Error fetching job details', err);
          alert('Failed to load job details.');
        }
      });
    }
  }

  onSubmit(): void {
    if (!this.application.resume) {
      alert('Please select a resume to apply.');
      return;
    }

    if (!this.job || !this.job.id) return;

    // 1. Get the currently logged-in student
    const currentUser = this.authService.currentUserValue;
    if (!currentUser || !currentUser.id) {
      alert('Session expired. Please log in again.');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.isSubmitting = true;
    const studentId = Number(currentUser.id);

    // 2. Send the real application to the backend
    this.applicationService.applyForJob(studentId, this.job.id).subscribe({
      next: (res) => {
        alert('Application submitted successfully!');
        this.isSubmitting = false;
        // Keeping your original redirect path
        this.router.navigate(['/student/applications']); 
      },
      error: (err) => {
        // Handle backend errors (e.g., "You have already applied for this job.")
        const errorMsg = typeof err.error === 'string' ? err.error : 'Failed to submit application.';
        alert(errorMsg);
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/student/placement-drives']);
  }

  canApply(): boolean {
    if (!this.job || !this.job.applyDeadline) return false;
    // Ensure we are comparing actual Date objects
    return new Date() < new Date(this.job.applyDeadline);
  }
}