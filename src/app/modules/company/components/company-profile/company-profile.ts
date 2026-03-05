import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-profile',
   imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './company-profile.html',
  styleUrls: ['./company-profile.css']
})
export class CompanyProfileComponent implements OnInit {
  profileForm: FormGroup;
  companyProfile: Company;
  isEditing = false;
  isLoading = false;
  isSubmitting = false;
  logoPreview: string | ArrayBuffer | null = null;
  logoFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private companyService: CompanyService
  ) {
    this.profileForm = this.createForm();
    this.companyProfile = this.getEmptyCompany();
  }

  ngOnInit(): void {
    this.loadCompanyProfile();
  }

  private createForm(): FormGroup {
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

  private getEmptyCompany(): Company {
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

  private loadCompanyProfile(): void {
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

  private populateForm(profile: Company): void {
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

  private getCompanyId(): string {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData).companyId : '';
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.populateForm(this.companyProfile);
    }
  }

  onLogoSelected(event: any): void {
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

  uploadLogo(): void {
    if (!this.logoFile) return;

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

  removeLogo(): void {
    this.logoPreview = null;
    this.logoFile = null;
    this.companyProfile.logo = '';
  }

  onSubmit(): void {
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
    } else {
      this.markFormGroupTouched(this.profileForm);
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

  cancelEdit(): void {
    this.isEditing = false;
    this.populateForm(this.companyProfile);
    this.logoPreview = null;
    this.logoFile = null;
  }

  getVerificationStatus(): void {
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

  goBack(): void {
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

  getStatusClass(): string {
    return `status-${this.companyProfile.status}`;
  }

  getStatusIcon(): string {
    switch (this.companyProfile.status) {
      case 'approved': return 'check_circle';
      case 'rejected': return 'cancel';
      default: return 'schedule';
    }
  }
}