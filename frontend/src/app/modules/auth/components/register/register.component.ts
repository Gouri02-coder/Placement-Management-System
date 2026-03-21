import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
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
  registerForm: FormGroup;
  errorMessage: string = '';

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
    } else if (this.selectedRole === 'company') {
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
    if (this.registerForm.valid && this.selectedRole) {
      this.isLoading = true;
      this.errorMessage = '';

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

      console.log('Sending registration data:', registerData);

      this.authService.register(registerData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log('Registration response:', response);
          
          if (response && response.status === 'success') {
            alert(response.message || 'Registration successful! Please wait for admin verification.');
            this.router.navigate(['/auth/login']);
          } else {
            this.errorMessage = response?.message || 'Registration failed';
            alert(this.errorMessage);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Registration error:', error);
          
          let errorMsg = 'Registration failed. Please try again.';
          
          if (error.error) {
            if (typeof error.error === 'string') {
              errorMsg = error.error;
            } else if (error.error.message) {
              errorMsg = error.error.message;
            }
          }
          
          this.errorMessage = errorMsg;
          alert(errorMsg);
        }
      });
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }

  getRoleDisplayName(): string {
    return this.selectedRole === 'student' ? 'Student' : 'Company';
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'This field is required';
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
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