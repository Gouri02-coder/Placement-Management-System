import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { JobCreateRequest } from '../../../models/job.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-create',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './job-create.html',
  styleUrls: ['./job-create.css']
})
export class JobCreateComponent implements OnInit {
  jobForm: FormGroup;
  isSubmitting = false;
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
    private router: Router,
    private jobService: JobService
  ) {
    this.jobForm = this.createForm();
  }

  ngOnInit(): void {}

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(100), Validators.maxLength(5000)]],
      type: ['fulltime', [Validators.required]],
      location: ['onsite', [Validators.required]],
      category: ['', [Validators.required, Validators.minLength(3)]],
      
      // Salary/Stipend
      compensationType: ['salary'],
      salary: this.fb.group({
        min: [null, [Validators.min(0)]],
        max: [null, [Validators.min(0)]],
        currency: ['INR']
      }),
      stipend: [null, [Validators.min(0)]],
      
      // Eligibility
      eligibility: this.fb.group({
        branches: [[], [Validators.required, Validators.minLength(1)]],
        minCGPA: [null, [Validators.min(0), Validators.max(10)]],
        yearOfPassing: [[new Date().getFullYear()], [Validators.required]],
        requiredSkills: [[], [Validators.required, Validators.minLength(1)]],
        additionalRequirements: ['']
      }),
      
      applicationDeadline: ['', [Validators.required]],
      status: ['draft']
    }, { validators: this.salaryRangeValidator });
  }

  private salaryRangeValidator(group: FormGroup): any {
    const compensationType = group.get('compensationType')?.value;
    if (compensationType === 'salary') {
      const min = group.get('salary.min')?.value;
      const max = group.get('salary.max')?.value;
      if (min && max && min > max) {
        return { salaryRangeInvalid: true };
      }
    }
    return null;
  }

  get compensationType(): string {
    return this.jobForm.get('compensationType')?.value;
  }

  toggleBranch(branch: string): void {
    const branches = [...(this.jobForm.get('eligibility.branches')?.value || [])];
    const index = branches.indexOf(branch);
    
    if (index > -1) {
      branches.splice(index, 1);
    } else {
      branches.push(branch);
    }
    
    this.jobForm.get('eligibility.branches')?.setValue(branches);
    this.jobForm.get('eligibility.branches')?.markAsTouched();
  }

  toggleSkill(skill: string): void {
    const skills = [...(this.jobForm.get('eligibility.requiredSkills')?.value || [])];
    const index = skills.indexOf(skill);
    
    if (index > -1) {
      skills.splice(index, 1);
    } else {
      skills.push(skill);
    }
    
    this.jobForm.get('eligibility.requiredSkills')?.setValue(skills);
    this.jobForm.get('eligibility.requiredSkills')?.markAsTouched();
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
      this.jobForm.get('stipend')?.clearValidators();
      this.jobForm.get('salary.min')?.setValidators([Validators.min(0)]);
      this.jobForm.get('salary.max')?.setValidators([Validators.min(0)]);
    } else {
      this.jobForm.get('salary')?.patchValue({ min: null, max: null, currency: 'INR' });
      this.jobForm.get('salary.min')?.clearValidators();
      this.jobForm.get('salary.max')?.clearValidators();
      this.jobForm.get('stipend')?.setValidators([Validators.min(0)]);
    }
    this.jobForm.get('salary.min')?.updateValueAndValidity();
    this.jobForm.get('salary.max')?.updateValueAndValidity();
    this.jobForm.get('stipend')?.updateValueAndValidity();
  }

  onSubmit(isPublish: boolean = false): void {
    if (this.jobForm.valid) {
      this.isSubmitting = true;
      const formValue = this.jobForm.value;
      
      // Prepare salary data - without the 'type' property
      let salaryData = undefined;
      if (formValue.compensationType === 'salary' && formValue.salary.min) {
        salaryData = {
          min: formValue.salary.min,
          max: formValue.salary.max || formValue.salary.min,
          currency: formValue.salary.currency
        };
      }
      
      const jobData: JobCreateRequest = {
        title: formValue.title.trim(),
        description: formValue.description.trim(),
        type: formValue.type,
        location: formValue.location,
        category: formValue.category.trim(),
        salary: salaryData,
        stipend: formValue.compensationType === 'stipend' ? formValue.stipend : undefined,
        eligibility: {
          branches: formValue.eligibility.branches,
          minCGPA: formValue.eligibility.minCGPA,
          yearOfPassing: formValue.eligibility.yearOfPassing,
          requiredSkills: formValue.eligibility.requiredSkills,
          additionalRequirements: formValue.eligibility.additionalRequirements?.trim() || ''
        },
        applicationDeadline: new Date(formValue.applicationDeadline),
        status: isPublish ? 'active' : 'draft'
      };

      this.jobService.createJob(jobData).subscribe({
        next: (createdJob) => {
          this.isSubmitting = false;
          const message = isPublish ? 'Job published successfully!' : 'Job saved as draft successfully!';
          alert(message);
          this.router.navigate(['/company/jobs']);
        },
        error: (error) => {
          console.error('Error creating job:', error);
          this.isSubmitting = false;
          alert(error.error?.message || 'Error creating job. Please try again.');
        }
      });
    } else {
      this.markFormGroupTouched(this.jobForm);
      this.scrollToFirstError();
    }
  }

  saveAsDraft(): void {
    this.onSubmit(false);
  }

  publishJob(): void {
    this.onSubmit(true);
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

  private scrollToFirstError(): void {
    const firstError = document.querySelector('.error-message');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  cancel(): void {
    if (this.jobForm.dirty) {
      if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
        this.router.navigate(['/company/jobs']);
      }
    } else {
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
  get selectedBranches(): string[] { return this.jobForm.get('eligibility.branches')?.value || []; }
  get selectedSkills(): string[] { return this.jobForm.get('eligibility.requiredSkills')?.value || []; }

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

  get salaryRangeError(): boolean {
    return this.jobForm.hasError('salaryRangeInvalid') && 
           this.jobForm.get('compensationType')?.value === 'salary';
  }
}