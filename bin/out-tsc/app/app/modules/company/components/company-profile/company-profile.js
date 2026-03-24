import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
let CompanyProfileComponent = class CompanyProfileComponent {
    fb;
    router;
    companyService;
    profileForm;
    companyProfile;
    isEditing = false;
    isLoading = false;
    isSubmitting = false;
    logoPreview = null;
    logoFile = null;
    constructor(fb, router, companyService) {
        this.fb = fb;
        this.router = router;
        this.companyService = companyService;
        this.profileForm = this.createForm();
        this.companyProfile = this.getEmptyCompany();
    }
    ngOnInit() {
        this.loadCompanyProfile();
    }
    createForm() {
        return this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            website: ['', [Validators.required, Validators.pattern('https?://.+')]],
            address: ['', [Validators.required, Validators.minLength(10)]],
            description: ['', [Validators.required, Validators.minLength(50)]],
            hrContact: this.fb.group({
                name: ['', [Validators.required]],
                email: ['', [Validators.required, Validators.email]],
                phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
                position: ['', [Validators.required]]
            })
        });
    }
    getEmptyCompany() {
        return {
            id: '',
            name: '',
            logo: '',
            website: '',
            address: '',
            description: '',
            hrContact: {
                name: '',
                email: '',
                phone: '',
                position: ''
            },
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }
    loadCompanyProfile() {
        this.isLoading = true;
        const companyId = this.getCompanyId();
        this.companyService.getCompanyProfile(companyId).subscribe({
            next: (profile) => {
                this.companyProfile = profile;
                this.populateForm(profile);
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading company profile:', error);
                this.isLoading = false;
            }
        });
    }
    populateForm(profile) {
        this.profileForm.patchValue({
            name: profile.name,
            website: profile.website,
            address: profile.address,
            description: profile.description,
            hrContact: {
                name: profile.hrContact.name,
                email: profile.hrContact.email,
                phone: profile.hrContact.phone,
                position: profile.hrContact.position
            }
        });
    }
    getCompanyId() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData).companyId : '';
    }
    toggleEdit() {
        this.isEditing = !this.isEditing;
        if (!this.isEditing) {
            this.populateForm(this.companyProfile);
        }
    }
    onLogoSelected(event) {
        const file = event.target.files[0];
        if (file) {
            this.logoFile = file;
            const reader = new FileReader();
            reader.onload = () => {
                this.logoPreview = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }
    uploadLogo() {
        if (!this.logoFile)
            return;
        const companyId = this.getCompanyId();
        this.companyService.uploadLogo(companyId, this.logoFile).subscribe({
            next: (response) => {
                this.companyProfile.logo = response.logoUrl;
                this.logoFile = null;
                alert('Logo uploaded successfully!');
            },
            error: (error) => {
                console.error('Error uploading logo:', error);
                alert('Error uploading logo. Please try again.');
            }
        });
    }
    removeLogo() {
        this.logoPreview = null;
        this.logoFile = null;
        this.companyProfile.logo = '';
    }
    onSubmit() {
        if (this.profileForm.valid) {
            this.isSubmitting = true;
            const companyId = this.getCompanyId();
            const formData = this.profileForm.value;
            this.companyService.updateCompanyProfile(companyId, formData).subscribe({
                next: (updatedProfile) => {
                    this.companyProfile = updatedProfile;
                    this.isEditing = false;
                    this.isSubmitting = false;
                    alert('Profile updated successfully!');
                },
                error: (error) => {
                    console.error('Error updating profile:', error);
                    this.isSubmitting = false;
                    alert('Error updating profile. Please try again.');
                }
            });
        }
        else {
            this.markFormGroupTouched(this.profileForm);
        }
    }
    markFormGroupTouched(formGroup) {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
            else {
                control?.markAsTouched();
            }
        });
    }
    cancelEdit() {
        this.isEditing = false;
        this.populateForm(this.companyProfile);
        this.logoPreview = null;
        this.logoFile = null;
    }
    getVerificationStatus() {
        const companyId = this.getCompanyId();
        this.companyService.getVerificationStatus(companyId).subscribe({
            next: (status) => {
                alert(`Verification Status: ${status.status}\n${status.notes ? `Notes: ${status.notes}` : ''}`);
            },
            error: (error) => {
                console.error('Error getting verification status:', error);
            }
        });
    }
    goBack() {
        this.router.navigate(['/company/dashboard']);
    }
    // Form field getters for easy access in template
    get name() { return this.profileForm.get('name'); }
    get website() { return this.profileForm.get('website'); }
    get address() { return this.profileForm.get('address'); }
    get description() { return this.profileForm.get('description'); }
    get hrName() { return this.profileForm.get('hrContact.name'); }
    get hrEmail() { return this.profileForm.get('hrContact.email'); }
    get hrPhone() { return this.profileForm.get('hrContact.phone'); }
    get hrPosition() { return this.profileForm.get('hrContact.position'); }
    getStatusClass() {
        return `status-${this.companyProfile.status}`;
    }
    getStatusIcon() {
        switch (this.companyProfile.status) {
            case 'approved': return 'check_circle';
            case 'rejected': return 'cancel';
            default: return 'schedule';
        }
    }
};
CompanyProfileComponent = __decorate([
    Component({
        selector: 'app-company-profile',
        imports: [CommonModule, ReactiveFormsModule, FormsModule],
        templateUrl: './company-profile.html',
        styleUrls: ['./company-profile.css']
    })
], CompanyProfileComponent);
export { CompanyProfileComponent };
