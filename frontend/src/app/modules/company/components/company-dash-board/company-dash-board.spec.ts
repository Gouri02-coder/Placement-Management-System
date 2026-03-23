import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CompanyDashboardComponent } from './company-dash-board';
import { CompanyService } from '../../services/company.service';
import { Company, CompanyStats } from '../../models/company.model';

describe('CompanyDashboardComponent', () => {
  let component: CompanyDashboardComponent;
  let fixture: ComponentFixture<CompanyDashboardComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockCompanyService: jasmine.SpyObj<CompanyService>;

  const mockCompany: Company = {
    id: '1',
    name: 'Test Company',
    logo: 'test-logo.png',
    website: 'https://test.com',
    address: 'Test Address',
    description: 'Test Description',
    hrContact: {
      name: 'Test HR',
      email: 'hr@test.com',
      phone: '1234567890',
      position: 'HR Manager'
    },
    status: 'approved',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockStats: CompanyStats = {
    activeJobs: 5,
    totalApplications: 100,
    localHires: 10,
    pendingReviews: 15,
    upcomingDrives: 2,
    unreadNotifications: 3
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const companyServiceSpy = jasmine.createSpyObj('CompanyService', [
      'getCompanyProfile',
      'getCompanyStats'
    ]);

    await TestBed.configureTestingModule({
      imports: [CompanyDashboardComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: CompanyService, useValue: companyServiceSpy }
      ]
    }).compileComponents();

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockCompanyService = TestBed.inject(CompanyService) as jasmine.SpyObj<CompanyService>;

    mockCompanyService.getCompanyProfile.and.returnValue(of(mockCompany));
    mockCompanyService.getCompanyStats.and.returnValue(of(mockStats));

    // Mock localStorage
    const mockUser = { name: 'Test User', role: 'HR Manager', companyId: '1' };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data from localStorage', () => {
    expect(component.userName).toBe('Test User');
    expect(component.userRole).toBe('HR Manager');
  });

  it('should load company profile on init', () => {
    expect(mockCompanyService.getCompanyProfile).toHaveBeenCalledWith('1');
    expect(component.companyProfile.name).toBe('Test Company');
  });

  it('should load company stats on init', () => {
    expect(mockCompanyService.getCompanyStats).toHaveBeenCalledWith('1');
    expect(component.dashboardStats.activeJobs).toBe(5);
  });

  it('should switch sections correctly', () => {
    component.switchSection('profile');
    expect(component.activeSection).toBe('profile');
  });

  it('should navigate to post job', () => {
    component.postJob();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/company/jobs/post']);
  });

  it('should navigate to manage jobs', () => {
    component.manageJobs();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/company/jobs']);
  });

  it('should get correct status class', () => {
    expect(component.getStatusClass('approved')).toBe('status-approved');
    expect(component.getStatusClass('pending')).toBe('status-pending');
    expect(component.getStatusClass('rejected')).toBe('status-rejected');
  });

  it('should get notification count', () => {
    expect(component.getNotificationCount()).toBe(3);
  });

  it('should logout correctly', () => {
    const removeItemSpy = spyOn(localStorage, 'removeItem');
    component.logout();
    expect(removeItemSpy).toHaveBeenCalledWith('currentUser');
    expect(removeItemSpy).toHaveBeenCalledWith('authToken');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
