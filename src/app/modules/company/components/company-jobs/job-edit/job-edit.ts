import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { Job } from '../../../models/job.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-edit',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './job-edit.html',
  styleUrls: ['./job-edit.css']
})
export class JobEditComponent implements OnInit {
  jobForm: FormGroup;
  job: Job | null = null;
  isSubmitting = false;
  isLoading = false;
  
  branches: string[] = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Chemical Engineering',
    'Biotechnology',
    'Data Science',
    'Artificial Intelligence'
  ];
  
  commonSkills: string[] = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Angular', 'Node.js',
    'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning',
    'Data Analysis', 'UI/UX Design', 'Project Management', 'Agile Methodology'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService
  ) {
    this.jobForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadJob();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(100)]],
      type: ['fulltime', [Validators.required]],
      location: ['onsite', [Validators.required]],
      category: ['', [Validators.required]],
      
      compensationType: ['salary'],
      salary: this.fb.group({
        min: [null],
        max: [null],
        currency: ['INR']
      }),
      stipend: [null],
      
      eligibility: this.fb.group({
        branches: [[], [Validators.required]],
        minCGPA: [null, [Validators.min(0), Validators.max(10)]],
        yearOfPassing: [[], [Validators.required]],
        requiredSkills: [[], [Validators.required]],
        additionalRequirements: ['']
      }),
      
      applicationDeadline: ['', [Validators.required]]
    });
  }

  private loadJob(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (!jobId) {
      alert('Invalid job ID');
      this.router.navigate(['/company/jobs']);
      return;
    }

    this.isLoading = true;
    this.jobService.getJobById(jobId).subscribe({
      next: (job) => {
        this.job = job;
        this.populateForm(job);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading job:', error);
        this.isLoading = false;
        alert('Error loading job details');
        this.router.navigate(['/company/jobs']);
      }
    });
  }

  private populateForm(job: Job): void {
    const compensationType = job.stipend ? 'stipend' : (job.salary ? 'salary' : 'salary');
    
    this.jobForm.patchValue({
      title: job.title,
      description: job.description,
      type: job.type,
      location: job.location,
      category: job.category,
      compensationType: compensationType,
      stipend: job.stipend || null,
      eligibility: {
        branches: job.eligibility.branches,
        minCGPA: job.eligibility.minCGPA,
        yearOfPassing: job.eligibility.yearOfPassing,
        requiredSkills: job.eligibility.requiredSkills,
        additionalRequirements: job.eligibility.additionalRequirements || ''
      },
      applicationDeadline: this.formatDateForInput(job.applicationDeadline)
    });

    if (job.salary) {
      this.jobForm.patchValue({
        salary: {
          min: job.salary.min,
          max: job.salary.max,
          currency: job.salary.currency
        }
      });
    }
  }

  private formatDateForInput(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  get compensationType(): string {
    return this.jobForm.get('compensationType')?.value;
  }

  get selectedBranches(): string[] {
    return this.jobForm.get('eligibility.branches')?.value || [];
  }

  get selectedSkills(): string[] {
    return this.jobForm.get('eligibility.requiredSkills')?.value || [];
  }

  toggleBranch(branch: string): void {
    const branches = this.selectedBranches;
    const index = branches.indexOf(branch);
    
    if (index > -1) {
      branches.splice(index, 1);
    } else {
      branches.push(branch);
    }
    
    this.jobForm.get('eligibility.branches')?.setValue([...branches]);
  }

  toggleSkill(skill: string): void {
    const skills = this.selectedSkills;
    const index = skills.indexOf(skill);
    
    if (index > -1) {
      skills.splice(index, 1);
    } else {
      skills.push(skill);
    }
    
    this.jobForm.get('eligibility.requiredSkills')?.setValue([...skills]);
  }

  addCustomSkill(event: any): void {
    const skill = event.target.value.trim();
    if (skill && !this.commonSkills.includes(skill)) {
      this.commonSkills.push(skill);
      this.toggleSkill(skill);
      event.target.value = '';
    }
  }

  onCompensationTypeChange(): void {
    if (this.compensationType === 'salary') {
      this.jobForm.get('stipend')?.setValue(null);
    } else {
      this.jobForm.get('salary')?.patchValue({ min: null, max: null });
    }
  }

  onSubmit(): void {
    if (this.jobForm.valid && this.job) {
      this.isSubmitting = true;
      const formValue = this.jobForm.value;
      
      const jobData: any = {
        title: formValue.title,
        description: formValue.description,
        type: formValue.type,
        location: formValue.location,
        category: formValue.category,
        eligibility: {
          branches: formValue.eligibility.branches,
          minCGPA: formValue.eligibility.minCGPA,
          yearOfPassing: formValue.eligibility.yearOfPassing,
          requiredSkills: formValue.eligibility.requiredSkills,
          additionalRequirements: formValue.eligibility.additionalRequirements
        },
        applicationDeadline: new Date(formValue.applicationDeadline)
      };

      // Handle compensation data
      if (formValue.compensationType === 'salary' && formValue.salary.min) {
        jobData.salary = {
          min: formValue.salary.min,
          max: formValue.salary.max,
          currency: formValue.salary.currency
        };
        jobData.stipend = undefined;
      } else if (formValue.compensationType === 'stipend' && formValue.stipend) {
        jobData.stipend = formValue.stipend;
        jobData.salary = undefined;
      }

      this.jobService.updateJob(this.job.id, jobData).subscribe({
        next: (updatedJob) => {
          this.isSubmitting = false;
          alert('Job updated successfully!');
          this.router.navigate(['/company/jobs']);
        },
        error: (error) => {
          console.error('Error updating job:', error);
          this.isSubmitting = false;
          alert('Error updating job. Please try again.');
        }
      });
    } else {
      this.markFormGroupTouched(this.jobForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  cancel(): void {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      this.router.navigate(['/company/jobs']);
    }
  }

  // Form field getters
  get title() { return this.jobForm.get('title'); }
  get description() { return this.jobForm.get('description'); }
  get type() { return this.jobForm.get('type'); }
  get location() { return this.jobForm.get('location'); }
  get category() { return this.jobForm.get('category'); }
  get applicationDeadline() { return this.jobForm.get('applicationDeadline'); }
  get minCGPA() { return this.jobForm.get('eligibility.minCGPA'); }
  get requiredSkills() { return this.jobForm.get('eligibility.requiredSkills'); }

  get minDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  get maxDate(): string {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString().split('T')[0];
  }

  canEditJob(): boolean {
    return this.job?.status === 'draft' || this.job?.status === 'active';
  }
}