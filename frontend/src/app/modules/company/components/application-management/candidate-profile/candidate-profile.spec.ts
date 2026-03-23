import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CandidateProfileComponent } from './candidate-profile';

describe('CandidateProfileComponent', () => {
  let component: CandidateProfileComponent;
  let fixture: ComponentFixture<CandidateProfileComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [CandidateProfileComponent, FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(CandidateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load application on init', () => {
      expect(component.application).toBeTruthy();
      expect(component.applicationId).toBe('1');
    });
  });

  describe('Helper Methods', () => {
    it('should return correct status class', () => {
      expect(component.getStatusClass('pending')).toBe('status-pending');
      expect(component.getStatusClass('shortlisted')).toBe('status-shortlisted');
      expect(component.getStatusClass('hired')).toBe('status-hired');
      expect(component.getStatusClass(null)).toBe('status-unknown');
    });

    it('should return correct status icon', () => {
      expect(component.getStatusIcon('pending')).toBe('schedule');
      expect(component.getStatusIcon('shortlisted')).toBe('star');
      expect(component.getStatusIcon('hired')).toBe('check_circle');
      expect(component.getStatusIcon(null)).toBe('help');
    });

    it('should get avatar color', () => {
      const color = component.getAvatarColor('John Doe');
      expect(typeof color).toBe('string');
      expect(color.startsWith('#')).toBeTrue();
    });

    it('should get initials', () => {
      expect(component.getInitials('John Doe')).toBe('J');
      expect(component.getInitials('Jane')).toBe('J');
    });

    it('should format date', () => {
      const date = new Date('2024-03-15');
      const formatted = component.formatDate(date);
      expect(formatted).toContain('2024');
    });

    it('should check if status can be edited', () => {
      component.application = { status: 'pending' };
      expect(component.canEditStatus()).toBeTrue();
      
      component.application = { status: 'hired' };
      expect(component.canEditStatus()).toBeFalse();
      
      component.application = { status: 'rejected' };
      expect(component.canEditStatus()).toBeFalse();
    });

    it('should return status options', () => {
      const options = component.getStatusOptions();
      expect(options.length).toBe(5);
      expect(options[0].value).toBe('pending');
      expect(options[4].value).toBe('hired');
    });
  });

  describe('Actions', () => {
    beforeEach(() => {
      component.application = {
        id: '1',
        status: 'pending',
        resumeUrl: 'https://example.com/resume.pdf',
        candidateName: 'John Doe'
      };
    });

    it('should update status', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(window, 'alert');
      
      component.updateStatus('shortlisted');
      
      expect(component.application.status).toBe('shortlisted');
      expect(window.alert).toHaveBeenCalledWith('Application status updated to SHORTLISTED');
    });

    it('should not update status if user cancels', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      
      component.updateStatus('shortlisted');
      
      expect(component.application.status).toBe('pending');
    });

    it('should go back', () => {
      component.goBack();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/company/applications']);
    });

    it('should view resume', () => {
      spyOn(window, 'open');
      component.viewResume();
      expect(window.open).toHaveBeenCalledWith('https://example.com/resume.pdf', '_blank');
    });

    it('should show alert if resume not available', () => {
      component.application.resumeUrl = null;
      spyOn(window, 'alert');
      component.viewResume();
      expect(window.alert).toHaveBeenCalledWith('Resume not available.');
    });

    it('should download resume', () => {
      const createElementSpy = spyOn(document, 'createElement').and.callThrough();
      component.downloadResume();
      expect(createElementSpy).toHaveBeenCalledWith('a');
    });
  });
});