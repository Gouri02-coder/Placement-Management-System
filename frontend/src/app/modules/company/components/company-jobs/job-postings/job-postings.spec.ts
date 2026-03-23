import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobPostingsComponent } from './job-postings';

describe('JobPostingsComponent', () => {
  let component: JobPostingsComponent;
  let fixture: ComponentFixture<JobPostingsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [JobPostingsComponent, FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(JobPostingsComponent);
    component = fixture.componentInstance;
    
    // Manually set up test data
    component.jobs = [
      {
        id: 1,
        title: 'Frontend Developer',
        company: 'Tech Corp',
        location: 'remote',
        type: 'fulltime',
        experience: 'mid',
        description: 'Angular developer needed',
        deadline: '2024-12-31'
      },
      {
        id: 2,
        title: 'Backend Developer',
        company: 'Dev Solutions',
        location: 'onsite',
        type: 'fulltime',
        experience: 'senior',
        description: 'Node.js expert',
        deadline: '2024-12-31'
      },
      {
        id: 3,
        title: 'UI Designer',
        company: 'Creative Studio',
        location: 'hybrid',
        type: 'parttime',
        experience: 'entry',
        description: 'UI/UX designer needed',
        deadline: '2024-12-31'
      }
    ];
    component.filteredJobs = [...component.jobs];
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Filter Methods', () => {
    beforeEach(() => {
      // Reset filters before each test
      component.searchTerm = '';
      component.selectedType = 'all';
      component.selectedLocation = 'all';
      component.selectedExperience = 'all';
      component.applyFilters();
    });

    it('should filter jobs by search term', () => {
      component.searchTerm = 'frontend';
      component.applyFilters();
      expect(component.filteredJobs.length).toBe(1);
      expect(component.filteredJobs[0].title).toBe('Frontend Developer');
    });

    it('should filter jobs by type', () => {
      component.selectedType = 'fulltime';
      component.applyFilters();
      expect(component.filteredJobs.length).toBe(2);
    });

    it('should filter jobs by location', () => {
      component.selectedLocation = 'remote';
      component.applyFilters();
      expect(component.filteredJobs.length).toBe(1);
      expect(component.filteredJobs[0].location).toBe('remote');
    });

    it('should filter jobs by experience', () => {
      component.selectedExperience = 'senior';
      component.applyFilters();
      expect(component.filteredJobs.length).toBe(1);
      expect(component.filteredJobs[0].experience).toBe('senior');
    });

    it('should combine multiple filters', () => {
      component.searchTerm = 'developer';
      component.selectedType = 'fulltime';
      component.selectedLocation = 'remote';
      component.applyFilters();
      expect(component.filteredJobs.length).toBe(1);
      expect(component.filteredJobs[0].title).toBe('Frontend Developer');
    });

    it('should clear all filters', () => {
      // Set some filter values
      component.searchTerm = 'test';
      component.selectedType = 'fulltime';
      component.selectedLocation = 'remote';
      component.selectedExperience = 'senior';
      
      component.clearFilters();
      
      expect(component.searchTerm).toBe('');
      expect(component.selectedType).toBe('all');
      expect(component.selectedLocation).toBe('all');
      expect(component.selectedExperience).toBe('all');
      
      // Verify that filters were applied after clearing
      expect(component.filteredJobs.length).toBe(component.jobs.length);
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      // Set up test data for pagination
      component.filteredJobs = Array(15).fill({
        id: 1,
        title: 'Test Job',
        company: 'Test Company',
        location: 'remote',
        type: 'fulltime',
        experience: 'mid',
        description: 'Test description',
        deadline: '2024-12-31'
      });
      component.itemsPerPage = 6;
      // Call private method through public method
      component.applyFilters(); // This triggers calculateTotalPages internally
    });

    it('should calculate total pages correctly', () => {
      // Access totalPages which is public
      expect(component.totalPages).toBe(3);
    });

    it('should return paginated jobs for page 1', () => {
      component.currentPage = 1;
      const paginated = component.paginatedJobs;
      expect(paginated.length).toBe(6);
    });

    it('should return paginated jobs for page 2', () => {
      component.currentPage = 2;
      const paginated = component.paginatedJobs;
      expect(paginated.length).toBe(6);
    });

    it('should return paginated jobs for last page', () => {
      component.currentPage = 3;
      const paginated = component.paginatedJobs;
      expect(paginated.length).toBe(3);
    });

    it('should change page', () => {
      component.totalPages = 5;
      component.changePage(3);
      expect(component.currentPage).toBe(3);
      
      component.changePage(6); // Invalid page
      expect(component.currentPage).toBe(3);
      
      component.changePage(0); // Invalid page
      expect(component.currentPage).toBe(3);
    });

    it('should generate page numbers with current page in middle', () => {
      component.totalPages = 10;
      component.currentPage = 5;
      const pages = component.getPages();
      expect(pages.length).toBe(5);
      expect(pages).toEqual([3, 4, 5, 6, 7]);
    });

    it('should generate page numbers for first pages', () => {
      component.totalPages = 10;
      component.currentPage = 1;
      const pages = component.getPages();
      expect(pages.length).toBe(5);
      expect(pages).toEqual([1, 2, 3, 4, 5]);
    });

    it('should generate page numbers for last pages', () => {
      component.totalPages = 10;
      component.currentPage = 10;
      const pages = component.getPages();
      expect(pages.length).toBe(5);
      expect(pages).toEqual([6, 7, 8, 9, 10]);
    });

    it('should generate page numbers for small total pages', () => {
      component.totalPages = 3;
      component.currentPage = 2;
      const pages = component.getPages();
      expect(pages.length).toBe(3);
      expect(pages).toEqual([1, 2, 3]);
    });
  });

  describe('Helper Methods', () => {
    it('should return correct type class', () => {
      expect(component.getTypeClass('fulltime')).toBe('type-fulltime');
      expect(component.getTypeClass('parttime')).toBe('type-parttime');
      expect(component.getTypeClass('internship')).toBe('type-internship');
      expect(component.getTypeClass('contract')).toBe('type-contract');
      expect(component.getTypeClass('unknown')).toBe('');
    });

    it('should return correct location icon', () => {
      expect(component.getLocationIcon('remote')).toBe('home');
      expect(component.getLocationIcon('hybrid')).toBe('sync');
      expect(component.getLocationIcon('onsite')).toBe('business');
      expect(component.getLocationIcon('unknown')).toBe('location_on');
    });

    it('should return correct experience label', () => {
      expect(component.getExperienceLabel('entry')).toBe('Entry Level');
      expect(component.getExperienceLabel('mid')).toBe('Mid Level');
      expect(component.getExperienceLabel('senior')).toBe('Senior Level');
      expect(component.getExperienceLabel('unknown')).toBe('All Levels');
    });

    it('should format date correctly', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 5);
      const lastMonth = new Date(today);
      lastMonth.setDate(lastMonth.getDate() - 20);
      const lastYear = new Date(today);
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      
      expect(component.formatDate(today.toISOString())).toBe('Today');
      expect(component.formatDate(yesterday.toISOString())).toBe('Yesterday');
      expect(component.formatDate(lastWeek.toISOString())).toContain('days ago');
      expect(component.formatDate(lastMonth.toISOString())).toContain('weeks ago');
      expect(component.formatDate(lastYear.toISOString())).toContain('months ago');
    });

    it('should calculate days remaining', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      
      expect(component.getDaysRemaining(futureDate.toISOString())).toBe(10);
      expect(component.getDaysRemaining(pastDate.toISOString())).toBe(-5);
    });

    it('should detect urgent jobs (7 days or less)', () => {
      const urgentDate = new Date();
      urgentDate.setDate(urgentDate.getDate() + 5);
      expect(component.isUrgent(urgentDate.toISOString())).toBeTrue();
      
      const normalDate = new Date();
      normalDate.setDate(normalDate.getDate() + 10);
      expect(component.isUrgent(normalDate.toISOString())).toBeFalse();
      
      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() - 1);
      expect(component.isUrgent(expiredDate.toISOString())).toBeFalse();
    });

    it('should detect expired jobs', () => {
      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() - 1);
      expect(component.isExpired(expiredDate.toISOString())).toBeTrue();
      
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      expect(component.isExpired(futureDate.toISOString())).toBeFalse();
    });
  });

  describe('Navigation Methods', () => {
    it('should navigate to job details on viewDetails', () => {
      component.viewDetails(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/jobs', 1]);
    });

    it('should navigate to application form on applyNow for valid job', () => {
      const job = {
        id: 1,
        deadline: new Date(Date.now() + 86400000).toISOString() // Future date
      };
      component.jobs = [job];
      
      component.applyNow(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/jobs', 1, 'apply']);
    });

    it('should show alert and not navigate when applying for expired job', () => {
      spyOn(window, 'alert');
      const expiredJob = {
        id: 1,
        deadline: new Date(Date.now() - 86400000).toISOString() // Past date
      };
      component.jobs = [expiredJob];
      
      component.applyNow(1);
      
      expect(window.alert).toHaveBeenCalledWith('This job posting has expired. You cannot apply for this position.');
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Initialization', () => {
    it('should load jobs on initialization', () => {
      // Spy on loadJobs method
      const loadJobsSpy = spyOn(component as any, 'loadJobs').and.callThrough();
      
      component.ngOnInit();
      
      expect(loadJobsSpy).toHaveBeenCalled();
    });
  });
});