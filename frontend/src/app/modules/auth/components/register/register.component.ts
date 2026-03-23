import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService, RegisterRequest } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  selectedRole: 'student' | 'company' | null = null;
  isLoading = false;
  showPassword = false;
  errorMessage = '';
  successMessage = '';
  registerForm: FormGroup;
  readonly roleHighlights = {
    student: ['Smart job recommendations', 'Interview tracking', 'Resume and profile scoring'],
    company: ['Candidate pipeline management', 'Role posting and shortlisting', 'Placement analytics and reports']
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.createForm();
  }

  selectRole(role: 'student' | 'company'): void {
    this.selectedRole = role;
    this.registerForm = this.createForm();
    this.errorMessage = '';
    this.successMessage = '';
  }

  createForm(): FormGroup {
    const baseForm = {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    };

    if (this.selectedRole === 'student') {
      return this.fb.group({
        ...baseForm,
        parentEmail: ['', [Validators.required, Validators.email]],
        department: ['', [Validators.required]],
        course: ['', [Validators.required]],
        year: ['', [Validators.required, Validators.min(1), Validators.max(4)]],
        cgpa: ['', [Validators.required, Validators.min(0), Validators.max(10)]]
      });
    }

    if (this.selectedRole === 'company') {
      return this.fb.group({
        ...baseForm,
        companyName: ['', [Validators.required]],
        industry: ['', [Validators.required]],
        website: ['', [Validators.pattern(/https?:\/\/.+\..+/)]],
        companySize: ['', [Validators.required]],
        address: ['', [Validators.required]],
        description: ['']
      });
    }

    return this.fb.group(baseForm);
  }

  onRegister(): void {
    if (!this.selectedRole || this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach((key) => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.registerForm.value;
    const registerData: RegisterRequest = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: this.selectedRole,
      ...(this.selectedRole === 'student' && {
        department: formData.department,
        course: formData.course,
        year: Number(formData.year),
        cgpa: Number(formData.cgpa),
        parentEmail: formData.parentEmail
      }),
      ...(this.selectedRole === 'company' && {
        companyName: formData.companyName,
        industry: formData.industry,
        website: formData.website,
        companySize: formData.companySize,
        address: formData.address,
        description: formData.description
      })
    };

    this.authService.register(registerData).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        if (response?.status === 'success') {
          this.successMessage = response.message || 'Registration successful. Redirecting to login...';
          setTimeout(() => this.router.navigate(['/auth/login']), 1200);
          return;
        }

        this.errorMessage = response?.message || 'Registration failed.';
      },
      error: (error) => {
        this.isLoading = false;

        if (error?.error) {
          if (typeof error.error === 'string') {
            this.errorMessage = error.error;
            return;
          }

          if (error.error.message) {
            this.errorMessage = error.error.message;
            return;
          }
        }

        this.errorMessage = 'Registration failed. Please try again.';
      }
    });
  }

  getRoleDisplayName(): string {
    return this.selectedRole === 'student' ? 'Student' : 'Company';
  }

  getEmailRequirement(): string {
    if (!this.selectedRole) {
      return '';
    }

    return this.selectedRole === 'student'
      ? 'Please register using your college email ID.'
      : 'Please register using a valid company email ID.';
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  get completionPercentage(): number {
    const controls = Object.values(this.registerForm.controls);

    if (!controls.length) {
      return 0;
    }

    const validCount = controls.filter((control) => control.valid && !!control.value).length;
    return Math.round((validCount / controls.length) * 100);
  }

  get passwordStrengthScore(): number {
    const password = this.registerForm.get('password')?.value || '';
    let score = 0;

    if (password.length >= 6) score += 25;
    if (password.length >= 10) score += 25;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 25;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 25;

    return score;
  }

  get passwordStrengthLabel(): string {
    if (this.passwordStrengthScore >= 100) return 'Strong';
    if (this.passwordStrengthScore >= 75) return 'Good';
    if (this.passwordStrengthScore >= 50) return 'Fair';
    return 'Weak';
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);

    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'This field is required';
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) {
        return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
      }
      if (field.errors['pattern']) {
        if (fieldName === 'phone') return 'Please enter a valid 10-digit phone number';
        if (fieldName === 'website') return 'Please enter a valid website URL';
      }
      if (field.errors['min']) return `Value must be at least ${field.errors['min'].min}`;
      if (field.errors['max']) return `Value must be at most ${field.errors['max'].max}`;
    }

    return '';
  }
}
