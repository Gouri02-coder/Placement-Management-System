import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

// Services
import { CompanyService } from '../../services/company.service';
import { UploadService } from '../../services/upload.service';
import { NotificationService } from '../../services/notification.service';

// Models
import { Company, HRContact, SocialLinks, VerificationDocument } from '../../models/company.model';

// Constants
const COMPANY_CONSTANTS = {
  WEBSITE_REGEX: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i,
  PHONE_REGEX: /^[\d\s\-\+\(\)]{10,}$/,
  SOCIAL_LINK_REGEX: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i
};

@Component({
  selector: 'app-company-profile',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './company-profile.html',
  styleUrls: ['./company-profile.css']
})
export class CompanyProfileComponent implements OnInit, OnDestroy {
  // Component state
  profileForm: FormGroup;
  companyProfile: Company;
  
  // UI state
  isEditing = false;
  isLoading = false;
  isSubmitting = false;
  isSavingDraft = false;
  showConfirmDialog = false;
  showPreviewMode = false;
  
  // Logo handling
  logoPreview: string | ArrayBuffer | null = null;
  logoFile: File | null = null;
  isUploadingLogo = false;
  
  // Social links
  socialLinks: SocialLinks = {};
  
  // Verification documents
  verificationDocuments: VerificationDocument[] = [];
  isUploadingDocument = false;
  
  // Change history
  changeHistory: any[] = [];
  showChangeHistory = false;
  
  // Statistics
  companyStats = {
    totalApplications: 0,
    activeJobPostings: 0,
    interviewsScheduled: 0,
    profileCompletion: 0
  };
  
  // Draft saving
  private readonly DRAFT_KEY = 'company_profile_draft';
  private readonly DRAFT_AUTO_SAVE_INTERVAL = 30000; // 30 seconds
  private autoSaveTimer: any;
  private hasUnsavedChanges = false;
  
  // For cleanup
  private destroy$ = new Subject<void>();
  
  // Form dirty state tracking
  private originalFormValue: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private companyService: CompanyService,
    private uploadService: UploadService,
    private notificationService: NotificationService
  ) {
    this.profileForm = this.createForm();
    this.companyProfile = this.getEmptyCompany();
    
    // Subscribe to form changes for auto-save
    this.setupAutoSave();
  }

  ngOnInit(): void {
    this.loadCompanyProfile();
    this.loadCompanyStatistics();
    this.loadVerificationDocuments();
    this.loadChangeHistory();
    this.restoreDraftIfExists();
    
    // Setup beforeunload warning
    this.setupBeforeUnloadWarning();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearInterval(this.autoSaveTimer);
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent): void {
    if (this.hasUnsavedChanges) {
      event.preventDefault();
      event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Basic Info
      name: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      website: ['', [
        Validators.required, 
        Validators.pattern(COMPANY_CONSTANTS.WEBSITE_REGEX)
      ]],
      address: ['', [
        Validators.required, 
        Validators.minLength(10),
        Validators.maxLength(500)
      ]],
      description: ['', [
        Validators.required, 
        Validators.minLength(50),
        Validators.maxLength(2000)
      ]],
      
      // HR Contacts
      hrContacts: this.fb.array([]),
      
      // Social Links
      socialLinks: this.fb.group({
        linkedin: ['', Validators.pattern(COMPANY_CONSTANTS.SOCIAL_LINK_REGEX)],
        twitter: ['', Validators.pattern(COMPANY_CONSTANTS.SOCIAL_LINK_REGEX)],
        github: ['', Validators.pattern(COMPANY_CONSTANTS.SOCIAL_LINK_REGEX)],
        facebook: ['', Validators.pattern(COMPANY_CONSTANTS.SOCIAL_LINK_REGEX)]
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
      hrContacts: [],
      socialLinks: {},
      verificationDocuments: [],
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // HR Contacts Form Array Methods
  get hrContacts(): FormArray {
    return this.profileForm.get('hrContacts') as FormArray;
  }

  // Get the primary HR contact (first one or marked as primary)
  get primaryHRContact(): HRContact | null {
    const contacts = this.companyProfile.hrContacts || [];
    if (contacts.length === 0) return null;
    
    const primary = contacts.find(c => c.isPrimary);
    return primary || contacts[0];
  }

  createHRContactFormGroup(contact?: HRContact): FormGroup {
    return this.fb.group({
      name: [contact?.name || '', [Validators.required, Validators.minLength(2)]],
      email: [contact?.email || '', [Validators.required, Validators.email]],
      phone: [contact?.phone || '', [
        Validators.required, 
        Validators.pattern(COMPANY_CONSTANTS.PHONE_REGEX)
      ]],
      position: [contact?.position || '', Validators.required],
      isPrimary: [contact?.isPrimary || false]
    });
  }

  addHRContact(contact?: HRContact): void {
    this.hrContacts.push(this.createHRContactFormGroup(contact));
  }

  removeHRContact(index: number): void {
    if (this.hrContacts.length > 1) {
      this.hrContacts.removeAt(index);
      this.saveDraft();
    }
  }

  setPrimaryContact(index: number): void {
    this.hrContacts.controls.forEach((control, i) => {
      control.get('isPrimary')?.setValue(i === index);
    });
    this.saveDraft();
  }

  // Individual HR Contact Getters for the first/primary HR contact
  get hrName() { 
    const control = this.hrContacts.length > 0 ? this.hrContacts.at(0).get('name') : null;
    return control;
  }
  
  get hrEmail() { 
    const control = this.hrContacts.length > 0 ? this.hrContacts.at(0).get('email') : null;
    return control;
  }
  
  get hrPhone() { 
    const control = this.hrContacts.length > 0 ? this.hrContacts.at(0).get('phone') : null;
    return control;
  }
  
  get hrPosition() { 
    const control = this.hrContacts.length > 0 ? this.hrContacts.at(0).get('position') : null;
    return control;
  }

  // Load Methods
  private loadCompanyProfile(): void {
    this.isLoading = true;
    const companyId = this.getCompanyId();
    
    this.companyService.getCompanyProfile(companyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profile) => {
          this.companyProfile = profile;
          this.populateForm(profile);
          this.originalFormValue = this.profileForm.getRawValue();
          this.isLoading = false;
        },
        error: (error) => {
          this.notificationService.showError('Failed to load company profile');
          console.error('Error loading company profile:', error);
          this.isLoading = false;
        }
      });
  }

  private loadCompanyStatistics(): void {
    const companyId = this.getCompanyId();
    
    // Check if method exists, if not, use mock data
    if (typeof this.companyService.getCompanyStats === 'function') {
      this.companyService.getCompanyStats(companyId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (stats) => {
            this.companyStats = stats;
          },
          error: (error) => {
            console.error('Error loading company statistics:', error);
            this.companyStats = {
              totalApplications: 45,
              activeJobPostings: 12,
              interviewsScheduled: 8,
              profileCompletion: this.calculateProfileCompletion()
            };
          }
        });
    } else {
      // Mock data for demonstration
      this.companyStats = {
        totalApplications: 45,
        activeJobPostings: 12,
        interviewsScheduled: 8,
        profileCompletion: this.calculateProfileCompletion()
      };
    }
  }

  private loadVerificationDocuments(): void {
    const companyId = this.getCompanyId();
    
    // Check if method exists
    if (typeof this.companyService.getVerificationDocuments === 'function') {
      this.companyService.getVerificationDocuments(companyId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (documents: any) => {
            this.verificationDocuments = Array.isArray(documents) ? documents : [];
          },
          error: (error) => {
            console.error('Error loading verification documents:', error);
            this.verificationDocuments = [];
          }
        });
    } else {
      this.verificationDocuments = [];
    }
  }

  private loadChangeHistory(): void {
    const companyId = this.getCompanyId();
    
    // Check if method exists
    if (typeof this.companyService.getChangesHistory === 'function') {
      this.companyService.getChangesHistory(companyId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (history) => {
            this.changeHistory = Array.isArray(history) ? history : [];
          },
          error: (error) => {
            console.error('Error loading change history:', error);
            this.changeHistory = [];
          }
        });
    } else {
      this.changeHistory = [];
    }
  }

  private populateForm(profile: Company): void {
    // Clear existing HR contacts
    while (this.hrContacts.length) {
      this.hrContacts.removeAt(0);
    }
    
    // Add HR contacts
    if (profile.hrContacts && profile.hrContacts.length > 0) {
      profile.hrContacts.forEach(contact => {
        this.addHRContact(contact);
      });
    } else {
      // Add at least one HR contact
      this.addHRContact();
    }
    
    // Populate form
    this.profileForm.patchValue({
      name: profile.name,
      website: profile.website,
      address: profile.address,
      description: profile.description,
      socialLinks: profile.socialLinks || {}
    });
  }

  private getCompanyId(): string {
    try {
      const userData = localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData).companyId : 'demo-company-id';
    } catch {
      return 'demo-company-id';
    }
  }

  // Edit Mode Methods
  toggleEdit(): void {
    if (this.isEditing && this.hasUnsavedChanges) {
      this.showConfirmDialog = true;
      return;
    }
    
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.populateForm(this.companyProfile);
      this.hasUnsavedChanges = false;
      this.clearDraft();
    } else {
      this.originalFormValue = this.profileForm.getRawValue();
    }
  }

  confirmDiscardChanges(): void {
    this.showConfirmDialog = false;
    this.isEditing = false;
    this.populateForm(this.companyProfile);
    this.hasUnsavedChanges = false;
    this.clearDraft();
  }

  cancelDiscardChanges(): void {
    this.showConfirmDialog = false;
  }

  // Logo Handling
  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Validate file
    if (!this.validateImageFile(file)) {
      this.notificationService.showError('Please select a valid image file (JPEG, PNG, GIF) under 5MB');
      return;
    }
    
    this.logoFile = file;
    
    const reader = new FileReader();
    reader.onload = () => {
      this.logoPreview = reader.result;
      this.saveDraft();
    };
    reader.readAsDataURL(file);
    
    // Auto-upload logo
    this.uploadLogo();
  }

  private validateImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      return false;
    }
    
    if (file.size > maxSize) {
      return false;
    }
    
    return true;
  }

  uploadLogo(): void {
    if (!this.logoFile) return;

    this.isUploadingLogo = true;
    const companyId = this.getCompanyId();
    
    this.uploadService.uploadImage(this.logoFile, 'company-logos')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.companyProfile.logo = response.url;
          this.logoFile = null;
          this.isUploadingLogo = false;
          this.notificationService.showSuccess('Logo uploaded successfully!');
        },
        error: (error) => {
          this.isUploadingLogo = false;
          this.notificationService.showError('Failed to upload logo');
          console.error('Error uploading logo:', error);
        }
      });
  }

  removeLogo(): void {
    this.logoPreview = null;
    this.logoFile = null;
    this.companyProfile.logo = '';
    this.saveDraft();
  }

  // Document Handling
  onDocumentSelected(event: any, type: string): void {
    const file = event.target.files[0];
    
    if (!file) return;
    
    if (!this.validateDocumentFile(file)) {
      this.notificationService.showError('Please select a valid document (PDF, DOC, DOCX) under 10MB');
      return;
    }
    
    this.uploadDocument(file, type);
  }

  private validateDocumentFile(file: File): boolean {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
      return false;
    }
    
    if (file.size > maxSize) {
      return false;
    }
    
    return true;
  }

  uploadDocument(file: File, type: string): void {
    this.isUploadingDocument = true;
    
    this.uploadService.uploadDocument(file, 'verification-documents')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const document: VerificationDocument = {
            id: `doc-${Date.now()}`,
            name: file.name,
            url: response.url,
            type: type,
            uploadedAt: new Date(),
            status: 'pending'
          };
          
          this.verificationDocuments.push(document);
          this.isUploadingDocument = false;
          this.notificationService.showSuccess('Document uploaded successfully!');
          this.saveDraft();
        },
        error: (error) => {
          this.isUploadingDocument = false;
          this.notificationService.showError('Failed to upload document');
          console.error('Error uploading document:', error);
        }
      });
  }

  // Form Submission
  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      this.notificationService.showError('Please fix the errors in the form');
      return;
    }

    this.isSubmitting = true;
    const companyId = this.getCompanyId();
    const formData = this.profileForm.value;

    // Ensure hrContacts are properly structured
    const submitData = {
      ...formData,
      hrContacts: formData.hrContacts.map((contact: any, index: number) => ({
        ...contact,
        isPrimary: index === 0 || contact.isPrimary // Ensure at least one is primary
      }))
    };

    this.companyService.updateCompanyProfile(companyId, submitData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedProfile) => {
          this.companyProfile = updatedProfile;
          this.isEditing = false;
          this.isSubmitting = false;
          this.hasUnsavedChanges = false;
          this.clearDraft();
          this.originalFormValue = this.profileForm.getRawValue();
          this.notificationService.showSuccess('Profile updated successfully!');
        },
        error: (error) => {
          this.isSubmitting = false;
          this.notificationService.showError('Failed to update profile');
          console.error('Error updating profile:', error);
        }
      });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(group => {
          if (group instanceof FormGroup) {
            this.markFormGroupTouched(group);
          }
        });
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
    this.hasUnsavedChanges = false;
    this.clearDraft();
  }

  // Verification Status
  getVerificationStatus(): void {
    const companyId = this.getCompanyId();
    
    // Check if method exists
    if (typeof this.companyService.getVerificationStatus === 'function') {
      this.companyService.getVerificationStatus(companyId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (status) => {
            this.notificationService.showInfo(
              `Verification Status: ${status.status}\n${status.notes ? `Notes: ${status.notes}` : ''}`,
              'Verification Status'
            );
          },
          error: (error) => {
            this.notificationService.showError('Failed to load verification status');
            console.error('Error getting verification status:', error);
          }
        });
    } else {
      this.notificationService.showInfo(
        `Verification Status: ${this.companyProfile.status || 'pending'}`,
        'Verification Status'
      );
    }
  }

  // Draft Saving
  private setupAutoSave(): void {
    // Debounced auto-save on form changes
    this.profileForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(1000),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(() => {
        if (this.isEditing && this.profileForm.dirty) {
          this.hasUnsavedChanges = true;
          this.saveDraft();
        }
      });

    // Periodic auto-save
    this.autoSaveTimer = setInterval(() => {
      if (this.isEditing && this.hasUnsavedChanges) {
        this.saveDraft();
      }
    }, this.DRAFT_AUTO_SAVE_INTERVAL);
  }

  private saveDraft(): void {
    if (!this.isEditing) return;

    const draftData = {
      formData: this.profileForm.getRawValue(),
      logoPreview: this.logoPreview,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem(this.DRAFT_KEY, JSON.stringify(draftData));
    this.isSavingDraft = true;
    
    setTimeout(() => {
      this.isSavingDraft = false;
    }, 500);
  }

  private restoreDraftIfExists(): void {
    const draftData = localStorage.getItem(this.DRAFT_KEY);
    
    if (draftData) {
      try {
        const draft = JSON.parse(draftData);
        const timeDiff = Date.now() - new Date(draft.timestamp).getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        // Only restore if draft is less than 24 hours old
        if (hoursDiff < 24) {
          this.notificationService.showInfo(
            'Found unsaved changes from your last session.',
            'Restore Draft',
            10000
          );
          
          // Auto-restore after a delay
          setTimeout(() => {
            this.restoreDraft(draft);
          }, 1000);
        } else {
          this.clearDraft();
        }
      } catch (e) {
        this.clearDraft();
      }
    }
  }

  restoreDraft(draft: any): void {
    if (draft.formData) {
      // Clear and repopulate
      while (this.hrContacts.length) {
        this.hrContacts.removeAt(0);
      }
      
      if (draft.formData.hrContacts && draft.formData.hrContacts.length > 0) {
        draft.formData.hrContacts.forEach((contact: any) => {
          this.addHRContact(contact);
        });
      }
      
      this.profileForm.patchValue({
        name: draft.formData.name,
        website: draft.formData.website,
        address: draft.formData.address,
        description: draft.formData.description,
        socialLinks: draft.formData.socialLinks || {}
      });
    }
    
    if (draft.logoPreview) {
      this.logoPreview = draft.logoPreview;
    }
    
    this.hasUnsavedChanges = true;
    this.isEditing = true;
    this.notificationService.showSuccess('Draft restored successfully!');
  }

  private clearDraft(): void {
    localStorage.removeItem(this.DRAFT_KEY);
  }

  private setupBeforeUnloadWarning(): void {
    window.addEventListener('beforeunload', (event) => {
      if (this.hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    });
  }

  // Profile Completion
  calculateProfileCompletion(): number {
    let completion = 0;
    const formValue = this.profileForm.getRawValue();

    if (formValue.name) completion += 15;
    if (formValue.website) completion += 10;
    if (formValue.address) completion += 10;
    if (formValue.description && formValue.description.length >= 50) completion += 15;
    if (this.companyProfile.logo) completion += 10;
    if (this.hrContacts.length > 0 && this.hrContacts.at(0).get('name')?.value) completion += 20;
    if (Object.keys(formValue.socialLinks || {}).some(key => formValue.socialLinks[key])) completion += 10;
    if (this.verificationDocuments.length > 0) completion += 10;

    return Math.min(100, completion);
  }

  // Preview Mode
  togglePreviewMode(): void {
    this.showPreviewMode = !this.showPreviewMode;
  }

  // Export Profile
  exportProfile(): void {
    // Check if method exists
    if (typeof this.companyService.getexportProfile === 'function') {
      const companyId = this.getCompanyId();
      this.companyService.getexportProfile(companyId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.notificationService.showSuccess('Profile exported successfully!');
          },
          error: (error) => {
            this.notificationService.showError('Failed to export profile');
          }
        });
    } else {
      this.notificationService.showInfo('Profile export feature coming soon!');
    }
  }

  // Navigation
  goBack(): void {
    if (this.hasUnsavedChanges) {
      this.showConfirmDialog = true;
      return;
    }
    this.router.navigate(['/company/dashboard']);
  }

  goToDashboard(): void {
    if (this.hasUnsavedChanges) {
      this.showConfirmDialog = true;
      return;
    }
    this.router.navigate(['/company/dashboard']);
  }

  // Form field getters for easy access in template
  get name() { return this.profileForm.get('name'); }
  get website() { return this.profileForm.get('website'); }
  get address() { return this.profileForm.get('address'); }
  get description() { return this.profileForm.get('description'); }
  get linkedin() { return this.profileForm.get('socialLinks.linkedin'); }
  get twitter() { return this.profileForm.get('socialLinks.twitter'); }
  get github() { return this.profileForm.get('socialLinks.github'); }
  get facebook() { return this.profileForm.get('socialLinks.facebook'); }

  // Status helpers
  getStatusClass(): string {
    return `status-${this.companyProfile.status}`;
  }

  getStatusIcon(): string {
    switch (this.companyProfile.status) {
      case 'approved': return '✓';
      case 'rejected': return '✗';
      default: return '⏱';
    }
  }

  // Error handling
  getFieldErrorMessage(control: any): string {
    if (!control || !control.errors) return '';
    
    const errors = control.errors;
    
    if (errors['required']) return 'This field is required';
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['pattern']) return 'Please enter a valid format';
    if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']) return `Maximum length is ${errors['maxlength'].requiredLength} characters`;
    
    return 'Invalid value';
  }

  // Accessibility
  getAriaLabel(fieldName: string): string {
    return `${fieldName} field ${this.isEditing ? 'editable' : 'read-only'}`;
  }
}