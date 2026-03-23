import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { JobEditComponent } from './job-edit';
import { JobService } from '../../../services/job.service';
import { Job } from '../../../models/job.model';

describe('JobEditComponent', () => {
  let component: JobEditComponent;
  let fixture: ComponentFixture<JobEditComponent>;
  let mockJobService: jasmine.SpyObj<JobService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

const mockJob: Job = {
    id: '1',
    companyId: 'company123',
    title: 'Frontend Developer',
    description: 'Looking for an experienced frontend developer with strong Angular skills. The ideal candidate should have at least 3 years of experience and be passionate about building great user interfaces. Experience with TypeScript and modern JavaScript frameworks is required.',
    category: 'Engineering',
    status: 'active' as const,  // ✅ Use 'as const' to make it a literal type
    type: 'fulltime' as const,   // ✅ Use 'as const' for type as well
    location: 'remote' as const, // ✅ Use 'as const' for location
    applicationDeadline: new Date('2024-12-31'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    applicationsCount: 5,
    eligibility: {
      branches: ['Computer Science', 'Information Technology'],
      requiredSkills: ['Angular', 'TypeScript', 'JavaScript'],
      minCGPA: 7.5,
      yearOfPassing: [2023, 2024, 2025],
      additionalRequirements: 'Strong communication skills'
    },
    salary: {
      currency: 'USD',
      min: 60000,
      max: 80000,
      type: 'range' as const  // ✅ Use 'as const' for salary type
    }
  };

  beforeEach(async () => {
    const jobServiceSpy = jasmine.createSpyObj('JobService', ['getJobById', 'updateJob']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [JobEditComponent, ReactiveFormsModule],
      providers: [
        { provide: JobService, useValue: jobServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    mockJobService = TestBed.inject(JobService) as jasmine.SpyObj<JobService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    fixture = TestBed.createComponent(JobEditComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockJobService.getJobById.and.returnValue(of(mockJob));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load job on initialization', () => {
      mockJobService.getJobById.and.returnValue(of(mockJob));
      
      fixture.detectChanges();
      
      expect(mockJobService.getJobById).toHaveBeenCalledWith('1');
      expect(component.job).toEqual(mockJob);
      expect(component.isLoading).toBeFalse();
    });

    it('should handle error when loading job', () => {
      mockJobService.getJobById.and.returnValue(throwError(() => new Error('Network error')));
      
      fixture.detectChanges();
      
      expect(component.isLoading).toBeFalse();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/company/jobs']);
    });

    it('should redirect if no job ID is provided', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);
      
      fixture.detectChanges();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/company/jobs']);
    });
  });

  describe('form validation', () => {
    beforeEach(() => {
      mockJobService.getJobById.and.returnValue(of(mockJob));
      fixture.detectChanges();
    });

    it('should validate required fields', () => {
      expect(component.jobForm.get('title')?.valid).toBeTrue();
      expect(component.jobForm.get('description')?.valid).toBeTrue();
      expect(component.jobForm.get('category')?.valid).toBeTrue();
      expect(component.jobForm.get('applicationDeadline')?.valid).toBeTrue();
      expect(component.jobForm.get('eligibility.branches')?.valid).toBeTrue();
      expect(component.jobForm.get('eligibility.requiredSkills')?.valid).toBeTrue();
    });

    it('should require min length for title', () => {
      const titleControl = component.jobForm.get('title');
      titleControl?.setValue('Test');
      expect(titleControl?.errors?.['minlength']).toBeTruthy();
    });

    it('should require min length for description', () => {
      const descControl = component.jobForm.get('description');
      descControl?.setValue('Short');
      expect(descControl?.errors?.['minlength']).toBeTruthy();
    });
  });

  describe('toggleBranch', () => {
    beforeEach(() => {
      mockJobService.getJobById.and.returnValue(of(mockJob));
      fixture.detectChanges();
    });

    it('should add branch if not selected', () => {
      const branch = 'Data Science';
      expect(component.selectedBranches).not.toContain(branch);
      
      component.toggleBranch(branch);
      
      expect(component.selectedBranches).toContain(branch);
    });

    it('should remove branch if already selected', () => {
      const branch = 'Computer Science';
      expect(component.selectedBranches).toContain(branch);
      
      component.toggleBranch(branch);
      
      expect(component.selectedBranches).not.toContain(branch);
    });
  });

  describe('toggleSkill', () => {
    beforeEach(() => {
      mockJobService.getJobById.and.returnValue(of(mockJob));
      fixture.detectChanges();
    });

    it('should add skill if not selected', () => {
      const skill = 'React';
      expect(component.selectedSkills).not.toContain(skill);
      
      component.toggleSkill(skill);
      
      expect(component.selectedSkills).toContain(skill);
    });

    it('should remove skill if already selected', () => {
      const skill = 'Angular';
      expect(component.selectedSkills).toContain(skill);
      
      component.toggleSkill(skill);
      
      expect(component.selectedSkills).not.toContain(skill);
    });
  });

  describe('addCustomSkill', () => {
    beforeEach(() => {
      mockJobService.getJobById.and.returnValue(of(mockJob));
      fixture.detectChanges();
    });

    it('should add custom skill', () => {
      const event = { target: { value: 'GraphQL' } };
      component.addCustomSkill(event);
      
      expect(component.commonSkills).toContain('GraphQL');
      expect(component.selectedSkills).toContain('GraphQL');
    });

    it('should not add empty skill', () => {
      const event = { target: { value: '   ' } };
      component.addCustomSkill(event);
      
      expect(component.commonSkills.length).toBe(17); // Original length
    });

    it('should not add duplicate skill', () => {
      const event = { target: { value: 'JavaScript' } };
      component.addCustomSkill(event);
      
      expect(component.commonSkills.filter(s => s === 'JavaScript').length).toBe(1);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      mockJobService.getJobById.and.returnValue(of(mockJob));
      fixture.detectChanges();
    });

    it('should update job with salary data', () => {
      mockJobService.updateJob.and.returnValue(of(mockJob));
      
      component.onSubmit();
      
      expect(mockJobService.updateJob).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/company/jobs']);
    });

    it('should handle update error', () => {
      mockJobService.updateJob.and.returnValue(throwError(() => new Error('Update failed')));
      spyOn(window, 'alert');
      
      component.onSubmit();
      
      expect(window.alert).toHaveBeenCalledWith('Error updating job. Please try again.');
      expect(component.isSubmitting).toBeFalse();
    });

    it('should not submit if form is invalid', () => {
      component.jobForm.get('title')?.setValue('');
      component.onSubmit();
      
      expect(mockJobService.updateJob).not.toHaveBeenCalled();
    });
  });

 describe('canEditJob', () => {
  beforeEach(() => {
    mockJobService.getJobById.and.returnValue(of(mockJob));
    fixture.detectChanges();
  });

  it('should allow editing for active jobs', () => {
    expect(component.canEditJob()).toBeTrue();
  });

  it('should allow editing for draft jobs', () => {
    const draftJob: Job = { 
      ...mockJob, 
      status: 'draft'  // ✅ TypeScript now knows this is valid
    };
    component.job = draftJob;
    expect(component.canEditJob()).toBeTrue();
  });

  it('should not allow editing for closed jobs', () => {
    const closedJob: Job = { 
      ...mockJob, 
      status: 'closed'  // ✅ TypeScript now knows this is valid
    };
    component.job = closedJob;
    expect(component.canEditJob()).toBeFalse();
  });

  it('should not allow editing for expired jobs', () => {
    const expiredJob: Job = { 
      ...mockJob, 
      status: 'expired'  // ✅ TypeScript now knows this is valid
    };
    component.job = expiredJob;
    expect(component.canEditJob()).toBeFalse();
  });
});
  describe('date helpers', () => {
    beforeEach(() => {
      mockJobService.getJobById.and.returnValue(of(mockJob));
      fixture.detectChanges();
    });

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

  describe('compensation type change', () => {
    beforeEach(() => {
      mockJobService.getJobById.and.returnValue(of(mockJob));
      fixture.detectChanges();
    });

    it('should clear stipend when switching to salary', () => {
      component.jobForm.patchValue({ compensationType: 'salary', stipend: 25000 });
      component.onCompensationTypeChange();
      
      expect(component.jobForm.get('stipend')?.value).toBeNull();
    });

    it('should clear salary when switching to stipend', () => {
      component.jobForm.patchValue({ 
        compensationType: 'stipend',
        salary: { min: 50000, max: 70000, currency: 'INR' }
      });
      component.onCompensationTypeChange();
      
      expect(component.jobForm.get('salary')?.value).toEqual({ min: null, max: null, currency: 'INR' });
    });
  });
});