import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { DriveDetails } from './drive-details';

describe('DriveDetails', () => {
  let component: DriveDetails;
  let fixture: ComponentFixture<DriveDetails>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      paramMap: of({ get: (key: string) => '1' })
    };

    await TestBed.configureTestingModule({
      imports: [DriveDetails],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(DriveDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Helper Methods', () => {
    it('should return correct status class', () => {
      expect(component.getStatusClass('scheduled')).toBe('status-scheduled');
      expect(component.getStatusClass('ongoing')).toBe('status-ongoing');
      expect(component.getStatusClass('completed')).toBe('status-completed');
    });

    it('should return correct status icon', () => {
      expect(component.getStatusIcon('scheduled')).toBe('schedule');
      expect(component.getStatusIcon('ongoing')).toBe('play_circle');
      expect(component.getStatusIcon('completed')).toBe('check_circle');
    });

    it('should calculate days remaining', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      expect(component.getDaysRemaining(futureDate.toISOString())).toBe(10);
    });

    it('should format date', () => {
      const date = '2024-12-31';
      const formatted = component.formatDate(date);
      expect(formatted).toContain('December');
      expect(formatted).toContain('2024');
    });

    it('should check if registration is open', () => {
      component.drive = { status: 'scheduled', registrationDeadline: new Date(Date.now() + 86400000).toISOString() };
      expect(component.isRegistrationOpen()).toBeTrue();
      
      component.drive = { status: 'scheduled', registrationDeadline: new Date(Date.now() - 86400000).toISOString() };
      expect(component.isRegistrationOpen()).toBeFalse();
      
      component.drive = { status: 'completed', registrationDeadline: new Date(Date.now() + 86400000).toISOString() };
      expect(component.isRegistrationOpen()).toBeFalse();
    });
  });

  describe('Application Form', () => {
    beforeEach(() => {
      component.drive = { status: 'scheduled', registrationDeadline: new Date(Date.now() + 86400000).toISOString() };
    });

    it('should open application form', () => {
      component.openApplicationForm();
      expect(component.showApplicationForm).toBeTrue();
    });

    it('should close application form', () => {
      component.showApplicationForm = true;
      component.closeApplicationForm();
      expect(component.showApplicationForm).toBeFalse();
    });

    it('should validate form', () => {
      component.applicationForm = {
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        rollNumber: 'CS001',
        branch: 'Computer Science',
        passingYear: '2024',
        cgpa: 7.5
      };
      expect(component.validateApplicationForm()).toBeTrue();
    });

    it('should reject invalid email', () => {
      component.applicationForm = {
        fullName: 'Test User',
        email: 'invalid-email',
        phone: '1234567890',
        rollNumber: 'CS001',
        branch: 'Computer Science',
        passingYear: '2024'
      };
      expect(component.validateApplicationForm()).toBeFalse();
    });

    it('should reject invalid phone', () => {
      component.applicationForm = {
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '12345',
        rollNumber: 'CS001',
        branch: 'Computer Science',
        passingYear: '2024'
      };
      expect(component.validateApplicationForm()).toBeFalse();
    });
  });

  describe('FAQ', () => {
    it('should toggle FAQ', () => {
      component.faqs[0].open = false;
      component.toggleFAQ(0);
      expect(component.faqs[0].open).toBeTrue();
      
      component.toggleFAQ(0);
      expect(component.faqs[0].open).toBeFalse();
    });
  });

  describe('Navigation', () => {
    it('should go back', () => {
      component.goBack();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/company/drives']);
    });
  });
});