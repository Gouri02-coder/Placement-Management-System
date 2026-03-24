import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { JobListComponent } from './job-list';
import { JobService } from '../../../services/job.service';
import { Job } from '../../../models/job.model';

describe('JobListComponent', () => {
  let component: JobListComponent;
  let fixture: ComponentFixture<JobListComponent>;
  let mockJobService: jasmine.SpyObj<JobService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockJobs: Job[] = [
    {
      id: '1',
      companyId: 'company123',  
      title: 'Frontend Developer',
      description: 'Looking for an experienced frontend developer',
      category: 'Engineering',  
      status: 'active',
      type: 'fulltime',
      location: 'remote',
      applicationDeadline: new Date('2024-12-31'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      applicationsCount: 5,
      eligibility: {
        branches: ['CS', 'IT'],
        requiredSkills: ['Angular', 'TypeScript'],
        minCGPA: 7.5,
        yearOfPassing: [2023, 2024, 2025]
      },
      salary: {
        currency: 'USD',
        min: 60000,
        max: 80000,
        type: 'range'
      }
    },
    {
      id: '2',
      companyId: 'company123',  // Add this - required property
      title: 'Backend Developer',
      description: 'Looking for an experienced backend developer',
      category: 'Engineering',  // Add this - required property
      status: 'draft',
      type: 'fulltime',
      location: 'hybrid',
      applicationDeadline: new Date('2024-12-31'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      applicationsCount: 3,
      eligibility: {
        branches: ['CS', 'IT'],
        requiredSkills: ['Node.js', 'Python'],
        minCGPA: 7.0,
        yearOfPassing: [2023, 2024]
      },
      salary: {
        currency: 'USD',
        min: 70000,
        max: 90000,
        type: 'range'
      }
    }
  ];

  beforeEach(async () => {
    const jobServiceSpy = jasmine.createSpyObj('JobService', [
      'getJobsByCompany',
      'closeJob',
      'extendDeadline'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [JobListComponent],
      providers: [
        { provide: JobService, useValue: jobServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    mockJobService = TestBed.inject(JobService) as jasmine.SpyObj<JobService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ companyId: 'company123' }));
    
    fixture = TestBed.createComponent(JobListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load jobs on initialization', () => {
      mockJobService.getJobsByCompany.and.returnValue(of(mockJobs));
      
      component.ngOnInit();
      
      expect(mockJobService.getJobsByCompany).toHaveBeenCalledWith('company123');
      expect(component.jobs).toEqual(mockJobs);
      expect(component.filteredJobs).toEqual(mockJobs);
      expect(component.isLoading).toBeFalse();
    });

    it('should handle error when loading jobs', () => {
      mockJobService.getJobsByCompany.and.returnValue(throwError(() => new Error('Network error')));
      
      component.ngOnInit();
      
      expect(component.isLoading).toBeFalse();
      expect(component.jobs).toEqual([]);
    });
  });

  describe('applyFilters', () => {
    beforeEach(() => {
      component.jobs = mockJobs;
    });

    it('should filter jobs by search term', () => {
      component.searchTerm = 'frontend';
      component.applyFilters();
      
      expect(component.filteredJobs.length).toBe(1);
      expect(component.filteredJobs[0].title).toBe('Frontend Developer');
    });

    it('should filter jobs by status', () => {
      component.statusFilter = 'active';
      component.applyFilters();
      
      expect(component.filteredJobs.length).toBe(1);
      expect(component.filteredJobs[0].status).toBe('active');
    });

    it('should filter jobs by type', () => {
      component.typeFilter = 'fulltime';
      component.applyFilters();
      
      expect(component.filteredJobs.length).toBe(2);
    });

    it('should reset current page to 1 after filtering', () => {
      component.currentPage = 2;
      component.applyFilters();
      
      expect(component.currentPage).toBe(1);
    });
  });

  describe('pagination', () => {
    beforeEach(() => {
      component.filteredJobs = mockJobs;
      component.itemsPerPage = 1;
    });

    it('should calculate total pages correctly', () => {
      expect(component.totalPages).toBe(2);
    });

    it('should return paginated jobs', () => {
      component.currentPage = 1;
      const paginated = component.paginatedJobs;
      expect(paginated.length).toBe(1);
      expect(paginated[0].id).toBe('1');
      
      component.currentPage = 2;
      const paginated2 = component.paginatedJobs;
      expect(paginated2.length).toBe(1);
      expect(paginated2[0].id).toBe('2');
    });

    it('should change page', () => {
      component.totalPages = 3;
      component.changePage(2);
      expect(component.currentPage).toBe(2);
      
      component.changePage(4);
      expect(component.currentPage).toBe(2);
    });

    it('should generate page numbers', () => {
      component.totalPages = 5;
      component.currentPage = 3;
      const pages = component.getPages();
      expect(pages).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('job actions', () => {
    it('should navigate to create job page', () => {
      component.createJob();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/company/jobs/create']);
    });

    it('should navigate to edit job page', () => {
      component.editJob('1');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/company/jobs/edit', '1']);
    });

    it('should navigate to view applications', () => {
      component.viewApplications('1');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/company/applications'], { queryParams: { jobId: '1' } });
    });

    it('should close job after confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      
      component.jobs = mockJobs;
      component.closeJob('1');
      
      expect(mockJobService.closeJob).toHaveBeenCalledWith('1');
      expect(component.jobs[0].status).toBe('closed');
    });

    it('should extend deadline', () => {
      spyOn(window, 'prompt').and.returnValue('2025-12-31');
      const updatedJob = { ...mockJobs[0], applicationDeadline: new Date('2025-12-31') };
      mockJobService.extendDeadline.and.returnValue(of(updatedJob));
      
      component.jobs = mockJobs;
      component.extendDeadline('1');
      
      expect(mockJobService.extendDeadline).toHaveBeenCalled();
    });
  });

  describe('helper methods', () => {
    it('should return correct status class', () => {
      expect(component.getStatusClass('active')).toBe('status-active');
      expect(component.getStatusClass('draft')).toBe('status-draft');
      expect(component.getStatusClass('closed')).toBe('status-closed');
      expect(component.getStatusClass('expired')).toBe('status-expired');
      expect(component.getStatusClass('unknown')).toBe('status-draft');

      const expiredJob = { 
      ...mockJobs[0], 
      applicationDeadline: new Date('2020-01-01'), 
      status: 'active' as const  
    };
    
    const activeJob = { 
      ...mockJobs[0], 
      applicationDeadline: new Date('2025-12-31'), 
      status: 'active' as const 
    };
    });

    it('should return correct type icon', () => {
      expect(component.getTypeIcon('fulltime')).toBe('work');
      expect(component.getTypeIcon('parttime')).toBe('schedule');
      expect(component.getTypeIcon('internship')).toBe('school');
      expect(component.getTypeIcon('other')).toBe('work');
    });

    it('should return correct location icon', () => {
      expect(component.getLocationIcon('remote')).toBe('home');
      expect(component.getLocationIcon('hybrid')).toBe('sync');
      expect(component.getLocationIcon('onsite')).toBe('business');
      expect(component.getLocationIcon('other')).toBe('location_on');
    });

  });
});