import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { JobCreateComponent } from './job-create';
import { JobService } from '../../../services/job.service';
import { Job } from '../../../models/job.model';

describe('JobCreateComponent', () => {
  let component: JobCreateComponent;
  let fixture: ComponentFixture<JobCreateComponent>;
  let mockJobService: jasmine.SpyObj<JobService>;
  let mockRouter: jasmine.SpyObj<Router>;

  // Create a complete mock job object
  const mockCreatedJob: Job = {
    id: '1',
    companyId: 'company123',
    title: 'Frontend Developer',
    description: 'We are looking for an experienced frontend developer with strong Angular skills.',
    category: 'Engineering',
    status: 'active',
    type: 'fulltime',
    location: 'remote',
    applicationDeadline: new Date('2024-12-31'),
    createdAt: new Date(),
    updatedAt: new Date(),
    applicationsCount: 0,
    eligibility: {
      branches: ['Computer Science'],
      minCGPA: 7.5,
      yearOfPassing: [2024],
      requiredSkills: ['Angular'],
      additionalRequirements: ''
    },
    salary: {
      min: 60000,
      max: 80000,
      currency: 'INR',
      type: 'range'
    }
  };

  const mockDraftJob: Job = {
    ...mockCreatedJob,
    status: 'draft',
    id: '2'
  };

  beforeEach(async () => {
    const jobServiceSpy = jasmine.createSpyObj('JobService', ['createJob']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [JobCreateComponent, ReactiveFormsModule],
      providers: [
        { provide: JobService, useValue: jobServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    mockJobService = TestBed.inject(JobService) as jasmine.SpyObj<JobService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(JobCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with default values', () => {
      expect(component.jobForm.get('title')?.value).toBe('');
      expect(component.jobForm.get('type')?.value).toBe('fulltime');
      expect(component.jobForm.get('location')?.value).toBe('onsite');
      expect(component.jobForm.get('compensationType')?.value).toBe('salary');
      expect(component.jobForm.get('status')?.value).toBe('draft');
    });

    it('should have required validators', () => {
      const titleControl = component.jobForm.get('title');
      titleControl?.setValue('');
      expect(titleControl?.valid).toBeFalse();
      expect(titleControl?.errors?.['required']).toBeTruthy();
    });

    it('should have minLength validator on title', () => {
      const titleControl = component.jobForm.get('title');
      titleControl?.setValue('Test');
      expect(titleControl?.errors?.['minlength']).toBeTruthy();
    });

    it('should have minLength validator on description', () => {
      const descControl = component.jobForm.get('description');
      descControl?.setValue('Short');
      expect(descControl?.errors?.['minlength']).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should validate required branches', () => {
      const branchesControl = component.jobForm.get('eligibility.branches');
      branchesControl?.setValue([]);
      expect(branchesControl?.valid).toBeFalse();
      expect(branchesControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate required skills', () => {
      const skillsControl = component.jobForm.get('eligibility.requiredSkills');
      skillsControl?.setValue([]);
      expect(skillsControl?.valid).toBeFalse();
      expect(skillsControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate salary range', () => {
      component.jobForm.patchValue({
        compensationType: 'salary',
        salary: { min: 100000, max: 50000 }
      });
      expect(component.salaryRangeError).toBeTrue();
    });

    it('should accept valid salary range', () => {
      component.jobForm.patchValue({
        compensationType: 'salary',
        salary: { min: 50000, max: 100000 }
      });
      expect(component.salaryRangeError).toBeFalse();
    });
  });

  describe('toggleBranch', () => {
    it('should add branch when not selected', () => {
      const branch = 'Computer Science';
      expect(component.selectedBranches).not.toContain(branch);
      
      component.toggleBranch(branch);
      
      expect(component.selectedBranches).toContain(branch);
    });

    it('should remove branch when already selected', () => {
      const branch = 'Computer Science';
      component.toggleBranch(branch);
      expect(component.selectedBranches).toContain(branch);
      
      component.toggleBranch(branch);
      expect(component.selectedBranches).not.toContain(branch);
    });
  });

  describe('toggleSkill', () => {
    it('should add skill when not selected', () => {
      const skill = 'Angular';
      expect(component.selectedSkills).not.toContain(skill);
      
      component.toggleSkill(skill);
      
      expect(component.selectedSkills).toContain(skill);
    });

    it('should remove skill when already selected', () => {
      const skill = 'Angular';
      component.toggleSkill(skill);
      expect(component.selectedSkills).toContain(skill);
      
      component.toggleSkill(skill);
      expect(component.selectedSkills).not.toContain(skill);
    });
  });

  describe('addCustomSkill', () => {
    it('should add custom skill', () => {
      const event = { target: { value: 'GraphQL' } };
      const initialLength = component.commonSkills.length;
      
      component.addCustomSkill(event);
      
      expect(component.commonSkills.length).toBe(initialLength + 1);
      expect(component.commonSkills).toContain('GraphQL');
      expect(component.selectedSkills).toContain('GraphQL');
    });

    it('should not add empty skill', () => {
      const event = { target: { value: '   ' } };
      const initialLength = component.commonSkills.length;
      
      component.addCustomSkill(event);
      
      expect(component.commonSkills.length).toBe(initialLength);
    });

    it('should not add duplicate skill', () => {
      const event = { target: { value: 'JavaScript' } };
      const initialLength = component.commonSkills.length;
      
      component.addCustomSkill(event);
      
      expect(component.commonSkills.length).toBe(initialLength);
    });
  });

  describe('onCompensationTypeChange', () => {
    it('should clear stipend when switching to salary', () => {
      component.jobForm.patchValue({ compensationType: 'stipend', stipend: 25000 });
      component.onCompensationTypeChange();
      
      expect(component.jobForm.get('stipend')?.value).toBeNull();
    });

    it('should clear salary when switching to stipend', () => {
      component.jobForm.patchValue({ 
        compensationType: 'salary',
        salary: { min: 50000, max: 70000 }
      });
      component.onCompensationTypeChange();
      
      expect(component.jobForm.get('salary.min')?.value).toBeNull();
      expect(component.jobForm.get('salary.max')?.value).toBeNull();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      // Set valid form values for all tests in this describe block
      component.jobForm.patchValue({
        title: 'Frontend Developer',
        description: 'We are looking for an experienced frontend developer with strong Angular skills. The ideal candidate should have at least 3 years of experience and be passionate about building great user interfaces.',
        type: 'fulltime',
        location: 'remote',
        category: 'Engineering',
        compensationType: 'salary',
        salary: {
          min: 60000,
          max: 80000,
          currency: 'INR'
        },
        eligibility: {
          branches: ['Computer Science'],
          minCGPA: 7.5,
          yearOfPassing: [2024],
          requiredSkills: ['Angular'],
          additionalRequirements: ''
        },
        applicationDeadline: '2024-12-31'
      });
    });

    it('should create job on publish', () => {
      // Return a complete Job object, not just an object with id
      mockJobService.createJob.and.returnValue(of(mockCreatedJob));
      spyOn(window, 'alert');
      
      component.publishJob();
      
      expect(mockJobService.createJob).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Job published successfully!');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/company/jobs']);
    });

    it('should create job as draft', () => {
      // Return a complete Job object with draft status
      mockJobService.createJob.and.returnValue(of(mockDraftJob));
      spyOn(window, 'alert');
      
      component.saveAsDraft();
      
      expect(mockJobService.createJob).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Job saved as draft successfully!');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/company/jobs']);
    });

    it('should handle error on job creation', () => {
      mockJobService.createJob.and.returnValue(throwError(() => new Error('Creation failed')));
      spyOn(window, 'alert');
      
      component.publishJob();
      
      expect(window.alert).toHaveBeenCalledWith('Error creating job. Please try again.');
      expect(component.isSubmitting).toBeFalse();
    });

    it('should not submit if form is invalid', () => {
      component.jobForm.get('title')?.setValue('');
      component.publishJob();
      
      expect(mockJobService.createJob).not.toHaveBeenCalled();
    });

    it('should mark form as touched on invalid submission', () => {
      component.jobForm.get('title')?.setValue('');
      component.publishJob();
      
      expect(component.title?.touched).toBeTrue();
    });
  });

  describe('cancel', () => {
    it('should navigate back when form is pristine', () => {
      component.cancel();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/company/jobs']);
    });

    it('should show confirmation when form is dirty', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      component.jobForm.get('title')?.setValue('Test Job');
      
      component.cancel();
      
      expect(window.confirm).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/company/jobs']);
    });

    it('should not navigate when user cancels confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      component.jobForm.get('title')?.setValue('Test Job');
      
      component.cancel();
      
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Date Helpers', () => {
    it('should return min date as tomorrow', () => {
      const minDate = new Date(component.minDate);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      expect(minDate.getDate()).toBe(tomorrow.getDate());
    });

    it('should return max date as next year', () => {
      const maxDate = new Date(component.maxDate);
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      
      expect(maxDate.getFullYear()).toBe(nextYear.getFullYear());
    });
  });

  describe('Form Getters', () => {
    it('should return correct form controls', () => {
      expect(component.title).toBe(component.jobForm.get('title'));
      expect(component.description).toBe(component.jobForm.get('description'));
      expect(component.type).toBe(component.jobForm.get('type'));
      expect(component.location).toBe(component.jobForm.get('location'));
      expect(component.category).toBe(component.jobForm.get('category'));
      expect(component.applicationDeadline).toBe(component.jobForm.get('applicationDeadline'));
      expect(component.minCGPA).toBe(component.jobForm.get('eligibility.minCGPA'));
      expect(component.requiredSkills).toBe(component.jobForm.get('eligibility.requiredSkills'));
    });
  });

  describe('compensationType', () => {
    it('should return current compensation type', () => {
      expect(component.compensationType).toBe('salary');
      
      component.jobForm.get('compensationType')?.setValue('stipend');
      expect(component.compensationType).toBe('stipend');
    });
  });
});