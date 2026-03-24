import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
let RegisterComponent = class RegisterComponent {
    fb;
    authService;
    router;
    selectedRole = null;
    isLoading = false;
    registerForm;
    constructor(fb, authService, router) {
        this.fb = fb;
        this.authService = authService;
        this.router = router;
        this.registerForm = this.createForm();
    }
    selectRole(role) {
        this.selectedRole = role;
        this.registerForm = this.createForm();
    }
    createForm() {
        const baseForm = {
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
        };
        if (this.selectedRole === 'student') {
            return this.fb.group({
                ...baseForm,
                department: ['', [Validators.required]],
                course: ['', [Validators.required]],
                year: [1, [Validators.required, Validators.min(1), Validators.max(4)]],
                cgpa: [0, [Validators.required, Validators.min(0), Validators.max(10)]]
            });
        }
        else if (this.selectedRole === 'company') {
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
    onRegister() {
        if (this.registerForm.valid && this.selectedRole) {
            this.isLoading = true;
            const formData = this.registerForm.value;
            // Prepare registration data based on role
            const registerData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                role: this.selectedRole,
                ...(this.selectedRole === 'student' && {
                    department: formData.department,
                    course: formData.course,
                    year: formData.year,
                    cgpa: formData.cgpa
                }),
                ...(this.selectedRole === 'company' && {
                    department: 'N/A',
                    course: 'N/A',
                    year: 0,
                    cgpa: 0,
                    companyName: formData.companyName,
                    industry: formData.industry,
                    website: formData.website,
                    companySize: formData.companySize,
                    address: formData.address,
                    description: formData.description
                })
            };
            this.authService.register(registerData).subscribe({
                next: (response) => {
                    this.isLoading = false;
                    alert('Registration successful! Please login with your credentials.');
                    this.router.navigate(['/auth/login']);
                },
                error: (error) => {
                    this.isLoading = false;
                    // Show user-friendly error messages
                    if (error.error === 'INVALID_EMAIL_DOMAIN') {
                        alert(this.getEmailRequirement());
                    }
                    else {
                        alert(error.message || 'Registration failed. Please try again.');
                    }
                }
            });
        }
        else {
            // Mark all fields as touched to show validation errors
            Object.keys(this.registerForm.controls).forEach(key => {
                this.registerForm.get(key)?.markAsTouched();
            });
        }
    }
    getRoleDisplayName() {
        return this.selectedRole === 'student' ? 'Student' : 'Company';
    }
    getEmailRequirement() {
        if (!this.selectedRole)
            return '';
        const requirements = {
            'student': 'Please register using your college email ID',
            'company': 'Please register using a valid email id'
        };
        return requirements[this.selectedRole];
    }
    goToLogin() {
        this.router.navigate(['/auth/login']);
    }
    // Helper methods for validation messages
    getFieldError(fieldName) {
        const field = this.registerForm.get(fieldName);
        if (field?.errors && field.touched) {
            if (field.errors['required'])
                return 'This field is required';
            if (field.errors['email'])
                return 'Please enter a valid email';
            if (field.errors['minlength'])
                return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
            if (field.errors['pattern']) {
                if (fieldName === 'phone')
                    return 'Please enter a valid 10-digit phone number';
                if (fieldName === 'website')
                    return 'Please enter a valid website URL';
            }
            if (field.errors['min'])
                return `Value must be at least ${field.errors['min'].min}`;
            if (field.errors['max'])
                return `Value must be at most ${field.errors['max'].max}`;
        }
        return '';
    }
};
RegisterComponent = __decorate([
    Component({
        selector: 'app-register',
        standalone: true,
        imports: [CommonModule, ReactiveFormsModule],
        templateUrl: './register.component.html',
        styleUrls: ['./register.component.css']
    })
], RegisterComponent);
export { RegisterComponent };
