import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CompanyProfileComponent } from './company-profile';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';

describe('CompanyProfileComponent', () => {
  let component: CompanyProfileComponent;
  let fixture: ComponentFixture<CompanyProfileComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockCompanyService: jasmine.SpyObj<CompanyService>;

  const mockCompany: Company = {
    id: '1',
    name: 'Test Company',
    logo: 'test-logo.png',
    website: 'https://test.com',
    address: 'Test Address, City, State 12345',
    description: 'This is a test company description that is long enough to meet validation requirements.',
    hrContacts: [{
      name: 'John Doe',
      email: 'john@test.com',
      phone: '1234567890',
      position: 'HR Manager'
    }],
    socialLinks: [{}] as any,
    verificationDocuments: [],
    status: 'approved',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const companyServiceSpy = jasmine.createSpyObj('CompanyService', [
      'getCompanyProfile',
      'updateCompanyProfile',
      'uploadLogo',
      'getVerificationStatus'
    ]);

    await TestBed.configureTestingModule({
      declarations: [CompanyProfileComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: CompanyService, useValue: companyServiceSpy }
      ]
    }).compileComponents();

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockCompanyService = TestBed.inject(CompanyService) as jasmine.SpyObj<CompanyService>;

    // Mock localStorage
    const mockUser = { name: 'Test User', companyId: '1' };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyProfileComponent);
    component = fixture.componentInstance;
    mockCompanyService.getCompanyProfile.and.returnValue(of(mockCompany));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load company profile on init', () => {
    expect(mockCompanyService.getCompanyProfile).toHaveBeenCalledWith('1');
    expect(component.companyProfile).toEqual(mockCompany);
    expect(component.profileForm.value.name).toBe(mockCompany.name);
  });

  it('should toggle edit mode', () => {
    expect(component.isEditing).toBeFalse();
    component.toggleEdit();
    expect(component.isEditing).toBeTrue();
    component.toggleEdit();
    expect(component.isEditing).toBeFalse();
  });

  it('should validate required fields', () => {
    component.profileForm.patchValue({
      name: '',
      website: '',
      address: ''
    });
    
    expect(component.profileForm.valid).toBeFalse();
    expect(component.name?.valid).toBeFalse();
    expect(component.website?.valid).toBeFalse();
    expect(component.address?.valid).toBeFalse();
  });

  it('should validate email format', () => {
    component.profileForm.patchValue({
      hrContact: { email: 'invalid-email' }
    });
    
    expect(component.hrEmail?.valid).toBeFalse();
    
    component.profileForm.patchValue({
      hrContact: { email: 'valid@email.com' }
    });
    
    expect(component.hrEmail?.valid).toBeTrue();
  });

  it('should validate phone number format', () => {
    component.profileForm.patchValue({
      hrContact: { phone: '123' }
    });
    
    expect(component.hrPhone?.valid).toBeFalse();
    
    component.profileForm.patchValue({
      hrContact: { phone: '1234567890' }
    });
    
    expect(component.hrPhone?.valid).toBeTrue();
  });

  it('should handle logo selection', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] } };
    
    component.onLogoSelected(event);
    expect(component.logoFile).toBe(file);
  });

  it('should submit form when valid', () => {
    const updatedCompany = { ...mockCompany, name: 'Updated Company' };
    mockCompanyService.updateCompanyProfile.and.returnValue(of(updatedCompany));
    
    component.isEditing = true;
    component.profileForm.patchValue({
      name: 'Updated Company',
      website: 'https://updated.com',
      address: 'Updated Address',
      description: 'Updated description that is long enough to meet validation requirements.',
      hrContact: {
        name: 'Jane Doe',
        email: 'jane@updated.com',
        phone: '0987654321',
        position: 'Senior HR'
      }
    });
    
    component.onSubmit();
    
    expect(mockCompanyService.updateCompanyProfile).toHaveBeenCalledWith('1', component.profileForm.value);
    expect(component.companyProfile).toEqual(updatedCompany);
    expect(component.isEditing).toBeFalse();
  });

  it('should handle form submission error', () => {
    mockCompanyService.updateCompanyProfile.and.returnValue(throwError(() => new Error('Update failed')));
    spyOn(window, 'alert');
    
    component.isEditing = true;
    component.profileForm.patchValue({
      name: 'Updated Company',
      website: 'https://updated.com',
      address: 'Updated Address',
      description: 'Updated description that is long enough to meet validation requirements.',
      hrContact: {
        name: 'Jane Doe',
        email: 'jane@updated.com',
        phone: '0987654321',
        position: 'Senior HR'
      }
    });
    
    component.onSubmit();
    
    expect(component.isSubmitting).toBeFalse();
  });

  it('should cancel edit and reset form', () => {
    component.isEditing = true;
    component.profileForm.patchValue({ name: 'Changed Name' });
    
    component.cancelEdit();
    
    expect(component.isEditing).toBeFalse();
    expect(component.profileForm.value.name).toBe(mockCompany.name);
  });

  it('should get correct status class', () => {
    component.companyProfile.status = 'approved';
    expect(component.getStatusClass()).toBe('status-approved');
    
    component.companyProfile.status = 'pending';
    expect(component.getStatusClass()).toBe('status-pending');
    
    component.companyProfile.status = 'rejected';
    expect(component.getStatusClass()).toBe('status-rejected');
  });

  it('should get correct status icon', () => {
    component.companyProfile.status = 'approved';
    expect(component.getStatusIcon()).toBe('check_circle');
    
    component.companyProfile.status = 'rejected';
    expect(component.getStatusIcon()).toBe('cancel');
    
    component.companyProfile.status = 'pending';
    expect(component.getStatusIcon()).toBe('schedule');
  });

  it('should navigate back to dashboard', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/company/dashboard']);
  });
});